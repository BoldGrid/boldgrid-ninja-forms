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
			if( 'name' == jQuery( e.target ).data( 'id' ) ) { // We are editing the name field
				// Check to see if our name already exists.
				this.checkName( value, optionModel );
				this.checkEQ( optionModel.get( 'eq' ), optionModel );
			} else { // We're editing the eq
				// Check to see if there are any calcs referenced in our eq
				this.checkEQ( value, optionModel );
			}
		},

		updateCalc: function( optionModel ) {
			this.checkName( optionModel.get( 'name' ), optionModel );
			this.checkEQ( optionModel.get( 'eq' ), optionModel );
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
		checkName: function( name, optionModel ) {
			optionModel.set( 'name', name );
			// Get our current errors, if any.
			var errors = optionModel.get( 'errors' );
			// Search our calc collection for our name
			var found = optionModel.collection.where( { name: name } );

			// If the name that was passed is the same as our current name, return false.
			if ( name == optionModel.get( 'name' ) ) {
				found = [];
			}

			// If our name exists, add an errors to the option model
			if ( 0 != found.length ) {
				errors.nameExists = 'Calculation names must be unique. Please enter another name.';
			} else {
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

		checkAllCalcs: function( collection ) {
			var that = this;
			collection.models.map( function( opt ) {
				that.checkName( opt.get( 'name' ), opt );
				that.checkEQ( opt.get( 'eq' ), opt );
			} );
		}

	});

	return controller;
} );