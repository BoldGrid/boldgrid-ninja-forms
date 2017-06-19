define( [], function() {
	var radioChannel = nfRadio.channel( 'fields' );
	var errorID = 'confirm-mismatch';

	var controller = Marionette.Object.extend( {

		initialize: function() {
			this.listenTo( radioChannel, 'init:model', this.registerConfirm );
			this.listenTo( radioChannel, 'keyup:field', this.confirmKeyup );
		},

		registerConfirm: function( confirmModel ) {
			if ( ! confirmModel.get( 'confirm_field' ) ) return;

			this.listenTo( nfRadio.channel( 'form' ), 'loaded', function( formModal ){
				this.registerConfirmListeners( confirmModel );
			});
		},

		registerConfirmListeners: function( confirmModel ) {
			
			var targetModel = nfRadio.channel( 'form-' + confirmModel.get( 'formID' ) ).request( 'get:fieldByKey', confirmModel.get( 'confirm_field' ) );

			console.log( targetModel );

			targetModel.set( 'confirm_with', confirmModel.get( 'id' ) );

			this.listenTo( nfRadio.channel( 'field-' + targetModel.get( 'id' ) ), 'change:modelValue', this.changeValue );
			this.listenTo( nfRadio.channel( 'field-' + confirmModel.get( 'id' ) ), 'change:modelValue', this.changeValue );
		},

		changeValue: function( model ) {
			if ( 'undefined' == typeof model.get( 'confirm_with' ) ) {
				var confirmModel = model;
				var targetModel = nfRadio.channel( 'form-' + model.get( 'formID' ) ).request( 'get:fieldByKey', confirmModel.get( 'confirm_field' ) );
			} else {
				var targetModel = model;
				var confirmModel = radioChannel.request( 'get:field', targetModel.get( 'confirm_with' ) );
			}
			var targetID = targetModel.get( 'id' );
			var confirmID = confirmModel.get( 'id' );

			if ( '' == confirmModel.get( 'value' ) || confirmModel.get( 'value' ) == targetModel.get( 'value' ) ) {
				nfRadio.channel( 'fields' ).request( 'remove:error', confirmID, errorID );
			} else {
				var fieldModel = nfRadio.channel( 'fields' ).request( 'get:field', confirmID );
				var formModel  = nfRadio.channel( 'app'    ).request( 'get:form',  fieldModel.get( 'formID' ) );
				nfRadio.channel( 'fields' ).request( 'add:error', confirmID, errorID, formModel.get( 'settings' ).confirmFieldErrorMsg );
			}
		},
		
		confirmKeyup: function( el, model, keyCode ) {

			var currentValue = jQuery( el ).val();
			if ( model.get( 'confirm_field' ) ) {
				var confirmModel = model;
				var confirmID = model.get( 'id' );
				var targetModel = nfRadio.channel( 'form-' + model.get( 'formID' ) ).request( 'get:fieldByKey', confirmModel.get( 'confirm_field' ) );
				var compareValue = targetModel.get( 'value' );
				var confirmValue = currentValue;
			} else if ( model.get( 'confirm_with' ) ) {
				var confirmModel = nfRadio.channel( 'fields' ).request( 'get:field', model.get( 'confirm_with' ) );
				var confirmID = confirmModel.get( 'id' );
				var confirmValue = confirmModel.get( 'value' );
				var compareValue = confirmValue;
			}

			if ( 'undefined' !== typeof confirmModel ) {
				if ( '' == confirmValue ) {
					nfRadio.channel( 'fields' ).request( 'remove:error', confirmID, errorID );
				} else if ( currentValue == compareValue ) {
					nfRadio.channel( 'fields' ).request( 'remove:error', confirmID, errorID );
				} else {
					var fieldModel = nfRadio.channel( 'fields' ).request( 'get:field', confirmID );
					var formModel  = nfRadio.channel( 'app'    ).request( 'get:form',  fieldModel.get( 'formID' ) );
					nfRadio.channel( 'fields' ).request( 'add:error', confirmID, errorID, formModel.get( 'settings' ).confirmFieldErrorMsg );
				}
			}
		}
	});

	return controller;
} );