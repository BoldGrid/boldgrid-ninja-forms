/**
 * Modify the user's browser history when they click on a domain
 * 
 * @package Ninja Forms builder
 * @subpackage Main App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			this.listenTo( nfRadio.channel( 'app' ), 'click:confirmPublish', this.confirmPublish );
		},

		confirmPublish: function() {
			var formModel = nfRadio.channel( 'app' ).request( 'get:formModel' );
			// Check to see if we need to add a submit button.
			if ( 1 == formModel.get( 'settings' ).get( 'add_submit' ) ) {
				nfRadio.channel( 'fields' ).request( 'add', { type: 'submit', label: 'Submit', order: 9999 } );
			}
			formModel.set( 'show_publish_options', false );
			nfRadio.channel( 'app' ).request( 'update:db', 'publish' );
		}

	});

	return controller;
} );