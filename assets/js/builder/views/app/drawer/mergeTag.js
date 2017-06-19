/**
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
    var view = Marionette.ItemView.extend({
        tagName: 'li',
        template: '#tmpl-nf-merge-tag-box-tag',

        events: {
            "click": "insertTag"
        },

        insertTag: function() {
            nfRadio.channel( 'mergeTags' ).request( 'insert:tag', this.model.get( 'tag' ) );
        }
    });

    return view;
} );