/**
 * Merge tags popup
 *
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['views/app/drawer/mergeTagsSection', 'models/app/mergeTagCollection'], function( mergeTagsSectionView, MergeTagCollection ) {
	var view = Marionette.CollectionView.extend({
		tagName: 'div',
		template: '#nf-tmpl-merge-tags-content',
		childView: mergeTagsSectionView,

		initialize: function() {
			nfRadio.channel( 'mergeTags' ).reply( 'get:view', this.getMergeTagsView, this );
		},

		reRender: function( settingModel ) {
			var mergeTagCollection = nfRadio.channel( 'mergeTags' ).request( 'get:collection' );
			var defaultGroups = mergeTagCollection.where( { default_group: true } );
			this.collection = new MergeTagCollection( defaultGroups );
			var that = this;
			var useMergeTags = settingModel.get( 'use_merge_tags' );
			if ( 'object' == typeof useMergeTags ) {
				if ( 'undefined' != typeof useMergeTags.exclude ) {
					_.each( useMergeTags.exclude, function( exclude ) {
						that.collection.remove( exclude );
					} );
				}

				if ( 'undefined' != typeof useMergeTags.include ) {
					_.each( mergeTagCollection.models, function( sectionModel ) {
						if ( -1 != useMergeTags.include.indexOf( sectionModel.get( 'id' ) ) ) {
							// console.log( sectionModel );
							that.collection.add( sectionModel );
						}
					} );
				}
			}

			this.render();
		},

		getMergeTagsView: function() {
			return this;
		}
	});

	return view;
} );