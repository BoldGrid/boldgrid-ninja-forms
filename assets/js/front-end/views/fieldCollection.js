define( ['views/fieldLayout'], function( fieldLayout ) {
	var view = Marionette.CollectionView.extend({
		tagName: 'nf-fields-wrap',
		childView: fieldLayout

	});

	return view;
} );