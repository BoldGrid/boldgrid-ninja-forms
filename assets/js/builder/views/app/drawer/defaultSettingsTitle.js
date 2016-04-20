/**
 * Default settings title view.
 * 
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var view = Marionette.ItemView.extend({
		tagName: 'div',
		template: '#nf-tmpl-drawer-content-edit-settings-title-default',

		templateHelpers: function () {
	    	return {
	    		renderTypeNicename: function() {
	    			var currentDomain = nfRadio.channel( 'app' ).request( 'get:currentDomain' );
					var domainID = currentDomain.get( 'id' );
	    			var type = nfRadio.channel( domainID ).request( 'get:type', this.type );
	    			if ( 'undefined' != typeof type ) {
	    				return type.get( 'nicename' );
	    			} else {
	    				return '';
	    			}
				}
			};
		},
	});

	return view;
} );