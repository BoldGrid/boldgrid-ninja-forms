/**
 * Return views that might be used in extensions.
 * These are un-instantiated views.
 * 
 * @package Ninja Forms builder
 * @subpackage Main App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [ 'views/fields/fieldItem', 'views/fields/mainContentEmpty', 'views/app/formTitle' ], function( fieldItemView, mainContentEmptyView, FormTitleView ) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			// Reply to requests for our field item view.
			nfRadio.channel( 'views' ).reply( 'get:fieldItem', this.getFieldItem );
		
			// Reply to requests for our empty content view.
			nfRadio.channel( 'views' ).reply( 'get:mainContentEmpty', this.getMainContentEmpty );
		
			// Reply to requests for our form title view.
			nfRadio.channel( 'views' ).reply( 'get:formTitle', this.getFormTitle );
		},

		getFieldItem: function( model ) {
			return fieldItemView;
		},

		getMainContentEmpty: function() {
			return mainContentEmptyView;
		},

		getFormTitle: function() {
			return FormTitleView;
		}

	});

	return controller;
} );