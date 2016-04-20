define([], function() {
    var controller = Marionette.Object.extend({

        initialize: function () {
            this.listenTo( nfRadio.channel( 'date' ), 'render:view', this.initDatepicker );
        },

        initDatepicker: function ( view ) {
            var dateObject = pikadayResponsive( jQuery( view.el ).find( '.nf-element' )[0], {
                format: view.model.get( 'date_format' ),
                classes: 'ninja-forms-field'
            } );
            if ( 1 == view.model.get( 'date_default' ) ) {
               dateObject.setDate( moment() ); 
            }
        }
    });

    return controller;
});