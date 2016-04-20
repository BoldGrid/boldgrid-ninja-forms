/**
 * Renders the action buttons to the right of the app menu. i.e. Publish
 *
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var view = Marionette.ItemView.extend({
		tagName: 'span',
		template: '#nf-tmpl-app-header-action-button',

		initialize: function() {
			// Listen to changes on the app 'clean' state. When it changes, re-render.
			this.listenTo( nfRadio.channel( 'app' ), 'change:clean', this.render, this );
			this.listenTo( nfRadio.channel( 'app' ), 'change:loading', this.render, this );

			this.listenTo( nfRadio.channel( 'app' ), 'response:updateDB', this.bounceIcon, this );
		},

		/**
		 * These functions are available to templates, and help us to remove logic from template files.
		 * 
		 * @since  3.0
		 * @return Object
		 */
		templateHelpers: function () {
			var that = this;
	    	return {

	    		/**
	    		 * Render our Publish button. If we're loading, render the loading version.
	    		 *
	    		 * @since  3.0
	    		 * @return string
	    		 */
	    		renderPublish: function() {
	    			if ( that.publishWidth ) {
	    				this.publishWidth = 'style="width:' + that.publishWidth + 'px !important"';
	    			} else {
	    				this.publishWidth = '';
	    			}
	    			if ( nfRadio.channel( 'app' ).request( 'get:setting', 'loading' ) ) {
	    				var template = _.template( jQuery( '#nf-tmpl-add-header-publish-loading' ).html() );
	    			} else {
	    				var template = _.template( jQuery( '#nf-tmpl-app-header-publish-button' ).html() );
	    			}
	    			return template( this );
	    		},

	    		/**
	    		 * If our app state is clean, disable publish.
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
	    		},

	    		/**
	    		 * If our app isn't clean, render our 'viewChanges' button.
	    		 * @since  version
	    		 * @return {[type]} [description]
	    		 */
	    		maybeRenderCancel: function() {
	    			if ( ! nfRadio.channel( 'app' ).request( 'get:setting', 'clean' ) ) {
	    				var viewChanges = _.template( jQuery( '#nf-tmpl-app-header-view-changes' ).html() );
	    				return viewChanges( this );
	    			} else {
	    				return '';
	    			}
				},
			};
		},

		onShow: function() {
			var publishEL = jQuery( this.el ).find( '.publish' );
			// this.publishWidth = jQuery( publishEL ).outerWidth( true );
		},

		/**
		 * Listen for clicks on the Publish or view changes button.
		 * @type {Object}
		 */
		events: {
			'click .publish': 'clickPublish',
			'click .viewChanges': 'clickViewChanges'
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
		},

		/**
		 * When we click view changes, trigger a radio event.
		 * This lets us separate the logic from the click event and view.
		 * 
		 * @since  3.0
		 * @param  Object 	e event
		 * @return void
		 */
		clickViewChanges: function( e ) {
			nfRadio.channel( 'app' ).trigger( 'click:viewChanges', e );
		},

		bounceIcon: function( changeModel ) {
			jQuery( this.el ).find( '.dashicons-backup' ).effect( 'bounce', { times: 3 }, 600 );
		}

	});

	return view;
} );