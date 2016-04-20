define([], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			this.listenTo( nfRadio.channel( 'submit' ), 'submit:response', this.actionSubmit );
		},

		actionSubmit: function( response ) {
			if ( _.size( response.errors ) == 0 && 'undefined' != typeof response.data.actions ) {
				if ( 'undefined' != typeof response.data.actions.success_message && '' != response.data.actions.success_message ) {
					jQuery( '.nf-response-msg' ).html( response.data.actions.success_message );
				}
			}
		}

	});

	return controller;
} );