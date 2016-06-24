/**
 * Return views that might be used in extensions.
 * These are un-instantiated views.
 * 
 * @package Ninja Forms builder
 * @subpackage Main App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['views/fieldItem', 'views/fieldLayout'], function( fieldItemView, fieldLayoutView ) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			// Reply to requests for our field item view.
			nfRadio.channel( 'views' ).reply( 'get:fieldItem', this.getFieldItem );

			nfRadio.channel( 'views' ).reply( 'get:fieldLayout', this.getFieldLayout );
		},

		getFieldItem: function( model ) {
			return fieldItemView;
		},

		getFieldLayout: function() {
			return fieldLayoutView;
		}

	});

	return controller;
} );