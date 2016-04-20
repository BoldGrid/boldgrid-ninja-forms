define( ['views/beforeForm', 'views/formLayout', 'views/afterForm', 'views/formErrorCollection'], function( BeforeForm, FormLayout, AfterForm, FormErrors ) {

	var view = Marionette.LayoutView.extend({
		template: '#nf-tmpl-layout',

		regions: {
			responseMsg: '.nf-response-msg',
			formErrors: '.nf-form-errors',
			beforeForm: '.nf-before-form',
			formLayout: '.nf-form-layout',
			afterForm: '.nf-after-form'
		},

		initialize: function() {
			this.$el = jQuery( '#nf-form-' + this.model.id + '-cont' );
			this.el = '#nf-form-' + this.model.id + '-cont';

			this.render();

			this.formErrors.show( new FormErrors( { collection: this.model.get( 'errors' ) } ) );
			this.beforeForm.show( new BeforeForm( { model: this.model } ) );
			this.formLayout.show( new FormLayout( { model: this.model, fieldCollection: this.options.fieldCollection } ) );
			this.afterForm.show( new AfterForm( { model: this.model } ) );
		},

		onRender: function() {
			// var formEl = jQuery( '#nf-form-' + this.model.get( 'id' ) );
			// console.log( formEl );
		}

	});

	return view;
} );