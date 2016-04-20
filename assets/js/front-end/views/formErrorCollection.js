define( ['views/formErrorItem'], function( formErrorItem ) {
	var view = Marionette.CollectionView.extend({
		tagName: "nf-errors",
		childView: formErrorItem
	});

	return view;
} );