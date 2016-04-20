/**
 * Handles the logic for our field type draggables.
 * 
 * @package Ninja Forms builder
 * @subpackage Fields - New Field Drawer
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function( ) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			// Listen to our field type draggables and run the appropriate function.
			this.listenTo( nfRadio.channel( 'drawer-addField' ), 'startDrag:type', this.startDrag );
			this.listenTo( nfRadio.channel( 'drawer-addField' ), 'stopDrag:type', this.stopDrag );
			/*
			 * Respond to requests for our helper clone.
			 * This is used by other parts of the application to modify what the user is dragging in real-time.
			 */ 
			nfRadio.channel( 'drawer-addField' ).reply( 'get:typeHelperClone', this.getCurrentDraggableHelperClone, this );
		},

		/**
		 * When we start dragging:
		 * get our drawer element
		 * set its overflow property to visible !important -> forces the type drag element to be on at the top of the z-index.
		 * get our main element
		 * est its overflow propery to visible !important -> forces the type drag element to be on top of the z-index.
		 * set our dragging helper clone
		 * 
		 * @since  3.0
		 * @param  object context 	This function is going to be called from a draggable. Context is the "this" reference to the draggable.
		 * @param  object ui      	Object sent by jQuery UI draggable.
		 * @return void
		 */
		startDrag: function( context, ui ) {
			this.drawerEl = nfRadio.channel( 'app' ).request( 'get:drawerEl' );
			this.mainEl = nfRadio.channel( 'app' ).request( 'get:mainEl' );
			jQuery( this.drawerEl )[0].style.setProperty( 'overflow', 'visible', 'important' );
			jQuery( this.mainEl )[0].style.setProperty( 'overflow', 'visible', 'important' );

			this.draggableHelperClone = jQuery( ui.helper ).clone();

		},

		/**
		 * When we stop dragging, reset our overflow property to hidden !important.
		 * 
		 * @since  3.0
		 * @param  object context 	This function is going to be called from a draggable. Context is the "this" reference to the draggable.
		 * @param  object ui      	Object sent by jQuery UI draggable.
		 * @return {[type]}         [description]
		 */
		stopDrag: function( context, ui ) {
			jQuery( this.drawerEl )[0].style.setProperty( 'overflow', 'hidden', 'important' );
			jQuery( this.mainEl )[0].style.setProperty( 'overflow', 'hidden', 'important' );
		},

		getCurrentDraggableHelperClone: function() {
			return this.draggableHelperClone;
		}
	});

	return controller;
} );