/**
 * Changes collection view.
 *
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['views/app/drawer/itemSetting'], function( itemSettingView) {
	var view = Marionette.LayoutView.extend( {
		tagName: 'div',
		template: '#tmpl-nf-drawer-content-new-form',

		regions: {
			formName: '.new-form-name',
			formSubmit: '.new-form-submit'
		},

		onRender: function() {
			var titleSettingModel = nfRadio.channel( 'settings' ).request( 'get:settingModel', 'title' );
			var addSubmitSettingModel = nfRadio.channel( 'settings' ).request( 'get:settingModel', 'add_submit' );
			var dataModel = nfRadio.channel( 'settings' ).request( 'get:settings' );
			this.formName.show( new itemSettingView( { model: titleSettingModel, dataModel: dataModel } ) );
			/*
			 * If we don't have any submit buttons on the form, prompt the user to add one on publish.
			 */
			var fieldCollection = nfRadio.channel( 'fields' ).request( 'get:collection' );
			var submitButtons = fieldCollection.findWhere( { type: 'submit' } );
			if ( 'undefined' == typeof submitButtons ) {
				this.formSubmit.show( new itemSettingView( { model: addSubmitSettingModel, dataModel: dataModel } ) );
			} else {
				dataModel.set( 'add_submit', 0 );
			}
		},

		events: {
			'click .publish': 'clickPublish'
		},

		clickPublish: function( e ) {
			nfRadio.channel( 'app' ).trigger( 'click:confirmPublish', e );
		}
	} );

	return view;
} );
