/**
 * Model that represents our form fields.
 * 
 * @package Ninja Forms builder
 * @subpackage Fields
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var model = Backbone.Model.extend( {
		defaults: {
			objectType: 'Field',
			objectDomain: 'fields',
			editActive: false,
			order: 999
		},

		initialize: function() {
			if ( 'undefined' == typeof this.get( 'type' ) ) return;

			// Listen for model attribute changes
			this.on( 'change', this.changeSetting, this );

			// Get our parent field type.
			var fieldType = nfRadio.channel( 'fields' ).request( 'get:type', this.get( 'type' ) );
			var parentType = fieldType.get( 'parentType' );

			// Loop through our field type "settingDefaults" and add any default settings.
			_.each( fieldType.get( 'settingDefaults' ), function( val, key ) {
				if ( 'undefined' == typeof this.get( key ) ) {
					this.set( key, val, { silent: true } );
				}
			}, this );

			/*
			 * If our field type is a saved field, set our field type to the actual field type
			 */
			if ( 'saved' == fieldType.get( 'section' ) ) {
				this.set( 'type', fieldType.get( 'type' ) );
			}

			/*
			 * Trigger an init event on three channels:
			 * 
			 * fields
			 * fields-parentType
			 * field-type
			 *
			 * This lets specific field types modify model attributes before anything uses them.
			 */ 
			nfRadio.channel( 'fields' ).trigger( 'init:fieldModel', this );
			nfRadio.channel( 'fields-' + parentType ).trigger( 'init:fieldModel', this );
			nfRadio.channel( 'fields-' + this.get( 'type' ) ).trigger( 'init:fieldModel', this );

			this.listenTo( nfRadio.channel( 'app' ), 'fire:updateFieldKey', this.updateFieldKey );
		},

		/**
		 * Fires an event on the fieldSetting-{name} channel saying we've updated a setting.
		 * When we change the model attributes, fire an event saying we've changed something.
		 * 
		 * @since  3.0
		 * @return void
		 */
		changeSetting: function( model, options ) {
			nfRadio.channel( 'fieldSetting-' + _.keys( model.changedAttributes() )[0] ).trigger( 'update:setting', this, options.settingModel ) ;
			nfRadio.channel( 'fields' ).trigger( 'update:setting', this, options.settingModel );
			nfRadio.channel( 'app' ).trigger( 'update:setting', this, options.settingModel );
		},

		updateFieldKey: function( keyModel, settingModel ) {
			nfRadio.channel( 'app' ).trigger( 'replace:fieldKey', this, keyModel, settingModel );
		}
	} );
	
	return model;
} );