define([], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			this.listenTo( nfRadio.channel( 'listradio' ), 'change:modelValue', this.changeModelValue );
			this.listenTo( nfRadio.channel( 'listradio' ), 'init:model', this.register );
			nfRadio.channel( 'listradio' ).reply( 'get:calcValue', this.getCalcValue, this );
			
			this.listenTo( nfRadio.channel( 'listradio' ), 'change:field', this.updateCheckedClass, this );
		},

		register: function( model ) {
			model.set( 'renderOptions', this.renderOptions );
			model.set( 'renderOtherText', this.renderOtherText );
			/*
			 * When we init a model, we need to set our 'value' to the selected option's value.
			 * This is the list equivalent of a 'default value'.
			 */ 
			if ( 0 != model.get( 'options' ).length ) {
				/*
				 * Check to see if we have a selected value.
				 */
				var selected = _.find( model.get( 'options' ), function( opt ) { return 1 == opt.selected } );

				if ( 'undefined' != typeof selected ) {
					model.set( 'value', selected.value );
				}
			}
		},

		changeModelValue: function( model ) {
			if ( 1 == model.get( 'show_other' ) ) {
				// model.set( 'reRender', true );
				model.trigger( 'reRender');
			}
		},

		renderOptions: function() {
			var html = '';
			if ( '' == this.value ) {
				var valueFound = true;
			} else {
				var valueFound = false;
			}
			
			_.each( this.options, function( option, index ) {
				if ( option.value == this.value ) {
					valueFound = true;
				}

				/*
                 * TODO: This is a bandaid fix for making sure that each option has a "visible" property.
                 * This should be moved to creation so that when an option is added, it has a visible property by default.
                 */
                if ( 'undefined' == typeof option.visible ) {
                    option.visible = true;
                }

                option.selected = false;
				option.fieldID = this.id;
				option.classes = this.classes;
				option.currentValue = this.value;
				option.index = index;

				/*
				 * If we haven't edited this field yet, use the default checked
				 */
				if ( this.clean && 1 == this.selected ) {
					option.selected = true;
				} else if ( this.value == option.value ) {
					option.selected = true;
				} else {
					option.selected = false;
				}

				var template = nfRadio.channel( 'app' ).request( 'get:template',  '#tmpl-nf-field-listradio-option' );

				html += template( option );
			}, this );

			if ( 1 == this.show_other ) {
				if ( 'nf-other' == this.value ) {
					valueFound = false;
				}
				var data = {
					fieldID: this.id,
					classes: this.classes,
					currentValue: this.value,
					renderOtherText: this.renderOtherText,
					valueFound: valueFound
				};
				var template = nfRadio.channel( 'app' ).request( 'get:template',  '#tmpl-nf-field-listradio-other' );
				html += template( data );
			}

			return html;
		},

		renderOtherText: function() {
			if ( 'nf-other' == this.currentValue || ! this.valueFound ) {
				if ( 'nf-other' == this.currentValue ) {
					this.currentValue = '';
				}
				var data = {
					fieldID: this.fieldID,
					classes: this.classes,
					currentValue: this.currentValue
				};
				var template = nfRadio.channel( 'app' ).request( 'get:template',  '#tmpl-nf-field-listradio-other-text' );
				return template( data );
			}
		},

		getCalcValue: function( fieldModel ) {
			var calc_value = 0;
			if ( 0 != fieldModel.get( 'options' ).length ) {
				/*
				 * Check to see if we have a selected value.
				 */
				var selected = _.find( fieldModel.get( 'options' ), function( opt ) { return fieldModel.get( 'value' ) == opt.value } );
				/*
				 * We don't have a selected value, so use our first option.
				 */
				if ( 'undefined' == typeof selected ) {
					selected = fieldModel.get( 'options' )[0];
				}

				var calc_value = selected.calc;
			}
			return calc_value;
		},

		updateCheckedClass: function( el, model ) {
			jQuery( '[name="' + jQuery( el ).attr( 'name' ) + '"]' ).removeClass( 'nf-checked' );
			jQuery( el ).closest( 'ul' ).find( 'label' ).removeClass( 'nf-checked-label' );
			jQuery( el ).addClass( 'nf-checked' );
			jQuery( el ).closest( 'li' ).find( 'label[for="' + jQuery( el ).prop( 'id' ) + '"]' ).addClass( 'nf-checked-label' );


		}

	});

	return controller;
} );