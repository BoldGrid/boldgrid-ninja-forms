/**
 * Fetches settings models so that we can get setting information
 * 
 * @package Ninja Forms builder
 * @subpackage Advanced
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['models/app/settingCollection'], function( settingCollection ) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			this.collection = new settingCollection( formSettings, { objectType: 'settings' } );
					
			// Responds to requests for settings models.
			nfRadio.channel( 'settings' ).reply( 'get:settingModel', this.getSettingModel, this );

			// Responds to requests for our setting collection
			nfRadio.channel( 'settings' ).reply( 'get:collection', this.getSettingCollection, this );
		},

		getSettingModel: function( name ) {
			return this.collection.findWhere( { name: name } );
		},

		getSettingCollection: function() {
			return this.collection;
		}

	});

	return controller;
} );