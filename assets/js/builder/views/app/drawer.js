/**
 * Renders our drawer region
 *
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['views/app/drawer/contentEmpty'], function( drawerEmptyView ) {

	var view = Marionette.LayoutView.extend( {
		template: '#nf-tmpl-drawer',

		regions: {
			header: '#nf-drawer-header',
			content: '#nf-drawer-content',
			footer: '#nf-drawer-footer'
		},

		initialize: function() {
			nfRadio.channel( 'app' ).reply( 'get:drawerEl', this.getEl, this );
			nfRadio.channel( 'drawer' ).reply( 'load:drawerContent', this.loadContent, this );
			nfRadio.channel( 'drawer' ).reply( 'empty:drawerContent', this.emptyContent, this );
		},

		onShow: function() {
			if ( ! nfRadio.channel( 'app' ).request( 'is:mobile' ) ) {
				jQuery( this.el ).parent().perfectScrollbar();
			}
		    // jQuery( this.el ).parent().disableSelection();
		},

		loadContent: function( drawerID, data ) {
			var drawer = nfRadio.channel( 'app' ).request( 'get:drawer', drawerID );
			var contentView = drawer.get( 'getContentView' ).call( drawer, data );
			var headerView = drawer.get( 'getHeaderView' ).call( drawer, data );
			var footerView = drawer.get( 'getFooterView' ).call( drawer, data );

			this.header.show( headerView );
			this.content.show( contentView );
			this.footer.show( footerView );

		},

		emptyContent: function() {
			this.header.empty();
			this.content.empty();
			this.footer.empty();
		},

		getEl: function() {
			return jQuery( this.el ).parent();
		},

		events: {
			'click .nf-toggle-drawer': 'clickToggleDrawer'
		},

		clickToggleDrawer: function() {
			nfRadio.channel( 'app' ).trigger( 'click:toggleDrawerSize' );
		}

	} );

	return view;
} );
