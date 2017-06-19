/**
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [ 'views/app/drawer/mergeTagGroup' ], function( mergeTagGroupView ) {
    var view = Marionette.CollectionView.extend({
        tagName: 'ul',
        childView: mergeTagGroupView,

        initialize: function(){
            this.listenTo( nfRadio.channel( 'merge-tags' ), 'open', this.render, this );
        },

        // TODO: Update filter when a new tag is added. ie Calculations.
        filter: function( child, index, collection ){
            return 0 < child.get( 'tags' ).length;
        },
    });

    return view;
} );