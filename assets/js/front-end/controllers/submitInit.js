define(['controllers/submitButton'], function( submitButton ) {
	var radioChannel = nfRadio.channel( 'submit' );
	var controller = Marionette.Object.extend( {
		initialize: function() {
			this.listenTo( radioChannel, 'init:model', this.registerSubmit );
		},

		registerSubmit: function( model ) {
			model.set( 'maybeRenderError', this.maybeRenderError );
			new submitButton( model );
		},

		maybeRenderError: function() {
			if ( nfRadio.channel( 'form' ).request( 'get:errors', this.formID ) ) {
				var template = nfRadio.channel( 'app' ).request( 'get:template',  '#tmpl-nf-field-submit-error-msg' );
				return template( this );
			} else {
				return '';
			}
			
		}

	});

	return controller;
} );