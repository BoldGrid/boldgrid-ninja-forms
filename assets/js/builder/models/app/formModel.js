/**
 * Model that represents our form data.
 * 
 * @package Ninja Forms builder
 * @subpackage Fields
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var model = Backbone.Model.extend( {
		initialize: function() {
			if ( ! jQuery.isNumeric( this.get( 'id' ) ) ) {
				this.set( 'show_publish_options', true, { silent: true } );
			} else {
				this.set( 'show_publish_options', false, { silent: true } );
			}
		}
	} );
	
	return model;
} );