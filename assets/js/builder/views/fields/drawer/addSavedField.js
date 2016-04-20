define( [], function() {
	var view = Marionette.ItemView.extend({
		tagName: 'div',
		template: '#nf-tmpl-add-saved-field',

		initialize: function() {
			this.model.on( 'change:addSavedLoading', this.renderAddButton, this );
		},

		onRender: function() {
			this.renderAddButton();
		},

		renderAddButton: function() {
			if ( this.model.get( 'addSavedLoading' ) ) {
				var button = _.template( jQuery( '#nf-tmpl-add-saved-field-loading' ).html() );
			} else {
				var button = _.template( jQuery( '#nf-tmpl-add-saved-field-button' ).html() );
			}
			jQuery( this.el ).find( '.add-button' ).html( button( this ) );
		},

		onBeforeDestroy: function() {
			this.model.off( 'change:addSavedLoading', this.render );
		},

		events: {
			'click .nf-button': 'clickAddSavedField'
		},

		clickAddSavedField: function( e ) {
			nfRadio.channel( 'drawer' ).trigger( 'click:addSavedField', e, this.model );
		}
	});

	return view;
} );
