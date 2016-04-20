/**
 * Handles actions related to our toggle field.
 * When we change the toggle, the setting value will be 'on' or ''.
 * We need to change this to 1 or 0.
 * 
 * @package Ninja Forms builder
 * @subpackage Fields - Edit Field Drawer
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			// We don't want the RTE setting to re-render when the value changes.
			nfRadio.channel( 'setting-type-toggle' ).reply( 'renderOnChange', function(){ return false } );

			// Respond to requests for field setting filtering.
			nfRadio.channel( 'toggle' ).reply( 'before:updateSetting', this.updateSetting, this );
		},

		/**
		 * Return either 1 or 0, depending upon the toggle position.
		 * 
		 * @since  3.0
		 * @param  Object 			e                event
		 * @param  backbone.model 	fieldModel       field model
		 * @param  string 			name             setting name
		 * @param  backbone.model 	settingTypeModel field type model
		 * @return int              1 or 0
		 */
		updateSetting: function( e, fieldModel, name, settingTypeModel ) {
			if ( jQuery( e.target ).attr( 'checked' ) ) {
				var value = 1;
			} else {
				var value = 0;
			}

			return value;
		}

	});

	return controller;
} );