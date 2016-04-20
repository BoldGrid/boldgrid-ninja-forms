/**
 * Handles adding and removing the active class from a action currently being edited.
 * 
 * @package Ninja Forms builder
 * @subpackage Actions - Edit Action Drawer
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			// Respond to requests to remove the active class from all our actions.
			nfRadio.channel( 'actions' ).reply( 'clear:editActive', this.clearEditActive, this );
			// Listen for the closing drawer so that we can remove all of our active classes.
			this.listenTo( nfRadio.channel( 'drawer-editSettings' ), 'before:closeDrawer', this.clearEditActive );
		},

		/**
		 * Loops through our actions collection and sets editActive to false.
		 * 
		 * @since  3.0
		 * @return void
		 */
        clearEditActive: function() {
            var actionCollection = nfRadio.channel( 'actions' ).request( 'get:collection' );
            _.each( actionCollection.models, function( action ) {
				action.set( 'editActive', false );
            } );
        }
	});

	return controller;
} );
