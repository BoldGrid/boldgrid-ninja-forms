/**
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
    var view = Marionette.LayoutView.extend({
        el: '#merge-tags-box',
        template: "#tmpl-nf-merge-tag-box",

        regions: {
            filter:   '.merge-tag-filter',
            sections: '.merge-tag-sections',
            tags:     '.merge-tag-list'
        },
    });

    return view;
} );