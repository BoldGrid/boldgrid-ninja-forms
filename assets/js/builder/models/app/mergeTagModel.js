/**
 * Model that represents our merge tags.
 * 
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var model = Backbone.Model.extend( {
		defaults: {
			active: false,
			exclude: false
		}
	} );
	
	return model;
} );