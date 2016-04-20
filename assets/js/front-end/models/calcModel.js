/**
 * Model that represents a calculation.
 *
 * On init, we trigger a radio message so that controllers can do things when a calc model inits.
 */
define( [], function() {
	var model = Backbone.Model.extend( {
		initialize: function() {
			// Set our form id
			this.set( 'formID', this.collection.options.formModel.get( 'id' ) );
			// Set our initial fields object to empty. This will hold our key/value pairs.
			this.set( 'fields', {} );
			// Trigger a radio message to let controllers know we've inited this model.
			nfRadio.channel( 'calc' ).trigger( 'init:model', this );
			// When we change the value of this calculation, send out a radio message
			this.on( 'change:value', this.changeValue, this );
		},

		/**
		 * Trigger a radio message when a field present in our calculation changes
		 *
		 * The listener that triggers/calls this function is in controllers/calculations
		 * 
		 * @since  3.0
		 * @return void
		 */
		changeField: function( fieldModel ) {
			nfRadio.channel( 'calc' ).trigger( 'change:field', this, fieldModel );
		},

		changeCalc: function( targetCalcModel ) {
			nfRadio.channel( 'calc' ).trigger( 'change:calc', this, targetCalcModel );
		},

		changeValue: function() {
			nfRadio.channel( 'calc' ).trigger( 'change:value', this );
		}
	} );

	return model;
} );
