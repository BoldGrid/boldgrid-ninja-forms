/**
 * Model that represents our setting.
 *
 * When the model is created, we trigger the init event in two radio channels.
 *
 * This lets specific types of settings modify the model before anything uses it.
 *
 * Fieldset, for instance, uses this hook to instantiate its settings as a collection.
 * 
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var model = Backbone.Model.extend( {
		defaults: {
			settings: false,
			hide_merge_tags: false,
			error: false
		},

		initialize: function() {
			// Send out two messages saying that we've initialized a setting model.
			nfRadio.channel( 'app' ).trigger( 'init:settingModel', this );
			nfRadio.channel( this.get( 'type' ) ).trigger( 'init:settingModel', this );
			nfRadio.channel( 'setting-name-' + this.get( 'name' ) ).trigger( 'init:settingModel', this );
			this.on( 'change:error', this.maybePreventUI, this );

			/*
			 * If we have an objectType set on our collection, then we're creating a model for the generic settings collection.
			 * If we're using merge tags in this setting
			 */

			if( 'undefined' == typeof this.collection ) return;

			if ( this.get( 'use_merge_tags' ) && 'undefined' != typeof this.collection.options.objectType ) {
				this.listenTo( nfRadio.channel( 'app' ), 'update:fieldKey', this.updateKey );
			}
		},

		/**
		 * When a field key is updated, send out a radio message requesting that this setting be checked for the old key.
		 * We want to send the message on the objectType channel.
		 * This means that if this setting is for fields, it will trigger on the fields channel, actions, etc.
		 * 
		 * @since  3.0
		 * @param  Backbone.Model 	keyModel data model representing the field for which the key just changed
		 * @return void
		 */
		updateKey: function( keyModel ) {
			nfRadio.channel( this.collection.options.objectType ).trigger( 'update:fieldKey', keyModel, this );
		},

		maybePreventUI: function() {
			if ( this.get( 'error' ) ) {
				nfRadio.channel( 'drawer' ).request( 'prevent:close', 'setting-' + this.get( 'name' ) + '-error' );
				nfRadio.channel( 'app' ).request( 'prevent:changeDomain', 'setting-' + this.get( 'name' ) + '-error' );				
			} else {
				nfRadio.channel( 'drawer' ).request( 'enable:close', 'setting-' + this.get( 'name' ) + '-error' );
				nfRadio.channel( 'app' ).request( 'enable:changeDomain', 'setting-' + this.get( 'name' ) + '-error' );
			}
		}
	} );
	
	return model;
} );