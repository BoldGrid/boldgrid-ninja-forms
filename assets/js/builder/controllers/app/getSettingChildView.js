/**
 * Returns the appropriate child view for our settings drawer.
 *
 * This enables settings types to register custom childviews for their settings.
 * The option-repeater setting for the list field is an example.
 * 
 * @package Ninja Forms builder
 * @subpackage App - Edit Settings Drawer
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['views/app/drawer/itemSetting'], function( itemSettingView ) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			// Respond to requests for field settings child views.
			nfRadio.channel( 'app' ).reply( 'get:settingChildView', this.getSettingChildView, this );
		},

		/**
		 * Return the appropriate child setting view.
		 *
		 * @since  3.0
		 * @param  backbone.model	model 	Field setting
		 * @return backbone.view
		 */
		getSettingChildView: function( model ) {
			// Get our setting type.
			var type = model.get( 'type' );
			// Request a setting childview from our setting type channel. (Setting type, not field type)
			var settingChildView = nfRadio.channel( type ).request( 'get:settingChildView', model ) || itemSettingView;
			
			return settingChildView
		}

	});

	return controller;
} );