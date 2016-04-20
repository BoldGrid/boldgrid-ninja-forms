/**
 * Handles changing our preview link when we change the 'clean' state of our app.
 * 
 * @package Ninja Forms builder
 * @subpackage Fields
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			// Listen for events that would change our preview link
			this.listenTo( nfRadio.channel( 'app' ), 'before:sendChanges', this.disablePreview, this );
			this.listenTo( nfRadio.channel( 'app' ), 'response:sendChanges', this.enablePreview, this );
			this.listenTo( nfRadio.channel( 'app' ), 'change:clean', this.changePreviewNicename, this );
		},

		/**
		 * Disable our preview link before we send data to update our preview.
		 * 
		 * @since  3.0
		 * @return void
		 */
		disablePreview: function() {
			// Get our preview domain
			var appDomains = nfRadio.channel( 'app' ).request( 'get:domainCollection' );
			var preview = appDomains.get( 'preview' );
			// Set disabled to true. This will trigger the preview link view to redraw.
			preview.set( 'disabled', true );
		},

		/**
		 * Change the preview link text from "Preview Form" to "Preview Changes" or vice-versa
		 * 
		 * @since  3.0
		 * @param  boolean 	clean app data state
		 * @return void
		 */
		changePreviewNicename: function( clean ) {
			// Get our preview domain
			var appDomains = nfRadio.channel( 'app' ).request( 'get:domainCollection' );
			var preview = appDomains.get( 'preview' );

			// If we have unsaved changes, set our text to 'changes' otherwise, set it to 'form'
			if ( ! clean ) {
				var nicename = 'Preview Changes';
			} else {
				var nicename = 'Preview Form';
			}

			preview.set( 'nicename', nicename );
		},

		/**
		 * Enable our preview button.
		 * This is triggered when we get a response from our preview update.
		 * 
		 * @since  3.0
		 * @return void
		 */
		enablePreview: function() {
			// Get our preview domain
			var appDomains = nfRadio.channel( 'app' ).request( 'get:domainCollection' );
			var preview = appDomains.get( 'preview' );
			// Set disabled to false. This will trigger the preview link view to redraw.
			preview.set( 'disabled', false );
		}

	});

	return controller;
} );