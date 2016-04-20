define( [], function() {
	var view = Marionette.ItemView.extend({
		tagName: 'nf-section',
		template: '#nf-tmpl-field-file-row',

		onRender: function() {
			this.$el = this.$el.children();
			this.$el.unwrap();
			this.setElement( this.$el );

			if ( 0 == jQuery( this.el ).find( 'input:file' ).length ) {
				jQuery( this.el ).find( '.nf-file-input' ).append( this.model.get( 'fileInput' ) );
			}
		},
	});

	return view;
} );