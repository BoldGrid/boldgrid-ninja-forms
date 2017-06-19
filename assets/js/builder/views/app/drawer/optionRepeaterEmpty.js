define( [], function() {
	var view = Marionette.ItemView.extend({
		tagName: 'tr',
		template: '#tmpl-nf-edit-setting-option-repeater-empty'
	});

	return view;
} );