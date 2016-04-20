define( [], function() {
	var view = Marionette.ItemView.extend({
		tagName: 'div',
		className: 'nf-error',
		template: '#nf-tmpl-edit-setting-option-repeater-error'
	});

	return view;
} );