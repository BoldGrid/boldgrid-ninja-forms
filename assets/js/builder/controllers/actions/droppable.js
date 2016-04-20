/**
 * Handles the logic for our action type droppable.
 * 
 * @package Ninja Forms builder
 * @subpackage Actions - New Action Drawer
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function( ) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			/*
			 * Respond to requests for our helper clone.
			 * This is used by other parts of the application to modify what the user is dragging in real-time.
			 */ 
			nfRadio.channel( 'app' ).reply( 'drop:actionType', this.dropActionType, this );
		},

		dropActionType: function( e, ui ) {
			var type_slug = jQuery( ui.helper ).data( 'type' );
			var type = nfRadio.channel( 'actions' ).request( 'get:type', type_slug );
			nfRadio.channel( 'actions' ).request( 'add:actionType', type );
		}
	});

	return controller;
} );