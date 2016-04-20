/**
 * Controller responsible for keeping up with calculations.
 */
define(['models/calcCollection'], function( CalcCollection ) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			this.calcs = {};
			this.displayFields = {};
			// When our form initialises, check to see if there are any calculations that need to be tracked.
			this.listenTo( nfRadio.channel( 'form' ), 'loaded', this.registerCalcs );

			// When a calc model is initialised, run a setup function.
			// this.listenTo( nfRadio.channel( 'calc' ), 'init:model', this.setupCalc );

			// When a field referenced by a calc model changes, update our calc.
			this.listenTo( nfRadio.channel( 'calc' ), 'change:field', this.changeField );

			// When a calculation referenced by a calc model changes, update our calc.
			this.listenTo( nfRadio.channel( 'calc' ), 'change:calc', this.changeCalc );

			/*
			 * Listen to our field model init for fields that want to display calc values.
			 * If that field has a calc merge tag, replace it with the default calc value.
			 */
			var that = this;
			_.each( nfFrontEnd.use_merge_tags.calculations, function( fieldType ) {
				that.listenTo( nfRadio.channel( 'fields-' + fieldType ), 'init:model', that.initDisplayField );
			} );
			
			// When we change our calc value, update any display fields.
			this.listenTo( nfRadio.channel( 'calc' ), 'change:value', this.updateDisplayFields );

			// Set an init variable so that we only call reRender on the display field on change, not on init.
			this.init = {};
		},

		/**
		 * When our form loads, create a collection out of any calculations.
		 * 
		 * @since  3.0
		 * @param  backbone.model formModel
		 * @return void
		 */
		registerCalcs: function( formModel ) {
			var calcCollection = new CalcCollection( formModel.get( 'settings' ).calculations, { formModel: formModel } );
			this.calcs[ formModel.get( 'id' ) ] = calcCollection;
			var that = this;

			_.each( calcCollection.models, function( calcModel ) {
				/*
				 * We set a property on our init variable for the calc model we're looping over.
				 * This property is set to true so that when we make changes to the calc model on the next line
				 * the field view doesn't try to redraw itself.
				 * If we don't do this, the 'reRender' attribute of the model will be set before the view is initialized,
				 * which means that setting 'reRender' to true will never re-render the view.
				 */
				that.init[ calcModel.get( 'name' ) ] = true;
				// Setup our calculation models with initial values and register listeners for calc-related fields.
				that.setupCalc( calcModel );
			} );
		},

		/**
		 * When a calculation model is instantiated from the registerCalcs function:
		 *
		 * Use a regex to get an array of the field keys
		 * Setup an initial key/values array
		 * Check for any references to other calculations
		 * Set the initial value of our calculation
		 * 
		 * @since  3.0
		 * @param  backbone.model calcModel
		 * @return void
		 */
		setupCalc: function( calcModel ) {
			// Setup our that var so we can access 'this' context in our loop.
			var that = this;
			// Get our equation
			var eq = calcModel.get( 'eq' );
			// We want to keep our original eq intact, so we use a different var for string replacment.
			var eqValues = eq;

			/* TODO:
			 * It might be possible to refactor these two if statements.
			 * The difficulty is that each has a different method of retreiving the specific data model.
			 */
			// Check to see if we have any field merge tags in our equation.
			var fields = eq.match( new RegExp( /{field:(.*?)}/g ) );
			if ( fields ) {
				/*
				 * fields is now an array of field keys that looks like:
				 * ['{field:key'], ['{field:key'], etc.
				 *
				 * We need to run a function with each of our field keys to setup our field key array and hook up our field change listner.
				 */
				
				fields = fields.map( function( field ) {
					// field will be {field:key}
					var key = field.replace( '}', '' ).replace( '{field:', '' );
					// Get our field model
					fieldModel = nfRadio.channel( 'form-' + calcModel.get( 'formID' ) ).request( 'get:fieldByKey', key );

					if( 'undefined' == typeof fieldModel ) return;

					fieldModel.on( 'change:value', calcModel.changeField, calcModel );
					// Get our calc value from our field model.
					var calcValue = that.getCalcValue( fieldModel );
					// Add this field to our internal key/value object.
					that.updateCalcFields( calcModel, key, calcValue );
					// Update the string tracking our merged eq with the calc value.
					eqValues = that.replaceKey( 'field', key, calcValue, eqValues );
				} );
			}

			// Check to see if we have any calc merge tags in our equation.
			var calcs = eq.match( new RegExp( /{calc:(.*?)}/g ) );
			if ( calcs ) {
				/*
				 * calcs is now an array of calc keys that looks like:
				 * ['{calc:key'], ['{calc:key'], etc.
				 *
				 * We need to run a function with each of our calc keys to setup our calc key array and hook up our calc change listner.
				 */
				
				calcs = calcs.map( function( calc ) {
					// calc will be {calc:name}
					var name = calc.replace( '}', '' ).replace( '{calc:', '' );
					// Get our calc model
					var targetCalcModel = calcModel.collection.findWhere( { name: name } );
					// Listen for changes on our calcluation, since we need to update our calc when it changes.
					targetCalcModel.on( 'change:value', calcModel.changeCalc, calcModel );
					// // Get our calc value from our calc model.
					var calcValue = targetCalcModel.get( 'value' );
					// Update the string tracking our merged eq with the calc value.
					eqValues = that.replaceKey( 'calc', name, calcValue, eqValues );
				} );

			}

			// Evaluate the equation and update the value of this model.
			try {
				calcModel.set('value', math.eval(eqValues));
			} catch( e ) {
				console.log( e );
			}

			// Debugging console statement.
			// console.log( eqValues + ' = ' + calcModel.get( 'value' ) );
		},

		/**
		 * Update an item in our key/value pair that represents our fields and calc values.
		 * 
		 * @since  3.0
		 * @param  backbone.model 	calcModel
		 * @param  string 			key
		 * @param  string 			calcValue
		 * @return void
		 */
		updateCalcFields: function( calcModel, key, calcValue ) {
			var fields = calcModel.get( 'fields' );
			fields[ key ] = calcValue;
			calcModel.set( 'fields', fields );
		},

		/**
		 * Get a calc value from a field model.
		 *
		 * Sends a request to see if there's a special calc value
		 * Uses the value of the field if there is not.
		 * 
		 * @since  3.0
		 * @param  backbone.model fieldModel
		 * @return value
		 */
		getCalcValue: function( fieldModel ) {
			/*
			 * Send out a request on the field type and parent type channel asking if they need to modify the calc value.
			 * This is helpful for fields like lists that can have a different calc_value than selected value.
			 */
			var value = nfRadio.channel( fieldModel.get( 'type' ) ).request( 'get:calcValue', fieldModel );

			// If value is 'undefined', then we got no response. Set value to field model value.
			if ( 'undefined' == typeof value ) {
				if ( jQuery.isNumeric( fieldModel.get( 'value' ) ) ) {
					value = fieldModel.get( 'value' );
				} else {
					value = 0;
				}
			}

			return ( jQuery.isNumeric( value ) ) ? value : 0;
		},

		/**
		 * Replace instances of key with calcValue. This is used to replace one key at a time.
		 *
		 * If no eq is passed, use calcModel eq.
		 *
		 * Returns a string with instances of key replaced with calcValue.
		 * 
		 * @since  version
		 * @param  string 	key       
		 * @param  string 	calcValue 
		 * @param  string 	eq        
		 * @return string 	eq      
		 */
		replaceKey: function( type, key, calcValue, eq ) {
			eq = eq || calcModel.get( 'eq' );
			key = '{' + type + ':' + key + '}';
			var re = new RegExp( key, 'g' );
			return eq.replace( re, calcValue );
		},

		/**
		 * Takes a calcModel and returns a string eq with all keys replaced by their appropriate calcValues.
		 * 
		 * @since  3.0
		 * @param  backbone.model 	calcModel
		 * @return string			eq
		 */
		replaceAllKeys: function( calcModel ) {
			var eq = calcModel.get( 'eq' );
			var that = this;
			_.each( calcModel.get( 'fields' ), function( value, key ) {
				eq = that.replaceKey( 'field', key, value, eq );
			} );

			// If we have any calc merge tags, replace those as well.
			var calcs = eq.match( new RegExp( /{calc:(.*?)}/g ) );
			if ( calcs ) {
				_.each( calcs, function( calc ) {
					// calc will be {calc:key}
					var name = calc.replace( '}', '' ).replace( '{calc:', '' );
					var targetCalcModel = calcModel.collection.findWhere( { name: name } );
					var re = new RegExp( calc, 'g' );
					eq = eq.replace( re, targetCalcModel.get( 'value' ) );
				} );
			}

			return eq;
		},

		/**
		 * Function that's called when a field within the calculation changes.
		 * 
		 * @since  3.0
		 * @param  backbone.model calcModel
		 * @param  backbone.model fieldModel
		 * @return void
		 */
		changeField: function( calcModel, fieldModel ) {
			var key = fieldModel.get( 'key' );
			var value = this.getCalcValue( fieldModel );
			this.updateCalcFields( calcModel, key, value );
			var eqValues = this.replaceAllKeys( calcModel );
			calcModel.set( 'value', math.eval( eqValues ) );

			// Debugging console statement.
			// console.log( eqValues + ' = ' + calcModel.get( 'value' ) );		
		},

		initDisplayField: function( fieldModel ) {

			if( ! fieldModel.get( 'default' ) ) return;

			var calcs = fieldModel.get( 'default' ).match( new RegExp( /{calc:(.*?)}/g ) );
			if ( calcs ) {
				var that = this;
				_.each( calcs, function( calcName ) {
					calcName = calcName.replace( '{calc:', '' ).replace( '}', '' );
					that.displayFields[ calcName ] = that.displayFields[ calcName ] || [];
					that.displayFields[ calcName ].push( fieldModel );
				} );
			}
		},

		updateDisplayFields: function( calcModel ) {
			var that = this;
			if ( 'undefined' != typeof this.displayFields[ calcModel.get( 'name' ) ] ) {
				_.each( this.displayFields[ calcModel.get( 'name' ) ], function( fieldModel ) {
					var value = fieldModel.get( 'default' );
					var calcs = value.match( new RegExp( /{calc:(.*?)}/g ) );
					_.each( calcs, function( calc ) {
						// calc will be {calc:key}
						var name = calc.replace( '}', '' ).replace( '{calc:', '' );
						var calcModel = that.calcs[ fieldModel.get( 'formID' ) ].findWhere( { name: name } );
						var re = new RegExp( calc, 'g' );
						value = value.replace( re, calcModel.get( 'value' ) );
					} );
					fieldModel.set( 'value', value );
					if ( ! that.init[ calcModel.get( 'name' ) ] ) {
						fieldModel.set( 'reRender', true );
					}
					that.init[ calcModel.get( 'name' ) ] = false;
				} );
			}
		},

		getCalc: function( name, formID ) {
			return this.calcs[ formID ].findWhere( { name: name } );
		},

		changeCalc: function( calcModel, targetCalcModel ) {
			var eqValues = this.replaceAllKeys( calcModel );
			calcModel.set( 'value', math.eval( eqValues ) );
		}
	});

	return controller;
} );