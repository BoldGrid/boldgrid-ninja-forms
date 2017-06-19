/**
 * Makes sure that calculations don't reference calculations with a lower order.
 *
 * For example, our first caclulation can't reference the second, but the second can reference the first.
 * 
 * @package Ninja Forms builder
 * @subpackage Advanced
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			/*
			 * When someone types in the "name" or "eq" portion of our calculation, we need to make sure
			 * that they haven't duplicated a name or made a bad EQ reference.
			 */
			this.listenTo( nfRadio.channel( 'option-repeater-calculations' ), 'keyup:option', this.keyUp );
			/*
			 * Same thing for when our calculation option is updated
			 */
			this.listenTo( nfRadio.channel( 'option-repeater-calculations' ), 'update:option', this.updateCalc );
			/*
			 * When we sort our calcluations, we need to make sure that we don't get any bad EQ
			 * references.
			 */
			this.listenTo( nfRadio.channel( 'option-repeater-calculations' ), 'sort:option', this.sortCalc );
		},

		keyUp: function( e, optionModel ) {
			// Get our current value
			var value = jQuery( e.target ).val();
			// Check to see if we're editing a name or eq
            var id = jQuery( e.target ).data( 'id' );
			if( 'name' == id ) { // We are editing the name field
				// Check to see if our name already exists.
				this.checkName( value, optionModel );
				this.checkEQ( optionModel.get( 'eq' ), optionModel );
			} else if( 'eq' == id ) { // We're editing the eq
				// Check to see if there are any calcs referenced in our eq
				this.checkEQ( value, optionModel );
			} else if( 'dec' == id ) { // We're editing the dec
                // Check to see that we have a non-negative integer
                this.checkDec( value, optionModel );
            }
		},

		updateCalc: function( optionModel ) {
			this.checkName( optionModel.get( 'name' ), optionModel, false );
			this.checkEQ( optionModel.get( 'eq' ), optionModel );
			this.checkDec( optionModel.get( 'dec' ), optionModel );
		},

		sortCalc: function( optionModel, setting ) {
			this.checkAllCalcs( setting.collection );
		},

		/**
		 * Check to see if a calc name exists.
		 * 
		 * @since  3.0
		 * @param  string 			name        calc name to check
		 * @param  backbone.model 	optionModel 
		 * @return void
		 */
		checkName: function( name, optionModel, silent ) {
			silent = silent || true;
			// Get our current errors, if any.
			var errors = optionModel.get( 'errors' );
			// Search our calc collection for our name
			var found = optionModel.collection.where( { name: jQuery.trim( name ) } );

			// If the name that was passed is the same as our current name, return false.
			if ( name == optionModel.get( 'name' ) ) {
				found = [];
			}

			// If our name exists, add an errors to the option model
			if ( 0 != found.length ) {
				errors.nameExists = 'Calculation names must be unique. Please enter another name.';
			} else {
				optionModel.set( 'name', name, { silent: silent } );
				delete errors.nameExists;
			}

			optionModel.set( 'errors', errors );
			optionModel.trigger( 'change:errors', optionModel );
		},

		/**
		 * Check to see if an eq contains a reference to a calc at a lower priority.
		 *
		 * @since  3.0
		 * @param  string 			eq          our equation
		 * @param  backbone.model 	optionModel
		 * @return void
		 */
		checkEQ: function( eq, optionModel ) {
			// Get any current errors on our optionModel
			var errors = optionModel.get( 'errors' );
			/*
			 * We're looking for two errors:
			 * - Calculations that are below the current one can't be processed.
			 * - Calculations can't refer to themselves.
			 */ 
			var errorSelfRef = false;
			var errorFutureCalc = false;
			// Regex that searches for {calc:key}
			var calcs = eq.match( new RegExp( /{calc:(.*?)}/g ) );
			/*
			 * Calcs will be an array like:
			 * ['{calc:test}'], ['{calc:another}']
			 * 
			 * If we have any calcs in the eq, loop through them and search for the errors.
			 */
			if ( calcs ) {
				var calculations = optionModel.collection;
				// Maps a function to each item in our calcs array.
				calcs = calcs.map( function( calc ) {
					// calc will be {calc:name}
					var name = calc.replace( '}', '' ).replace( '{calc:', '' );
					// Get our optionModel from our calculations collection.
					var targetCalc = calculations.findWhere( { name: name } );
					if ( name == optionModel.get( 'name' ) ) {
						// If we already have a calc with this name, set an error.
						errors.selfRef = 'A calculation can\'t reference itself!';
						errorSelfRef = true;
					} else if ( targetCalc && targetCalc.get( 'order' ) > optionModel.get( 'order' ) ) {
						// If the calc is after this one, set an error. 
						errorFutureCalc = true;
						errors.futureCalc = 'Can\'t reference a future calculation!';
					}
				} );
			}

			// If we didn't find any self ref errors, remove the key.
			if ( ! errorSelfRef ) {
				delete errors.selfRef;
			}

			// If we didn't find any future calc errors, remove the key.
			if ( ! errorFutureCalc ) {
				delete errors.futureCalc;
			}

			// Set errors and trigger our optionModel change.
			optionModel.set( 'errors', errors );
			optionModel.trigger( 'change:errors', optionModel );

		},

        /**
         * Ceck to see if a dec is an integer value.
         * 
         * @since 3.1
         * @param string            dec         our decimal value
         * @param backbone.model    optionModel
         * @return void
         */
        checkDec: function( dec, optionModel ) {
            // If dec isn't defined, bail...
            if( 'undefined' === typeof(dec) ) return false;
			// Get our current errors, if any.
			var errors = optionModel.get( 'errors' );
            /**
             * We're looking for one error:
             * - dec is not a non-negative integer.
             */
            var errorNonIntDec = false;
            
            // Get our target value and see if it matches what we got.
            var checked = Math.abs( parseInt( dec.trim() ) );
            if ( dec.trim() !== '' && checked.toString() !== dec.trim() ) {
                errorNonIntDec = true;
                errors.nonIntDec = 'Decimals must be a non-negative integer!';
            }
            
            // If our dec value is a non-negative integer.
            if ( ! errorNonIntDec ) {
                delete errors.nonIntDec;
            }
            
			// Set errors and trigger our optionModel change.
			optionModel.set( 'errors', errors );
			optionModel.trigger( 'change:errors', optionModel );
            
        },
        
		checkAllCalcs: function( collection ) {
			var that = this;
			collection.models.map( function( opt ) {
				that.checkName( opt.get( 'name' ), opt );
				that.checkEQ( opt.get( 'eq' ), opt );
                that.checkDec( opt.get( 'dec' ), opt );
			} );
		}

	});

	return controller;
} );