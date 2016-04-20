define([], function() {
	var radioChannel = nfRadio.channel( 'fields' );
	var controller = Marionette.Object.extend( {
		initialize: function( model ) {
			nfRadio.channel( 'form' ).reply( 'get:errors', this.getFormErrors );
		},

		getFormErrors: function( formID ) {
			var formModel = nfRadio.channel( 'app' ).request( 'get:form', formID );
			var errors = false;
			
			if ( formModel ) {
				/*
				 * Check to see if we have any errors on our form model.
				 */
				if ( 0 !== formModel.get( 'errors' ).length ) {
					_.each( formModel.get( 'errors' ).models, function( error ) {
						errors = errors || {};
						errors[ error.get( 'id' ) ] = error.get( 'msg' );
					} );						
				}

				_.each( formModel.get( 'fields' ).models, function( field ) {
					if ( field.get( 'type' ) != 'submit' && field.get( 'errors' ).length > 0 ) {
						errors = errors || {};
						errors[ field.get( 'id' ) ] = field.get( 'errors' );
					}
				} );
			}
			return errors;
		},
	});

	return controller;
} );