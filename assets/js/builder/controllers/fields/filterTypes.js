/**
 * Filters our field type collection.
 * 
 * @package Ninja Forms builder
 * @subpackage Fields - New Field Drawer
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['models/fields/typeSectionCollection'], function( fieldTypeSectionCollection ) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			// Listen to our change filter event.
			this.listenTo( nfRadio.channel( 'drawer-addField' ), 'change:filter', this.filterFieldTypes );
		},

		/**
		 * Filter our field types in the add new field drawer
		 * 
		 * Takes a search string and finds any field types that match either the name or alias.
		 * 
		 * @since  3.0
		 * @param  string	 search 	string being searched for
		 * @param  object 	 e      	Keyup event
		 * @return void
		 */
		filterFieldTypes: function( search, e ) {
			// Make sure that we aren't dealing with an empty string.
			if ( '' != jQuery.trim( search ) ) {
        		var filtered = [];
        		/**
        		 * Call the function that actually filters our collection,
        		 * and then loop through our collection, adding each model to our filtered array.
        		 */
        		_.each( this.filterCollection( search ), function( model ) {
        			filtered.push( model.get( 'id' ) );
        		} );

        		// Create a new Field Type Section collection with the filtered array.
        		var filteredSectionCollection = new fieldTypeSectionCollection( [
				{ 
					id: 'filtered',
					nicename: 'Filtered Fields',
					fieldTypes: filtered
				}
				] );

        		// Request that our field types filter be applied, passing the collection we created above.
        		nfRadio.channel( 'drawer' ).trigger( 'filter:fieldTypes', filteredSectionCollection );
        		// If we've pressed the 'enter' key, add the field to staging and clear the filter.
        		if ( e.addObject ) {
        			if ( 0 < filtered.length ) {
        				nfRadio.channel( 'fields' ).request( 'add:stagedField', filtered[0] );
        				nfRadio.channel( 'drawer' ).request( 'clear:filter' );
        			}
        		}
        	} else {
        		// Clear our filter if the search text is empty.
        		nfRadio.channel( 'drawer' ).trigger( 'clear:filter' );
        	}
        },

        /**
         * Search our field type collection for the search string.
         * 
         * @since  3.0
         * @param  string	 search 	string being searched for
         * @return backbone.collection
         */
        filterCollection: function( search ) {
        	search = search.toLowerCase();
        	// Get our list of field types
        	var collection = nfRadio.channel( 'fields' ).request( 'get:typeCollection' );
        	/*
        	 * Backbone collections have a 'filter' method that loops through every model,
        	 * waiting for you to return true or false. If you return true, the model is kept.
        	 * If you return false, it's removed from the filtered result.
        	 */
			var filtered = collection.filter( function( model ) {
				var found = false;
				
				// If we match either the ID or nicename, return true.
				if ( model.get( 'type' ).toLowerCase().indexOf( search ) != -1 ) {
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