/**
 * Builder view.
 *
 * This layout view has regions that represent our application areas:
 * header
 * main
 * menuDrawer - Mobile side-menu
 * drawer
 *
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['views/app/builderHeader', 'views/app/main', 'views/app/mobileMenu', 'views/app/drawer', 'views/app/drawer/mergeTagsContent'], function( headerView, mainView, mobileMenuView, drawerView, mergeTagsContentView ) {
	var view = Marionette.LayoutView.extend( {
		template: "#tmpl-nf-builder",
		el: '#nf-builder',

		regions: {
			header: "#nf-header",
			main: "#nf-main",
			menuDrawer: "#nf-menu-drawer",
			drawer: "#nf-drawer",
			mergeTagsContent: '.merge-tags-content'
		},

		initialize: function() {
			// Respond to requests asking for the builder dom element.
			nfRadio.channel( 'app' ).reply( 'get:builderEl', this.getBuilderEl, this );
			// Respond to requests asking for the builder view
			nfRadio.channel( 'app' ).reply( 'get:builderView', this.getBuilderView, this );
			// Layout views aren't self-rendering.
			this.render();
			var mergeTags = nfRadio.channel( 'mergeTags' ).request( 'get:collection' );
			var mergeTagsClone = mergeTags.clone();
			this.mergeTagsContent.show( new mergeTagsContentView( { collection: mergeTagsClone } ) );
			// Show our header.
			this.header.show( new headerView() );
			// Show our main content.
			this.main.show( new mainView() );
			// Show our mobile menu
			var appDomainCollection = nfRadio.channel( 'app' ).request( 'get:domainCollection' );
			this.menuDrawer.show( new mobileMenuView( { collection: appDomainCollection } ) );
			// Show our drawer.
			this.drawer.show( new drawerView() );


		},

		onRender: function() {

		},

		getBuilderEl: function() {
			return this.el;
		},

		getBuilderView: function() {
			return this;
		},

		// Listen for clicks
		events: {
			'click .nf-open-drawer': 'openDrawer',
			'click .nf-change-domain': 'changeDomain',
			'click .nf-close-drawer': 'closeDrawer'
		},

		/**
		 * Someone clicked to open a drawer, so fire a radio event.
		 * This lets us separate the logic from the click event and view.
		 *
		 * @since  3.0
		 * @param  Object 	e 	event
		 * @return void
		 */
		openDrawer: function( e ) {
			nfRadio.channel( 'app' ).trigger( 'click:openDrawer', e );
		},
		/**
		 * Someone clicked to close a drawer, so fire a radio event.
		 * This lets us separate the logic from the click event and view.
		 *
		 * @since  3.0
		 * @return void
		 */
		closeDrawer: function() {
			nfRadio.channel( 'app' ).trigger( 'click:closeDrawer' );
		},
		/**
		 * Someone clicked to change the domain, so fire a radio event.
		 * This lets us separate the logic from the click event and view.
		 *
		 * @since  3.0
		 * @param  Object 	e 	event
		 * @return void
		 */
		changeDomain: function( e ) {
			nfRadio.channel( 'app' ).trigger( 'click:menu', e );
		}

	} );

	return view;
} );
