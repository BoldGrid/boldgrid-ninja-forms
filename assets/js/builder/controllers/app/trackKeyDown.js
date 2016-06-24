/**
 * Tracks which keys have been pressed.
 * Currently only used by fields to see if they should duplicate or delete on click.
 * (Shift + D + click = delete) (Shift + C + click = duplicate)
 * 
 * @package Ninja Forms builder
 * @subpackage Fields - Edit Field Drawer
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var controller = Marionette.Object.extend( {
		keys: [],

		initialize: function() {
			var that = this;
			/*
			 * Track keydowns and store the keys pressed.
			 */
			
			jQuery( document ).on( 'keydown', function( e ) {
				that.keyDown( e, that );
			} );

			jQuery( document ).on( 'keyup', function( e ) {
				that.keyUp( e, that );
			} );

			/*
			 * Get the keys currently being pressed, if any
			 */
			nfRadio.channel( 'app' ).reply( 'get:keydown', this.getKeyDown, this );
		},

		keyDown: function( e, context ) {
			/*
			 * Add our keycode to our keys array.
			 */
			context.keys[ e.keyCode ] = e.keyCode;
		},

		keyUp: function( e, context ) {
			/*
			 * Remove our keycode from our keys array.
			 */
			if ( -1 != context.keys.indexOf( e.keyCode ) ) {
				delete context.keys[ e.keyCode ];
			}
		},

		getKeyDown: function() {
			return this.keys;
		}
	});

	return controller;
} );