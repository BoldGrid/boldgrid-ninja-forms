/**
 * Handles opening and closing our drawer. This is where we display settings for fields, actions, and settings.
 * 
 * @package Ninja Forms builder
 * @subpackage Main App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			// Listen to our drawer-related click events.
			this.listenTo( nfRadio.channel( 'app' ), 'click:openDrawer', this.clickOpenDrawer );
			this.listenTo( nfRadio.channel( 'app' ), 'click:closeDrawer', this.closeDrawer );
			this.listenTo( nfRadio.channel( 'app' ), 'click:toggleDrawerSize', this.toggleDrawerSize );

			// Reply to direct requests to open or close the drawer.
			nfRadio.channel( 'app' ).reply( 'open:drawer', this.openDrawer, this );
			nfRadio.channel( 'app' ).reply( 'close:drawer', this.closeDrawer, this );

			/*
			 * When we close the drawer, we have to figure out what the right position should be.
			 * This listens to requests from other parts of our app asking what the closed right position is.
			 */
			nfRadio.channel( 'drawer' ).reply( 'get:closedRightPos', this.getClosedDrawerPos, this );
			
			// Reply to requests to prevent our drawer from closing
			nfRadio.channel( 'drawer' ).reply( 'prevent:close', this.preventClose, this );
			// Reply to requests to enable drawer closing
			nfRadio.channel( 'drawer' ).reply( 'enable:close', this.enableClose, this );
			// Reply to requests for our disabled/enabled state.
			nfRadio.channel( 'drawer' ).reply( 'get:preventClose', this.maybePreventClose, this );

			/*
			 * Object that holds our array of 'prevent close' values.
			 * We use an array so that registered requests can unregister and not affect each other.
			 */
			this.objPreventClose = {};

			/*
			 *  Listen to focus events on the filter and stop our interval when it happens.
			 *  This is to fix a bug that can cause the filter to gain focus every few seconds.
			 */
			this.listenTo( nfRadio.channel( 'drawer' ), 'filter:focused', this.filterFocused );
		},

		/**
		 * Handles closing our drawer
		 * @since  3.0
		 * @return void
		 */
		closeDrawer: function() {
			// Get our current domain.
			var currentDrawer = nfRadio.channel( 'app' ).request( 'get:currentDrawer' );
			if ( ! currentDrawer || this.maybePreventClose() ) {
				return false;
			}

			// Triggers the before close drawer action on our current domain's drawer channel.
			nfRadio.channel( 'drawer-' + currentDrawer.get( 'id' ) ).trigger( 'before:closeDrawer' );
			nfRadio.channel( 'drawer' ).trigger( 'before:closeDrawer' );
			
			// Send a message to our drawer to empty its contents.
			nfRadio.channel( 'drawer' ).request( 'empty:drawerContent' );

			// To close our drawer, we have to add our closed class to the builder and remove the opened class.
			var builderEl = nfRadio.channel( 'app' ).request( 'get:builderEl' );
			jQuery( builderEl ).addClass( 'nf-drawer-closed' ).removeClass( 'nf-drawer-opened' );
			jQuery( builderEl ).removeClass( 'disable-main' );

			// Get the right position of our closed drawer. Should be container size in -px.
			var rightClosed = this.getClosedDrawerPos();

			// Get our drawer element and give change the 'right' property to our closed position.
			var drawerEl = nfRadio.channel( 'app' ).request( 'get:drawerEl' );
			jQuery( drawerEl ).css( { 'right': rightClosed } );

			// In order to access properties in 'this' context in our interval below, we have to set it here.	
			var that = this;

			/*
			 * Since jQuery can't bind to a CSS change, we poll every .15 seconds to see if we've closed the drawer.
			 *
			 * Once our drawer is closed, we:
			 * clear our interval
			 * request that the app change it's current drawer to false
			 * trigger a drawer closed message
			 */
			this.checkCloseDrawerPos = setInterval( function() {
	        	if ( rightClosed == jQuery( drawerEl ).css( 'right' ) ) {
	        		clearInterval( that.checkCloseDrawerPos );
		    		nfRadio.channel( 'app' ).request( 'update:currentDrawer', false );
		    		nfRadio.channel( 'drawer' ).trigger( 'closed' );
		    		// jQuery( drawerEl ).scrollTop( 0 );
	        	}
			}, 150 );
		},

		/**
		 * Click handler for our 'open drawer' event.
		 * @since  3.0
		 * @param  e jQuery event
		 * @return void
		 */
		clickOpenDrawer: function( e ) {
			var drawerID = jQuery( e.target ).data( 'drawerid' );
			this.openDrawer( drawerID );
		},

		/**
		 * Open our drawer.
		 * 
		 * @since  3.0
		 * @param  string drawerID 	ID of the drawer we want to open.
		 * @param  object data     	Optional data that we want to pass to the drawer.
		 * @return void
		 */
		openDrawer: function( drawerID, data ) {
			if ( this.maybePreventClose() ) {
				return false;
			}

			// If we haven't sent a data object, set the variable to an empty object.
			data = data || {};

			/*
			 * If we're dealing with something that has a model, set the proper active state.
			 *
			 * TODO: Make this more dynamic. I'm not sure that it fits in the drawer controller.
			 */
			if ( 'undefined' != typeof data.model ) {
				var currentDomain = nfRadio.channel( 'app' ).request( 'get:currentDomain' );
				var currentDomainID = currentDomain.get( 'id' );
				nfRadio.channel( currentDomainID ).request( 'clear:editActive' );
				data.model.set( 'editActive', true );
				this.dataModel = data.model;
			}

			// Send out a message requesting our drawer view to load the content for our drawer ID.
			nfRadio.channel( 'drawer' ).request( 'load:drawerContent', drawerID, data );

			// To open our drawer, we have to add our opened class to our builder element and remove the closed class.
			var builderEl = nfRadio.channel( 'app' ).request( 'get:builderEl' );
			jQuery( builderEl ).addClass( 'nf-drawer-opened' ).removeClass( 'nf-drawer-closed' );
			
			// To open our drawer, we have to set the right position of our drawer to 0px.
			var drawerEl = nfRadio.channel( 'app' ).request( 'get:drawerEl' );
			jQuery( drawerEl ).css( { 'right': '0px' } );
			
			// In order to access properties in 'this' context in our interval below, we have to set it here.	
			var that = this;

			/*
			 * Since jQuery can't bind to a CSS change, we poll every .15 seconds to see if we've opened the drawer.
			 *
			 * Once our drawer is opened, we:
			 * clear our interval
			 * focus our filter
			 * request that the app update its current drawer to the one we opened
			 * trigger a drawer opened message
			 */
			this.hasFocus = false;

			this.checkOpenDrawerPos = setInterval( function() {
	        	if ( '0px' == jQuery( drawerEl ).css( 'right' ) ) {
	        		clearInterval( that.checkOpenDrawerPos );
					if ( ! that.hasFocus ) {
		        		that.focusFilter();
						that.hasFocus = true;
			    		nfRadio.channel( 'app' ).request( 'update:currentDrawer', drawerID );
			    		// jQuery( drawerEl ).scrollTop( 0 );
			    		nfRadio.channel( 'drawer' ).trigger( 'opened' );
					}   		
	        	}
			}, 150 );
		},

		/**
		 * Toggle the drawer from half to full screen and vise-versa
		 * @since  3.0
		 * @return void
		 */
		toggleDrawerSize: function() {
			// Get our drawer element.
			var drawerEl = nfRadio.channel( 'app' ).request( 'get:drawerEl' );
			// toggle our drawer size class.
			jQuery( drawerEl ).toggleClass( 'nf-drawer-expand' );
		},

		/**
		 * Focus our filter
		 * @since  3.0
		 * @return void
		 */
        focusFilter: function() {
        	// Get our filter element
        	var filterEl = nfRadio.channel( 'drawer' ).request( 'get:filterEl' );
        	// Focus
        	jQuery( filterEl ).focus();
        },

        /**
         * Get the CSS right position (in px) of the closed drawer element.
         * This is calculated by:
         * getting the width of the builder element
         * add 300 pixels
         * make it negative
         * 
         * @since  3.0
         * @return void
         */
        getClosedDrawerPos: function() {
			var builderEl = nfRadio.channel( 'app' ).request( 'get:builderEl' );
			var closedPos = jQuery( builderEl ).width() + 300;
			return '-' + closedPos + 'px';
        },

        /**
         * Check to see if anything has registered a prevent close key.
         * 
         * @since  3.0
         * @return boolean
         */
        maybePreventClose: function() {
        	if ( 0 == Object.keys( this.objPreventClose ).length ) {
        		return false;
        	} else {
        		return true;
        	}
        },

        /**
         * Register a prevent close key.
         * 
         * @since  3.0
         * @param  string 	key unique id for our 'prevent close' setting.
         * @return void
         */
        preventClose: function( key ) {
        	this.objPreventClose[ key ] = true;
        	/*
        	 * When we disable closing the drawer, add the disable class.
        	 */
        	// Get our current drawer.
			this.dataModel.set( 'drawerDisabled', true );
        },

        /**
         * Remove a previously registered prevent close key.
         * 
         * @since  3.0
         * @param  string 	key unique id for our 'prevent close' setting.
         * @return void
         */
        enableClose: function( key ) {
        	delete this.objPreventClose[ key ];
        	 /*
        	 * When we remove all of our disables preventing closing the drawer, remove the disable class.
        	 */
        	if ( ! this.maybePreventClose() ) {
	        	// Get our current drawer.
				this.dataModel.set( 'drawerDisabled', false );        		
        	}
        },

        /**
         * When we focus our filter, make sure that our open drawer interval is cleared.
         * 
         * @since  3.0
         * @return void
         */
        filterFocused: function() {
        	clearInterval( this.checkOpenDrawerPos );
        },

        getPreventClose: function() {
        	return this.objPreventClose;
        }
	});

	return controller;
} );