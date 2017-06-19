/**
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
    var view = Marionette.ItemView.extend({
        template: '#tmpl-nf-merge-tag-box-filter',
        events: {
            "keyup input": "updateFilter",
        },
        updateFilter: function( event ) {

            if( /* ENTER */ 13 == event.keyCode ){ // Copied from Keyup Callback.
                // Get top listed merge tag.
                var firstFilteredTag = jQuery( '#merge-tags-box .merge-tag-list ul li span' ).first().data( 'tag' );

                nfRadio.channel( 'mergeTags' ).request( 'insert:tag', firstFilteredTag );

                // COPIED FROM BELOW
                jQuery( '#merge-tags-box' ).css( 'display', 'none' );
                jQuery( '#merge-tags-box' ).removeClass();
                jQuery( '.merge-tag-focus' ).removeClass( 'merge-tag-focus' );
                jQuery( '.merge-tag-focus-overlay' ).removeClass( 'merge-tag-focus-overlay' );
                return;
            }
            var value = this.$el.find( 'input' ).val();
            nfRadio.channel( 'merge-tags' ).request( 'filtersearch', value );
        }
    });

    return view;
} );