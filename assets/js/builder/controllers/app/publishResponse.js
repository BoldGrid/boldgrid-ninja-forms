/**
 * Listens for our update:db response and replaces tmp ids with new ids if we were performing the publish action.
 * 
 * @package Ninja Forms builder
 * @subpackage Main App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			// Listen to our app channel for the updateDB response.
			this.listenTo( nfRadio.channel( 'app' ), 'response:updateDB', this.publishResponse );
		},

		publishResponse: function( response ) {
			// If we aren't performing a publish action, bail.
			if ( 'publish' !== response.action ) {
				return false;
			}
			
			// Check to see if we have any new ids. 
			if ( 'undefined' != typeof response.data.new_ids ) {

				// If we have any new fields, update their models with the new id.
				if ( 'undefined' != typeof response.data.new_ids.fields ) {
					_.each( response.data.new_ids.fields, function( newID, oldID ) {
						var field = nfRadio.channel( 'fields' ).request( 'get:field', oldID );
						if ( field ) {
							field.set( 'id', newID );
						}
					} );
				}

				// If we have any new actions, update their models with the new id.
				if ( 'undefined' != typeof response.data.new_ids.actions ) {
					_.each( response.data.new_ids.actions, function( newID, oldID ) {
						var action = nfRadio.channel( 'actions' ).request( 'get:action', oldID );
						if ( action ) {
							action.set( 'id', newID );
						}
					} );
				}

				// If we have a new form id, update the model with the new id.
				if ( 'undefined' != typeof response.data.new_ids.forms ) {
					_.each( response.data.new_ids.forms, function( newID, oldID ) {
						var formModel = nfRadio.channel( 'app' ).request( 'get:formModel' );
						formModel.set( 'id', newID );
						history.replaceState( '', '', 'admin.php?page=ninja-forms&form_id=' + newID );
					} );
				}
			}

			nfRadio.channel( 'app' ).request( 'update:setting', 'loading', false );
			nfRadio.channel( 'app' ).trigger( 'change:loading' );

			// If we're on mobile, show a notice that we're publishing
			if ( nfRadio.channel( 'app' ).request( 'is:mobile' ) ) {
				nfRadio.channel( 'notices' ).request( 'close', 'publishing' );
			}
			// Add a notice that we've published.
			nfRadio.channel( 'notices' ).request( 'add', 'published', 'Changes Published' );
			nfRadio.channel( 'app' ).trigger( 'app:published', response );

			// Mark our app as clean. This will disable the publish button and fire anything else that cares about the state.
			nfRadio.channel( 'app' ).request( 'update:setting', 'clean', true );
		}
		
	});

	return controller;
} );