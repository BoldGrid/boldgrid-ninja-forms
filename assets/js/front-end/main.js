jQuery( document ).ready( function( $ ) {
	require( ['models/formCollection', 'models/formModel', 'models/fieldCollection', 'controllers/loadControllers', 'views/mainLayout'], function( formCollection, FormModel, FieldCollection, LoadControllers, mainLayout ) {

		var NinjaForms = Marionette.Application.extend({
			forms: {},
			initialize: function( options ) {

				// TODO: Maybe move the resumeProcessing elsewhere.
				if( 'undefined' != typeof nfFrontEnd.resumeProcessing ){
					var formData = JSON.stringify( nfFrontEnd.resumeProcessing );
					var data = {
						'action': 'nf_ajax_resume',
						'security': nfFrontEnd.ajaxNonce,
						'formData': formData
					};

					jQuery.ajax({
						url: nfFrontEnd.adminAjax,
						type: 'POST',
						data: data,
						cache: false,
						success: function( data, textStatus, jqXHR ) {
							var response = jQuery.parseJSON( data );

							nfRadio.channel( 'submit' ).trigger( 'submit:response', response, textStatus, jqXHR );
						},
						error: function( jqXHR, textStatus, errorThrown ) {
							// Handle errors here
							console.log('ERRORS: ' + textStatus);
							// STOP LOADING SPINNER

							nfRadio.channel( 'submit' ).trigger( 'submit:response', 'error', textStatus, jqXHR, errorThrown );
						}
					});
				}

				var loadControllers = new LoadControllers();
			},
			
			onStart: function() {
				var formCollection = nfRadio.channel( 'app' ).request( 'get:forms' );
				_.each( formCollection.models, function( form, index ) {
					var layoutView = new mainLayout( { model: form, fieldCollection: form.get( 'fields' ) } );			
					nfRadio.channel( 'form' ).trigger( 'render:view', layoutView );
				} );
			}
		});
	
		var ninjaForms = new NinjaForms();
		ninjaForms.start();		
	} );
} );