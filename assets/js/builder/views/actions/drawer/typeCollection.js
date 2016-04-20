define( ['views/actions/drawer/typeButton'], function( actionTypeButtonView ) {
	var view = Marionette.CompositeView.extend( {
		template: '#nf-tmpl-drawer-action-type-section',
		childView: actionTypeButtonView,

		templateHelpers: function() {
			var that = this;
			return {
				renderNicename: function() {
					return that.collection.nicename;
				},

				renderClasses: function() {
					return that.collection.slug;
				}
			}
		},

		attachHtml: function( collectionView, childView ) {
			jQuery( collectionView.el ).find( '.action-types' ).append( childView.el );
		}
	} );

	return view;
} );