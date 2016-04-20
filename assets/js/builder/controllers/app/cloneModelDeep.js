/**
 * Returns a clone of a backbone model with all the attributes looped through so that collections contained within are propely cloned.
 * 
 * @package Ninja Forms builder
 * @subpackage Main App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			nfRadio.channel( 'app' ).reply( 'clone:modelDeep', this.cloneModelDeep, this );
		},

		cloneModelDeep: function( model ) {
			// Temporary value used to store any new collections.
			var replace = {};
			// Loop over every model attribute and if we find a collection, clone each model and instantiate a new collection.
			_.each( model.attributes, function( val, key ) {
				// console.log( val );
				if( val instanceof Backbone.Collection ) { // Is this a backbone collection?
					// Clone each model.
					var models = val.map( function( model ) { return model.clone(); } );
					var options = _.clone( val.options );
					var copy = new val.constructor( models, options );
					replace[ key ] = copy;
				} else if ( val instanceof Backbone.Model ) { // Is this a backbone model?
					replace[ key ] = val.clone();
				}
			} );

			// Clone our original model
			var newModel = model.clone();
			// Overwrite any collections we created above.
			_.each( replace, function( val, key ) {
				newModel.set( key, val );
			} );

			return newModel;
		}
	});

	return controller;
} );