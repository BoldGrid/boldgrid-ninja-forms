/**
 * Model that represents our field type section on the add new field drawer.
 * 
 * @package Ninja Forms builder
 * @subpackage Fields
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var model = Backbone.Model.extend( {
		defaults: {
			classes: ''
		}
	} );
	
	return model;
} );