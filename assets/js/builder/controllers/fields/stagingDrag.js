/**
 * Handles the dragging of our field staging area
 * 
 * @package Ninja Forms builder
 * @subpackage Fields - New Field Drawer
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function( ) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			// Listen for the start and stop of our field staging dragging
			this.listenTo( nfRadio.channel( 'drawer-addField' ), 'startDrag:fieldStaging', this.startDrag );
			this.listenTo( nfRadio.channel( 'drawer-addField' ), 'stopDrag:fieldStaging', this.stopDrag );
		},

		/**
		 * When the user starts dragging the staging area, we have to:
		 * set the overflow property of the drawer to visible !important. If we don't, the button goes underneath the main section.
		 * set the overflow proerty of the main to visible !important. If we don't, the dragged element goes underneath the drawer.
		 * replace our helper with the stacked "x fields" template.
		 * 
		 * @since  3.0
		 * @param  Object	 context jQuery UI Draggable
		 * @param  Object	 ui      jQuery UI element
		 * @return void
		 */
		startDrag: function( context, ui ) {
			this.drawerEl = nfRadio.channel( 'app' ).request( 'get:drawerEl' );
			this.mainEl = nfRadio.channel( 'app' ).request( 'get:mainEl' );
			jQuery( this.drawerEl )[0].style.setProperty( 'overflow', 'visible', 'important' );
			jQuery( this.mainEl )[0].style.setProperty( 'overflow', 'visible', 'important' );

			var stagedFields = nfRadio.channel( 'fields' ).request( 'get:staging' );
			var html = _.template( jQuery( '#nf-tmpl-staged-fields-drag' ).html() );
			jQuery( ui.helper ).html( html( { num: stagedFields.models.length } ) );
			jQuery( ui.helper ).prop( 'id', 'nf-staged-fields-drag' );
			jQuery( ui.item ).css( 'opacity', '0.7' );
		},

		/**
		 * When we stop dragging the staging area, we have to set the overflow property to hidden !important
		 * 
		 * @since  3.0
		 * @param  Object	 context jQuery UI Draggable
		 * @param  Object	 ui      jQuery UI element
		 * @return void
		 */
		stopDrag: function( context, ui ) {
			jQuery( this.drawerEl )[0].style.setProperty( 'overflow', 'hidden', 'important' );
			jQuery( this.mainEl )[0].style.setProperty( 'overflow', 'hidden', 'important' );
		}
	});

	return controller;
} );