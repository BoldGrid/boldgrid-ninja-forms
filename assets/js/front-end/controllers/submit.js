/**
 * Handles submission of our form.
 */
define([], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			this.listenTo( nfRadio.channel( 'forms' ), 'init:model', this.registerSubmitHandler );
		},

		/**
		 * Register the submission handler function.
		 * 
		 * @since  3.0
		 * @param  Backbone.model 	formModel
		 * @return void
		 */
		registerSubmitHandler: function( formModel ) {
			nfRadio.channel( 'form-' + formModel.get( 'id' ) ).reply( 'submit', this.submit );
		},

		/**
		 * Handles the actual submission of our form.
		 * When we submit:
		 *
		 * 1) Send out a message saying that we're about to begin form submission.
		 * 2) Check the form for errors
		 * 3) Submit the data
		 * 4) Send out a message with our response
		 * 
		 * @since  3.0
		 * @param  Backbone.model 	formModel
		 * @return void
		 */
		submit: function( formModel ) {

			/*
			 * Send out a radio message saying that we're about to begin submitting.
			 * First we send on the generic forms channel, and then on the form-specific channel.
			 */
			nfRadio.channel( 'forms' ).trigger( 'before:submit', formModel );
			nfRadio.channel( 'form-' + formModel.get( 'id' ) ).trigger( 'before:submit', formModel );

			var submit = nfRadio.channel( 'form-' + formModel.get( 'id' ) ).request( 'maybe:submit', formModel );

			if ( false == submit ) {
				nfRadio.channel( 'forms' ).trigger( 'submit:cancel', formModel );
				nfRadio.channel( 'form-' + formModel.get( 'id' ) ).trigger( 'submit:cancel', formModel );
				return;
			}

			/*
			 * Make sure we don't have any form errors before we submit.
			 * Return false if we do.
			 */
			if ( 0 != _.size( formModel.get( 'fieldErrors' ) ) ) {
				nfRadio.channel( 'forms' ).trigger( 'submit:failed', formModel );
				nfRadio.channel( 'form-' + formModel.get( 'id' ) ).trigger( 'submit:failed', formModel );
				return false;
			}

			/*
			 * Actually submit our form, and send out a message with our response.
			 */

 			var formID = formModel.get( 'id' );
			var fields = [];
			_.each( formModel.get( 'fields' ).models, function( field ) {
				var fieldDataDefaults = { value:field.get( 'value' ), id:field.get( 'id' ) };
				var fieldData = nfRadio.channel( field.get( 'type' ) ).request( 'get:submitData', fieldDataDefaults, field ) || fieldDataDefaults;
				fields.push( fieldData );
			} );
			var extra = formModel.get( 'extra' );
			var settings = formModel.get( 'settings' );
			delete settings.fieldContentsData;
			var formData = JSON.stringify( { id: formID, fields: fields, settings: settings, extra: extra } );
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
			        nfRadio.channel( 'forms' ).trigger( 'submit:response', response, textStatus, jqXHR, formModel.get( 'id' ) );
			    	nfRadio.channel( 'form-' + formModel.get( 'id' ) ).trigger( 'submit:response', response, textStatus, jqXHR )
			    },
			    error: function( jqXHR, textStatus, errorThrown ) {
			        // Handle errors here
			        console.log('ERRORS: ' + textStatus);
			        // STOP LOADING SPINNER
					nfRadio.channel( 'forms' ).trigger( 'submit:response', 'error', textStatus, jqXHR, errorThrown );
			    }
			});

		}

	});

	return controller;
} );