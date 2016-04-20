/**
 * Creates and stores a collection of form setting types. This includes all of the settings shown when editing a field.
 *
 * Loops over our preloaded data and adds that to our form setting type collection
 *
 * Also responds to requests for data about form setting types
 *
 * @package Ninja Forms builder
 * @subpackage Advanced
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [
	'models/app/typeCollection',
	'models/app/settingCollection',
	'models/app/settingGroupCollection',
	], function(
	typeCollection,
	settingCollection,
	settingGroupCollection
	) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			// Create our field type collection
			this.collection = new typeCollection();

			var that = this;
			_.each( formSettingTypeData, function( type ) {
				var settingGroups = new settingGroupCollection();
				// Loop through the settings groups within this field type and create an object to add to the groups collection.
				_.each( type.settingGroups, function( group ) {
					var groupTmp = {
						label: group.label,
						display: group.display,
						settings: new settingCollection( group.settings ),
					}
					// Add the tmp object to our setting groups collection
					settingGroups.add( groupTmp );
				} );

				// Build an object for this type that we can add to our field type collection
				var settingType = {
					id: type.id,
					nicename: type.nicename,
					alias: type.alias,
					settingGroups: settingGroups,
					settingDefaults: type.settingDefaults,
					editActive: false
				}

				// Add tmp object to the appropriate collection (either installed or available)
				that.collection.add( settingType );
			} );

			// Respond to requests to get field type, collection, settings, and sections
			nfRadio.channel( 'settings' ).reply( 'get:type', this.getType, this );
			nfRadio.channel( 'settings' ).reply( 'get:typeCollection', this.getCollection, this );
		},

		/**
		 * Return a field type by id
		 *
		 * @since  3.0
		 * @param  string 			id 	field type
		 * @return backbone.model    	field type model
		 */
		getType: function( id ) {
			return this.collection.get( id );
        },

        /**
         * Return the installed action type collection
         *
         * @since  3.0
         * @return backbone.collection    	field type collection
         */
		getCollection: function() {
        	return this.collection;
        }
	});

	return controller;
} );
