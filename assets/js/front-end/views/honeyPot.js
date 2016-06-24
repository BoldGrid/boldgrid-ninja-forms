define( [], function() {
    var view = Marionette.ItemView.extend({
        tagName: 'nf-section',
        template: '#nf-tmpl-form-hp',

        events: {
        	'keyup .nf-field-hp': 'maybeError',
            'change .nf-field-hp': 'maybeError'
        },

        maybeError: function( e ) {
            /*
             * If we have an empty honeyPot field, remove the honeypot form error.
             * If we do not have an empty honeyPot field, add the honeypot form error.
             */
            if ( 0 == jQuery( e.target ).val().length ) {
                nfRadio.channel( 'form-' + this.model.get( 'id' ) ).request( 'remove:error', 'honeyPot' );
            } else {
                nfRadio.channel( 'form-' + this.model.get( 'id' ) ).request( 'add:error', 'honeyPot', 'Honeypot Error' );
            }
        }
    });

    return view;
} );