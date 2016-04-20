/**
 * Listens to our app channel for settings views being rendered.
 *
 * If we're about to render a setting model that's a select and has 'fields' as the 'fill' setting, add all our field models to its options.
 * 
 * @package Ninja Forms builder
 * @subpackage Main App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			// Listen for messages that are fired before a setting view is rendered.
			this.listenTo( nfRadio.channel( 'app' ), 'before:renderSetting', this.beforeRenderSetting );
		},

		beforeRenderSetting: function( settingModel, dataModel ) {
			if ( 'fields' == settingModel.get( 'fill' ) ) {
				
			}
		}

	});

	return controller;
} );