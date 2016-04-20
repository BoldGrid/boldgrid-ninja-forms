define( ['views/fields/drawer/typeSection'], function( fieldTypeSectionView ) {
	var view = Marionette.CollectionView.extend( {
		tagName: 'div',
		childView: fieldTypeSectionView,

		onShow: function() {
			jQuery( this.el ).find( '.nf-settings' ).unwrap();
			nfRadio.channel( 'fields' ).request( 'clear:editActive' );
		}
	} );

	return view;
} );