define( ['views/fileItem'], function( fileItem ) {
	var view = Marionette.CollectionView.extend({
		childView: fileItem
	});

	return view;
} );