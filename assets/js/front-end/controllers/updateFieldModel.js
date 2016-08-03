define([], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			nfRadio.channel( 'nfAdmin' ).reply( 'update:field', this.updateField );
		},

		updateField: function( model, value ) {
			if ( ! model.get( 'isUpdated' ) ) {
				model.set( 'value', value );
				model.set( 'isUpdated', true );
				/*
				 * If we're working with an array, it won't trigger a change event on the value attribute.
				 * Instead, we have to manually trigger a change event.
				 */ 
				if ( _.isArray( value ) ) {
					model.trigger( 'change:value', model );
				}
			}
		}
	});

	return controller;
} );