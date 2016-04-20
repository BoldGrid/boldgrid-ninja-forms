var nfRadio = Backbone.Radio;

jQuery( document ).ready( function( $ ) {
	require( ['views/app/builder', 'controllers/loadControllers', 'views/loadViews'], function( BuilderView, LoadControllers, LoadViews ) {

		var NinjaForms = Marionette.Application.extend( {

			initialize: function( options ) {
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
			},

			onStart: function() {
				var builderView = new BuilderView();
				// Trigger our after start event.
				nfRadio.channel( 'app' ).trigger( 'after:appStart', this );
			}
		} );
	
		var ninjaForms = new NinjaForms();
		ninjaForms.start();
	} );
} );