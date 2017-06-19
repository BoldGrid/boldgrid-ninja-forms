/*
 * Because our backbone listens to .change() events on elements, changes made using jQuery .val() don't bubble properly.
 * This patch overwrites the default behaviour of jQuery .val() so that IF the item has an nf-element class, we fire a change event.
 */
( function( jQuery ) {
	/*
	 * Store our original .val() function.
	 */
    var originalVal = jQuery.fn.val;
    /*
     * Create our own .val() function.
     */
    jQuery.fn.val = function(){
        var prev;
        /* 
         * Store a copy of the results of the original .val() call.
         * We use this to make sure that we've actually changed something.
         */
        if( arguments.length > 0 ){
            prev = originalVal.apply( this,[] );
        }
        /*
         * Get the results of the original .val() call. 
         */
        var result = originalVal.apply( this, arguments );

        /*
         * If we have arguments, we have actually made a change, AND this has the nf-element class, trigger .change().
         */
        if( arguments.length > 0 && prev != originalVal.apply( this, [] ) && jQuery( this ).hasClass( 'nf-element' ) ) {
			jQuery(this).change();
        }

        return result;
    };
} ) ( jQuery );

jQuery( document ).ready( function( $ ) {
	require( [ 'models/formCollection', 'models/formModel', 'models/fieldCollection', 'controllers/loadControllers', 'views/mainLayout'], function( formCollection, FormModel, FieldCollection, LoadControllers, mainLayout ) {

		var NinjaForms = Marionette.Application.extend({
			forms: {},
			initialize: function( options ) {

				var that = this;
				Marionette.Renderer.render = function(template, data){
					var template = that.template( template );
					return template( data );
				};

				// Underscore one-liner for getting URL Parameters
				this.urlParameters = _.object(_.compact(_.map(location.search.slice(1).split('&'), function(item) {  if (item) return item.split('='); })));

				if( 'undefined' != typeof this.urlParameters.nf_resume ) {
					this.listenTo(nfRadio.channel('form-' + this.urlParameters.nf_resume), 'loaded', this.restart);
				}

				var loadControllers = new LoadControllers();
				nfRadio.channel( 'app' ).trigger( 'after:loadControllers' );

				nfRadio.channel( 'app' ).reply( 'get:template', this.template );
			},
			
			onStart: function() {
				var formCollection = nfRadio.channel( 'app' ).request( 'get:forms' );
				_.each( formCollection.models, function( form, index ) {
					var layoutView = new mainLayout( { model: form, fieldCollection: form.get( 'fields' ) } );			
					nfRadio.channel( 'form' ).trigger( 'render:view', layoutView );
					jQuery( document ).trigger( 'nfFormReady', layoutView );
				} );
			},

			restart: function( formModel ) {
				if( 'undefined' != typeof this.urlParameters.nf_resume ){
					var data = {
						'action': 'nf_ajax_submit',
						'security': nfFrontEnd.ajaxNonce,
						'nf_resume': this.urlParameters
					};

					nfRadio.channel( 'form-' + formModel.get( 'id' ) ).trigger( 'disable:submit' );
					nfRadio.channel( 'form-' + formModel.get( 'id' ) ).trigger( 'processingLabel' );

					this.listenTo( nfRadio.channel( 'form' ), 'render:view', function() {
						/**
						 * TODO: This needs to be re-worked for backbone. It's not dynamic enough.
						 */
						/*
						 * Hide form fields (but not the submit button).
						 */
						jQuery( '#nf-form-' + formModel.get( 'id' ) + '-cont .nf-field-container:not(.submit-container)' ).hide();
					});

					// TODO: Refactor Duplication
					jQuery.ajax({
						url: nfFrontEnd.adminAjax,
						type: 'POST',
						data: data,
						cache: false,
						success: function( data, textStatus, jqXHR ) {
							try {
						   		var response = jQuery.parseJSON( data );
						        nfRadio.channel( 'forms' ).trigger( 'submit:response', response, textStatus, jqXHR, formModel.get( 'id' ) );
						    	nfRadio.channel( 'form-' + formModel.get( 'id' ) ).trigger( 'submit:response', response, textStatus, jqXHR );
							} catch( e ) {
								console.log( 'Parse Error' );
							}

					    },
					    error: function( jqXHR, textStatus, errorThrown ) {
					        // Handle errors here
					        console.log('ERRORS: ' + textStatus);
					        // STOP LOADING SPINNER
							nfRadio.channel( 'forms' ).trigger( 'submit:response', 'error', textStatus, jqXHR, errorThrown );
					    }
					});
				}
			},

			template: function( template ) {
				return _.template( $( template ).html(),  {
					evaluate:    /<#([\s\S]+?)#>/g,
					interpolate: /\{\{\{([\s\S]+?)\}\}\}/g,
					escape:      /\{\{([^\}]+?)\}\}(?!\})/g,
					variable:    'data'
				} );
			}
		});
	
		var ninjaForms = new NinjaForms();
		ninjaForms.start();		
	} );
} );