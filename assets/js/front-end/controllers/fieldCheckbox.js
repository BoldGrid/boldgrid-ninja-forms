define([], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			/*
			 * When we init our checkbox model, register our renderClasses() function
			 */
			this.listenTo( nfRadio.channel( 'checkbox' ), 'init:model', this.registerRenderClasses );

			nfRadio.channel( 'checkbox' ).reply( 'validate:required', this.validateRequired );
			nfRadio.channel( 'checkbox' ).reply( 'validate:modelData', this.validateModelData );
            nfRadio.channel( 'checkbox' ).reply( 'before:updateField', this.beforeUpdateField, this );
            nfRadio.channel( 'checkbox' ).reply( 'get:calcValue', this.getCalcValue, this );
		},

		beforeUpdateField: function( el, model ) {
			var checked = jQuery( el ).prop( 'checked' );
			if ( checked ) {
				var value = 1;
				jQuery( el ).addClass( 'nf-checked' );
				jQuery( el ).closest( '.field-wrap' ).find( 'label[for="' + jQuery( el ).prop( 'id' ) + '"]' ).addClass( 'nf-checked-label' );
			} else {
				var value = 0;
				jQuery( el ).removeClass( 'nf-checked' );
				jQuery( el ).closest( '.field-wrap' ).find( 'label[for="' + jQuery( el ).prop( 'id' ) + '"]' ).removeClass( 'nf-checked-label' );
			}

			return value;
		},

		validateRequired: function( el, model ) {
			return el[0].checked;
		},

		validateModelData: function( model ) {
			return model.get( 'value' ) != 0;
		},

		getCalcValue: function( fieldModel ) {
			if ( 1 == fieldModel.get( 'value' ) ) {
				calcValue = fieldModel.get( 'checked_calc_value' );
			} else {
				calcValue = fieldModel.get( 'unchecked_calc_value' );
			}

			return calcValue;
		},

		registerRenderClasses: function( model ) {
			if ( 'checked' == model.get( 'default_value' ) ) {
				model.set( 'value', 1 );
			} else {
				model.set( 'value', 0 );
			}
			model.set( 'customClasses', this.customClasses );
			model.set( 'customLabelClasses', this.customLabelClasses );
			model.set( 'maybeChecked', this.maybeChecked );
		},

		customClasses: function( classes ) {
			if ( 1 == this.value || ( this.clean && 'undefined' != typeof this.default_value && 'checked' == this.default_value ) ) {
				classes += ' nf-checked';
			} else {
				classes.replace( 'nf-checked', '' );
			}
			return classes;
		},

		customLabelClasses: function( classes ) {
			if ( 1 == this.value || ( this.clean && 'undefined' != typeof this.default_value && 'checked' == this.default_value ) ) {
				classes += ' nf-checked-label';
			} else {
				classes.replace( 'nf-checked-label', '' );
			}
			return classes;
		},

		maybeChecked: function() {
			if ( 1 == this.value || ( this.clean && 'undefined' != typeof this.default_value && 'checked' == this.default_value ) ) {
				return ' checked';
			} else {
				return '';
			}
		}
	});

	return controller;
} );