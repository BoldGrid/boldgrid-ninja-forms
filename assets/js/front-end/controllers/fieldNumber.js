define([], function() {
    var controller = Marionette.Object.extend( {
        initialize: function() {
            this.listenTo( nfRadio.channel( 'number' ), 'init:model', this.maybeMinDefault );
            this.listenTo( nfRadio.channel( 'number' ), 'keyup:field', this.validateMinMax );
        },

        maybeMinDefault: function( model ) {

            if( '' == model.get( 'value' ) ){
                var min = model.get( 'num_min' );
                model.set( 'value', min );
            }
        },

        validateMinMax: function( el, model ) {
            var $el = jQuery( el );
            var value = parseFloat( $el.val() );
            var min = $el.attr( 'min' );
            var max = $el.attr( 'max' );
            var step = parseFloat( $el.attr( 'step' ) );

            if( min && value < min ){
                var fieldModel = nfRadio.channel( 'fields' ).request( 'get:field', model.get( 'id' ) );
                var formModel  = nfRadio.channel( 'app'    ).request( 'get:form',  fieldModel.get( 'formID' ) );
                nfRadio.channel( 'fields' ).request( 'add:error', model.get( 'id' ), 'number-min', formModel.get( 'settings' ).fieldNumberNumMinError );
            } else {
                nfRadio.channel( 'fields' ).request( 'remove:error', model.get( 'id' ), 'number-min' );
            }

            if ( max && value > max ){
                var fieldModel = nfRadio.channel( 'fields' ).request( 'get:field', model.get( 'id' ) );
                var formModel  = nfRadio.channel( 'app'    ).request( 'get:form',  fieldModel.get( 'formID' ) );
                nfRadio.channel( 'fields' ).request( 'add:error', model.get( 'id' ), 'number-max', formModel.get( 'settings' ).fieldNumberNumMaxError );
            } else {
                nfRadio.channel( 'fields' ).request( 'remove:error', model.get( 'id' ), 'number-max' );
            }

            var testValue = parseInt( value * 1000000000 );
            var testStep = parseInt( step * 1000000000  );

            if( value && 0 !== testValue % testStep ){
                var fieldModel = nfRadio.channel( 'fields' ).request( 'get:field', model.get( 'id' ) );
                var formModel  = nfRadio.channel( 'app'    ).request( 'get:form',  fieldModel.get( 'formID' ) );
                nfRadio.channel( 'fields' ).request( 'add:error', model.get( 'id' ), 'number-step', formModel.get( 'settings' ).fieldNumberIncrementBy + step );
            } else {
                nfRadio.channel( 'fields' ).request( 'remove:error', model.get( 'id' ), 'number-step' );
            }
        }

    });

    return controller;
} );