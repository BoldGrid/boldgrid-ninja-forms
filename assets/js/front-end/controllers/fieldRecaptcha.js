define([], function() {
    var controller = Marionette.Object.extend({

        initialize: function () {
            this.listenTo( nfRadio.channel( 'recaptcha' ), 'init:model', this.initRecaptcha );
        },

       	initRecaptcha: function ( model ) {
       		this.model = model;
        	nfRadio.channel( 'recaptcha' ).reply( 'update:response', this.updateResponse, this );
        },

        updateResponse: function( response ) {
        	this.model.set( 'value', response );
            nfRadio.channel( 'fields' ).request( 'remove:error', this.model.get( 'id' ), 'required-error' );
        }
    });

    return controller;
} );