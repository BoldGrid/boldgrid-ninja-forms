define([], function() {
	var radioChannel = nfRadio.channel( 'fields' );

	var controller = Marionette.Object.extend( {
		initialize: function() {
			nfRadio.channel( 'fields' ).reply( 'get:field', this.getField );
		},

		getField: function( id ) {
			var model = false;
			
			return model;
		}
	});

	return controller;
} );