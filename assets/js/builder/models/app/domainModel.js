/**
 * Model for our individual domains.
 * 
 * @package Ninja Forms builder
 * @subpackage Fields
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['views/app/drawer/defaultSettingsTitle'], function( defaultSettingsTitleView ) {
	var model = Backbone.Model.extend( {
		defaults: {
			dashicons: '',
			classes: '',
			active: false,
			url: '',
			hotkeys: false,
			disabled: false,

			getSettingsTitleView: function( data ) {
				return new defaultSettingsTitleView( data );
			}
		}
	} );
	
	return model;
} );