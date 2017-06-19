/**
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
    var view = Marionette.ItemView.extend({
        tagName: 'li',
        template: '#tmpl-nf-merge-tag-box-section',
        events: {
            "click": "onClick"
        },

        initialize: function () {
            this.listenTo( nfRadio.channel( 'merge-tags' ), 'after:filtersearch', this.removeActive );
        },

        onClick: function(){
          this.updateTags();
          this.setActive();
        },

        updateTags: function() {
            nfRadio.channel( 'merge-tags' ).request( 'update:taglist', this.model.get( 'id' ) );
        },

        setActive: function(){
            this.$el.addClass( 'active' );
            this.$el.siblings().removeClass( 'active' );
        },

        removeActive: function(){
            this.$el.removeClass( 'active' );
        }
    });

    return view;
} );