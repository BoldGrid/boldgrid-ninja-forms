/**
 * Handles interactions with our form settings collection.
 * 
 * @package Ninja Forms builder
 * @subpackage Advanced
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['models/advanced/settingsModel'], function( settingsModel ) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			// Load our action collection from our localized form data
			this.model = new settingsModel( preloadedFormData.settings );

			nfRadio.channel( 'settings' ).reply( 'get:settings', this.getSettings, this );
			nfRadio.channel( 'settings' ).reply( 'get:setting', this.getSetting, this );
			nfRadio.channel( 'settings' ).reply( 'update:setting', this.updateSetting, this );
		},

		getSettings: function() {
			return this.model;
		},

		updateSetting: function( name, value, silent ) {
			silent = silent || false;
			this.model.set( name, value, { silent: silent } );
		},

		getSetting: function( name ) {
			return this.model.get( name );
		}
	});

	return controller;
} );