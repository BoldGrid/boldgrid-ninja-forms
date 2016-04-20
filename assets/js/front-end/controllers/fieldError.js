define(['models/fieldErrorModel'], function( fieldErrorModel ) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			nfRadio.channel( 'fields' ).reply( 'add:error', this.addError );
			nfRadio.channel( 'fields' ).reply( 'remove:error', this.removeError );
			nfRadio.channel( 'fields' ).reply( 'get:error', this.getError );
		},

		addError: function( targetID, id, msg ) {
			var model = nfRadio.channel( 'fields' ).request( 'get:field', targetID );
			var errors = model.get( 'errors' );
			errors.add( { 'id': id, 'msg' : msg } );
			model.set( 'errors', errors );
			model.trigger( 'change:errors', model );
			nfRadio.channel( 'fields' ).trigger( 'add:error', model, id, msg );
		},

		removeError: function( targetID, id ) {
			var model = nfRadio.channel( 'fields' ).request( 'get:field', targetID );

			if( 'undefined' == typeof model ) return;

			var errors = model.get( 'errors' );
			var targetError = errors.get( id );
			if ( 'undefined' != targetError ) {
				errors.remove( targetError );
				model.set( 'errors', errors );
				model.trigger( 'change:errors', model );
				nfRadio.channel( 'fields' ).trigger( 'remove:error', model, id );
			}
		},

		getError: function( targetID, id ) {
			var model = nfRadio.channel( 'fields' ).request( 'get:field', targetID );
			var errors = model.get( 'errors' );
			var targetError = errors.get( id );
			if ( 'undefined' != targetError ) {
				return targetError;
			} else {
				return false;
			}
		}
	});

	return controller;
} );