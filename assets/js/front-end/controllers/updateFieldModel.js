define([], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			nfRadio.channel( 'nfAdmin' ).reply( 'update:field', this.updateField );
		},

		updateField: function( model, value ) {
			if ( ! model.get( 'isUpdated' ) ) {
				model.set( 'value', value );
				model.set( 'isUpdated', true );
			}
		}
	});

	return controller;
} );