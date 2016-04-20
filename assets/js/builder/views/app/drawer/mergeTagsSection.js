/**
 * Merge tags popup section
 *
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['views/app/drawer/mergeTagItem'], function( mergeTagItemView ) {
	var view = Marionette.CompositeView.extend({
		tagName: 'div',
		childView: mergeTagItemView,
		template: '#nf-tmpl-merge-tags-section',

		initialize: function() {
			this.collection = this.model.get( 'tags' );
			this.model.on( 'change', this.render, this );
			if ( 'fields' == this.model.get( 'id' ) ) {
				// var fieldCollection = nfRadio.channel( 'fields' ).request( 'get:collection' );
				// fieldCollection.on( 'all', this.updateFields, this );
			}
		},

		onBeforeDestroy: function() {
			if ( 'fields' == this.model.get( 'id' ) ) {
				var fieldCollection = nfRadio.channel( 'fields' ).request( 'get:collection' );
				fieldCollection.off( 'all', this.updateFields, this );
			}
		},

		attachHtml: function( collectionView, childView ) {
			jQuery( collectionView.el ).find( '.merge-tags' ).append( childView.el );
		},

		updateFields: function() {
			var fieldCollection = nfRadio.channel( 'fields' ).request( 'get:collection' );
			this.model.set( 'tags', fieldCollection );
		}
	});

	return view;
} );