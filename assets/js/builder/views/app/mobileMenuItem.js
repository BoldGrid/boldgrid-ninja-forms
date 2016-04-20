/**
 * Renders an application menu item from a domain model.
 *
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var view = Marionette.ItemView.extend({
		tagName: 'div',
		template: '#nf-tmpl-mobile-menu-item',

		/**
		 * When we render this view, remove the extra <div> tag created by backbone.
		 * 
		 * @since  3.0
		 * @return void
		 */
		onRender: function() {
			this.$el = this.$el.children();
			this.$el.unwrap();
			this.setElement( this.$el );
		},

		// Listen for clicks on our app menu.
		events: {
			'click a': 'clickAppMenu'
		},

		/**
		 * When we click on a menu item, fire a radio event.
		 * This lets us separate the logic from the click event and view.
		 * We pass this.model so that we know what item was clicked.
		 * 
		 * @since  3.0
		 * @param  Object	e event
		 * @return return
		 */
		clickAppMenu: function( e ) {
			nfRadio.channel( 'app' ).trigger( 'click:menu', e, this.model );
		},

		/**
		 * These functions are available to templates, and help us to remove logic from template files.
		 * 
		 * @since  3.0
		 * @return Object
		 */
		templateHelpers: function() {
			return {
				/**
				 * If we have any dashicons in our model, render them.
				 * 
				 * @since  3.0
				 * @return string
				 */
				renderDashicons: function() {
					if ( this.mobileDashicon ) {
						return '<span class="dashicons ' + this.mobileDashicon + '"></span>'
					} else {
						return '';
					}
				},
				/**
				 * Render classes for our menu item, including active.
				 * 
				 * @since  3.0
				 * @return string
				 */
				renderClasses: function() {
					var classes = this.classes;
					var currentDomain = nfRadio.channel( 'app' ).request( 'get:currentDomain' );
					if ( currentDomain.get( 'id' ) == this.id ) {
						classes += ' active';
					}
					return classes;
				},
				/**
				 * If our menu is a link (like preview), render its url.
				 * 
				 * @since  3.0
				 * @return string
				 */
				renderUrl: function() {
					if ( '' != this.url ) {
						var formModel = nfRadio.channel( 'app' ).request( 'get:formModel' );
						return this.url + formModel.get( 'id' );
					} else {
						return '#';
					}
				},
				/**
				 * If our menu is a link (like preview), render its target.
				 * 
				 * @since  3.0
				 * @return string
				 */
				renderTarget: function() {
					if ( '' != this.url ) {
						return '_blank';
					} else {
						return '_self';
					}
				},

				/**
				 * If our menu item is disabled, output 'disabled'
				 * 
				 * @since  3.0
				 * @return string
				 */
				renderDisabled: function() {
					if ( this.disabled ) {
						return 'disabled';
					} else {
						return '';
					}
				}
			}
		}
	});

	return view;
} );