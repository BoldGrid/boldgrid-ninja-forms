define( [], function() {
	var view = Marionette.ItemView.extend({
		tagName: 'div',
		template: '#tmpl-nf-drawer-content-edit-form-settings'
	});

	return view;
} );