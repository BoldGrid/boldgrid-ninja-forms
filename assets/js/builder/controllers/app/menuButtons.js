/**
 * Listens to our app channel for requests to change the current domain.
 *
 * The app menu and the main submenu both contain clickable links that change the current domain.
 * 
 * @package Ninja Forms builder
 * @subpackage Main App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			this.listenTo( nfRadio.channel( 'app' ), 'click:publish', this.publish );
			this.listenTo( nfRadio.channel( 'app' ), 'click:viewChanges', this.viewChanges );
		},

		publish: function() {
			nfRadio.channel( 'app' ).request( 'update:db', 'publish' );
		},

		viewChanges: function() {
			var changeCollection = nfRadio.channel( 'changes' ).request( 'get:collection' );
			nfRadio.channel( 'app' ).request( 'open:drawer', 'viewChanges', { collection: changeCollection } );
		}

	});

	return controller;
} );