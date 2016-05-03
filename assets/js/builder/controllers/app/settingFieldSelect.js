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

            // Bind field key listener to field-select setting type.
            this.listenTo( nfRadio.channel( 'field-select' ), 'init:settingModel', this.trackKeyChanges );

            // The first time settingModel and the dataModel meet.
            this.listenTo( nfRadio.channel( 'setting-type-field-select' ), 'before:renderSetting', this.beforeRender );

            // Add setting change listener only in drawers with a field-select setting.
            this.listenTo( nfRadio.channel( 'field-select' ), 'init:settingModel', function() {
                this.listenTo( nfRadio.channel( 'app' ), 'change:setting', this.maybeSwitchToFieldsDomain );
            });

            this.listenTo( nfRadio.channel( 'app' ), 'change:currentDomain', this.autoOpenDrawer );

            this.listenTo( nfRadio.channel( 'drawer' ), 'opened', this.filterDrawerContents );
            this.listenTo( nfRadio.channel( 'drawer' ), 'closed', this.SwitchToFieldsDomain );
        },

        trackKeyChanges: function( settingModel ) {
            settingModel.listenTo( nfRadio.channel( 'app' ), 'update:fieldKey', settingModel.updateKey );

            // Update selected field if the selected field's key changes.
            this.listenTo( nfRadio.channel( 'app' ), 'replace:fieldKey', this.updateFieldMap );
        },

        updateFieldMap: function( dataModel, keyModel, settingModel ) {

            var oldKey = keyModel._previousAttributes[ 'key' ];
            var newKey = keyModel.get( 'key' );

            if( 'field-select' == settingModel.get( 'type' ) && dataModel.get( settingModel.get( 'name' ) ) == oldKey ) {

                dataModel.set( settingModel.get( 'name' ), newKey );
            }
        },

        beforeRender: function( settingModel, dataModel ) {

            var fieldCollection = nfRadio.channel( 'fields' ).request( 'get:collection' );

            var fieldTypes = settingModel.get( 'field_types' );

            var options = [
                {
                    label: '--',
                    value: 0
                }
            ];
            _.each( fieldCollection.models, function( field ){

                if( dataModel.cid == field.cid ) return;

                if( 'undefined' != typeof fieldTypes && 0 != fieldTypes.length && ! _.contains( fieldTypes, field.get( 'type' ) ) ) return;

                options.push({
                    label: field.get( 'label' ),
                    value: '{field:' + field.get( 'key' ) + '}'
                });
            });

            if( 'undefined' != typeof fieldTypes && 0 != fieldTypes.length ) {
                _.each( fieldTypes, function( fieldType ){
                    options.push({
                        label: '-- Add ' + fieldType + ' Field',
                        value: 'addField:' + fieldType,
                    });
                } );
            }

            settingModel.set( 'options', options );
        },

        maybeSwitchToFieldsDomain: function( e, model, dataModel ) {

            if( 'field-select' != model.get( 'type' ) ) return;

            var name = model.get( 'name' );
            var value = dataModel.get( name );
            var rubble = value.split( ':' );

            if( 'addField' != rubble[0] ) return;

            this.openDrawer = 'addField';
            this.filterDrawer = rubble[1];

            dataModel.set( name, '' );

            this.switchDomain = true;
            nfRadio.channel( 'app' ).request( 'close:drawer' );
        },

        SwitchToFieldsDomain: function() {
            if( this.switchDomain ) {
                var fieldDomainModel = nfRadio.channel( 'app' ).request( 'get:domainModel', 'fields' );
                nfRadio.channel('app').request('change:currentDomain', null, fieldDomainModel);
                this.switchDomain = null;
            }
        },

        autoOpenDrawer: function() {
            if( this.openDrawer ) {
                nfRadio.channel( 'app' ).request( 'open:drawer', this.openDrawer );
                this.openDrawer = null;
            }
        },

        filterDrawerContents: function() {
            if( this.filterDrawer ) {
                nfRadio.channel('drawer-addField').trigger('change:filter', this.filterDrawer);
                this.filterDrawer = null;
            }
        }
    });

    return controller;
} );