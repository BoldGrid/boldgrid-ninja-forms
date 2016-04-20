define( ['views/fields/fieldItem', 'views/fields/mainContentEmpty'], function( mainContentFieldView, mainContentFieldEmptyView ) {
	var view = Marionette.CollectionView.extend( {
		tagName: 'div',
		emptyView: mainContentFieldEmptyView,
		reorderOnSort: true,

		initialize: function() {
			this.childView = nfRadio.channel( 'views' ).request( 'get:fieldItem' );
			nfRadio.channel( 'fields' ).reply( 'get:sortableEl', this.getSortableEl, this );
			nfRadio.channel( 'fields' ).reply( 'init:sortable', this.initSortable, this );
			nfRadio.channel( 'fields' ).reply( 'destroy:sortable', this.destroySortable, this );
		},

		onRender: function() {
			if ( this.collection.models.length > 0 ) {
				jQuery( this.el ).addClass( 'nf-field-type-droppable' ).addClass( 'nf-fields-sortable' );
				var that = this;
				/* TODO: There's a bug with some Android phones and chrome. The fix below hasn't been implement.

				 * Instantiate our sortable field list, but only if we aren't on a mobile device.
				 *
				 * On Android, our sortable list isn't scrollable if it's instantiated at render.
				 * Instead, for mobile, we need to instantiate our sortable when the user tapholds and then
				 * destroy it when the drag stops.
				 */
				// if ( ! nfRadio.channel( 'app' ).request( 'is:mobile' ) ) {
					this.initSortable();
				// }
			}

			nfRadio.channel( 'app' ).trigger( 'render:fieldsSortable', this );
		},

		getSortableEl: function() {
			return this.el;
		},

		initSortable: function() {
			if ( nfRadio.channel( 'app' ).request( 'is:mobile' ) ) {
				var tolerance = 'pointer';
			} else {
				var tolerance = 'intersect';
			}

			jQuery( this.el ).sortable( {
				containment: '#nf-main',
				helper: 'clone',
				cancel: '.nf-item-controls',
				placeholder: 'nf-fields-sortable-placeholder',
				opacity: 0.95,
				tolerance: tolerance,

				receive: function( e, ui ) {
					nfRadio.channel( 'app' ).request( 'receive:fieldsSortable', ui );
				},

				over: function( e, ui ) {
					nfRadio.channel( 'app' ).request( 'over:fieldsSortable', ui );
				},

				out: function( e, ui ) {
					nfRadio.channel( 'app' ).request( 'out:fieldsSortable', ui );
				},

				start: function( e, ui ) {
					nfRadio.channel( 'app' ).request( 'start:fieldsSortable', ui );
				},

				update: function( e, ui ) {
					nfRadio.channel( 'app' ).request( 'update:fieldsSortable', ui );
				},

				stop: function( e, ui ) {
					nfRadio.channel( 'app' ).request( 'stop:fieldsSortable', ui );
				}
			} );
		},

		destroySortable: function() {
			jQuery( this.el ).sortable( 'destroy' );
		}

	} );

	return view;
} );
