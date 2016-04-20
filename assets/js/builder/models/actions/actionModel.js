/**
 * Model that represents our form action.
 * 
 * @package Ninja Forms builder
 * @subpackage Actions
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var model = Backbone.Model.extend( {
		defaults: {
			objectType: 'Action',
			objectDomain: 'actions',
			editActive: false
		},

		initialize: function() {
			// Listen for model attribute changes
			this.on( 'change', this.changeSetting, this );

			// Get our parent field type.
			var actionType = nfRadio.channel( 'actions' ).request( 'get:type', this.get( 'type' ) );

			// Loop through our action type "settingDefaults" and add any default settings.
			var that = this;
			_.each( actionType.get( 'settingDefaults' ), function( val, key ) {
				if ( ! that.get( key ) ) {
					that.set( key, val, { silent: true } );
				}
			} );
			
			/*
			 * Trigger an init event on three channels:
			 * 
			 * actions
			 * action-type
			 *
			 * This lets specific field types modify model attributes before anything uses them.
			 */ 
			nfRadio.channel( 'actions' ).trigger( 'init:fieldModel', this );
			nfRadio.channel( 'actions-' + this.get( 'type' ) ).trigger( 'init:fieldModel', this );

			this.listenTo( nfRadio.channel( 'actions' ), 'update:fieldKey', this.updateFieldKey );
		},

		/**
		 * When we change the model attributes, fire an event saying we've changed something.
		 * 
		 * @since  3.0
		 * @return void
		 */
		changeSetting: function( model, options ) {
            nfRadio.channel( 'actionSetting-' + _.keys( this.changedAttributes() )[0] ).trigger( 'update:setting', this, options.settingModel ) ;
			nfRadio.channel( 'actions').trigger( 'update:setting', this, options.settingModel );
            nfRadio.channel( 'app' ).trigger( 'update:setting', this, options.settingModel );
		},

		updateFieldKey: function( keyModel, settingModel ) {
			nfRadio.channel( 'app' ).request( 'replace:fieldKey', this, keyModel, settingModel );
		}
	} );
	
	return model;
} );