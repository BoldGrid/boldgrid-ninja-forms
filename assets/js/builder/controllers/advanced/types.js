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
		'models/app/typeCollection'
	],
	function(
		TypeCollection
	) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			// Create our field type collection
			this.collection = new TypeCollection( formSettingTypeData );

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
