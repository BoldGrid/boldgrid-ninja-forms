define( [], function() {
	var view = Marionette.ItemView.extend({
		tagName: 'tr',
		template: '#nf-tmpl-edit-setting-option-repeater-empty'
	});

	return view;
} );