/**
 * Model for our repeater option.
 * 
 * @package Ninja App builder
 * @subpackage Fields
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var model = Backbone.Model.extend( {
		defaults: {
			errors: {},
		},

		initialize: function() {
			// When we add errors to the option row, run a function.
			this.on( 'change:errors', this.changeErrors, this );
		},

		/**
		 * When we change the errors on our model, check to see if we should add or remove 
		 * the error from the setting that this option is a part of.
		 *
		 * Adding an error to the setting model simply disables the drawer and other
		 * navigation. As long as we have one option with an error, it should be set to true.
		 * 
		 * @since  3.0
		 * @return void
		 */
		changeErrors: function( model ) {
			/*
			 * The errors attribute will be an object, so if we don't have any keys, it's empty.
			 * If we have an empty object, check to see if we can remove the error from our setting model.
			 */

			if ( 0 == _.size( model.get( 'errors' ) ) ) {
				/*
				 * Loop through our collection to see if we have any other errors.
				 */
				var errorsFound = false;
				_.each( model.collection.models, function( opt ) {
					if ( 0 != _.size( opt.get( 'errors' ) ) ) {
						errorsFound = true;
					}
				} );
				if ( ! errorsFound ) {
					model.collection.settingModel.set( 'error', false );
				}
			} else {
				/*
				 * We have errors, so make sure that the setting model has an error set.
				 */
				model.collection.settingModel.set( 'error', true );
			}
		}
	} );
	
	return model;
} );