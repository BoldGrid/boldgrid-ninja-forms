var nfRadio = Backbone.Radio;

jQuery( document ).ready( function( $ ) {
	require( ['views/app/builder', 'controllers/loadControllers', 'views/loadViews'], function( BuilderView, LoadControllers, LoadViews ) {

		var NinjaForms = Marionette.Application.extend( {

			initialize: function( options ) {

				var that = this;
				Marionette.Renderer.render = function(template, data){
					var template = that.template( template );
					return template( data );
				};

				// Trigger an event before we load our controllers.
				nfRadio.channel( 'app' ).trigger( 'before:loadControllers', this );
				// Load our controllers.
				var loadControllers = new LoadControllers();
				// Trigger an event after we load our controllers.
				nfRadio.channel( 'app' ).trigger( 'after:loadControllers', this );

				// Trigger an event before we load un-instantiated views
				nfRadio.channel( 'app' ).trigger( 'before:loadViews', this );
				var loadViews = new LoadViews();
				// Trigger an event after we load un-instantiated views.
				nfRadio.channel( 'app' ).trigger( 'after:loadViews', this );

				nfRadio.channel( 'app' ).reply( 'get:template', this.template );
			},

			onStart: function() {
				var builderView = new BuilderView();
				// Trigger our after start event.
				nfRadio.channel( 'app' ).trigger( 'after:appStart', this );

				/*
				 * If we're on the new forms builder, open the add fields drawer.
				 */
				if ( 0 == nfAdmin.formID ) {
					nfRadio.channel( 'app' ).request( 'open:drawer', 'addField' );
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
		} );
	
		var ninjaForms = new NinjaForms();
		ninjaForms.start();
	} );
} );