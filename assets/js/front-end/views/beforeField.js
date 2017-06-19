define( [], function() {
    var view = Marionette.ItemView.extend({
        tagName: 'nf-section',
        template: '#tmpl-nf-field-before'
    });

    return view;
} );