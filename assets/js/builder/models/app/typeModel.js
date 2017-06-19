/**
 * Model for our field type
 * 
 * @package Ninja Forms builder
 * @subpackage Fields
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [ 'models/app/settingGroupCollection' ], function( SettingGroupCollection ) {
	var model = Backbone.Model.extend( {
		initialize: function() {
			if ( false === this.get( 'settingGroups' ) instanceof Backbone.Collection ) {
				this.set( 'settingGroups', new SettingGroupCollection( this.get( 'settingGroups' ) ) );
			}
			
			nfRadio.channel( 'fields' ).trigger( 'init:typeModel', this );
		}
	} );
	
	return model;
} );