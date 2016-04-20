/**
 * Single item view used for the menu drawer.
 *
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['views/app/mobileMenuItem'], function( mobileMenuItemView ) {
	var view = Marionette.CompositeView.extend({
		tagName: 'div',
		template: '#nf-tmpl-mobile-menu',
		childView: mobileMenuItemView,

		initialize: function() {
			// Listen to changes on the app 'clean' state. When it changes, re-render.
			this.listenTo( nfRadio.channel( 'app' ), 'change:clean', this.render, this );
		},

		attachHtml: function( collectionView, childView ) {
			jQuery( collectionView.el ).find( '.secondary' ).append( childView.el );
		},

		templateHelpers: function() {
			return {
				/**
	    		 * If our app state is clean, disable button.
	    		 * 
	    		 * @since  3.0
	    		 * @return string
	    		 */
	    		maybeDisabled: function() {
	    			if ( nfRadio.channel( 'app' ).request( 'get:setting', 'clean' ) ) {
	    				return 'disabled';
	    			} else {
	    				return '';
	    			}
	    		}
			};
		},

		events: {
			'click .nf-publish': 'clickPublish'
		},

		/**
		 * When we click publish, trigger a radio event.
		 * This lets us separate the logic from the click event and view.
		 * 
		 * @since  3.0
		 * @param  Object 	e event
		 * @return void
		 */
		clickPublish: function( e ) {
			nfRadio.channel( 'app' ).trigger( 'click:publish', e );
			var builderEl = nfRadio.channel( 'app' ).request( 'get:builderEl' );
			jQuery( builderEl ).toggleClass( 'nf-menu-expand' );
		},
	});

	return view;
} );