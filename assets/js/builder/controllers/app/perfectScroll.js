/**
 * Initialize the perfectscroll jQuery plugin
 * 
 * @package Ninja Forms builder
 * @subpackage Main App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var controller = Marionette.Object.extend( {
		movedPos: false,

		initialize: function() {
			/*
			 * When we init the main view, init our perfectscroll
			 */
			this.listenTo( nfRadio.channel( 'main' ), 'show:main', this.initPerfectScroll );

			/*
			 * When our drawer opens and closes, change the position of our scroll rail.
			 */
			this.listenTo( nfRadio.channel( 'drawer' ), 'opened', this.moveRail );
			this.listenTo( nfRadio.channel( 'drawer' ), 'before:closeDrawer', this.resetRail );
		},

		initPerfectScroll: function( view ) {
			if ( ! nfRadio.channel( 'app' ).request( 'is:mobile' ) ) {
				jQuery( view.el ).parent().perfectScrollbar( {
					suppressScrollX: true
				} );
			}

			jQuery( 'head' ).append( '<style id="ps-scrollbar-css" type="text/css"></style>' );
		},

		moveRail: function() {
			var drawerEl = nfRadio.channel( 'app' ).request( 'get:drawerEl' );
			var movedPos = jQuery( drawerEl ).outerWidth();

			jQuery( '#ps-scrollbar-css' ).text( '.ps-scrollbar-moved { right: ' + movedPos + 'px !important; } ' );
			jQuery( '#nf-main .ps-scrollbar-y-rail' ).addClass( 'ps-scrollbar-moved ' );
			
		},

		resetRail: function() {
			jQuery( '.ps-scrollbar-y-rail' ).removeClass( 'ps-scrollbar-moved ' );
		}

	});

	return controller;
} );