/**
 * Handles clicks on the 'view changes' button in the header.
 * 
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var view = Marionette.ItemView.extend({
		tagName: 'div',
		template: '#nf-tmpl-drawer-header-view-changes',

		events: {
			'click .undoChanges': 'clickUndoChanges'
		},

		clickUndoChanges: function( e ) {
			nfRadio.channel( 'drawer' ).trigger( 'click:undoChanges' );
		}
	});

	return view;
} );