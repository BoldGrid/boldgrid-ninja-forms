/**
 * Model that represents our form.
 * 
 * @package Ninja Forms client
 * @copyright (c) 2017 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var model = Backbone.Model.extend( {
		defaults: {
            objectType: 'form',
            id: 0,
            title: 'unknown',
            created_at: 'unknown'
		},

        url: function() {
            return ajaxurl + "?action=nf_forms&form_id=" + this.get( 'id' );
        },

		initialize: function() {

            this.set( 'id', Number( this.get( 'id' ) ) );
            
            if( this.get( 'id' ) ) {
                this.initShortcode( this.get( 'id' ) );
            }
        },
        
        initShortcode: function( id ) {
            var shortcode = '[ninja_form id=' + id + ']';
            this.set( 'shortcode', shortcode);
        }
        
	} );
	
	return model;
} );