/**
 * Model for our app data.
 * Listens for changes to the 'clean' attribute and triggers a radio message when the state changes.
 * 
 * @package Ninja Forms builder
 * @subpackage Fields
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var model = Backbone.Model.extend( {
		defaults: {
			loading: false
		},

		initialize: function() {
			// Listen to changes to our 'clean' attribute.
			this.on( 'change:clean', this.changeStatus, this );
		},

		changeStatus: function() {
			// Send out a radio message when the 'clean' attribute changes.
			nfRadio.channel( 'app' ).trigger( 'change:clean', this.get( 'clean' ) );
		}
	} );
	
	return model;
} );