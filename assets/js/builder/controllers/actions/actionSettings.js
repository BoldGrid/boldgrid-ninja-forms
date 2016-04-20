/**
 * Fetches settings models so that we can get setting information
 * 
 * @package Ninja Forms builder
 * @subpackage Main App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['models/app/settingCollection'], function( settingCollection ) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			this.collection = new settingCollection( actionSettings, { objectType: 'actions' } );

			// Responds to requests for settings models.
			nfRadio.channel( 'actions' ).reply( 'get:settingModel', this.getSettingModel, this );
		},

		getSettingModel: function( name ) {
			return this.collection.findWhere( { name: name } );
		}

	});

	return controller;
} );