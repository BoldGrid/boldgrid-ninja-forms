/**
 * Filters our action type collection.
 * 
 * @package Ninja Forms builder
 * @subpackage Actions - New Action Drawer
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['models/actions/typeCollection'], function( typeCollection ) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			// Listen to our change filter event.
			this.listenTo( nfRadio.channel( 'drawer-addAction' ), 'change:filter', this.filterActionTypes );
		},

		/**
		 * Filter our action types in the add new action drawer
		 * 
		 * Takes a search string and finds any action types that match either the name or alias.
		 * 
		 * @since  3.0
		 * @param  string	 search 	string being searched for
		 * @param  object 	 e      	Keyup event
		 * @return void
		 */
		filterActionTypes: function( search, e ) {

			// Make sure that we aren't dealing with an empty string.
			if ( '' != jQuery.trim( search ) ) {

        		var filteredInstalled = [];
        		/**
        		 * Call the function that actually filters our collection,
        		 * and then loop through our collection, adding each model to our filteredInstalled array.
        		 */
				var installedActions = nfRadio.channel( 'actions' ).request( 'get:installedActions' );
        		_.each( this.filterCollection( search, installedActions ), function( model ) {
        			filteredInstalled.push( model );
        		} );

        		var filteredAvailable = [];
        		var availableActions = nfRadio.channel( 'actions' ).request( 'get:availableActions' );
        		_.each( this.filterCollection( search, availableActions ), function( model ) {
        			filteredAvailable.push( model );
        		} );

        		// Create a new Action Type Section collection with the filtered array.
        		var newInstalled = new typeCollection( filteredInstalled );
        		newInstalled.slug = 'installed';
        		newInstalled.nicename = 'Installed';

        		var newAvailable = new typeCollection( filteredAvailable );
        		newAvailable.slug = 'available';
        		newAvailable.nicename = 'Available';

        		// Request that our action types filter be applied, passing the collection we created above.
        		nfRadio.channel( 'drawer' ).trigger( 'filter:actionTypes', newInstalled, newAvailable );
        		// If we've pressed the 'enter' key, add the action to staging and clear the filter.
        		if ( e.addObject ) {
        			if ( 0 < newInstalled.length ) {
        				nfRadio.channel( 'actions' ).request( 'add:actionType', newInstalled.models[0] );
        				nfRadio.channel( 'drawer' ).request( 'clear:filter' );
        			}
        		}
        	} else {
        		// Clear our filter if the search text is empty.
        		nfRadio.channel( 'drawer' ).trigger( 'clear:filter' );
        	}
        },

        /**
         * Search our action type collection for the search string.
         * 
         * @since  3.0
         * @param  string	 search 	string being searched for
         * @return backbone.collection
         */
        filterCollection: function( search, collection ) {
        	search = search.toLowerCase();
        	/*
        	 * Backbone collections have a 'filter' method that loops through every model,
        	 * waiting for you to return true or false. If you return true, the model is kept.
        	 * If you return false, it's removed from the filtered result.
        	 */
			var filtered = collection.filter( function( model ) {
				var found = false;
				
				// If we match either the ID or nicename, return true.
				if ( model.get( 'id' ).toLowerCase().indexOf( search ) != -1 ) {
					found = true;
				} else if ( model.get( 'nicename' ).toLowerCase().indexOf( search ) != -1 ) {
					found = true;
				}

				/*
				 * TODO: Hashtag searching. Doesn't really do anything atm.
				 */
				if ( model.get( 'tags' ) && 0 == search.indexOf( '#' ) ) {
					_.each( model.get( 'tags' ), function( tag ) {
						if ( search.replace( '#', '' ).length > 1 ) {
							if ( tag.toLowerCase().indexOf( search.replace( '#', '' ) ) != -1 ) {
								found = true;
							}							
						}
					} );
				}

				// If we match any of the aliases, return true.
				if ( model.get( 'alias' ) ) {
					_.each( model.get( 'alias' ), function( alias ) {
						if ( alias.toLowerCase().indexOf( search ) != -1 ) {
							found = true;
						}
					} );
				}

				return found;
			} );

			// Return our filtered collection.
			return filtered;
        }
	});

	return controller;
} );