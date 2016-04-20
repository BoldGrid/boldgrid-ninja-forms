/**
 * Renders an application menu item from a domain model.
 *
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var view = Marionette.ItemView.extend({
		tagName: 'div',
		template: '#nf-tmpl-item-controls',

		initialize: function() {
			// Listen for domain changes and re-render when we detect one.
			// this.listenTo( nfRadio.channel( 'app' ), 'change:currentDomain', this.render );
		},

		/**
		 * When we render this view, remove the extra <div> tag created by backbone.
		 * 
		 * @since  3.0
		 * @return void
		 */
		onRender: function() {
			// this.$el = this.$el.children();
			// this.$el.unwrap();
			// this.setElement( this.$el );
			// 
			this.currentDomain = nfRadio.channel( 'app' ).request( 'get:currentDomain' );
		},

		events: {
			'click .nf-edit-settings': 'clickEdit',
			'singletap .nf-edit-settings': 'singleTapEdit',
			'click .nf-delete': 'clickDelete',
			'click .nf-duplicate': 'clickDuplicateField'
		},

		clickEdit: function( e ) {
			if ( ! nfRadio.channel( 'app' ).request( 'is:mobile' ) ) {
				nfRadio.channel( 'app' ).trigger( 'click:edit', e, this.model );
			}
		},

		singleTapEdit: function( e ) {
			nfRadio.channel( 'app' ).trigger( 'click:edit', e, this.model );
		},

		clickDelete: function( e ) {
			nfRadio.channel( 'app' ).trigger( 'click:delete', e, this.model );
		},

		clickDuplicateField: function( e ) {
			nfRadio.channel( 'app' ).trigger( 'click:duplicate', e, this.model );
		}
	});

	return view;
} );