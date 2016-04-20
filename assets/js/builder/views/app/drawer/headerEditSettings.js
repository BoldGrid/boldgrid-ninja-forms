/**
 * Edit Settings drawer header.
 *
 * Includes our 'Done' button.
 *
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var view = Marionette.ItemView.extend({
		tagName: 'div',
		template: '#nf-tmpl-drawer-header-edit-settings',

		initialize: function() {
			if ( this.model ) {
				// Listen for our drawer being disabled.
				this.model.on( 'change:drawerDisabled', this.render, this );				
			}
		},

		onBeforeDestroy: function() {
			if ( this.model ) {
				this.model.off( 'change:drawerDisabled', this.render );
			}
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