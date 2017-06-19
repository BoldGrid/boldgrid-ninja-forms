/**
 * Before we display our form content, ask if anyone wants to give us a different view.
 * Before we do anything with the data, pass it through any loading filters.
 * 
 * @package Ninja Forms builder
 * @subpackage Main App
 * @copyright (c) 2016 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			/*
			 * Init our fieldContent view and load filter arrays.
			 */
			this.viewFilters = [];
			this.loadFilters = [];

			/*
			 * Listen for requests to add new formContent filters.
			 */
			nfRadio.channel( 'formContent' ).reply( 'add:viewFilter', this.addViewFilter, this );
			nfRadio.channel( 'formContent' ).reply( 'add:loadFilter', this.addLoadFilter, this );

			/*
			 * Listen for requests to get our formContent filters.
			 */
			nfRadio.channel( 'formContent' ).reply( 'get:viewFilters', this.getViewFilters, this );
			nfRadio.channel( 'formContent' ).reply( 'get:loadFilters', this.getLoadFilters, this );

			/*
			 * -- DEPRECATED RADIO REPLIES --
			 * 
			 * The 'fieldContents' channel has been deprecated as of 3.0 (it was present in the RC) in favour of 'formContent'.
			 * Listen for requests to add new fieldContent filters.
			 * 
			 * TODO: These radio listeners on the 'fieldContents' channels are here for backwards compatibility and should be removed eventually.
			 */
			nfRadio.channel( 'fieldContents' ).reply( 'add:viewFilter', this.addViewFilter, this );
			nfRadio.channel( 'fieldContents' ).reply( 'add:loadFilter', this.addLoadFilter, this );

			/*
			 * Listen for requests to get our fieldContent filters.
			 * TODO: Remove eventually.
			 */
			nfRadio.channel( 'fieldContents' ).reply( 'get:viewFilters', this.getViewFilters, this );
			nfRadio.channel( 'fieldContents' ).reply( 'get:loadFilters', this.getLoadFilters, this );
		
			/*
			 * -- END DEPRECATED --
			 */
		},

		addViewFilter: function( callback, priority ) {
			this.viewFilters[ priority ] = callback;
		},

		getViewFilters: function() {
			return this.viewFilters;
		},

		addLoadFilter: function( callback, priority ) {
			this.loadFilters[ priority ] = callback;
		},

		getLoadFilters: function() {
			return this.loadFilters;
		}

	});

	return controller;
} );