define( ['views/fieldErrorCollection', 'views/inputLimit'], function( fieldErrorCollection, InputLimitView ) {
    var view = Marionette.ItemView.extend({
        tagName: 'nf-section',
        template: '#tmpl-nf-field-after',

        initialize: function() {
    		this.model.on( 'change:errors', this.changeError, this );
        },

        onRender: function() {
        	/*
        	 * If we have an error, render our error view.
        	 * TODO: Perhaps move to a controller?
        	 */
        	var errorEl = jQuery( this.el ).children( '.nf-error-wrap' );
    		this.errorCollectionView = new fieldErrorCollection( { el: errorEl, collection: this.model.get( 'errors' ), fieldModel: this.model } );
            if ( 0 < this.model.get( 'errors' ).length ) {
               this.errorCollectionView.render(); 
            }
            
    		/*
    		 * If we have an input limit set, render the view that contains our counter
    		 * TODO: Move this to a controller so that the logic isn't in the view.
    		 */
    		if ( 'undefined' != typeof this.model.get( 'input_limit' ) && '' != jQuery.trim( this.model.get( 'input_limit' ) ) ){
    			var inputLimitEl = jQuery( this.el ).children( '.nf-input-limit');
    			this.inputLimitView = new InputLimitView( { el: inputLimitEl, model: this.model } );
    		}
        },

        changeError: function() {
			this.errorCollectionView.render();
		},

    });

    return view;
} );