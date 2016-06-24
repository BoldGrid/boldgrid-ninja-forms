define([], function() {
    var controller = Marionette.Object.extend( {
        initialize: function() {
            this.listenTo( nfRadio.channel( 'terms' ), 'init:model', this.register );
        },

        register: function( model ) {
            // nfRadio.channel( 'field-' + this.model.get( 'id' ) ).trigger( 'click:extra', e, this.model );
            this.listenTo( nfRadio.channel( 'field-' + model.get( 'id' ) ), 'click:extra', this.clickExtra );
            this.listenTo( nfRadio.channel( 'field-' + model.get( 'id' ) ), 'keyup:field', this.keyUpExtra );
        },
        
        clickExtra: function( e, model ) {
            var el = jQuery( e.currentTarget );
            var value = el.parent().find( '.extra-value' ).val();
            this.addOption( model, value );
        },

        keyUpExtra: function( el, model, keyCode ) {
            if( 13 != keyCode ) return;
            this.addOption( model, el.val() );
        },

        addOption: function( model, value ) {
            if( ! value ) return;
            var options = model.get( 'options' );
            var new_option = {
                label: value,
                value: value,
                selected: 0,
            };
            options.push( new_option );

            var selected = model.get( 'value' );
            selected.push( value );

            // model.set( 'reRender', true );
            model.trigger( 'reRender' );
        }
        
    });

    return controller;
} );