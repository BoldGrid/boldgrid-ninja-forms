define([], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			this.listenTo( nfRadio.channel( 'forms' ), 'submit:response', this.submitErrors );
		},

		submitErrors: function( response, textStatus, jqXHR, formID ) {

			if ( _.size( response.errors.fields ) > 0 ) {
				_.each( response.errors.fields, function( data, fieldID ) {
                    if ( typeof( data ) === 'object' ) {
                        nfRadio.channel( 'fields' ).request( 'add:error', fieldID, data.slug, data.message );
                    } else {
                        nfRadio.channel( 'fields' ).request( 'add:error', fieldID, 'required-error', data );
                    }
				} );
			}

			if ( _.size( response.errors.form ) > 0 ) {
				_.each( response.errors.form, function( msg, errorID ) {
					nfRadio.channel( 'form-' + formID ).request( 'remove:error', errorID );
					nfRadio.channel( 'form-' + formID ).request( 'add:error', errorID, msg );
				} );
			}

			if ( 'undefined' != typeof response.errors.last ) {
				if( 'undefined' != typeof response.errors.last.message ) {
					var style = 'background: rgba( 255, 207, 115, .5 ); color: #FFA700; display: block;';
					console.log( '%c NINJA FORMS SUPPORT: SERVER ERROR', style );
					console.log( response.errors.last.message );
					console.log( '%c END SERVER ERROR MESSAGE', style );
				}
			}

			/**
			 * TODO: This needs to be re-worked for backbone. It's not dynamic enough.
			 */
			/*
			 * Re-show any hidden fields during a form submission re-start.
			 */
			jQuery( '#nf-form-' + formID + '-cont .nf-field-container' ).show();
		}

	});

	return controller;
} );
