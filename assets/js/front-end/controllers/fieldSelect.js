define([], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			this.listenTo( nfRadio.channel( 'listselect' ), 'init:model', this.register );
			this.listenTo( nfRadio.channel( 'liststate' ), 'init:model', this.register );
			this.listenTo( nfRadio.channel( 'listcountry' ), 'init:model', this.register );
			this.listenTo( nfRadio.channel( 'listmultiselect' ), 'init:model', this.register );
			nfRadio.channel( 'listselect' ).reply( 'get:calcValue', this.getCalcValue, this );
			nfRadio.channel( 'listmultiselect' ).reply( 'get:calcValue', this.getCalcValue, this );
		},

		register: function( model ) {
			model.set( 'renderOptions', this.renderOptions );
			model.set( 'renderOtherAttributes', this.renderOtherAttributes );
			/*
			 * When we init a model, we need to set our 'value' to the selected option's value.
			 * This is the list equivalent of a 'default value'.
			 */ 
			if ( 0 != model.get( 'options' ).length ) {
				/*
				 * Check to see if this is a multi-select list.
				 */
				if ( 'listmultiselect' == model.get( 'type' ) ) {
					/*
					 * We're using a multi-select, so we need to check out any selected options and add them together.
					 */
					var selected = _.filter( model.get( 'options' ), function( opt ) { return 1 == opt.selected } );
					selected = _.map( selected, function( opt ) { return opt.value } );
					var value = selected;
				} else {
					/*
					 * Check to see if we have a selected value.
					 */
					var selected = _.find( model.get( 'options' ), function( opt ) { return 1 == opt.selected } );
					/*
					 * We don't have a selected value, so use our first option.
					 */
					if ( 'undefined' == typeof selected ) {
						selected = model.get( 'options' )[0];
					}
					var value = selected.value;
				}

				model.set( 'value', value );
			}
		},

		renderOptions: function() {
			var that = this;
			var html = '';
			_.each( this.options, function( option ) {
				if ( 1 == option.selected ) {
					var selected = true;
				} else {
					var selected = false;
				}

				option.selected = selected;
				option.fieldID = that.id;
				option.classes = that.classes;
				option.currentValue = that.value;
				
				var template = _.template( jQuery( '#nf-tmpl-field-listselect-option' ).html() );
				html += template( option );
			} );

			return html;
		},

		renderOtherAttributes: function() {
			var otherAttributes = '';

			if( 'listmultiselect' == this.type ){
				otherAttributes = otherAttributes + ' multiple';
			}

			return otherAttributes;
		},

		getCalcValue: function( fieldModel ) {
			var calc_value = 0;
			var options = fieldModel.get( 'options' );
			if ( 0 != options.length ) {
				/*
				 * Check to see if this is a multi-select list.
				 */
				if ( 'listmultiselect' == fieldModel.get( 'type' ) ) {
					/*
					 * We're using a multi-select, so we need to check out any selected options and add them together.
					 */
					_.each( fieldModel.get( 'value' ), function( val ) {
						var tmp_opt = _.find( options, function( opt ) { return opt.value == val } );
						calc_value = math.add( calc_value, tmp_opt.calc );
					} );
				} else {
					/*
					 * We are using a single select, so our selected option is in the 'value' attribute.
					 */
					var selected = _.find( options, function( opt ) { return fieldModel.get( 'value' ) == opt.value } );
					/*
					 * We don't have a selected value, so use our first option.
					 */
					if ( 'undefined' == typeof selected ) {
						selected = fieldModel.get( 'options' )[0];
					}		
					calc_value  = selected.calc;			
				}
			}
			return calc_value;
		}

	});

	return controller;
} );