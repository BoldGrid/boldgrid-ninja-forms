/**
 * Listens to our app channel for settings views being rendered.
 *
 * @package Ninja Forms builder
 * @subpackage Main App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
    var controller = Marionette.Object.extend( {
        initialize: function() {
            // We don't want to re-render this setting type when the data changes.
            nfRadio.channel( 'setting-type-color' ).reply( 'renderOnChange', this.setRenderFalse );
            // We want to close any color pickers before we close our styling tab or drawer.
            this.listenTo( nfRadio.channel( 'setting-type-color' ), 'destroy:setting', this.closeColorPickers );

            // The first time settingModel and the dataModel meet.
            this.listenTo( nfRadio.channel( 'setting-type-color' ), 'render:setting', this.initColorPicker );
        },

        initColorPicker: function( settingModel, dataModel, view ) {

            var name = settingModel.get( 'name' );
            var el = jQuery( view.el ).find( 'input' );

            jQuery( el ).wpColorPicker( {
                change: function( event, ui ){
                    nfRadio.channel( 'app' ).request( 'change:setting', event, settingModel, dataModel, ui.color.toString() );
                }
            } );
        },

        setRenderFalse: function() {
            return false;
        },

        closeColorPickers: function( settingModel, dataModel, view ) {
            jQuery( view.el ).find( '.wp-color-picker' ).wpColorPicker( 'close' );
        }
    });

    return controller;
} );