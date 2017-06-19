/**
 * The Field List setting is a container of settings (like the Fieldset setting), in which its children are instantiated.
 * Unlike the Fieldset setting, Field List settings are dynamically created based on the list of form fields.
 *
 * Note: Field references in the dynamic setting names are based on field keys, which may change.
 * Unlike regular field key tracking, a new setting needs to be created with the same value as the previous.
 *
 * @package Ninja Forms builder
 * @subpackage Action Settings
 * @copyright (c) 2016 WP Ninjas
 * @author Kyle B. Johnson
 * @since 3.0
 */
define( ['views/app/drawer/typeSettingFieldset','models/app/settingCollection'], function( fieldsetView, settingCollection ) {
    return Marionette.Object.extend( {

        /**
         * A reference list of Field List setting models.
         */
        fieldListSettings: [],

        initialize: function() {
            this.listenTo( nfRadio.channel( 'field-list' ),       'init:settingModel',    this.registerFieldListSettings  );
            this.listenTo( nfRadio.channel( 'fields' ),           'update:setting',       this.updateFieldListSettingKeys );
                           nfRadio.channel( 'field-list' ).reply( 'get:settingChildView', this.getSettingChildView, this  );
        },

        /**
         * Build a reference list of Field List setting models for later reference.
         *
         * @param settingModel
         */
        registerFieldListSettings: function( settingModel ){
            this.fieldListSettings.push( settingModel.get( 'name' ) );
        },

        /**
         * Field List settings contain field keys in the setting names.
         * When a field key changes, so too must the Field List setting name.
         *
         * @param fieldModel
         */
        updateFieldListSettingKeys: function( fieldModel ){

            // We are only interested in field key changes.
            if( 'undefined' == typeof fieldModel.changed.key ) return;

            var oldKey = fieldModel._previousAttributes.key;
            var newKey = fieldModel.changed.key;

            /*
             * This is an absolute (functional) mess of nesting. I apologize to my future self, or Kenny.
             *
             * Each setting of each action model must be checked against each registered Field List setting.
             */
            var that = this;
            _.each( Backbone.Radio.channel( 'actions' ).request( 'get:collection' ).models, function( actionModel ) {
                _.each( actionModel.attributes, function( value, setting ) {
                    var lastChanged = ''; // Used to avoid resetting the change with a duplicate call.
                    _.each( that.fieldListSettings, function( prefix ) {
                        if( setting != prefix + '-' + oldKey || lastChanged == oldKey ) return;
                        var oldValue = actionModel.get( prefix + '-' + oldKey );
                        actionModel.set( prefix + '-' + newKey, oldValue );
                        actionModel.set( prefix + '-' + oldKey, 0 );
                        lastChanged = oldKey;
                    });
                });
            });
        },

        /**
         * Set the view for Field List sub-settings, just like the Fieldset setting.
         *
         * @param settingModel
         * @returns {*}
         */
        getSettingChildView: function( settingModel ) {

            /**
             * Dynamically build field-list settings as needed for the view.
             */

            // Filter fields based on the field_types setting property.
            var fields = _.filter( nfRadio.channel( 'fields' ).request( 'get:collection' ).models, function( field ) {
                return _.contains( settingModel.get( 'field_types' ), field.get( 'type' ) );
            });

            // Map fields into setting definitions.
            var settings = _.map( fields, function( field ) {
                return {
                    name: settingModel.get( 'name' ) + '-' + field.get( 'key' ),
                    type: 'toggle',
                    label: field.get( 'label' ),
                    width: 'full'
                };
            });

            settingModel.set( 'settings', new settingCollection( settings ) );

            // return the child view.
            return fieldsetView;
        },

    });
} );
