/**
 * Handles our hotkey execution. Needs to be cleaned up and made more programmatic.
 * 
 * Our hotkeys are defined by the domain that we're currently viewing. In each domain's model, there is a hotkey object.
 * 
 * Currently too much hotkey data is hard-coded here.
 * 
 * @package Ninja Forms builder
 * @subpackage Fields
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			// When we change our domain, change the hotkeys to those within that object.
			this.listenTo( nfRadio.channel( 'main' ), 'render:main', this.changeHotkeys );
			this.listenTo( nfRadio.channel( 'drawer' ), 'opened', this.changeHotkeys );
			this.listenTo( nfRadio.channel( 'drawer' ), 'render:settingGroup', this.changeHotkeys );
			// Currently, these are the functions that run when the new field or new action hotkey is pressed.
			// TODO: move these into a config module or into something more programmatic and scalable.
			this.listenTo( nfRadio.channel( 'hotkeys' ), 'add:newField', this.addNewField );
			this.listenTo( nfRadio.channel( 'hotkeys' ), 'add:newAction', this.addNewAction );
			// Same as above, these functions need to be moved into a more modular/programmatic solution.
			this.listenTo( nfRadio.channel( 'hotkeys' ), 'changeDomain:fields', this.changeDomainFields );
			this.listenTo( nfRadio.channel( 'hotkeys' ), 'changeDomain:actions', this.changeDomainActions );
			this.listenTo( nfRadio.channel( 'hotkeys' ), 'changeDomain:settings', this.changeDomainSettings );
			this.listenTo( nfRadio.channel( 'hotkeys' ), 'close:drawer', this.closeDrawer );
		},

		changeHotkeys: function() {
			var currentDomain = nfRadio.channel( 'app' ).request( 'get:currentDomain' );
			jQuery( document ).off( '.nfDomainHotkeys' );
			jQuery( 'input' ).off( '.nfDomainHotkeys' );
			if ( currentDomain.get( 'hotkeys' ) ) {
				jQuery.each( currentDomain.get( 'hotkeys' ), function( hotkey, msg ) {
					jQuery( document ).on( 'keydown.nfDomainHotkeys', null, hotkey, function( e ) {
						nfRadio.channel( 'hotkeys' ).trigger( msg, e );
					} );
					jQuery( 'input' ).on( 'keydown.nfDomainHotkeys', null, hotkey, function( e ) {
						nfRadio.channel( 'hotkeys' ).trigger( msg, e );
					} );
					jQuery( 'textarea' ).on( 'keydown.nfDomainHotkeys', null, hotkey, function( e ) {
						nfRadio.channel( 'hotkeys' ).trigger( msg, e );
					} );
				} );
			}
		},

		addNewField: function() {
			if ( 'addField' != nfRadio.channel( 'app' ).request( 'get:currentDrawer' ) ) {
				nfRadio.channel( 'app' ).request( 'open:drawer', 'addField' );
			} else {
				nfRadio.channel( 'app' ).request( 'close:drawer' );
			}
			
		},

		addNewAction: function() {
			if ( 'addAction' != nfRadio.channel( 'app' ).request( 'get:currentDrawer' ) ) {
				nfRadio.channel( 'app' ).request( 'open:drawer', 'addAction' );
			} else {
				nfRadio.channel( 'app' ).request( 'close:drawer' );
			}
		},

		changeDomainFields: function() {
			var appDomainCollection = nfRadio.channel( 'app' ).request( 'get:domainCollection' );
			var fieldsDomain = appDomainCollection.get( 'fields' );
			nfRadio.channel( 'app' ).request( 'change:currentDomain', {}, fieldsDomain );
		},

		changeDomainActions: function() {
			var appDomainCollection = nfRadio.channel( 'app' ).request( 'get:domainCollection' );
			var actionsDomain = appDomainCollection.get( 'actions' );
			nfRadio.channel( 'app' ).request( 'change:currentDomain', {}, actionsDomain );
		},

		changeDomainSettings: function() {
			var appDomainCollection = nfRadio.channel( 'app' ).request( 'get:domainCollection' );
			var settingsDomain = appDomainCollection.get( 'settings' );
			nfRadio.channel( 'app' ).request( 'change:currentDomain', {}, settingsDomain );
		},

		closeDrawer: function() {
			nfRadio.channel( 'app' ).request( 'close:drawer' );
		}

	});

	return controller;
} );