define([], function() {
    var controller = Marionette.Object.extend( {
        initialize: function() {
            this.listenTo( nfRadio.channel( 'product' ), 'init:model', this.register );
        },

        register: function( model ) {
            model.set( 'renderProductQuantity', this.renderProductQuantity );
            model.set( 'renderProduct', this.renderProduct );
            model.set( 'renderOptions', this.renderOptions );
        },

        renderProduct: function(){
            switch( this.product_type ) {
                case 'user':
                    var template = _.template( jQuery( '#nf-tmpl-field-textbox' ).html() );
                    return template( this );
                    break;
                case 'hidden':
                    var template = _.template( jQuery( '#nf-tmpl-field-hidden' ).html() );
                    return template( this );
                    break;

                case 'dropdown':
                    var template = _.template( jQuery( '#nf-tmpl-product-dropdown' ).html() );
                    return template( this );
                    break;
                default:
                    var template = _.template( jQuery( '#nf-tmpl-product-single' ).html() );
                    return template( this );
            }
        },

        renderProductQuantity: function(){
            if ( 1 == this.product_use_quantity ) {
                var template = _.template( jQuery( '#nf-tmpl-product-quantity' ).html() );
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

                var template = _.template( jQuery( '#nf-tmpl-product-' + that.product_type + '-option' ).html() );

                html += template( option );
            } );

            return html;
        }
    });

    return controller;
} );
