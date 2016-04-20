define([], function() {
	var radioChannel = nfRadio.channel( 'email' );
	var emailReg = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	var errorID = 'invalid-email';
	var errorMsg = 'Please enter a valid email address!';

	var controller = Marionette.Object.extend( {

		initialize: function() {
			this.listenTo( radioChannel, 'change:modelValue', this.emailChange );
			this.listenTo( radioChannel, 'keyup:field', this.emailKeyup );
		},

		emailChange: function( model ) {
			var value = model.get( 'value' );
			var fieldID = model.get( 'id' );

			if ( 0 < value.length ) {
				if( emailReg.test( value ) ) {
					nfRadio.channel( 'fields' ).request( 'remove:error', fieldID, errorID );
				} else {
					nfRadio.channel( 'fields' ).request( 'add:error', fieldID, errorID, errorMsg );
				}				
			} else {
				nfRadio.channel( 'fields' ).request( 'remove:error', fieldID, errorID );
			}
		},

		/**
		 * When a user types inside of an email field, track their keypresses and add the appropriate class.
		 * If the value validates as an email, add a class of nf-pass
		 * If the value does not validate as email, add a class of nf-fail
		 * 
		 * @since  3.0
		 * @param  {object} el    Element that triggered the keyup event.
		 * @param  {object} model Model connected to the element that triggered the event
		 * @return {void}
		 */
		emailKeyup: function( el, model, keyCode ) {
			/*
			 * Get the current value from our element.
			 */
			var value = jQuery( el ).val();

			/*
			 * Get our current ID
			 */
			var fieldID = model.get( 'id' );

			/*
			 * Check our value to see if it is a valid email.
			 * If we have an empty value, remove our pass/fail class
			 */
			if ( 0 == value.length ) {
				model.removeWrapperClass( 'nf-fail' );
				model.removeWrapperClass( 'nf-pass' );
				nfRadio.channel( 'fields' ).request( 'remove:error', fieldID, errorID );
			} else if ( ! emailReg.test( value ) ) {
				model.removeWrapperClass( 'nf-pass' );
				if ( ! model.get( 'clean' ) ) {
					model.addWrapperClass( 'nf-fail' );
					nfRadio.channel( 'fields' ).request( 'add:error', fieldID, errorID, errorMsg );
				}
			} else if ( emailReg.test( value ) ) {
				model.removeWrapperClass( 'nf-fail' );
				model.addWrapperClass( 'nf-pass' );
				nfRadio.channel( 'fields' ).request( 'remove:error', fieldID, errorID );
			}
		}
	});

	return controller;
} );