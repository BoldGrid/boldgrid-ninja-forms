/**
 * Add main header.
 *
 * TODO: make dynamic
 * 
 * @package Ninja Forms builder
 * @subpackage Actions
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var view = Marionette.ItemView.extend({
		tagName: 'div',
		template: '#nf-tmpl-main-header-actions',

		initialize: function() {
			var actionCollection = nfRadio.channel( 'actions' ).request( 'get:collection' );
			this.listenTo( actionCollection, 'add', this.render );
			this.listenTo( actionCollection, 'remove', this.render );
		},

		onRender: function() {
			var actionCollection = nfRadio.channel( 'actions' ).request( 'get:collection' );
			if ( actionCollection.models.length == 0 ) {
				jQuery( this.el ).hide();
			} else {
				jQuery( this.el ).show();
			}
		}
	});

	return view;
} );