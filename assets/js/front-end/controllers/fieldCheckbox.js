define([], function() {
	var radioChannel = nfRadio.channel( 'checkbox' );

	var controller = Marionette.Object.extend( {
		initialize: function() {
			radioChannel.reply( 'validate:required', this.validateRequired );
            nfRadio.channel( 'checkbox' ).reply( 'before:updateField', this.beforeUpdateField, this );
            nfRadio.channel( 'checkbox' ).reply( 'get:calcValue', this.getCalcValue, this );
		},

		beforeUpdateField: function( el, model ) {
			var checked = jQuery( el ).attr( 'checked' );
			if ( checked ) {
				var value = 1;
			} else {
				var value = 0;
			}

			return value;
		},

		validateRequired: function( el, model ) {
			return el[0].checked;
		},

		getCalcValue: function( fieldModel ) {
			if ( 1 == fieldModel.get( 'value' ) ) {
				calcValue = fieldModel.get( 'checked_calc_value' );
			} else {
				calcValue = fieldModel.get( 'unchecked_calc_value' );
			}

			return calcValue;
		}
	});

	return controller;
} );