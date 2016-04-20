
define( [], function() {
    return Marionette.Object.extend( {
        initialize: function() {
            this.listenTo( nfRadio.channel( 'setting' ), 'remote', this.addListener );
        },

        addListener: function( model, dataModel ) {

            var listenTo = model.get( 'remote' ).listen;

            // TODO: Change seems to be triggering twice on each update.
            this.listenTo( nfRadio.channel( 'fieldSetting-' + listenTo ), 'update:setting', this.updateSetting );
            this.listenTo( nfRadio.channel( 'actionSetting-' + listenTo ), 'update:setting', this.updateSetting );

            this.listenTo( nfRadio.channel( 'setting-type-' + model.get( 'type' ) ), 'click:extra', this.clickExtra );

            model.listenTo( nfRadio.channel( 'setting-remote' ), 'get:remote', this.getRemote, model );

            // Auto-trigger get:remote on drawer load.
            nfRadio.channel( 'setting-remote' ).trigger( 'get:remote', dataModel );
        },

        clickExtra: function( e, settingModel, dataModel, settingView ) {
            jQuery( e.srcElement ).addClass( 'spin' );
            nfRadio.channel( 'setting-remote' ).trigger( 'get:remote', dataModel );
        },

        updateSetting: function( dataModel, settingModel ) {
            nfRadio.channel( 'setting-remote' ).trigger( 'get:remote', dataModel );
        },

        getRemote: function( dataModel ) {

            var remote = this.get( 'remote' );

            var data = {
                parentValue: dataModel.get( remote.listen ),
                action: remote.action,
                security: ( remote.security ) ? remote.security : nfAdmin.ajaxNonce
            };

            // TODO: Disable setting and lock drawer while updating.
            var that = this;
            jQuery.post( ajaxurl, data, function( response ){
                var response = JSON.parse( response );

                if( 'textbox' == that.get( 'type' ) ) {
                    dataModel.set( that.get('name'), response.value );
                }

                if( 'select' == that.get( 'type' ) ) {
                    that.set( 'options', response.options );
                    that.trigger( 'rerender' );
                }
            });
        },

    });
} );