/**
 * Model for our individual domains.
 * 
 * @package Ninja Forms builder
 * @subpackage Fields
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [ 'views/app/drawer/defaultSettingsTitle', 'views/app/empty' ], function( DefaultSettingsTitleView, EmptyView ) {
	var model = Backbone.Model.extend( {
		defaults: {
			dashicons: '',
			classes: '',
			active: false,
			url: '',
			hotkeys: false,
			disabled: false,

			getSettingsTitleView: function( data ) {
				return new DefaultSettingsTitleView( data );
			},

			getDefaultSettingsTitleView: function( data ) {
				return new DefaultSettingsTitleView( data );
			},

			getGutterLeftView: function( data ) {
				/*
				 * Return empty view
				 */
				return new EmptyView();
			},

			getGutterRightView: function( data ) {
				/* 
				 * Return empty view
				 */
				return new EmptyView();
			}
		}
	} );
	
	return model;
} );