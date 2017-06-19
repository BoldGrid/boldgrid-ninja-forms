define( ['views/beforeForm', 'views/formLayout', 'views/afterForm'], function( BeforeForm, FormLayout, AfterForm ) {

	var view = Marionette.LayoutView.extend({
		template: '#tmpl-nf-layout',

		regions: {
			responseMsg: '.nf-response-msg',
			beforeForm: '.nf-before-form',
			formLayout: '.nf-form-layout',
			afterForm: '.nf-after-form'
		},

		initialize: function() {
			this.$el = jQuery( '#nf-form-' + this.model.id + '-cont' );
			this.el = '#nf-form-' + this.model.id + '-cont';

			this.render();

			this.beforeForm.show( new BeforeForm( { model: this.model } ) );
			this.formLayout.show( new FormLayout( { model: this.model, fieldCollection: this.options.fieldCollection } ) );
			this.afterForm.show( new AfterForm( { model: this.model } ) );

			/*
			 * If we need to hide a form, set the visibility of this form to hidden.
			 */
			 this.listenTo( this.model, 'hide', this.hide );
		},

        hide: function() {
        	jQuery( this.el ).find( '.nf-form-title' ).hide();
        }

	});

	return view;
} );