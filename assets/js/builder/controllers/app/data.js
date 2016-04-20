/**
 * Creates and stores a model that represents app-wide data. i.e. current domain, current drawer, clean, etc.
 *
 * clean is a boolean that represents whether or not changes have been made.
 * 
 * @package Ninja Forms builder
 * @subpackage Main App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['models/app/appModel'], function( appModel ) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			// Get the collection that represents all the parts of our application.
			var appDomainCollection = nfRadio.channel( 'app' ).request( 'get:domainCollection' );
			// Setup our initial model.
			this.model = new appModel( {
				currentDrawer: false,
				currentDomain: appDomainCollection.get( 'fields' ),
				clean: true
			} );

			/*
			 * Set the mobile setting used to track whether or not we're on a mobile device.
			 */
			var mobile = ( 1 == nfAdmin.mobile ) ? true : false;
			this.model.set( 'mobile', mobile );

			/*
			 * Respond to requests to see if we are on mobile.
			 */
			nfRadio.channel( 'app' ).reply( 'is:mobile', this.isMobile, this );

			/*
			 * Respond to app channel requests for information about the state of our app.
			 */
			nfRadio.channel( 'app' ).reply( 'get:data', this.getData, this );
			nfRadio.channel( 'app' ).reply( 'get:setting', this.getSetting, this );
			nfRadio.channel( 'app' ).reply( 'get:currentDomain', this.getCurrentDomain, this );
			nfRadio.channel( 'app' ).reply( 'get:currentDrawer', this.getCurrentDrawer, this );

			/*
			 * Respond to app channel requests to update app settings.
			 */		
			nfRadio.channel( 'app' ).reply( 'update:currentDomain', this.updateCurrentDomain, this );
			nfRadio.channel( 'app' ).reply( 'update:currentDrawer', this.updateCurrentDrawer, this );
			nfRadio.channel( 'app' ).reply( 'update:setting', this.updateSetting, this );

		},

		updateCurrentDomain: function( model ) {
			this.updateSetting( 'currentDomain', model );
		},

		updateSetting: function( setting, value ) {
			this.model.set( setting, value );
			return true;
		},

		getSetting: function( setting ) {
			return this.model.get( setting );
		},

		getData: function() {
			return this.model;
		},

		getCurrentDomain: function() {
			return this.model.get( 'currentDomain' );
		},

		updateCurrentDrawer: function( drawerID ) {
			this.updateSetting( 'currentDrawer', drawerID );
			return true;
		},

		getCurrentDrawer: function() {
			var currentDrawerID = this.model.get( 'currentDrawer' );
			return nfRadio.channel( 'app' ).request( 'get:drawer', currentDrawerID );
		},

		isMobile: function() {
			return this.model.get( 'mobile' );
		}


	});

	return controller;
} );