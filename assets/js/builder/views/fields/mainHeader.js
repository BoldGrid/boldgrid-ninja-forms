define( [], function() {
	var view = Marionette.ItemView.extend({
		tagName: 'div',
		template: '#nf-tmpl-main-header-fields',

		initialize: function() {
			var fieldCollection = nfRadio.channel( 'fields' ).request( 'get:collection' );
			this.listenTo( fieldCollection, 'add', this.render );
			this.listenTo( fieldCollection, 'remove', this.render );
		},

		onRender: function() {
			var fieldCollection = nfRadio.channel( 'fields' ).request( 'get:collection' );
			if ( fieldCollection.models.length == 0 ) {
				jQuery( this.el ).hide();
			} else {
				jQuery( this.el ).show();
			}
		}
	});

	return view;
} );