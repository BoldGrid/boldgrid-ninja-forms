/**
 * Main content view for our actions.
 *
 * TODO: make dynamic
 * 
 * @package Ninja Forms builder
 * @subpackage Actions
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['views/actions/actionItem', 'views/actions/mainContentEmpty'], function( actionView, emptyView ) {
	var view = Marionette.CompositeView.extend({
		template: '#nf-tmpl-action-table',
		childView: actionView,
		emptyView: emptyView,

		onRender: function() {
			jQuery( this.el ).droppable( {
				accept: '.nf-field-type-draggable',
				activeClass: 'nf-droppable-active',
				hoverClass: 'nf-droppable-hover',
				drop: function( e, ui ) {
					nfRadio.channel( 'app' ).request( 'drop:actionType', e, ui );
				}
			} );
		},

		attachHtml: function( collectionView, childView ) {
			jQuery( collectionView.el ).find( 'tbody' ).append( childView.el );
		},
	});

	return view;
} );