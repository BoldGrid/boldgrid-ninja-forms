/**
 * Before we save data to the database (on preview update or publish), we check to see if we have anyone
 * that wants to update the 'formContent' form setting. This setting is used on the front-end to allow
 * for custom display of form fields. i.e. layout rows.
 * 
 * @package Ninja Forms builder
 * @subpackage Main App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			/*
			 * Init our formContent view filter array.
			 */
			this.viewFilters = [];
			this.saveFilters = [];
			this.loadFilters = [];

			/*
		     * Listen for requests to add formContent filters.
			 */

			nfRadio.channel( 'formContent' ).reply( 'add:viewFilter', this.addViewFilter, this );
			nfRadio.channel( 'formContent' ).reply( 'add:saveFilter', this.addSaveFilter, this );
			nfRadio.channel( 'formContent' ).reply( 'add:loadFilter', this.addLoadFilter, this );

			/*
			 * Listen for requests to get our formContent filters.
			 */
			nfRadio.channel( 'formContent' ).reply( 'get:viewFilters', this.getViewFilters, this );
			nfRadio.channel( 'formContent' ).reply( 'get:saveFilters', this.getSaveFilters, this );
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
			nfRadio.channel( 'fieldContents' ).reply( 'add:saveFilter', this.addSaveFilter, this );
			nfRadio.channel( 'fieldContents' ).reply( 'add:loadFilter', this.addLoadFilter, this );

			/*
			 * Listen for requests to get our fieldContent filters.
			 */
			nfRadio.channel( 'fieldContents' ).reply( 'get:viewFilters', this.getViewFilters, this );
			nfRadio.channel( 'fieldContents' ).reply( 'get:saveFilters', this.getSaveFilters, this );
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

		addSaveFilter: function( callback, priority ) {
			this.saveFilters[ priority ] = callback;
		},

		getSaveFilters: function() {
			return this.saveFilters;
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