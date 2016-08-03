define([], function() {
    var controller = Marionette.Object.extend( {
        initialize: function() {
            this.listenTo( nfRadio.channel( 'forms' ), 'submit:response', this.submitDebug );
        },

        submitDebug: function( response, textStatus, jqXHR, formID ) {
            
            if( 'undefined' == typeof response.debug ) return;
            
            var debugMessages = '';
            _.each( response.debug, function( message, index ){
                debugMessages += message + '<br />';
            });

            jQuery( '.nf-debug-msg' ).html( debugMessages );
        }

    });

    return controller;
} );