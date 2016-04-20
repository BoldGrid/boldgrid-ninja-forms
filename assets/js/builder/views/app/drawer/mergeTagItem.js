/**
 * Single item view used for merge tags.
 *
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var view = Marionette.ItemView.extend({
		tagName: 'li',

		template: '#nf-tmpl-merge-tags-item',

		onBeforeDestroy: function() {
			this.model.off( 'change:active', this.render );
		},

		initialize: function() {
			this.model.on( 'change:active', this.render, this );
		},

		events: {
			'click a': 'clickTag'
		},

		clickTag: function( e ) {
			nfRadio.channel( 'mergeTags' ).trigger( 'click:mergeTag', e, this.model );
		},

		templateHelpers: function() {
			return {
				renderClasses: function() {
					if ( this.active ) {
						return 'active';
					}
				}				
			}
		}
	});

	return view;
} );