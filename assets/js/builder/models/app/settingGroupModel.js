/**
 * Model that represents our type settings groups.
 * 
 * @package Ninja Forms builder
 * @subpackage Fields
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [ 'models/app/settingCollection' ], function( SettingCollection ) {
	var model = Backbone.Model.extend( {
		defaults: {
			display: false
		},

		initialize: function( options ) {
			if ( false == this.get( 'settings' ) instanceof Backbone.Collection ) {
				this.set( 'settings', new SettingCollection( this.get( 'settings' ) ) );
			}
		}
	} );
	
	return model;
} );