define([], function() {
	var controller = Marionette.Object.extend( {
		initialize: function( model ) {
			this.model = model;
			var formChannel = nfRadio.channel( 'form-' + model.get( 'formID' ) );
			var allFieldsChannel = nfRadio.channel( 'fields' );
			var thisFieldChannel = nfRadio.channel( 'field-' + model.get( 'id' ) );

			this.listenTo( allFieldsChannel, 'add:error', this.updateSubmit, this );
			this.listenTo( allFieldsChannel, 'remove:error', this.updateSubmit, this );
			this.listenTo( thisFieldChannel, 'click:field', this.submitForm, this );

			this.listenTo( formChannel, 'disable:submit', this.disableSubmit, this );
			this.listenTo( formChannel, 'enable:submit', this.enableSubmit, this );
		},

		updateSubmit: function( model, id, msg ) {
			if ( model.get( 'formID' ) == this.model.get( 'formID' ) ) {
				if ( nfRadio.channel( 'form' ).request( 'get:errors', model.get( 'formID' ) ) ) {
					this.disableSubmit( model, id, msg );
				} else {
					this.enableSubmit( model, id );
				}
			}
		},

		disableSubmit: function( model, id, msg ) {
			if ( 'disabled' != this.model.get( 'disabled' ) ) {
				this.model.set( 'disabled', 'disabled' );
				this.model.set( 'reRender', true );				
			}
		},

		enableSubmit: function( model, id ) {
			if ( 'disabled' == this.model.get( 'disabled' ) ) {
				this.model.set( 'disabled', '' );
				this.model.set( 'reRender', true );						
			}
		},

		submitForm: function( el, model ) {
			this.processingLabel();
			/*
			 * Check to see if our honeypot has been filled in. If it has, add an error and don't submit.
			 * TODO:
			 * Abstract this logic to another controller.
			 * Create a view just for honeypot.
			 */
			var formEl = nfRadio.channel( 'form' ).request( 'get:el' );
			var hpVal = jQuery( formEl ).find( '.nf-field-hp' ).val();
			if ( '' != jQuery.trim( hpVal ) ) {
				// Add an error to our form.
				nfRadio.channel( 'form-' + model.get( 'formID' ) ).request( 'add:error', 'hp', 'Honeypot Error' );
				nfRadio.channel( 'submit' ).trigger( 'error', model.get( 'formID' ) );
				this.resetLabel();
				return false;
			} else {
				// Remove our form error.
				nfRadio.channel( 'form-' + model.get( 'formID' ) ).request( 'remove:error', 'hp' );
			}

			var formErrors = nfRadio.channel( 'form' ).request( 'get:errors', this.model.get( 'formID' ) );

			if ( formErrors ) {
				nfRadio.channel( 'submit' ).trigger( 'error', model.get( 'formID' ) );
				jQuery( el ).closest( '.nf-field-wrap' ).find( '.nf-field-submit-error' ).show();
				return false;
			} else {
				// Get our form model.
				var formModel = nfRadio.channel( 'app' ).request( 'get:form', model.get( 'formID' ) );
				// Before we submit, check to make sure that all of our required fields aren't empty.
				_.each( formModel.get( 'fields' ).models, function( field ) {
					nfRadio.channel( 'submit' ).trigger( 'validate:field', field );
					nfRadio.channel( field.get( 'type' ) ).trigger( 'before:submit', field );
					nfRadio.channel( 'fields' ).trigger( 'before:submit', field );
				} );

				// console.log( 'before radio message' );

				// Send out a message on the radio saying we're about to submit.
				nfRadio.channel( 'submit' ).trigger( 'before:submit', formModel );

				// console.log( 'after radio message' );

				/*
				 * Check again for form errors.
				 *
				 * If the user's click on the submit button was the thing that blurred another field, an error could have been added in the code above.
				 */ 
				formErrors = nfRadio.channel( 'form' ).request( 'get:errors', this.model.get( 'formID' ) );

				if ( formErrors ) {
					nfRadio.channel( 'submit' ).trigger( 'error', model.get( 'formID' ) );
					this.resetLabel();
					return false;
				} else {
					var formData = JSON.stringify( formModel );
					var data = {
	                	'action': 'nf_ajax_submit',
	                	'security': nfFrontEnd.ajaxNonce,
	                	'formData': formData
					}

					var that = this;

					jQuery.ajax({
	                    url: nfFrontEnd.adminAjax,
	                    type: 'POST',
	                    data: data,
	                    cache: false,
	                   	success: function( data, textStatus, jqXHR ) {
	                   		var response = jQuery.parseJSON( data );
	                   		
	                        nfRadio.channel( 'submit' ).trigger( 'submit:response', response, textStatus, jqXHR );
	                    	that.resetLabel();
	                    },
	                    error: function( jqXHR, textStatus, errorThrown ) {
	                        // Handle errors here
	                        console.log('ERRORS: ' + textStatus);
	                        // STOP LOADING SPINNER

							nfRadio.channel( 'submit' ).trigger( 'submit:response', 'error', textStatus, jqXHR, errorThrown );
	                    	that.resetLabel();
	                    }
	                });
				}
			}
		},

		processingLabel: function() {
            this.label = this.model.get( 'label' );
            var processingLabel = this.model.get( 'processing_label' );
            this.model.set( 'label', processingLabel );
            this.model.set( 'reRender', true );
        },

        resetLabel: function() {
            this.model.set( 'label', this.label );
            this.model.set( 'reRender', true );
        }
	});

	return controller;
} );