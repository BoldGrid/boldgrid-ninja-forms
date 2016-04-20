define( [], function( ) {

	var view = Marionette.ItemView.extend({
		tagName: "nf-section",
		template: "#nf-tmpl-after-form",
		
	});

	return view;
} );