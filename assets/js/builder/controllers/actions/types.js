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
define( [ 'models/app/typeCollection' ], function( TypeCollection ) {
	var controller = Marionette.Object.extend( {
		initialize: function() {

			/*
			 * Instantiate "installed" actions collection.
			 */
			this.installedActions = new TypeCollection(
				_.filter( actionTypeData, function( type ) {
					return type.section == 'installed';
					} 
				),
				{
					slug: 'installed',
					nicename: nfi18n.installed
				} 
			);

			this.availableActions = new TypeCollection(
				_.filter( actionTypeData, function( type ) {
					return type.section == 'available';
					} 
				),
				{
					slug: 'available',
					nicename: nfi18n.available
				}
			);

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
