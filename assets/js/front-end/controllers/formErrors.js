/**
 * If a form has at least one field error, we should disable the submit button and add a form error.
 * If a form had errors, but all the field errors have been removed, we should remove the form error.
 *
 * @since 3.0
 */
define([], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			/*
			 * Listen for error messages being added to and removed from fields.
			 */
			this.listenTo( nfRadio.channel( 'fields' ), 'add:error', this.addError );
			this.listenTo( nfRadio.channel( 'fields' ), 'remove:error', this.removeError );

			/*
			 * Respond to requests to get form errors
			 */
			nfRadio.channel( 'form' ).reply( 'get:errors', this.getFormErrors );
		},

		addError: function( fieldModel, errorID, errorMsg ) {
			var formModel = nfRadio.channel( 'app' ).request( 'get:form', fieldModel.get( 'formID' ) );
			/*
			 * We store our errors in this object by field ID so that we don't have to loop over all our fields when we're testing for errors.
			 * They are stored as an object within an array, using the field ID as the key.
			 *
			 * If we haven't setup an array item for this field, set it as an object.
			 */
			if ( 'undefined' == typeof formModel.get( 'fieldErrors' )[ fieldModel.get( 'id' ) ] ) {
				formModel.get( 'fieldErrors' )[ fieldModel.get( 'id' ) ] = {};
			}
			// Add an error to our tracking array
			formModel.get( 'fieldErrors' )[ fieldModel.get( 'id' ) ][ errorID ] = errorMsg;
			/*
			 * We have at least one field error, so submmission should be prevented.
			 * Add a form error.
			 */
			nfRadio.channel( 'form-' + fieldModel.get( 'formID' ) ).request( 'add:error', 'field-errors', formModel.get( 'settings' ).formErrorsCorrectErrors );
		},

		removeError: function( fieldModel, errorID ) {
			var formModel = nfRadio.channel( 'app' ).request( 'get:form', fieldModel.get( 'formID' ) );
			// Remove this error ID from our tracking array.
			formModel.get( 'fieldErrors' )[ fieldModel.get( 'id' ) ] = _.omit( formModel.get( 'fieldErrors' )[ fieldModel.get( 'id' ) ], errorID );
			/*
			 * If we don't have any more error IDs on this field, then we need to remove this field from the array.
			 *
			 * Then, if the fieldErrors tracking array has a length of 0, we remove our form error, because all field errors have been dealt with.
			 */
			if ( 0 == _.size( formModel.get( 'fieldErrors' )[ fieldModel.get( 'id' ) ] ) ) {
				delete formModel.get( 'fieldErrors' )[ fieldModel.get( 'id' ) ];
			}

			if ( 0 == _.size( formModel.get( 'fieldErrors' ) ) ) {
				// Remove our form error.
				nfRadio.channel( 'form-' + fieldModel.get( 'formID' ) ).request( 'remove:error', 'field-errors' );
			}
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

				
			}
			return errors;
		}
	});

	return controller;
} );