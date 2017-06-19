define([], function() {
    var controller = Marionette.Object.extend( {
        initialize: function() {
            this.listenTo( nfRadio.channel( 'product' ), 'init:model', this.register );
            nfRadio.channel( 'product' ).reply( 'get:calcValue', this.getCalcValue, this );
        },

        register: function( model ) {
            model.set( 'renderProductQuantity', this.renderProductQuantity );
            model.set( 'renderProduct', this.renderProduct );
            model.set( 'renderOptions', this.renderOptions );
        },

        renderProduct: function(){
            switch( this.product_type ) {
                case 'user':
                    var template = nfRadio.channel( 'app' ).request( 'get:template',  '#tmpl-nf-field-textbox' );
                    return template( this );
                    break;
                case 'hidden':
                    var template = nfRadio.channel( 'app' ).request( 'get:template',  '#tmpl-nf-field-hidden' );
                    return template( this );
                    break;

                case 'dropdown':
                    var template = nfRadio.channel( 'app' ).request( 'get:template',  '#tmpl-nf-product-dropdown' );
                    return template( this );
                    break;
                default:
                    var template = nfRadio.channel( 'app' ).request( 'get:template',  '#tmpl-nf-product-single' );
                    return template( this );
            }
        },

        renderProductQuantity: function(){
            if ( 1 == this.product_use_quantity ) {
                var template = nfRadio.channel( 'app' ).request( 'get:template',  '#tmpl-nf-product-quantity' );
                return template( this );
            }
        },

        renderOptions: function() {
            var that = this;
            var html = '';
            _.each( this.options, function( option ) {
                if ( 1 == option.selected ) {
                    var selected = true;
                } else {
                    var selected = false;
                }

                option.selected = selected;
                option.fieldID = that.id;
                option.classes = that.classes;
                option.currentValue = that.value;

                var template = nfRadio.channel( 'app' ).request( 'get:template',  '#tmpl-nf-product-' + that.product_type + '-option' );
                html += template( option );
            } );

            return html;
        },

        getCalcValue: function( fieldModel ) {

            var product_price = fieldModel.get( 'product_price' );
            var product_quantity = fieldModel.get( 'value' );

            return product_price * product_quantity;
        }
    });

    return controller;
} );
