/**
 * Returns a clone of a backbone collection with all the models' attributes looped through so that collections contained within are propely cloned.
 * 
 * @package Ninja Forms builder
 * @subpackage Main App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			nfRadio.channel( 'app' ).reply( 'clone:collectionDeep', this.cloneCollectionDeep, this );
		},

		cloneCollectionDeep: function( collection ) {
			var models = [];
			// Loop through every model in our collection, clone it, and add it to our model array
			_.each( collection.models, function( model ) {
				var newModel = nfRadio.channel( 'app' ).request( 'clone:modelDeep', model );
				models.push( newModel );
			} );
			// Create a new instance of our collection
			return new collection.constructor( models, collection.options );
		}
	});

	return controller;
} );