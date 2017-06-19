define( ['views/fieldErrorItem'], function( fieldErrorItem ) {
	var view = Marionette.CollectionView.extend({
		tagName: "nf-errors",
		childView: fieldErrorItem,

		initialize: function( options ) {
			this.fieldModel = options.fieldModel;
		},

		onRender: function() {
			if ( 0 == this.fieldModel.get( 'errors' ).models.length ) {
                this.fieldModel.removeWrapperClass( 'nf-error' );
                this.fieldModel.removeWrapperClass( 'nf-fail' );
                this.fieldModel.addWrapperClass( 'nf-pass' );
            } else {
                this.fieldModel.removeWrapperClass( 'nf-pass' );
                this.fieldModel.addWrapperClass( 'nf-fail' );
                this.fieldModel.addWrapperClass( 'nf-error' );
            }

		}
	});

	return view;
} );