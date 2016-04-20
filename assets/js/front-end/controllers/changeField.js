/**
 * Controller responsible for replying to a Radio request stating that a field has been changed.
 *
 * This controller sends out a message to the field-specific channel, the field type channel,
 * and the public fields channel so that the data model can be updated.
 */

define([], function() {
	var controller = Marionette.Object.extend( {

		initialize: function() {
			/*
			 * Reply to our request for changing a field.
			 */
			nfRadio.channel( 'nfAdmin' ).reply( 'change:field', this.changeField );
		},

		changeField: function( el, model ) {
			// Get our current value.
			var value = nfRadio.channel( model.get( 'type' ) ).request( 'before:updateField', el, model );
			value = ( 'undefined' != typeof value ) ? value : nfRadio.channel( model.get( 'parentType' ) ).request( 'before:updateField', el, model );
			value = ( 'undefined' != typeof value ) ? value : jQuery( el ).val();

			// Set our 'isUpdated' flag to false.
			model.set( 'isUpdated', false );

			// Set our 'clean' flag to false.
			model.set( 'clean', false );

			/*
			 * Send out a message saying that we've changed a field.
			 * The first channel is field id/key specific.
			 * The second channel is the field type, i.e. text, email, radio
			 * The third channel is a generic 'field' channel.
			 *
			 * If the submitted value you wish to store in the data model isn't the same as the value received above,
			 * you can set that model in the actions below and set the 'isUpdated' model attribute to true.
			 * i.e. model.set( 'isUpdated', true );
			 */
			nfRadio.channel( 'field-' + model.get( 'id' ) ).trigger( 'change:field', el, model );
			nfRadio.channel( model.get( 'type' ) ).trigger( 'change:field', el, model );
			nfRadio.channel( 'fields' ).trigger( 'change:field', el, model );

			/*
			 * Send a request out on our nfAdmin channel to update our field model.
			 * If the field model has a 'isUpdated' property of false, nothing will be updated.
			 */
			nfRadio.channel( 'nfAdmin' ).request( 'update:field', model, value );
		}
	});

	return controller;
} );