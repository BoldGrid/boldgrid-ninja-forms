define( [], function() {
	var view = Marionette.ItemView.extend({
		tagName: 'nf-section',
		template: '#tmpl-nf-field-error',

		onRender: function() {
			this.$el = this.$el.children();
			this.$el.unwrap();
			this.setElement( this.$el );
		},
	});

	return view;
} );