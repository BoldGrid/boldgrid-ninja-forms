/**
 * Individual change item.
 *
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var view = Marionette.ItemView.extend({
		tagName: 'div',
		template: '#nf-tmpl-drawer-content-view-changes-item',

		initialize: function() {
			this.model.on( 'change:disabled', this.render, this );
		},

		onBeforeDestroy: function() {
			this.model.off( 'change:disabled', this.render );
		},

		/**
		 * When we render this element, remove the extra wrapping <div> that backbone creates.
		 * 
		 * @since  3.0
		 * @return void
		 */
		onRender: function() {
			this.$el = this.$el.children();
			this.$el.unwrap();
			this.setElement( this.$el );
		},

		events: {
			'click .undoSingle': 'undoSingle'
		},

		undoSingle: function( e ) {
			nfRadio.channel( 'drawer' ).trigger( 'click:undoSingle', this.model );
		}
	});

	return view;
} );