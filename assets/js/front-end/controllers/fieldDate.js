define([], function() {
    var controller = Marionette.Object.extend({

        initialize: function () {
            this.listenTo( nfRadio.channel( 'date' ), 'render:view', this.initDatepicker );
        },

        initDatepicker: function ( view ) {

            var el = jQuery( view.el ).find( '.nf-element' )[0];
            var dateObject = pikadayResponsive( el, {
                format: view.model.get( 'date_format' ),
                classes: jQuery( el ).attr( "class" )
            } );
            if ( 1 == view.model.get( 'date_default' ) ) {
               dateObject.setDate( moment() ); 
            }
        }
    });

    return controller;
});