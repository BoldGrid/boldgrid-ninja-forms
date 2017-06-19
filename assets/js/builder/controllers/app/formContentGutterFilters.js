/**
 * Handles filters for our main content gutter views.
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
			 * Init our gutter view filter array.
			 */
			this.leftFilters = [];
			this.rightFilters = [];
			/*
		     * Listen for requests to add gutter filters.
			 */
			nfRadio.channel( 'formContentGutters' ).reply( 'add:leftFilter', this.addLeftFilter, this );
			nfRadio.channel( 'formContentGutters' ).reply( 'add:rightFilter', this.addRightFilter, this );

			/*
			 * Listen for requests to get our content gutter filters.
			 */
			nfRadio.channel( 'formContentGutters' ).reply( 'get:leftFilters', this.getLeftFilters, this );
			nfRadio.channel( 'formContentGutters' ).reply( 'get:rightFilters', this.getRightFilters, this );
		},

		addLeftFilter: function( callback, priority ) {
			this.leftFilters[ priority ] = callback;
		},

		addRightFilter: function( callback, priority ) {
			this.rightFilters[ priority ] = callback;
		},

		getLeftFilters: function() {
			return this.leftFilters;
		},

		getRightFilters: function() {
			return this.rightFilters;
		}

	});

	return controller;
} );