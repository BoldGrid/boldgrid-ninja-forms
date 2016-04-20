/**
 * When we click on a domain link, close the mobile menu.
 * 
 * @package Ninja Forms builder
 * @subpackage Main App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			// Listen for clicks on our app menu.
			this.listenTo( nfRadio.channel( 'app' ), 'click:menu', this.closeMobileMenu );
		},

		closeMobileMenu: function() {
			var builderEl = nfRadio.channel( 'app' ).request( 'get:builderEl' );
			jQuery( builderEl ).removeClass( 'nf-menu-expand' );
		}

	});

	return controller;
} );