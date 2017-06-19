define([], function() {
    var controller = Marionette.Object.extend({

        initialize: function () {
            this.listenTo( nfRadio.channel( 'recaptcha' ), 'init:model',      this.initRecaptcha  );
            this.listenTo( nfRadio.channel( 'forms' ),     'submit:response', this.resetRecaptcha );
        },

       	initRecaptcha: function ( model ) {
       		this.model = model;
        	nfRadio.channel( 'recaptcha' ).reply( 'update:response', this.updateResponse, this );
        },

        updateResponse: function( response ) {
        	this.model.set( 'value', response );
            nfRadio.channel( 'fields' ).request( 'remove:error', this.model.get( 'id' ), 'required-error' );
        },

        resetRecaptcha: function() {
            try {
                grecaptcha.reset();
            } catch( e ){
                console.log( 'Notice: Error trying to reset grecaptcha.' );
            }
        }
    });

    return controller;
} );
