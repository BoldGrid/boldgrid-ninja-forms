define([], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			this.listenTo( nfRadio.channel( 'fields' ), 'blur:field', this.validateRequired );
			this.listenTo( nfRadio.channel( 'fields' ), 'change:field', this.validateRequired );
			this.listenTo( nfRadio.channel( 'fields' ), 'keyup:field', this.validateKeyup );

			this.listenTo( nfRadio.channel( 'fields' ), 'change:modelValue', this.validateModelData );
			this.listenTo( nfRadio.channel( 'submit' ), 'validate:field', this.validateModelData );
		},
		
		validateKeyup: function( el, model, keyCode ) {
			var errorExists = nfRadio.channel( 'fields' ).request( 'get:error', model.get( 'id' ), 'required-error' );
			if ( ( errorExists || ! model.get( 'clean' ) ) && 1 == model.get( 'required' ) ) {
				this.validateRequired( el, model );
			}
		},

		validateRequired: function( el, model ) {
			if ( 1 != model.get( 'required' ) ) {
				return false;
			}

			var currentValue = jQuery( el ).val();
			var customReqValidation = nfRadio.channel( model.get( 'type' ) ).request( 'validate:required', el, model );
			var defaultReqValidation = true;

			var maskPlaceholder = model.get( 'mask' );
			if ( maskPlaceholder ) {
				maskPlaceholder = maskPlaceholder.replace( /9/g, '_' );
				maskPlaceholder = maskPlaceholder.replace( /a/g, '_' );
				maskPlaceholder = maskPlaceholder.replace( /\*/g, '_' );
			}

			if ( ! jQuery.trim( currentValue ) || currentValue == maskPlaceholder ) {
				defaultReqValidation = false;
			}

			if ( 'undefined' !== typeof customReqValidation ) {
				var valid = customReqValidation;
			} else {
				var valid = defaultReqValidation;
			}

			this.maybeError( valid, model );
		},

		validateModelData: function( model ) {
			if ( 1 != model.get( 'required' ) ) {
				return false;
			}

			currentValue = model.get( 'value' );
			
			var defaultReqValidation = true;

			if ( ! jQuery.trim( currentValue ) ) {
				defaultReqValidation = false;
			}

			var valid = defaultReqValidation;
			
			this.maybeError( valid, model );

		},

		maybeError: function( valid, model ) {
			if ( ! valid ) {
				nfRadio.channel( 'fields' ).request( 'add:error', model.get( 'id' ), 'required-error', 'This is a required field.' );
			} else {
				nfRadio.channel( 'fields' ).request( 'remove:error', model.get( 'id' ), 'required-error' );
			}			
		}
	});

	return controller;
} );