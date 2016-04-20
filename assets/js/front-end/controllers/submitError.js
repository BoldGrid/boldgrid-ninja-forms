define([], function() {
	var radioChannel = nfRadio.channel( 'submit' );
	var controller = Marionette.Object.extend( {
		initialize: function() {
			this.listenTo( radioChannel, 'submit:response', this.submitErrors );
		},

		submitErrors: function( response ) {
			if ( _.size( response.errors ) > 0 ) {
				_.each( response.errors, function( msg, fieldID ) {
					nfRadio.channel( 'fields' ).request( 'add:error', fieldID, 'required-error', msg );
				} );
			}
		}

	});

	return controller;
} );