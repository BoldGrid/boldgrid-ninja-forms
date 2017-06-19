/**
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [ 'views/app/drawer/mergeTag' ], function( mergeTagView ) {
    var view = Marionette.CollectionView.extend({
        tagName: 'ul',
        childView: mergeTagView,

        initialize: function() {
            nfRadio.channel( 'merge-tags' ).reply( 'update:taglist', this.sectionFilter, this );
            nfRadio.channel( 'merge-tags' ).reply( 'filtersearch', this.searchFilter, this );
        },

        filter: function( child, index, collection ){
            return 'fields' == child.get( 'section' );
        },

        sectionFilter: function( section ){
            this.filter = function( child, index, collection ){
                return section == child.get( 'section' );
            }
            this.render();
            nfRadio.channel( 'merge-tags' ).trigger( 'after:filtersearch' );
        },

        searchFilter: function( term ){
            this.filter = function( child, index, collection ){
                var label = child.get( 'label' ).toLowerCase().indexOf( term.toLowerCase().replace( ':', '' ) ) >= 0;
                var tag   = child.get( 'tag' ).toLowerCase().indexOf( term.toLowerCase() ) >= 0;
                return label || tag;
            }
            this.render();
            nfRadio.channel( 'merge-tags' ).trigger( 'after:filtersearch' );

        }
    });

    return view;
} );