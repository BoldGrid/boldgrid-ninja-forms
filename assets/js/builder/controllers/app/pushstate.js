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
			this.listenTo( nfRadio.channel( 'app' ), 'change:currentDomain', this.changePushState );
		},

		changePushState: function() {
			var currentDomain = nfRadio.channel( 'app' ).request( 'get:currentDomain' );
			history.pushState( null, null, window.location.href + '&domain=' + currentDomain.get( 'id' ) );
			var reExp = /domain=\\d+/;
			var url = window.location.toString();
			var newUrl = url.replace( reExp, '' );
			console.log( newUrl );
		}

	});

	return controller;
} );