/**
 * Handles actions related to our staged fields sortable.
 * 
 * @package Ninja Forms builder
 * @subpackage Fields - New Field Drawer
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['models/fields/stagingCollection'], function( stagingCollection ) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			// Listen to our field type draggables
			// this.listenTo( nfRadio.channel( 'drawer-addField' ), 'startDrag:type', this.addActiveClass );
			// this.listenTo( nfRadio.channel( 'drawer-addField' ), 'stopDrag:type', this.removeActiveClass );
			// Listen to our sortable events
			this.listenTo( nfRadio.channel( 'drawer-addField' ), 'receive:stagedFields', this.receiveStagedFields );
			this.listenTo( nfRadio.channel( 'drawer-addField' ), 'over:stagedFields', this.overStagedFields );
			this.listenTo( nfRadio.channel( 'drawer-addField' ), 'out:stagedFields', this.outStagedFields );
			this.listenTo( nfRadio.channel( 'drawer-addField' ), 'start:stagedFields', this.startStagedFields );
			this.listenTo( nfRadio.channel( 'drawer-addField' ), 'stop:stagedFields', this.stopStagedFields );
		},

		/**
		 * Change our dropped field type helper so that it matches the other items in our sortable.
		 * 
		 * @since  3.0
		 * @param  Object 	ui jQuery UI item
		 * @return void
		 */
		receiveStagedFields: function( ui ) {
			if( jQuery( ui.item ).hasClass( 'nf-field-type-draggable' ) ) {
				var type = jQuery( ui.item ).data( 'id' );
				var tmpID = nfRadio.channel( 'fields' ).request( 'add:stagedField', type );
				jQuery( ui.helper ).prop( 'id', tmpID );
				nfRadio.channel( 'fields' ).request( 'sort:staging' );
				jQuery( ui.helper ).remove();
				nfRadio.channel( 'drawer-addField' ).trigger( 'drop:fieldType', type );				
			}
		},

		/**
		 * Add an active class to our sortable when a field type item is dragged
		 * 
		 * @since 3.0
		 */
		addActiveClass: function() {
			var stagedFieldsEl = nfRadio.channel( 'app' ).request( 'get:stagedFieldsEl' );
			jQuery( stagedFieldsEl ).addClass( 'nf-droppable-active' );
		},

		/**
		 * Remove the active class from our sortable when the field type item is dropped.
		 * 
		 * @since  3.0
		 * @return void
		 */
		removeActiveClass: function() {
			var stagedFieldsEl = nfRadio.channel( 'app' ).request( 'get:stagedFieldsEl' );
			jQuery( stagedFieldsEl ).removeClass( 'nf-droppable-active' );
		},

		/**
		 * When the field type item is dragged over our sortable, we change the helper to match the sortable items.
		 * 
		 * @since  3.0
		 * @param  Object 	e  event
		 * @param  Object 	ui jQuery UI Element
		 * @return void
		 */
		overStagedFields: function( e, ui ) {
			if( jQuery( ui.item ).hasClass( 'nf-field-type-draggable' ) ) {
				var type = jQuery( ui.item ).data( 'id' );
				var fieldType = nfRadio.channel( 'fields' ).request( 'get:type', type );
				var nicename = fieldType.get( 'nicename' );
				this.currentHelper = ui.helper 
				jQuery( ui.helper ).html( nicename + '<span class="dashicons dashicons-dismiss"></span>' );
				jQuery( ui.helper ).removeClass( 'nf-field-type-button' ).addClass( 'nf-item-dock' ).css( { 'opacity': '0.8', 'width': '', 'height': '' } );
				var sortableEl = nfRadio.channel( 'app' ).request( 'get:stagedFieldsEl' );
				if ( jQuery( sortableEl ).hasClass( 'ui-sortable' ) ) {
					jQuery( sortableEl ).addClass( 'nf-droppable-hover' );
				}
			}
			
		},

		/**
		 * When a field type item is moved away from our sortable, we change the helper to its previous appearance
		 * 
		 * @since  3.0
		 * @param  Object 	ui jQuery UI element
		 * @return void
		 */
		outStagedFields: function( ui ) {
			if( jQuery( ui.item ).hasClass( 'nf-field-type-draggable' ) ) {
				var helperClone = nfRadio.channel( 'drawer-addField' ).request( 'get:typeHelperClone' );	
				jQuery( this.currentHelper ).html( jQuery( helperClone ).html() );
				jQuery( this.currentHelper ).removeClass( 'nf-item-dock' ).addClass( 'nf-field-type-button' );
				var sortableEl = nfRadio.channel( 'app' ).request( 'get:stagedFieldsEl' );
				if ( jQuery( sortableEl ).hasClass( 'ui-sortable' ) ) {
					jQuery( sortableEl ).removeClass( 'nf-droppable-hover' );
				}
			}		
		},

		/**
		 * When a user starts to drag a sortable item, we need to set a few properties on the item and the helper.
		 * These keep the original item in place while dragging and changes the opacity of the helper.
		 * 
		 * @since  3.0
		 * @param  Object	 ui jQuery UI element
		 * @return void
		 */
		startStagedFields: function( ui ) {
			jQuery( ui.item ).show();
			jQuery( ui.item ).css( { 'display': 'inline', 'opacity': '0.7' } );
			jQuery( ui.helper ).css( 'opacity', '0.5' );
		},

		/**
		 * When we stop dragging a sortable item, remove our opacity setting and remove the helper item.
		 * 
		 * @since  3.0
		 * @param  Object	 ui jQuery UI element
		 * @return void
		 */
		stopStagedFields: function( ui ) {
			jQuery( ui.item ).css( 'opacity', '' );
			jQuery( ui.helper ).remove();
		}

	});

	return controller;
} );