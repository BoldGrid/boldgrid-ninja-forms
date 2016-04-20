/**
 * Listens to our app channel for settings views being rendered.
 *
 * If we're rendering a datepicker setting, add our datepicker.
 * 
 * @package Ninja Forms builder
 * @subpackage Main App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			this.listenTo( nfRadio.channel( 'setting-type-datepicker' ), 'render:setting', this.addDatepicker );
		},

		addDatepicker: function( settingModel, dataModel, view ) {
			var dateObject = pikadayResponsive( jQuery( view.el ).find( '.setting' )[0] );			
		}
	});

	return controller;
} );