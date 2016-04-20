/**
 * @package Ninja Forms builder
 * @subpackage Actions - New Action Drawer
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function( ) {
    var controller = Marionette.Object.extend( {
        initialize: function() {
            this.listenTo( nfRadio.channel( 'setting-newsletter_list' ),             'show:setting',      this.defaultFields );
            this.listenTo( nfRadio.channel( 'setting-type-newsletter_list' ),        'click:extra',       this.clickListUpdate );
            this.listenTo( nfRadio.channel( 'actionSetting-newsletter_list' ),       'update:setting',    this.maybeRenderFields );
            this.listenTo( nfRadio.channel( 'actionSetting-newsletter_list' ),       'update:setting',    this.maybeRenderGroups );
            this.listenTo( nfRadio.channel( 'setting-name-newsletter_list_fields' ), 'init:settingModel', this.registerFieldsListener );
            this.listenTo( nfRadio.channel( 'setting-name-newsletter_list_groups' ), 'init:settingModel', this.registerGroupsListener );
        },

        defaultFields: function( settingModel, dataModel ) {
            this.maybeRenderFields( dataModel, settingModel );
            this.maybeRenderGroups( dataModel, settingModel );
        },

        registerFieldsListener: function ( model ) {
            model.listenTo( nfRadio.channel( 'newsletter_list_fields' ), 'update:fieldMapping', this.updateFieldMapping, model );
        },

        registerGroupsListener: function ( model ) {
            model.listenTo( nfRadio.channel( 'newsletter_list_groups' ), 'update:interestGroups', this.updateInterestGroups, model );
        },

        clickListUpdate: function( e, settingModel, dataModel, settingView ) {

            var data = {
                action: 'nf_' + dataModel.attributes.type + '_get_lists',
                security: nfAdmin.ajaxNonce
            };

            var that = this;
            jQuery( e.srcElement ).addClass( 'spin' );
            jQuery.post( ajaxurl, data, function( response ){
                var response = JSON.parse( response );
                that.updateLists( settingModel, response.lists, settingView, dataModel );
                dataModel.set( 'newsletter_list', response.lists[0].value, { settingModel: settingModel } );
            }).always( function() {
                jQuery( e.srcElement ).removeClass( 'spin' );
            });
        },

        updateLists: function( settingModel, lists, settingView, dataModel ) {
            settingModel.set( 'options', lists );
            settingView.render();
        },

        maybeRenderFields: function( dataModel, settingModel ) {

            if( 'undefined' == typeof settingModel ) return;

            var selectedList = dataModel.get( 'newsletter_list' );
            var lists = settingModel.get( 'options' );
            _.each( lists, function( list ) {
                if ( selectedList == list.value ) {
                    nfRadio.channel( 'newsletter_list_fields').trigger( 'update:fieldMapping', list.fields );
                }
            } );

            dataModel.set( 'newsletter_list_fields', 0 );
        },

        maybeRenderGroups: function( dataModel, settingModel ) {
            if( 'undefined' == typeof settingModel ) return;

            var selectedList = dataModel.get( 'newsletter_list' );
            var lists = settingModel.get( 'options' );
            _.each( lists, function( list ) {
                if ( selectedList == list.value ) {
                    nfRadio.channel( 'newsletter_list_groups').trigger( 'update:interestGroups', list.groups );
                }
            } );

            dataModel.set( 'newsletter_list_fields', 0 );
        },

        updateFieldMapping: function( fields ) {
           var settings = this.get( 'settings' );
            settings.reset();
            _.each( fields, function( field ){

                settings.add({
                    name: field.value,
                    type: 'textbox',
                    label: field.label,
                    width: 'full',
                    use_merge_tags: { exclude: [ 'user', 'post', 'system', 'querystrings' ] }
                });
            });
            this.set( 'settings', settings );
        },

        updateInterestGroups: function( groups ) {
            var settings = this.get( 'settings' );
            settings.reset();
            _.each( groups, function( group ){

                settings.add({
                    name: group.value,
                    type: 'toggle',
                    label: group.label,
                    width: 'full',
                });
            });
            this.set( 'settings', settings );
        },

    });

    return controller;
} );
