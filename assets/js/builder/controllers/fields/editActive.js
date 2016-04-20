/**
 * Handles adding and removing the active class from a field currently being edited.
 * 
 * @package Ninja Forms builder
 * @subpackage Fields - Edit Field Drawer
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			// Respond to requests to remove the active class from all our fields.
			nfRadio.channel( 'fields' ).reply( 'clear:editActive', this.clearEditActive, this );
			// Listen for the closing drawer so that we can remove all of our active classes.
			this.listenTo( nfRadio.channel( 'drawer-editSettings' ), 'before:closeDrawer', this.clearEditActive );
		},

		/**
		 * Loops through our fields collection and sets editActive to false.
		 * 
		 * @since  3.0
		 * @return void
		 */
        clearEditActive: function() {
            var fieldCollection = nfRadio.channel( 'fields' ).request( 'get:collection' );
            _.each( fieldCollection.models, function( field ) {
				field.set( 'editActive', false );
            } );
        }
	});

	return controller;
} );
