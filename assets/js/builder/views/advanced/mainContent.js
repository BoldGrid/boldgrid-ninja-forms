define( ['views/advanced/settingItem'], function( settingItem ) {
	var view = Marionette.CollectionView.extend({
		childView: settingItem
		
	});

	return view;
} );