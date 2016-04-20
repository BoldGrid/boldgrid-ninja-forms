/**
 * Default drawer header.
 *
 * Includes our filter/search and 'Done' button.
 *
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var view = Marionette.ItemView.extend({
		tagName: 'div',
		template: '#nf-tmpl-drawer-header-default',

		initialize: function() {
			if ( this.model ) {
				// Listen for our drawer being disabled.
				this.model.on( 'change:drawerDisabled', this.render, this );				
			}
		},

		/**
		 * When we render, remove the extra div added by backbone and add listeners related to our filter.
		 * 
		 * @since  3.0
		 * @return void
		 */
		onRender: function() {
			// Remove extra wrapping div.
			this.$el = this.$el.children();
			this.$el.unwrap();
			this.setElement( this.$el );
			// Respond to requests related to our filter.
			nfRadio.channel( 'drawer' ).reply( 'clear:filter', this.clearFilter, this );
			nfRadio.channel( 'drawer' ).reply( 'blur:filter', this.blurFilter, this );
			nfRadio.channel( 'drawer' ).reply( 'get:filterEl', this.getEl, this );
		},

		onBeforeDestroy: function() {
			if ( this.model ) {
				this.model.off( 'change:drawerDisabled', this.render );
			}
		},

		events: {
			'keyup .nf-filter'	: 'maybeChangeFilter',
			'input .nf-filter'	: 'changeFilter',
			'focus input'		: 'getFocus'
		},

		/**
		 * When the filter text is changed, trigger an event on our current drawer.
		 * This lets us keep the logic separate from the click event and view.
		 * 
		 * @since  3.0
		 * @param  Object 	e event
		 * @return void
		 */
		changeFilter: function( e ) {
			var currentDrawer = nfRadio.channel( 'app' ).request( 'get:currentDrawer' );
			nfRadio.channel( 'drawer-' + currentDrawer.get( 'id' ) ).trigger( 'change:filter', e.target.value, e );
		},

		/**
		 * The user pressed a key. If it's the enter key, then run the change filter function.
		 * 
		 * @since  3.0
		 * @param  Object 	e event
		 * @return void
		 */
		maybeChangeFilter: function( e ) {
			if ( 13 == e.keyCode ) {
				e.addObject = true;
				this.changeFilter( e );			
			}
		},

		/**
		 * Clear our filter.
		 *
		 * This triggers 'input' on the field, which will trigger a change if necessary.
		 * 
		 * @since  3.0
		 * @return void
		 */
		clearFilter: function() {
			var filterEl =  jQuery( this.el ).find( '.nf-filter' );
			if ( '' != jQuery.trim( filterEl.val() ) ) {
				filterEl.val('');
				filterEl.trigger( 'input' );
				filterEl.focus();			
			}
		},

		/**
		 * Fire the 'blur' event on our filter. Used to force a change event when the user tabs.
		 * 
		 * @since  3.0
		 * @return void
		 */
		blurFilter: function() {
			jQuery( this.el ).find( '.nf-filter' ).blur();
		},

		/**
		 * Return our filter dom element.
		 * 
		 * @since  3.0
		 * @return Object
		 */
		getEl: function() {
			return jQuery( this.el ).find( '.nf-filter' );
		},

		getFocus: function() {
			nfRadio.channel( 'drawer' ).trigger( 'filter:focused' );
		},

		templateHelpers: function() {
			return {
				renderDisabled: function() {
					// Get our current domain.
					if ( this.drawerDisabled ) {
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