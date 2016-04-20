/**
 * Creates and stores a collection of action types. This includes all of the settings shown when editing a field.
 *
 * Loops over our preloaded data and adds that to our action type collection
 *
 * Also responds to requests for data about action types
 *
 * @package Ninja Forms builder
 * @subpackage Actions
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
			this.installedActions = new typeCollection();
			this.installedActions.slug = 'installed';
			this.installedActions.nicename = 'Installed';
			this.availableActions = new typeCollection();
			this.availableActions.slug = 'available';
			this.availableActions.nicename = 'Available';

			var that = this;
			_.each( actionTypeData, function( type ) {
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
				var actionType = {
					id: type.id,
					nicename: type.nicename,
					alias: type.alias,
					settingGroups: settingGroups,
					settingDefaults: type.settingDefaults,
					image: type.image,
					link: type.link,
					section: type.section
				}

				// Add tmp object to the appropriate collection (either installed or available)
				that[ type.section + 'Actions' ].add( actionType );
			} );

			// Respond to requests to get field type, collection, settings, and sections
			nfRadio.channel( 'actions' ).reply( 'get:type', this.getType, this );
			nfRadio.channel( 'actions' ).reply( 'get:installedActions', this.getInstalledActions, this );
			nfRadio.channel( 'actions' ).reply( 'get:availableActions', this.getAvailableActions, this );
		},

		/**
		 * Return a field type by id
		 *
		 * @since  3.0
		 * @param  string 			id 	field type
		 * @return backbone.model    	field type model
		 */
		getType: function( id ) {
			// Search our installed actions first
			var type = this.installedActions.get( id );
			if ( ! type ) {
				type = this.availableActions.get( id );
			}
        	return type;
        },

        /**
         * Return the installed action type collection
         *
         * @since  3.0
         * @return backbone.collection    	field type collection
         */
		getInstalledActions: function() {
        	return this.installedActions;
        },

        /**
         * Return the available action type collection
         *
         * @since  3.0
         * @return backbone.collection    	field type collection
         */
		getAvailableActions: function() {
        	return this.availableActions;
        },

        /**
         * Add a field type to our staging area when the field type button is clicked.
         *
         * @since 3.0
         * @param Object e event
         * @return void
         */
        addStagedField: function( e ) {
        	var type = jQuery( e.target ).data( 'id' );
        	nfRadio.channel( 'fields' ).request( 'add:stagedField', type );
        },

        /**
         * Return our field type settings sections
         *
         * @since  3.0
         * @return backbone.collection field type settings sections
         */
        getTypeSections: function() {
            return this.fieldTypeSections;
        }
	});

	return controller;
} );
