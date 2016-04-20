define( [], function() {

	var view = Marionette.LayoutView.extend({
		tagName: 'div',
		template: '#nf-tmpl-main',

		regions: {
			header: '#nf-main-header',
			content: '#nf-main-content'
		},

		initialize: function() {
			this.listenTo( nfRadio.channel( 'app' ), 'change:currentDomain', this.render );
			nfRadio.channel( 'app' ).reply( 'get:mainEl', this.getMainEl, this );
			
			// this.listenTo( nfRadio.channel( 'app' ), 'cancel:changes', this.render );
		},

		onShow: function() {
			if ( ! nfRadio.channel( 'app' ).request( 'is:mobile' ) ) {
				jQuery( this.el ).parent().perfectScrollbar();
				jQuery( this.el ).parent().disableSelection();
			}
			nfRadio.channel( 'main' ).trigger( 'show:main' );
		},

		onRender: function() {
			var currentDomain = nfRadio.channel( 'app' ).request( 'get:currentDomain' );
			// var headerView = currentDomain.get( 'getMainHeaderView' ).call( currentDomain );
			// this.header.show( headerView );
			var contentView = currentDomain.get( 'getMainContentView' ).call( currentDomain );
			this.content.show( contentView );

			nfRadio.channel( 'main' ).trigger( 'render:main' );
		},

		getMainEl: function() {
			return jQuery( this.el ).parent();
		}

	});

	return view;
} );