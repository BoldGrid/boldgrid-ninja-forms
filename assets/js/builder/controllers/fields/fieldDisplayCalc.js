/**
 * Listens to our app channel for settings views being rendered.
 *
 * If we're rendering a product_assignment setting, add our products to the data model.
 * 
 * @package Ninja Forms builder
 * @subpackage Main App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			// Listen for messages that are fired before a setting view is rendered.
			this.listenTo( nfRadio.channel( 'setting-calc_var' ), 'before:renderSetting', this.beforeRenderSetting );
		},

		beforeRenderSetting: function( settingModel, dataModel, view ) {
			// console.log( 'render!' );
		},

		getProductFields: function( settingModel ) {
			var productFields = [ settingModel.get( 'select_product' ) ];
			// Update our dataModel with all of our product fields.
			var fields = nfRadio.channel( 'fields' ).request( 'get:collection' );
			_.each( fields.models, function( field ) {
				if ( 'product' == field.get( 'type' ) ) {
					productFields.push( { label: field.get( 'label' ), value: field.get( 'id' ) } );
				}
			} );
			return productFields;
		}

	});

	return controller;
} );