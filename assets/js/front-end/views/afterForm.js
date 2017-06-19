define( [], function( ) {

	var view = Marionette.ItemView.extend({
		tagName: "nf-section",
		template: "#tmpl-nf-after-form",
		
	});

	return view;
} );