/**
 * Prompt the user to save if they attempt to leave the page with unsaved changes.
 * 
 * @package Ninja Forms builder
 * @subpackage Main App
 * @copyright (c) 2016 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			jQuery( window ).bind( 'beforeunload', this.maybePrompt );
		},

		maybePrompt: function( model ) {
			// If our app is clean, don't show a warning.
			if ( ! nfRadio.channel( 'app' ).request( 'get:setting', 'clean' ) ) {
				return 'You have unsaved changes.';
			}
		}

	});

	return controller;
} );