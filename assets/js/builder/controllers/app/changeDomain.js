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
			// Listen for both menu and submenu clicks.
			this.listenTo( nfRadio.channel( 'app' ), 'click:menu', this.changeAppDomain );
			// Reply to specific requests to change the domain
			nfRadio.channel( 'app' ).reply( 'change:currentDomain', this.changeAppDomain, this );

			// Reply to requests to prevent our drawer from closing
			nfRadio.channel( 'app' ).reply( 'prevent:changeDomain', this.preventChange, this );
			// Reply to requests to enable drawer closing
			nfRadio.channel( 'app' ).reply( 'enable:changeDomain', this.enableChange, this );

			/*
			 * Object that holds our array of 'prevent change' values.
			 * We use an array so that registered requests can unregister and not affect each other.
			 */
			this.objPreventChange = {};
		},

		changeAppDomain: function( e, model ) {
			/*
			 * If we have disabled movement between domains, return false.
			 */
			if ( this.maybePreventChange() ) {
				return false;
			}

			/*
			 * If we are passed a model, use that model.
			 * Otherwise, get the domain from the event target data.
			 */ 
			if ( 'undefined' == typeof model ) {
				var domainID = jQuery( e.target ).data( 'domain' );
				var model = nfRadio.channel( 'app' ).request( 'get:domainModel', domainID );
			}
			// If a drawer is open, close it.
			if ( nfRadio.channel( 'app' ).request( 'get:currentDrawer' ) ) {
				nfRadio.channel( 'app' ).request( 'close:drawer' );
			}
			/*
			 * If we aren't dealing with an external url (such as preview), update our app data
			 * and trigger a radio message saying we've changed the domain.
			 */ 
			if ( 0 == model.get( 'url' ).length ) {
				nfRadio.channel( 'app' ).request( 'update:currentDomain', model );
				nfRadio.channel( 'app' ).trigger( 'change:currentDomain', model );
			}
		},

		/**
         * Check to see if anything has registered a key to prevent changing the domain.
         * 
         * @since  3.0
         * @return boolean
         */
        maybePreventChange: function() {
        	if ( 0 == Object.keys( this.objPreventChange ).length ) {
        		return false;
        	} else {
        		return true;
        	}
        },

        /**
         * Register a key to prevent changing the domain.
         * 
         * @since  3.0
         * @param  string 	key unique id for our 'prevent change domain' setting.
         * @return void
         */
        preventChange: function( key ) {
        	this.objPreventChange[ key ] = true;
        },

        /**
         * Remove a previously registered key that is preventing our domain from changing.
         * 
         * @since  3.0
         * @param  string 	key unique id for our 'prevent change domain' setting.
         * @return void
         */
        enableChange: function( key ) {
        	delete this.objPreventChange[ key ];
        },

	});

	return controller;
} );