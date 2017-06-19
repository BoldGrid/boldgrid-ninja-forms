/**
 * Renders our builder.
 *
 * This is a layout view and handles three regions:
 * gutterLeft - gutter to the left of our main content area
 * body - main content area
 * gutterRight - gutter to the right of our main content area
 *
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2016 WP Ninjas
 * @since 3.0
 */
define( [], function() {

	var view = Marionette.LayoutView.extend({
		tagName: 'div',
		template: '#tmpl-nf-main',
		className: 'nf-main-test',
		maybeDone: false,

		offsetRight: false,
		offsetLeft: false,

		regions: {
			gutterLeft: '#nf-main-gutter-left',
			body: '#nf-main-body',
			gutterRight: '#nf-main-gutter-right'
		},

		initialize: function() {
			this.listenTo( nfRadio.channel( 'app' ), 'change:currentDomain', this.render );
			nfRadio.channel( 'app' ).reply( 'get:mainEl', this.getMainEl, this );

			/*
			 * Make sure that our gutters resize to match our screen upon resize or drawer open/close.
			 */
			jQuery( window ).on( 'resize', { context: this }, this.resizeBothGutters );
			this.listenTo( nfRadio.channel( 'drawer' ), 'before:open', this.setBothGuttersAbsolute );
			this.listenTo( nfRadio.channel( 'drawer' ), 'opened', this.setBothGuttersFixed );
			this.listenTo( nfRadio.channel( 'drawer' ), 'before:close', this.setBothGuttersAbsolute );
			this.listenTo( nfRadio.channel( 'drawer' ), 'closed', this.setBothGuttersFixed );

			/*
			 * Reply to messages requesting that we resize our gutters.
			 */
			nfRadio.channel( 'app' ).reply( 'update:gutters', this.updateGutters, this );
		},

		onShow: function() {
			nfRadio.channel( 'main' ).trigger( 'show:main', this );
		},

		onRender: function() {
			var currentDomain = nfRadio.channel( 'app' ).request( 'get:currentDomain' );
			var bodyView = currentDomain.get( 'getMainContentView' ).call( currentDomain );
			this.body.show( bodyView );

			var gutterLeftView = currentDomain.get( 'getGutterLeftView' ).call( currentDomain );
			this.gutterLeft.show( gutterLeftView );

			var gutterRightView = currentDomain.get( 'getGutterRightView' ).call( currentDomain );
			this.gutterRight.show( gutterRightView );
			
			nfRadio.channel( 'main' ).trigger( 'render:main' );
		},

		getMainEl: function() {
			return jQuery( this.el ).parent();
		},

		onAttach: function() {
			this.initialGutterResize();
		},

		onBeforeDestroy: function() {
			jQuery( window ).off( 'resize', this.resize );
		},

		initialGutterResize: function() {
			this.resizeGutter( this.gutterLeft.el );
			this.resizeGutter( this.gutterRight.el );
			this.setBothGuttersFixed( this );
		},

		resizeBothGutters: function( e ) {
			var context = ( e ) ? e.data.context : this;

			var leftEl = context.gutterLeft.el;
			var rightEl = context.gutterRight.el;
			
			context.resizeGutter( leftEl, context );
			context.resizeGutter( rightEl, context );

			context.setBothGuttersAbsolute( context );

			/*
			 * Clear our timeout. If the timeout runs, it means we've stopped resizing.
			 */	
			clearTimeout( context.maybeDone );
			/*
			 * Add our timeout.
			 */
			context.maybeDone = setTimeout( context.setBothGuttersFixed, 100, context );
		},

		resizeGutter: function( el, context ) {
			var top = jQuery( el ).offset().top;
			var viewHeight = jQuery( window ).height();
			var height = viewHeight - top;
			jQuery( el ).height( height );
		},

		setBothGuttersFixed: function( context ) {
			context = context || this;

			var offsetLeft = jQuery( context.gutterLeft.el ).offset();
			var topLeft = offsetLeft.top;
			var leftLeft = offsetLeft.left;

			jQuery( context.gutterLeft.el ).css( { position: 'fixed', left: leftLeft, top: topLeft } );			var offsetLeft = jQuery( context.gutterLeft.el ).offset();
			
			var offsetRight = jQuery( context.gutterRight.el ).offset();
			var topRight = offsetRight.top;
			var leftRight = offsetRight.left;

			jQuery( context.gutterRight.el ).css( { position: 'fixed', left: leftRight, top: topRight } );
		},

		setBothGuttersAbsolute: function( context ) {
			context = context || this;

			var offsetLeft = jQuery( context.gutterLeft.el ).offset();
			var offsetRight = jQuery( context.gutterRight.el ).offset();

			var scrollTop = jQuery( '#nf-main' ).scrollTop();

			jQuery( context.gutterLeft.el ).css( { position: 'absolute', left: 0, top: scrollTop } );
			jQuery( context.gutterRight.el ).css( { position: 'absolute', top: scrollTop, right: 0, left: 'auto' } );
		},

		updateGutters: function() {
			this.resizeBothGutters();
		}

	});

	return view;
} );