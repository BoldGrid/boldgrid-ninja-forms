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
	// Empty View
	'views/app/empty',
	// FieldCollection: used by the default formContentData filter
	'models/fields/fieldCollection'
	], 
	function( 
		appDomainCollection,
		fieldsSubHeaderView,
		FieldsMainContentFieldCollectionView,
		fieldsSettingsTitleView,
		actionsMainHeaderView,
		actionsSubHeaderView,
		actionsMainContentView,
		settingsMainHeaderView,
		settingsSubHeaderView,
		settingsMainContentView,
		EmptyView,
		FieldCollection
	) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			/*
			 * Add our default formContentView filter.
			 */
			nfRadio.channel( 'formContent' ).request( 'add:viewFilter', this.defaultFormContentView, 10, this );
			
			/*
			 * Add our default formContentData filter.
			 */
			nfRadio.channel( 'formContent' ).request( 'add:loadFilter', this.defaultFormContentLoad, 10, this );

			/*
			 * Add our default formContentGutterView filters.
			 */
			nfRadio.channel( 'formContentGutters' ).request( 'add:leftFilter', this.defaultFormContentGutterView, 10, this );
			nfRadio.channel( 'formContentGutters' ).request( 'add:rightFilter', this.defaultFormContentGutterView, 10, this );

			// Define our app domains
			this.collection = new appDomainCollection( [
				{
					id: 'fields',
					nicename: nfi18n.domainFormFields,
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

					getSubHeaderView: function() {
						return new fieldsSubHeaderView();
					},

					/**
					 * Get the formContent view that should be used in our builder.
					 * Uses two filters:
					 * 1) One for our formContentData
					 * 2) One for our formContentView
					 *
					 * If we don't have any view filters, we use the default formContentView.
					 * 
					 * @since  3.0
					 * @return formContentView backbone view.
					 */
					getMainContentView: function( collection ) {
						var formContentData = nfRadio.channel( 'settings' ).request( 'get:setting', 'formContentData' );

						/*
						 * As of version 3.0, 'fieldContentsData' has deprecated in favour of 'formContentData'.
						 * If we don't have this setting, then we check for this deprecated value.
						 * 
						 * Set our fieldContentsData to our form setting 'fieldContentsData'
						 *
						 * TODO: Remove this backwards compatibility eventually.
						 */
						if ( ! formContentData ) {
							formContentData = nfRadio.channel( 'settings' ).request( 'get:setting', 'fieldContentsData' );
						}
						
						/*
						 * If we don't have a filter for our formContentData, default to fieldCollection.
						 */
						var formContentLoadFilters = nfRadio.channel( 'formContent' ).request( 'get:loadFilters' );
						
						/* 
						* Get our first filter, this will be the one with the highest priority.
						*/
						var sortedArray = _.without( formContentLoadFilters, undefined );
						var callback = _.first( sortedArray );
						formContentData = callback( formContentData, nfRadio.channel( 'app' ).request( 'get:formModel' ), true );
						
						/*
						 * Check our fieldContentViewsFilter to see if we have any defined.
						 * If we do, overwrite our default with the view returned from the filter.
						 */
						var formContentViewFilters = nfRadio.channel( 'formContent' ).request( 'get:viewFilters' );
						
						/* 
						* Get our first filter, this will be the one with the highest priority.
						*/
						var sortedArray = _.without( formContentViewFilters, undefined );
						var callback = _.first( sortedArray );
						formContentView = callback();

						nfRadio.channel( 'settings' ).request( 'update:setting', 'formContentData', formContentData, true );
						return new formContentView( { collection: formContentData } );
					},

					getSettingsTitleView: function( data ) {
						/*
						 * If we are dealing with a field model, return the fields settings view, otherwise, return the default.
						 */
						if ( 'fields' == data.model.get( 'objectDomain' ) ) {
							return new fieldsSettingsTitleView( data );
						} else {
							return this.get( 'getDefaultSettingsTitleView' ).call( this, data );
						}
						
					},

					getGutterLeftView: function( data ) {
						/*
						 * Check our fieldContentViewsFilter to see if we have any defined.
						 * If we do, overwrite our default with the view returned from the filter.
						 */
						var gutterFilters = nfRadio.channel( 'formContentGutters' ).request( 'get:leftFilters' );

						/* 
						* Get our first filter, this will be the one with the highest priority.
						*/
						var sortedArray = _.without( gutterFilters, undefined );
						var callback = _.first( sortedArray );
						gutterView = callback();

						return new gutterView(); 
					},

					getGutterRightView: function() {
						/*
						 * Check our fieldContentViewsFilter to see if we have any defined.
						 * If we do, overwrite our default with the view returned from the filter.
						 */
						var gutterFilters = nfRadio.channel( 'formContentGutters' ).request( 'get:rightFilters' );
						
						/* 
						* Get our first filter, this will be the one with the highest priority.
						*/
						var sortedArray = _.without( gutterFilters, undefined );
						var callback = _.first( sortedArray );
						gutterView = callback();

						return new gutterView(); 
					}

				},
				{
					id: 'actions',
					nicename: nfi18n.domainActions,
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
					nicename: nfi18n.domainAdvanced,
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
		},

		defaultFormContentView: function( formContentData ) {
			return FieldsMainContentFieldCollectionView;
		},

		defaultFormContentLoad: function( formContentData ) {
			var fieldCollection = nfRadio.channel( 'fields' ).request( 'get:collection' );
			/*
			 * If we only have one load filter, we can just return the field collection.
			 */
			var formContentLoadFilters = nfRadio.channel( 'formContent' ).request( 'get:loadFilters' );
			var sortedArray = _.without( formContentLoadFilters, undefined );

			if ( 1 == sortedArray.length || 'undefined' == typeof formContentData || true === formContentData instanceof Backbone.Collection ) return fieldCollection;

			/*
			 * If another filter is registered, we are calling this from somewhere else.
			 */

        	var fieldModels = _.map( formContentData, function( key ) {
        		return fieldCollection.findWhere( { key: key } );
        	}, this );

        	return new FieldCollection( fieldModels );
		},

		defaultFormContentGutterView: function( formContentData ) {
			return EmptyView;
		}

	});

	return controller;
} );