define([], function() {
    var controller = Marionette.Object.extend( {

        totalModel: {},

        productTotals: {},

        initialize: function() {
            this.listenTo( nfRadio.channel( 'total' ), 'init:model', this.register );
            this.listenTo( nfRadio.channel( 'shipping' ), 'init:model', this.registerShipping );
        },

        register: function( totalModel ){
            this.totalModel = totalModel;

            var formID = totalModel.get( 'formID' );
            this.listenTo( nfRadio.channel( 'form-' + formID ), 'loaded', this.onFormLoaded );

            this.listenTo( nfRadio.channel( 'product' ), 'change:modelValue', this.onChangeProduct );
            this.listenTo( nfRadio.channel( 'quantity' ), 'change:modelValue', this.onChangeQuantity );
        },

        registerShipping: function( shippingModel ){
            this.shippingCost = shippingModel.get( 'shipping_cost' );
        },

        onFormLoaded: function( formModel ){

            var fieldModels = formModel.get( 'fields' ).models;

            var productFields = {};
            var quantityFields = {};

            for( var model in fieldModels ){

                var field = fieldModels[ model ];
                var fieldID = field.get( 'id' );

                // TODO: Maybe use switch
                if( 'product' == field.get( 'type' ) ){
                    productFields[ fieldID ] = field;
                } else if( 'quantity' == field.get( 'type' ) ){
                    var productID = field.get( 'product_assignment' );
                    quantityFields[ productID ] = field;
                }
            }

            for( var productID in productFields ){

                var product = productFields[ productID ];

                var productPrice = Number( product.get( 'product_price' ) );

                if( quantityFields[ productID ] ){

                    productPrice *= quantityFields[ productID ].get( 'value' );

                } else if( 1 == product.get( 'product_use_quantity' ) ){

                    productPrice *= product.get( 'value' );

                }

                this.productTotals[ productID ] = productPrice;
            }

            this.updateTotal();
        },

        onChangeProduct: function( model ){
            var productID = model.get( 'id' );
            var productPrice = Number( model.get( 'product_price' ) );
            var productQuantity = Number( model.get( 'value' ) );
            var newTotal = productQuantity * productPrice;
            this.productTotals[ productID ] = newTotal;

            this.updateTotal();
        },

        onChangeQuantity: function( model ){
            var productID = model.get( 'product_assignment' );
            var productField = nfRadio.channel( 'fields' ).request( 'get:field', productID );
            var productPrice = Number( productField.get( 'product_price' ) );

            var quantity = Number( model.get( 'value' ) );

            var newTotal = quantity * productPrice;

            this.productTotals[ productID ] = newTotal;

            this.updateTotal();
        },

        updateTotal: function(){

            var newTotal = 0;

            for( var product in this.productTotals ){
                newTotal += Number( this.productTotals[ product ] );
            }

            if( newTotal && this.shippingCost ) {
                // Only add shipping if there is a cost.
                newTotal += Number(this.shippingCost);
            }

            this.totalModel.set( 'value', newTotal.toFixed( 2 ) );
            this.totalModel.set( 'reRender', true );
            this.totalModel.set( 'reRender', false );
        }
    });

    return controller;
});