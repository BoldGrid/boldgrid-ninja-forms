define([], function() {
    var controller = Marionette.Object.extend( {
        initialize: function() {
            this.listenTo( nfRadio.channel( 'listcheckbox' ), 'init:model', this.register );
            this.listenTo( nfRadio.channel( 'terms' ), 'init:model', this.register );
            nfRadio.channel( 'listcheckbox' ).reply( 'before:updateField', this.beforeUpdateField, this );
            nfRadio.channel( 'terms' ).reply( 'before:updateField', this.beforeUpdateField, this );
            nfRadio.channel( 'listcheckbox' ).reply( 'get:calcValue', this.getCalcValue, this );
            nfRadio.channel( 'terms' ).reply( 'get:calcValue', this.getCalcValue, this );
        },

        register: function( model ) {
            model.set( 'renderOptions', this.renderOptions );
            model.set( 'renderOtherText', this.renderOtherText );
            model.set( 'selected', [] );

            /*
             * When we init a model, we need to set our 'value' to the selected option's value.
             * This is the list equivalent of a 'default value'.
             */ 
            if ( 0 != model.get( 'options' ).length ) {
                var selected = _.filter( model.get( 'options' ), function( opt ) { return 1 == opt.selected } );
                selected = _.map( selected, function( opt ) { return opt.value } );
                model.set( 'value', selected );
            }

        },

        renderOptions: function() {
            var html = '';

            if ( '' == this.value ) {
                var valueFound = true;
            } else {
                var valueFound = false;
            }

            _.each( this.options, function( option, index ) {
                if ( option.value == this.value ) {
                    valueFound = true;
                }

                /*
                 * TODO: This is a bandaid fix for making sure that each option has a "visible" property.
                 * This should be moved to creation so that when an option is added, it has a visible property by default.
                 */
                if ( 'undefined' == typeof option.visible ) {
                    option.visible = true;
                }

                option.fieldID = this.id;
                option.classes = this.classes;
                option.index = index;

                if( ( option.selected && "0" != option.selected ) && this.clean ){
                    option.isSelected = true;
                } else {
                    var testValues = _.map( this.value, function( value ) {
                        return value.toString();
                    } );               
                    
                    option.isSelected = ( -1 != testValues.indexOf( option.value.toString() ) );
                }

                var template = nfRadio.channel( 'app' ).request( 'get:template',  '#tmpl-nf-field-listcheckbox-option' );
                html += template( option );
            }, this );

            if ( 1 == this.show_other ) {
                if ( 'nf-other' == this.value ) {
                    valueFound = false;
                }
                var data = {
                    fieldID: this.id,
                    classes: this.classes,
                    currentValue: this.value,
                    renderOtherText: this.renderOtherText,
                    valueFound: valueFound
                };

                var template = nfRadio.channel( 'app' ).request( 'get:template',  '#tmpl-nf-field-listcheckbox-other' );
                html += template( data );

            }

            return html;
        },

        renderOtherText: function() {
            if ( 'nf-other' == this.currentValue || ! this.valueFound ) {
                if ( 'nf-other' == this.currentValue ) {
                    this.currentValue = '';
                }
                var data = {
                    fieldID: this.fieldID,
                    classes: this.classes,
                    currentValue: this.currentValue
                };
                var template = nfRadio.channel( 'app' ).request( 'get:template',  '#tmpl-nf-field-listcheckbox-other-text' );
                return template( data );
            }
        },

        getCalcValue: function( fieldModel ) {
            var calc_value = 0;
            var options = fieldModel.get( 'options' );
            if ( 0 != options.length ) {
                _.each( fieldModel.get( 'value' ), function( val ) {
                    var tmp_opt = _.find( options, function( opt ) { return opt.value == val } );
                    calc_value = Number( calc_value ) + Number( tmp_opt.calc );
                } );
            }
            return calc_value;
        },

        beforeUpdateField: function( el, model ) {
            var selected = model.get( 'value' ) || [];
            if ( typeof selected == 'string' ) selected = [ selected ];

            var value = jQuery( el ).val();
            var checked = jQuery( el ).prop( 'checked' );
            if ( checked ) {
                selected.push( value );
                jQuery( el ).addClass( 'nf-checked' );
                jQuery( el ).parent().find( 'label[for="' + jQuery( el ).prop( 'id' ) + '"]' ).addClass( 'nf-checked-label' );
            } else {
                jQuery( el ).removeClass( 'nf-checked' );
                jQuery( el ).parent().find( 'label[for="' + jQuery( el ).prop( 'id' ) + '"]' ).removeClass( 'nf-checked-label' );
                var i = selected.indexOf( value );
                if( -1 != i ){
                    selected.splice( i, 1 );
                }
            }

            // if ( 1 == model.get( 'show_other' ) ) {
            //     model.set( 'reRender', true );
            // }

            return _.clone( selected );
        }
    });

    return controller;
} );