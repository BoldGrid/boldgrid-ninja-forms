define([], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			this.listenTo( nfRadio.channel( 'forms' ), 'submit:response', this.submitErrors );
		},

		submitErrors: function( response, textStatus, jqXHR, formID ) {

			if ( _.size( response.errors.fields ) > 0 ) {
				_.each( response.errors.fields, function( msg, fieldID ) {
					nfRadio.channel( 'fields' ).request( 'add:error', fieldID, 'required-error', msg );
				} );
			}

			if ( _.size( response.errors.form ) > 0 ) {
				_.each( response.errors.form, function( msg, errorID ) {
					nfRadio.channel( 'form-' + formID ).request( 'add:error', errorID, msg );
				} );
			}
		}

	});

	return controller;
} );