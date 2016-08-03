define(['controllers/submitButton'], function( submitButton ) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			this.listenTo( nfRadio.channel( 'submit' ), 'init:model', this.registerHandlers );
		},

		registerHandlers: function( fieldModel ) {
			this.listenTo( nfRadio.channel( 'field-' + fieldModel.get( 'id' ) ), 'click:field', this.click, this );
			/*
			 * Register an interest in the 'before:submit' event of our form.
			 */
			fieldModel.listenTo( nfRadio.channel( 'form-' + fieldModel.get( 'formID' ) ), 'before:submit', this.beforeSubmit, fieldModel );
			fieldModel.listenTo( nfRadio.channel( 'form-' + fieldModel.get( 'formID' ) ), 'submit:failed', this.resetLabel, fieldModel );
			fieldModel.listenTo( nfRadio.channel( 'form-' + fieldModel.get( 'formID' ) ), 'submit:response', this.resetLabel, fieldModel );
			fieldModel.listenTo( nfRadio.channel( 'form-' + fieldModel.get( 'formID' ) ), 'enable:submit', this.maybeEnable, fieldModel );
			fieldModel.listenTo( nfRadio.channel( 'form-' + fieldModel.get( 'formID' ) ), 'disable:submit', this.maybeDisable, fieldModel );
			fieldModel.listenTo( nfRadio.channel( 'form-' + fieldModel.get( 'formID' ) ), 'processingLabel', this.processingLabel, fieldModel );

			fieldModel.listenTo( nfRadio.channel( 'fields' ), 'add:error', this.maybeDisable, fieldModel );
			fieldModel.listenTo( nfRadio.channel( 'fields' ), 'remove:error', this.maybeEnable, fieldModel );
		},

		click: function( e, fieldModel ) {
			var formModel = nfRadio.channel( 'app' ).request( 'get:form', fieldModel.get( 'formID' ) );
			nfRadio.channel( 'form-' + fieldModel.get( 'formID' ) ).request( 'submit', formModel );
		},

		beforeSubmit: function() {
			this.set( 'disabled', true );
			nfRadio.channel( 'form-' + this.get( 'formID' ) ).trigger( 'processingLabel', this );
		},

		maybeDisable: function( fieldModel ) {
			this.set( 'disabled', true );
			this.trigger( 'reRender' );
		},

		maybeEnable: function( fieldModel ) {
			/*
			 * If the field reporting the error is not on the same form as the submit button, return false;
			 */
			if ( 'undefined' != typeof fieldModel && fieldModel.get( 'formID' ) != this.get( 'formID' ) ) {
				return false;
			}
			
			var formModel = nfRadio.channel( 'app' ).request( 'get:form', this.get( 'formID' ) );
			if ( 0 == _.size( formModel.get( 'fieldErrors' ) ) ) {
				this.set( 'disabled', false );
				this.trigger( 'reRender' );
			}
		},

		processingLabel: function() {
			this.set( 'oldLabel', this.get( 'label' ) );
			this.set( 'label', this.get( 'processing_label' ) );
			this.trigger( 'reRender' );
		},

		resetLabel: function( response ) {
			this.set( 'label', this.get( 'oldLabel' ) );
			this.set( 'disabled', false );
			this.trigger( 'reRender' );
		}

	});

	return controller;
} );