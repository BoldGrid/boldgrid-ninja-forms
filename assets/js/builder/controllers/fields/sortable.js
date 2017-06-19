/**
 * Handles all the actions/functions related to our main field sortable.
 * All of the actual logic for our sortable is held here; the view just calls it using nfRadio.
 * 
 * @package Ninja Forms builder
 * @subpackage Fields
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			// When our field type buttons are dragged, we need to add or remove the active (blue) class.
			this.listenTo( nfRadio.channel( 'drawer-addField' ), 'startDrag:type', this.addActiveClass );
			this.listenTo( nfRadio.channel( 'drawer-addField' ), 'stopDrag:type', this.removeActiveClass );
			// When our field staging is dragged, we need to add or remove the active (blue) class.
			this.listenTo( nfRadio.channel( 'drawer-addField' ), 'startDrag:fieldStaging', this.addActiveClass );
			this.listenTo( nfRadio.channel( 'drawer-addField' ), 'stopDrag:fieldStaging', this.removeActiveClass );
			
			/*
			 * Handles all the events fired by our sortable:
			 * receive - dropped from type button or staging
			 * over - dragging within or over the sortable
			 * out - leaving the sortable
			 * stop - stopped sorting/dragging
			 * start - started sorting/dragging
			 * update - stopped sorting/dragging and order has changed
			 */
			nfRadio.channel( 'app' ).reply( 'receive:fieldsSortable', this.receiveFieldsSortable, this );
			nfRadio.channel( 'app' ).reply( 'over:fieldsSortable', this.overfieldsSortable, this );
			nfRadio.channel( 'app' ).reply( 'out:fieldsSortable', this.outFieldsSortable, this );
			nfRadio.channel( 'app' ).reply( 'stop:fieldsSortable', this.stopFieldsSortable, this );
			nfRadio.channel( 'app' ).reply( 'start:fieldsSortable', this.startFieldsSortable, this );
			nfRadio.channel( 'app' ).reply( 'update:fieldsSortable', this.updateFieldsSortable, this );
		},

		/**
		 * Add the active class to our sortable so that its border is blue.
		 * 
		 * @since 3.0
		 * @return void
		 */
		addActiveClass: function() {
			var sortableEl = nfRadio.channel( 'fields' ).request( 'get:sortableEl' );
			jQuery( sortableEl ).addClass( 'nf-droppable-active' );	
		},

		/**
		 * Remove the active class from our sortable
		 * 
		 * @since  3.0
		 * @return void
		 */
		removeActiveClass: function() {
			var sortableEl = nfRadio.channel( 'fields' ).request( 'get:sortableEl' );
			jQuery( sortableEl ).removeClass( 'nf-droppable-active' );
		},

		/**
		 * Fires when we drop a field type button or staging onto our sortable
		 * 
		 * @since  3.0
		 * @param  Object 	ui jQuery UI element
		 * @return void
		 */
		receiveFieldsSortable: function( ui ) {
			/*
			 * We have to do different things if we're dealing with a field type button or staging area.
			 */ 
			if( jQuery( ui.item ).hasClass( 'nf-field-type-draggable' ) ) { // Field Type Button
				// Get our type string
				var type = jQuery( ui.item ).data( 'id' );
				// Add a field (returns the tmp ID )
				var tmpID = this.addField( type, false );
				/*
				 * Update our helper id to the tmpID.
				 * We do this so that when we sort, we have the proper ID.
				 */ 
				jQuery( ui.helper ).prop( 'id', tmpID );
				nfRadio.channel( 'fields' ).request( 'sort:fields' );
				// Remove the helper. Gets rid of a weird type artifact.
				jQuery( ui.helper ).remove();
				// Trigger a drop field type event.
				nfRadio.channel( 'fields' ).trigger( 'drop:fieldType', type, tmpID );
			} else if ( jQuery( ui.item ).hasClass( 'nf-stage' ) ) { // Staging
				// Later, we want to reference 'this' context, so we define it here.
				var that = this;
				// Make sure that our staged fields are sorted properly.	
				nfRadio.channel( 'fields' ).request( 'sort:staging' );
				// Grab our staged fields.
				var stagedFields = nfRadio.channel( 'fields' ).request( 'get:staging' );
				// Get our current field order.
				var sortableEl = nfRadio.channel( 'fields' ).request( 'get:sortableEl' );
				
				if ( jQuery( sortableEl ).hasClass( 'ui-sortable' ) ) { // Sortable isn't empty
					// If we're dealing with a sortable that isn't empty, get the order.
					var order = jQuery( sortableEl ).sortable( 'toArray' );
				} else { // Sortable is empty
					// Sortable is empty, all we care about is our staged field draggable.
					var order = ['nf-staged-fields-drag'];
				}
				
				// Get the index of our droped element.
				var insertedAt = order.indexOf( 'nf-staged-fields-drag' );

				// Loop through each staged fields model and insert a field.
				var tmpIDs = [];
				_.each( stagedFields.models, function( field, index ) {
					// Add our field.
					var tmpID = that.addField( field.get( 'slug' ) );
					// Add this newly created field to our order array.
					order.splice( insertedAt + index, 0, tmpID );
				} );

				// Remove our dropped element from our order array.
				var insertedAt = order.indexOf( 'nf-staged-fields-drag' );
				order.splice( insertedAt, 1 );
				// Sort our fields
				nfRadio.channel( 'fields' ).request( 'sort:fields', order );
				// Clear our staging
				nfRadio.channel( 'fields' ).request( 'clear:staging' );
				// Remove our helper. Fixes a weird artifact.
				jQuery( ui.helper ).remove();
			}
		},

		/**
		 * Add a field.
		 * Builds the object necessary to add a field to the field model collection.
		 * 
		 * @since  3.0
		 * @param  string 	type   field type
		 * @param  boolean 	silent add silently
		 * @return string 	tmpID
		 */
		addField: function( type, silent ) {
			// Default to false
			silent = silent || false;
			// Get our field type model
			var fieldType = nfRadio.channel( 'fields' ).request( 'get:type', type ); 
			// Get our tmp ID
			var tmpID = nfRadio.channel( 'fields' ).request( 'get:tmpID' );
			// Add our field
			var newModel = nfRadio.channel( 'fields' ).request( 'add',  { id: tmpID, label: fieldType.get( 'nicename' ), type: type }, silent );
			// Add our field addition to our change log.
			var label = {
				object: 'Field',
				label: newModel.get( 'label' ),
				change: 'Added',
				dashicon: 'plus-alt'
			};

			var data = {
				collection: nfRadio.channel( 'fields' ).request( 'get:collection' )
			}

			nfRadio.channel( 'changes' ).request( 'register:change', 'addObject', newModel, null, label, data );

			return tmpID;
		},

		/**
		 * When the user drags a field type or staging over our sortable, we need to modify the helper.
		 * 
		 * @since  3.0
		 * @param  Object 	ui jQuery UI element
		 * @return void
		 */
		overfieldsSortable: function( ui ) {
			if( jQuery( ui.item ).hasClass( 'nf-field-type-draggable' ) ) { // Field Type
				// String type
				var type = jQuery( ui.helper ).data( 'id' );
				// Get our field type model.
				var fieldType = nfRadio.channel( 'fields' ).request( 'get:type', type );
				// Get our field type nicename.
				var label = fieldType.get( 'nicename' );
				// Get our sortable element.
				var sortableEl = nfRadio.channel( 'fields' ).request( 'get:sortableEl' );
				// Get our fieldwidth.
				var fieldWidth = jQuery( sortableEl ).width();
				// Set our currentHelper to an object var so that we can access it later.
				this.currentHelper = ui.helper;
				// Update our helper label.
				jQuery( ui.helper ).html( label );
				// Remove the field type draggable classes and add sortable classes.
				jQuery( ui.helper ).removeClass( 'nf-field-type-button' ).addClass( 'nf-field-wrap' ).css( { 'width': fieldWidth, 'height': '50px' } );						
				// Add our hover class if our sortable has been initialized.
				if ( jQuery( sortableEl ).hasClass( 'ui-sortable' ) ) {
					jQuery( sortableEl ).addClass( 'nf-droppable-hover' );
				}
			} else if ( jQuery( ui.item ).hasClass( 'nf-stage' ) ) { // Staging
				// Get our sortable, and if it's initialized add our hover class.
				var sortableEl = nfRadio.channel( 'fields' ).request( 'get:sortableEl' );
				if ( jQuery( sortableEl ).hasClass( 'ui-sortable' ) ) {
					jQuery( sortableEl ).addClass( 'nf-droppable-hover' );
				}
			}
		},

		/**
		 * When the user moves a draggable outside of the sortable, we need to change the helper.
		 * This returns the item to its pre-over state.
		 * 
		 * @since  3.0
		 * @param  Object 	ui jQuery UI element
		 * @return void
		 */
		outFieldsSortable: function( ui ) {
			if( jQuery( ui.item ).hasClass( 'nf-field-type-draggable' ) ) { // Field Type
				/*
				 * Get our helper clone.
				 * This will let us access the previous label and classes of our helper.
				 */ 
				var helperClone = nfRadio.channel( 'drawer-addField' ).request( 'get:typeHelperClone' );
				// Set our helper label, remove our sortable class, and add the type class back to the type draggable.
				jQuery( this.currentHelper ).html( jQuery( helperClone ).html() );
				jQuery( this.currentHelper ).removeClass( 'nf-field-wrap' ).addClass( 'nf-field-type-button' ).css( { 'width': '', 'height': '' } );
				// Get our sortable and if it has been intialized, remove the droppable hover class.
				var sortableEl = nfRadio.channel( 'fields' ).request( 'get:sortableEl' );
				if ( jQuery( sortableEl ).hasClass( 'ui-sortable' ) ) {
					jQuery( sortableEl ).removeClass( 'nf-droppable-hover' );
				}
			} else if ( jQuery( ui.item ).hasClass( 'nf-stage' ) ) { // Staging
				// If we've initialized our sortable, remove the droppable hover class.
				var sortableEl = nfRadio.channel( 'fields' ).request( 'get:sortableEl' );
				if ( jQuery( sortableEl ).hasClass( 'ui-sortable' ) ) {
					jQuery( sortableEl ).removeClass( 'nf-droppable-hover' );
				}
			}
		},

		/**
		 * When we stop dragging in the sortable:
		 * remove our opacity setting
		 * remove our ui helper
		 * 
		 * @since  3.0
		 * @param  Object 	ui jQuery UI element
		 * @return void
		 */
		stopFieldsSortable: function( ui ) {
			jQuery( ui.item ).css( 'opacity', '' );
			jQuery( ui.helper ).remove();
			nfRadio.channel( 'fields' ).trigger( 'sortable:stop', ui );
		},

		/**
		 * When we start dragging in the sortable:
		 * add an opacity setting of 0.5
		 * show our item (jQuery hides the original item by default)
		 * 
		 * @since  3.0
		 * @param  Object 	ui jQuery UI element
		 * @return void
		 */
		startFieldsSortable: function( ui ) {
			// If we aren't dragging an item in from types or staging, update our change log.
			if( ! jQuery( ui.item ).hasClass( 'nf-field-type-draggable' ) && ! jQuery( ui.item ).hasClass( 'nf-stage' ) ) { 
				jQuery( ui.item ).css( 'opacity', '0.5' ).show();
			}
			nfRadio.channel( 'fields' ).trigger( 'sortable:start', ui );
		},

		/**
		 * Sort our fields when we change the order.
		 * 
		 * @since  3.0
		 * @param  Object 	ui jQuery UI element
		 * @return void
		 */
		updateFieldsSortable: function( ui, sortable ) {
			
			nfRadio.channel( 'fields' ).request( 'sort:fields' );

			// If we aren't dragging an item in from types or staging, update our change log.
			if( ! jQuery( ui.item ).hasClass( 'nf-field-type-draggable' ) && ! jQuery( ui.item ).hasClass( 'nf-stage' ) ) { 

				var fieldCollection = nfRadio.channel( 'fields' ).request( 'get:collection' );
				var dragFieldID = jQuery( ui.item ).prop( 'id' ).replace( 'field-', '' );
				var dragModel = fieldCollection.get( dragFieldID );

				// Add our change event to the change tracker.
				var data = { fields: [] };
				_.each( fieldCollection.models, function( field ) {
					var oldPos = field._previousAttributes.order;
					var newPos = field.get( 'order' );
					
					data.fields.push( {
						model: field,
						attr: 'order',
						before: oldPos,
						after: newPos
					} );

				} );

				var label = {
					object: 'Field',
					label: dragModel.get( 'label' ),
					change: 'Re-ordered from ' + dragModel._previousAttributes.order + ' to ' + dragModel.get( 'order' ),
					dashicon: 'sort'
				};

				nfRadio.channel( 'changes' ).request( 'register:change', 'sortFields', dragModel, null, label, data );
			}
		}
	});

	return controller;
} );