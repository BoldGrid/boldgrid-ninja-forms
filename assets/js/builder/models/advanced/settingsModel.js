/**
 * Model that represents our form settings.
 * 
 * @package Ninja Forms builder
 * @subpackage Form Settings
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var model = Backbone.Model.extend( {
		defaults: {
			objectType: 'Form Setting',
			editActive: false
		},

		initialize: function() {
			// Listen for model attribute changes
			this.bind( 'change', this.changeSetting, this );
			/*
			 * Check to see if we have any setting defaults to set.
			 */
			var formSettings = nfRadio.channel( 'settings' ).request( 'get:collection' );
			_.each( formSettings.models, function( settingModel ) {
				if ( 'undefined' == typeof this.get( settingModel.get( 'name' ) ) ) {
					this.set( settingModel.get( 'name' ), settingModel.get( 'value' ), { silent: true } );
				}
				nfRadio.channel( settingModel.get( 'type' ) ).trigger( 'init:dataModel', this, settingModel );
			}, this );

			this.listenTo( nfRadio.channel( 'app' ), 'fire:updateFieldKey', this.updateFieldKey );
		},

		/**
		 * When we change the model attributes, fire an event saying we've changed something.
		 * 
		 * @since  3.0
		 * @return void
		 */
		changeSetting: function( model, options) {
			nfRadio.channel( 'app' ).trigger( 'update:setting', this, options.settingModel );
		},

		updateFieldKey: function( keyModel, settingModel ) {
			nfRadio.channel( 'app' ).trigger( 'replace:fieldKey', this, keyModel, settingModel );
		}
	} );
	
	return model;
} );