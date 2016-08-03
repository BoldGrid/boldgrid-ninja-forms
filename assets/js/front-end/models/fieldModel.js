define( ['models/fieldErrorCollection'], function( fieldErrorCollection ) {
	var model = Backbone.Model.extend( {
		defaults: {
			placeholder: '',
			value: '',
			label_pos: '',
			classes: 'ninja-forms-field',
			reRender: false,
			mirror_field: false,
			confirm_field: false,
			clean: true,
			disabled: '',
			visible: true
		},

		initialize: function() {
			this.set( 'formID', this.collection.options.formModel.get( 'id' ) );
			this.listenTo( nfRadio.channel( 'form-' + this.get( 'formID' ) ), 'reset', this.resetModel );

    		this.bind( 'change', this.changeModel, this );
    		this.bind( 'change:value', this.changeValue, this );
    		this.set( 'errors', new fieldErrorCollection() );

    		/*
			 * Trigger an init event on two channels:
			 * 
			 * fields
			 * field-type
			 *
			 * This lets specific field types modify model attributes before anything uses them.
			 */
			nfRadio.channel( 'fields' ).trigger( 'init:model', this );
			nfRadio.channel( this.get( 'type' ) ).trigger( 'init:model', this );
			nfRadio.channel( 'fields-' + this.get( 'type' ) ).trigger( 'init:model', this );

			if( 'undefined' != this.get( 'parentType' ) ){
				nfRadio.channel( this.get( 'parentType' ) ).trigger( 'init:model', this );
			}

			/*
			 * When we load our form, fire another event for this field.
			 */
			this.listenTo( nfRadio.channel( 'form-' + this.get( 'formID' ) ), 'loaded', this.formLoaded );
		
			/*
			 * Before we submit our form, we need to validate each field.
			 */
			this.listenTo( nfRadio.channel( 'form-' + this.get( 'formID' ) ), 'before:submit', this.beforeSubmit );
		},

		resetModel: function() {
			/*
			 * Trigger an init event on two channels:
			 * 
			 * fields
			 * field-type
			 *
			 * This lets specific field types modify model attributes before anything uses them.
			 */ 
			// nfRadio.channel( 'fields' ).trigger( 'init:model', this );
			// nfRadio.channel( this.get( 'type' ) ).trigger( 'init:model', this );
			// nfRadio.channel( 'fields-' + this.get( 'type' ) ).trigger( 'init:model', this );
		},

		changeModel: function() {
			nfRadio.channel( 'field-' + this.get( 'id' ) ).trigger( 'change:model', this );
			nfRadio.channel( this.get( 'type' ) ).trigger( 'change:model', this );
			nfRadio.channel( 'fields' ).trigger( 'change:model', this );
		},

		changeValue: function() {
			nfRadio.channel( 'field-' + this.get( 'id' ) ).trigger( 'change:modelValue', this );
			nfRadio.channel( this.get( 'type' ) ).trigger( 'change:modelValue', this );
			nfRadio.channel( 'fields' ).trigger( 'change:modelValue', this );
		},

		addWrapperClass: function( cl ) {
			this.set( 'addWrapperClass', cl );
		},

		removeWrapperClass: function( cl ) {
			this.set( 'removeWrapperClass', cl );
		},

		formLoaded: function() {
			nfRadio.channel( 'fields' ).trigger( 'formLoaded', this );
			nfRadio.channel( 'fields-' + this.get( 'type' ) ).trigger( 'formLoaded', this );
		},

		beforeSubmit: function( formModel ) {
			nfRadio.channel( 'submit' ).trigger( 'validate:field', this );
			nfRadio.channel( this.get( 'type' ) ).trigger( 'before:submit', this );
			nfRadio.channel( 'fields' ).trigger( 'before:submit', this );
		}

	} );

	return model;
} );
