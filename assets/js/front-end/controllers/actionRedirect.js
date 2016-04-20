define([], function() {
	var radioChannel = nfRadio.channel( 'submit' );
	var controller = Marionette.Object.extend( {
		initialize: function() {
			this.listenTo( radioChannel, 'submit:response', this.actionRedirect );
		},

		actionRedirect: function( response ) {

			if ( 'undefined' != typeof response.data.halt && 'undefined' != typeof response.data.halt.redirect && '' != response.data.halt.redirect ) {
				window.location = response.data.halt.redirect;
			}

			if ( _.size( response.errors ) == 0 && 'undefined' != typeof response.data.actions ) {

				if ( 'undefined' != typeof response.data.actions.redirect && '' != response.data.actions.redirect ) {
					window.location = response.data.actions.redirect;
				}
			}
		}

	});

	return controller;
} );