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
            var that = this;
            var html = '';
            if ( '' == this.value ) {
                var valueFound = true;
            } else {
                var valueFound = false;
            }

            _.each( this.options, function( option ) {
                if ( option.value == that.value ) {
                    valueFound = true;
                }

                option.fieldID = that.id;
                option.classes = that.classes;
                option.currentValue = that.value;

                if( option.selected ){
                    that.selected.push( option.value );
                }

                var template = _.template( jQuery( '#nf-tmpl-field-listcheckbox-option' ).html() );

                html += template( option );
            } );

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

                var template = _.template( jQuery( '#nf-tmpl-field-listcheckbox-other' ).html() );
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
                var template = _.template( jQuery( '#nf-tmpl-field-listcheckbox-other-text' ).html() );
                return template( data );
            }
        },

        getCalcValue: function( fieldModel ) {
            var calc_value = 0;
            var options = fieldModel.get( 'options' );
            if ( 0 != options.length ) {
                _.each( fieldModel.get( 'value' ), function( val ) {
                    var tmp_opt = _.find( options, function( opt ) { return opt.value == val } );
                    calc_value = math.add( calc_value, tmp_opt.calc );
                } );
            }
            return calc_value;
        },

        beforeUpdateField: function( el, model ) {
            var selected = model.get( 'selected' ) || [];
            if ( typeof selected == 'string' ) selected = [ selected ];

            var value = jQuery( el).val();
            var checked = jQuery( el ).attr( 'checked' );
            if ( checked ) {
                selected.push( value );
            } else {
                var i = selected.indexOf( value );
                if( -1 != i ){
                    selected.splice( i, 1 );
                }
            }

            model.set( 'selected', selected );

            if ( 1 == model.get( 'show_other' ) ) {
                model.set( 'reRender', true );
            }

            return _.clone( selected );
        }
    });

    return controller;
} );