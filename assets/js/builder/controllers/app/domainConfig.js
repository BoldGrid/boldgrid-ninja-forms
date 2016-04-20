/**
 * Config file for our app domains.
 * 
 * this.collection represents all of our app domain (fields, actions, settings) information.
 *
 * This doesn't store the current domain, but rather all the data about each.
 * 
 * This data includes:
 * hotkeys
 * header view
 * subheader view
 * content view
 * 
 * @package Ninja Forms builder
 * @subpackage Main App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [
	// Require our domain collection
	'models/app/domainCollection',
	// Require our fields domain files
	'views/fields/mainHeader',
	'views/fields/subHeader',
	'views/fields/mainContentFieldCollection',
	'views/fields/drawer/settingsTitle',
	// Require our actions domain files
	'views/actions/mainHeader', 
	'views/actions/subHeader',
	'views/actions/mainContent',
	// Require our settings domain files
	'views/advanced/mainHeader',
	'views/advanced/subHeader',
	'views/advanced/mainContent',
	], 
	function( 
		appDomainCollection,
		fieldsMainHeaderView,
		fieldsSubHeaderView,
		fieldsMainContentFieldCollectionView,
		fieldsSettingsTitleView,
		actionsMainHeaderView,
		actionsSubHeaderView,
		actionsMainContentView,
		settingsMainHeaderView,
		settingsSubHeaderView,
		settingsMainContentView
	) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			// Define our app domains
			this.collection = new appDomainCollection( [
				{
					id: 'fields',
					nicename: 'Form Fields',
					hotkeys: {
						'Esc'				: 'close:drawer',
						'Ctrl+Shift+n'		: 'add:newField',
						'Ctrl+Shift+a'		: 'changeDomain:actions',
						'Ctrl+Shift+s'		: 'changeDomain:settings',
						'Alt+Ctrl+t'		: 'open:mergeTags',
						'up'				: 'up:mergeTags',
						'down'				: 'down:mergeTags',
						'Shift+return'		: 'return:mergeTags'
					},
					mobileDashicon: 'dashicons-menu',

					getMainHeaderView: function() {
						return new fieldsMainHeaderView();
					},

					getSubHeaderView: function() {
						return new fieldsSubHeaderView();
					},

					/**
					 * Get the fieldContents view that should be used in our builder.
					 * Uses two filters:
					 * 1) One for our fieldContentsData
					 * 2) One for our fieldContentsView
					 *
					 * If we don't have any view filters, we use the default fieldContentsView.
					 * 
					 * @since  3.0
					 * @return fieldContentsView backbone view.
					 */
					getMainContentView: function( collection ) {
						/*
						 * Temporary method for adding data to our formModel.
						 * Can be removed once we start saving data for layouts.
						 */ 
						// nfRadio.channel( 'tmp' ).request( 'update:layoutCollection' );
						/*
						 * Get our field collection. We'll use this as the default if we don't have a defined fieldContentsData.
						 */ 				
						var fieldCollection = nfRadio.channel( 'fields' ).request( 'get:collection' );
						/*
						 * Set our fieldContentsData to our form setting 'fieldContentsData'
						 */
						var fieldContentsData = nfRadio.channel( 'settings' ).request( 'get:setting', 'fieldContentsData' );
						/*
						 * If we don't have a filter for our fieldContentsData, default to fieldCollection.
						 */
						var fieldContentsLoadFilters = nfRadio.channel( 'fieldContents' ).request( 'get:loadFilters' );
						if ( 0 != fieldContentsLoadFilters.length ) {
							/* 
							* Get our first filter, this will be the one with the highest priority.
							*/
							var sortedArray = _.without( fieldContentsLoadFilters, undefined );
							var callback = _.first( sortedArray );
							fieldContentsData = callback( fieldContentsData );
						} else {
							fieldContentsData = fieldCollection;
						}

						/*
						 * Set our default fieldContentsView.
						 */
						var fieldContentsView = fieldsMainContentFieldCollectionView;
						/*
						 * Check our fieldContentViewsFilter to see if we have any defined.
						 * If we do, overwrite our default with the view returned from the filter.
						 */
						var fieldContentsViewFilters = nfRadio.channel( 'fieldContents' ).request( 'get:viewFilters' );
						if ( 0 != fieldContentsViewFilters.length ) {
							/* 
							* Get our first filter, this will be the one with the highest priority.
							*/
							var sortedArray = _.without( fieldContentsViewFilters, undefined );
							var callback = _.first( sortedArray );
							fieldContentsView = callback();
						}
						/*
						 * If we don't have any fieldContentsData set yet, default to our field collection.
						 */
						if ( 'undefined' == typeof fieldContentsData ) {
							fieldContentsData = fieldCollection;
						}

						nfRadio.channel( 'settings' ).request( 'update:setting', 'fieldContentsData', fieldContentsData, true );
						return new fieldContentsView( { collection: fieldContentsData } );
					},

					getSettingsTitleView: function( data ) {
						return new fieldsSettingsTitleView( data );
					}
				},
				{
					id: 'actions',
					nicename: 'Emails & Actions',
					hotkeys: {
						'Esc'				: 'close:drawer',
						'Ctrl+Shift+n'		: 'add:newAction',
						'Ctrl+Shift+f'		: 'changeDomain:fields',
						'Ctrl+Shift+s'		: 'changeDomain:settings',
						'Alt+Ctrl+t'		: 'open:mergeTags',
						'up'				: 'up:mergeTags',
						'down'				: 'down:mergeTags',
						'Shift+return'		: 'return:mergeTags'
					},
					mobileDashicon: 'dashicons-external',

					getMainHeaderView: function() {
						return new actionsMainHeaderView();
					},

					getSubHeaderView: function() {
						return new actionsSubHeaderView();
					},
					
					getMainContentView: function() {
						var collection = nfRadio.channel( 'actions' ).request( 'get:collection' );
						return new actionsMainContentView( { collection: collection } );
					}
				},
				{
					id: 'settings',
					nicename: 'Advanced',
					hotkeys: {
						'Esc'				: 'close:drawer',
						'Ctrl+Shift+f'		: 'changeDomain:fields',
						'Ctrl+Shift+a'		: 'changeDomain:actions',
						'Alt+Ctrl+t'		: 'open:mergeTags',
						'up'				: 'up:mergeTags',
						'down'				: 'down:mergeTags',
						'Shift+return'		: 'return:mergeTags'
					},
					mobileDashicon: 'dashicons-admin-generic',

					getMainHeaderView: function() {
						return new settingsMainHeaderView();
					},

					getSubHeaderView: function() {
						return new settingsSubHeaderView();
					},
					
					getMainContentView: function() {
						var collection = nfRadio.channel( 'settings' ).request( 'get:typeCollection' );
						return new settingsMainContentView( { collection: collection } );
					}
				},
				{
					id: 'preview',
					nicename: 'Preview Form',
					classes: 'preview',
					dashicons: 'dashicons-visibility',
					mobileDashicon: 'dashicons-visibility',
					url: nfAdmin.previewurl
				}
			] );

			/*
			 * Send out a radio message with our domain config collection.
			 */
			nfRadio.channel( 'app' ).trigger( 'init:domainCollection', this.collection );

			/*
			 * Respond to requests to get the app domain collection.
			 */
			nfRadio.channel( 'app' ).reply( 'get:domainCollection', this.getDomainCollection, this );
			nfRadio.channel( 'app' ).reply( 'get:domainModel', this.getDomainModel, this );
		},

		getDomainCollection: function() {
			return this.collection;
		},

		getDomainModel: function( id ) {
			return this.collection.get( id );
		}

	});

	return controller;
} );