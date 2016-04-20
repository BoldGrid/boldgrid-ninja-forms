define( ['models/calcModel'], function( CalcModel ) {
	var collection = Backbone.Collection.extend( {
		model: CalcModel,
		comparator: 'order',

		initialize: function( models, options ) {
			this.options = options;
		}
	} );
	return collection;
} );