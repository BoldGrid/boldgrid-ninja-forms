define( ['models/fieldErrorModel'], function( errorModel ) {
	var collection = Backbone.Collection.extend( {
		model: errorModel
	} );
	return collection;
} );