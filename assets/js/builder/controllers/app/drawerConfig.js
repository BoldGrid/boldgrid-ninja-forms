/**
 * Config file for our app drawers.
 *
 * this.collection represents all of our registered drawers.
 * 
 * @package Ninja Forms builder
 * @subpackage Main App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [
	'models/app/drawerCollection',
	'views/fields/drawer/addField',
	'views/app/drawer/editSettings',
	'views/app/drawer/headerEditSettings',
	'views/actions/drawer/addAction',
	'views/app/drawer/contentViewChanges',
	'views/app/drawer/headerViewChanges',
	'views/app/drawer/contentNewForm',
	'views/app/drawer/headerNewForm'
	], function(
		drawerCollection,
		addFieldView,
		editSettingsView,
		editSettingsHeaderView,
		addActionView,
		viewChangesView,
		viewChangesHeaderView,
		newFormView,
		newFormHeaderView,
		mobileItemControlsView
	) {
	var controller = Marionette.Object.extend( {
		initialize: function() {

			this.collection = new drawerCollection( [
				{
					id: 'addField',

					getContentView: function( data ) {
						return new addFieldView( data );
					}
				},
				{
					id: 'addAction',

					getContentView: function( data ) {
						return new addActionView( data );
					}
				},				
				{
					id: 'editSettings',

					/*
					 * TODO: Add filtering when editing settings. For now, removing them from settings.
					 */
					getHeaderView: function( data ) {
						/*
						 * Get a custom setting header view if one is set.
						 * TODO: Currently, this only works for advanced settings.
						 * This could be used to replace the need for a single config file.
						 */
						if ( 'undefined' != typeof data.typeModel ) {
							var view = nfRadio.channel( data.typeModel.get( 'id' ) ).request( 'get:drawerHeaderView' ) || editSettingsHeaderView;
						} else {
							var view = editSettingsHeaderView;
						}
						return new view( data );
					},

					getContentView: function( data ) {
						return new editSettingsView( data );
					}
				},
				{
					id: 'viewChanges',

					// getHeaderView() is defined by default, but we need to override it for the viewChanges drawer.
					getHeaderView: function( data ) {
						return new viewChangesHeaderView( data );
					},

					getContentView: function( data ) {
						return new viewChangesView( data );
					}
				},
				{
					id: 'newForm',

					// getHeaderView() is defined by default, but we need to override it for the newForm drawer.
					getHeaderView: function( data ) {
						return new newFormHeaderView( data );
					},

					getContentView: function( data ) {
						return new newFormView( data );
					}
				}
			] );

			// Listen for requests for our drawer collection.
			nfRadio.channel( 'app' ).reply( 'get:drawerCollection', this.getDrawerCollection, this );
			// Listen for requests for specific drawer models.
			nfRadio.channel( 'app' ).reply( 'get:drawer', this.getDrawer, this );
		},

		getDrawerCollection: function() {
			return this.collection;
		},

		getDrawer: function( id ) {
			return this.collection.get( id );
		}

	});

	return controller;
} );