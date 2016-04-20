define([], function() {
    var controller = Marionette.Object.extend( {

        initialize: function() {
            this.listenTo( nfRadio.channel( 'quantity' ), 'init:model', this.registerQuantity );
        },

        registerQuantity: function( model ){
            var productID = model.get( 'product_assignment' );
            var product = nfRadio.channel( 'fields' ).request( 'get:field', productID );

            if( product ) {
                product.set('product_use_quantity', 0);
            }
        },

    });

    return controller;
});