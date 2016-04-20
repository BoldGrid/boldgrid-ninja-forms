/*
 * Handles setting up our form.
 *
 * Holds a collection of our fields.
 * Replies to requests for field data.
 * Updates field models.
 */
define(['models/formModel', 'models/formCollection', 'models/fieldCollection', 'models/formErrorCollection'], function( FormModel, FormCollection, FieldCollection, ErrorCollection ) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			/*
			 * Setup our field collections.
			 */
			var that = this;

			/*
			 * Initialize our form collection (incase we have multiple forms on the page)
			 */
			this.formCollection = new FormCollection();

			_.each( nfForms, function( form, index ) {
				var formModel = new FormModel( form );
				that.formCollection.add( formModel );
				var fields = new FieldCollection( form.fields, { formModel: formModel } );
				formModel.set( 'fields', fields );
				formModel.set( 'loadedFields', form.fields );
				var errors = new ErrorCollection();
				formModel.set( 'errors', errors );
				nfRadio.channel( 'form' ).trigger( 'loaded', formModel );
				nfRadio.channel( 'form-' + formModel.get( 'id' ) ).trigger( 'loaded', formModel );
			} );

			// _.each( this.formCollection.models, function( form ) {
			// 	_.each( form.get( 'fields' ).models, function( field ) {
			// 		nfRadio.channel( field.get( 'type' ) ).trigger( 'init:model', field );
			// 		nfRadio.channel( 'fields' ).trigger( 'init:model', field );
			// 	} );
				
			// 	nfRadio.channel( 'form' ).trigger( 'loaded', form );
			// 	nfRadio.channel( 'form-' + form.get( 'id' ) ).trigger( 'loaded', form );
			// } );

			nfRadio.channel( 'app' ).reply( 'get:form', this.getForm, this );
			nfRadio.channel( 'app' ).reply( 'get:forms', this.getForms, this );

			nfRadio.channel( 'fields' ).reply( 'get:field', this.getField, this );
		},

		getForm: function( id ) {
			return this.formCollection.get( id );
		},

		getForms: function() {
			return this.formCollection;
		},

		getField: function( id ) {
			var model = false;
			_.each( this.formCollection.models, function( form ) {
				if ( ! model ) {
					model = form.get( 'fields' ).get( id );	
				}			
			} );
			return model;
		}
	});

	return controller;
} );