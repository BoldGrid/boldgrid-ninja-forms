define( [], function() {
	var view = Marionette.ItemView.extend({
		tagName: 'div',
		template: '#nf-tmpl-drawer-staged-field',

		onRender: function() {
			this.$el = this.$el.children();
			this.$el.unwrap();
			this.setElement( this.$el );
		},

		events: {
			'click .dashicons-dismiss': 'removeStagedField'
		},

		removeStagedField: function( el ) {
			nfRadio.channel( 'drawer-addField' ).trigger( 'click:removeStagedField', el, this.model );
		}
	});

	return view;
} );
