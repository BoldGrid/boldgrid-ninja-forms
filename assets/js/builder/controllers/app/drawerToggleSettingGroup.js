/**
 * Listens for click events to expand/collapse setting groups.
 * 
 * @package Ninja Forms builder
 * @subpackage Fields - New Field Drawer
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			// Listen for click events on our settings group.
			this.listenTo( nfRadio.channel( 'drawer' ), 'click:toggleSettingGroup', this.toggleSettingGroup );
		},

		/**
		 * Set the 'display' attribute of our group model to true or false to toggle.
		 * 
		 * @since  3.0
		 * @param  Object			e     	event
		 * @param  backbone.model 	model 	group setting model
		 * @return void
		 */
		toggleSettingGroup: function( e, model ) {
			if ( model.get( 'display' ) ) {
				/*
				 * Make sure that none of our settings have errors
				 */
				var errors = false;
				_.each( model.get( 'settings' ).models, function( setting ) {
					if ( setting.get( 'error' ) ) {
						errors = true;
					}
				} );
				if ( ! errors ) {
					model.set( 'display', false );
				}
			} else {
				model.set( 'display', true );
			}
		}
	});

	return controller;
} );