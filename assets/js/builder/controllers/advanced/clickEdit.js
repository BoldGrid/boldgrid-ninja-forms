/**
 * Listens for clicks on our form settings sections.
 * 
 * @package Ninja Forms builder
 * @subpackage Advanced
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['models/advanced/settingsModel'], function( settingsModel ) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			this.listenTo( nfRadio.channel( 'settings' ), 'click:edit', this.clickEdit );
		},

		clickEdit: function( e, typeModel ) {
			var model = nfRadio.channel( 'settings' ).request( 'get:settings' );
			nfRadio.channel( 'app' ).request( 'open:drawer', 'editSettings', { model: model, groupCollection: typeModel.get( 'settingGroups' ) } );
			var preventClose = nfRadio.channel( 'drawer' ).request( 'get:preventClose' );
			if ( ! preventClose ) {
				typeModel.set( 'editActive', true );
			}
		}
	});

	return controller;
} );