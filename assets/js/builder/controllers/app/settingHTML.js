/**
 * Listens to our app channel for settings views being rendered.
 *
 *
 *
 * @package Ninja Forms builder
 * @subpackage Main App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
    var controller = Marionette.Object.extend( {
        initialize: function() {

            // The first time settingModel and the dataModel meet.
            this.listenTo( nfRadio.channel( 'setting-type-html' ), 'before:renderSetting', this.init );
        },

        init: function( settingModel, dataModel ) {

            if( 'undefined' == settingModel.get( 'mirror' ) ) return;

            // Listen to a setting change inside of the dataModel.
            dataModel.on( 'change:' + settingModel.get( 'mirror' ), this.update, settingModel );
        },

        update: function( dataModel, changedSettingValue ) {

            // Mirror the default value setting value.
            dataModel.set( this.get( 'name' ), changedSettingValue );
        }
    });

    return controller;
} );