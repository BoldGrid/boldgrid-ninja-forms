/**
 * Handles actions related to field settings that use a fieldset
 * 
 * @package Ninja Forms builder
 * @subpackage Fields - Edit Field Drawer
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['views/app/drawer/typeSettingFieldset','models/app/settingCollection'], function( fieldsetView, settingCollection ) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			nfRadio.channel( 'fieldset' ).reply( 'get:settingChildView', this.getSettingChildView, this );
			// When a list type field is initialized, create an option collection.
			this.listenTo( nfRadio.channel( 'fieldset' ), 'init:settingModel', this.createSettingsCollection );
		},

		getSettingChildView: function( model ) {
			return fieldsetView;
		},

		/**
		 * Instantiate settings collection when a fieldset type is initialized.
		 * 
		 * @since  3.0
		 * @param  backbone.model 	model 	field model being initialized
		 * @return void
		 */
		createSettingsCollection: function( model ) {
			model.set( 'settings', new settingCollection( model.get( 'settings' ) ) );
		},

	});

	return controller;
} );