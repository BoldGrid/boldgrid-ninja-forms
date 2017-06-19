/**
 * Returns a new setting group collection.
 * Used to settings drawers for custom data models (i.e. not fields, actions, or advanced)
 * 
 * @package Ninja Forms builder
 * @subpackage App - Edit Settings Drawer
 * @copyright (c) 2016 WP Ninjas
 * @since 3.0
 */
define( [ 'models/app/settingGroupCollection' ], function( SettingGroupCollection ) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			// Respond to requests for a new setting group collection
			nfRadio.channel( 'app' ).reply( 'get:settingGroupCollectionDefinition', this.getNewSettingGroupCollection, this );
		},

		/**
		 * Return a new instance of the setting group collection.
		 *
		 * @since  3.0
		 * @return backbone.collection
		 */
		getNewSettingGroupCollection: function() {
			return SettingGroupCollection;
		}

	});

	return controller;
} );