/**
 * Renders our builder header.
 *
 * This is a layout view and handles two regions:
 * app - menu/buttons
 * subapp - title, add new field, etc.
 *
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['views/app/header', 'views/app/subHeader', 'views/app/formTitle'], function( appHeaderView, appSubHeaderView, formTitleView ) {

	var view = Marionette.LayoutView.extend({
		tagName: "div",
		template: "#nf-tmpl-header",

		regions: {
			app: "#nf-app-header",
			formTitle: "#nf-app-form-title",
			appSub: "#nf-app-sub-header"
		},

		initialize: function() {
			this.listenTo( nfRadio.channel( 'app' ), 'change:currentDomain', this.changeSubHeader );
		},

		onShow: function() {
			this.app.show( new appHeaderView() );

			var formData = nfRadio.channel( 'app' ).request( 'get:formModel' );
			var formSettings = formData.get( 'settings' );
			this.formTitle.show( new formTitleView( { model: formSettings } ) );

			this.changeSubHeader();
		},

		changeSubHeader: function() {
			var currentDomain = nfRadio.channel( 'app' ).request( 'get:currentDomain' );
			var subHeaderView = currentDomain.get( 'getSubHeaderView' ).call( currentDomain );
			this.appSub.show( subHeaderView );
		}
	});

	return view;
} );