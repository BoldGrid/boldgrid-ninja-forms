/**
 * Creates and stores a collection of field types. This includes all of the settings shown when editing a field.
 *
 * 1) Create our settings sections config
 * 2) Loops over our preloaded data and adds that to our field type collection
 *
 * Also responds to requests for data about field types
 *
 * @package Ninja Forms builder
 * @subpackage Fields
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [
	'models/app/typeCollection',
	'models/app/settingCollection',
	'models/app/settingGroupCollection',
	'models/fields/typeSectionCollection'
	], function(
	fieldTypeCollection,
	settingCollection,
	fieldTypeSettingGroupCollection,
	fieldTypeSectionCollection
	) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			// Create our field type collection
			this.collection = new fieldTypeCollection();
			// Config for our settings sections
			this.fieldTypeSections = new fieldTypeSectionCollection( fieldTypeSections );

			// Since we want to access the "this" context later, we assign it to that so it isn't overwritten
			var that = this;

			// Loop through the field type data variable and add it to the field type collection array
			_.each( fieldTypeData, function ( type ) {
				var settingGroups = new fieldTypeSettingGroupCollection();
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

				// Add our field type to the appropriate drawer section.
				if ( 'undefined' != typeof that.fieldTypeSections.get( type.section ) ) {
					that.fieldTypeSections.get( type.section ).get( 'fieldTypes' ).push( type.id );
				}

				// Build an object for this type that we can add to our field type collection
				var fieldType = {
					id: type.id,
					type: type.type,
					nicename: type.nicename,
                    icon: type.icon,
					alias: type.alias,
					parentType: type.parentType,
					settingGroups: settingGroups,
					settingDefaults: type.settingDefaults
				}
				// Add tmp object to our field type collection
				that.collection.add( fieldType );
			} );

			// Respond to requests to get field type, collection, settings, and sections
			nfRadio.channel( 'fields' ).reply( 'get:type', this.getFieldType, this );
			nfRadio.channel( 'fields' ).reply( 'get:typeCollection', this.getTypeCollection, this );
			nfRadio.channel( 'fields' ).reply( 'get:typeSections', this.getTypeSections, this );
			nfRadio.channel( 'fields' ).reply( 'get:savedFields', this.getSavedFields, this );
			// Listen to clicks on field types
			this.listenTo( nfRadio.channel( 'drawer' ), 'click:fieldType', this.addStagedField );
		},

		/**
		 * Return a field type by id
		 *
		 * @since  3.0
		 * @param  string 			id 	field type
		 * @return backbone.model    	field type model
		 */
		getFieldType: function( id ) {
        	return this.collection.get( id );
        },

        /**
         * Return the entire field type collection
         *
         * @since  3.0
         * @param  string 				id 	[description]
         * @return backbone.collection    	field type collection
         */
		getTypeCollection: function( id ) {
        	return this.collection;
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
        },

        /**
         * Return our saved fields
         *
         * @since  3.0
         * @return backbone.collection
         */
        getSavedFields: function() {
        	this.fieldTypeSections.get( 'saved' );
        }
	});

	return controller;
} );
