define( ['models/fileModel'], function( fileModel ) {
	var collection = Backbone.Collection.extend( {
		model: fileModel
	} );
	return collection;
} );