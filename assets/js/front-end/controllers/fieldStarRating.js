define([], function() {
    var controller = Marionette.Object.extend( {

        initialize: function() {
        	this.listenTo( nfRadio.channel( 'starrating' ), 'init:model', this.register );
            this.listenTo( nfRadio.channel( 'starrating' ), 'render:view', this.initRating );
        },

        register: function( model ) {
			model.set( 'renderRatings', this.renderRatings );
		},

        initRating: function( view ){
            jQuery( view.el ).find( '.starrating' ).rating();
        },

        renderRatings: function() {
        	var html = '';
        	for (var i = this.default - 1; i >= 0; i--) {
        		var template = _.template( jQuery( '#nf-tmpl-field-starrating-star' ).html() );
        		var num = i + 1;
        		html += template( { id: this.id, classes: this.classes, num: num } );
        	}
        	return html;
        }

    });

    return controller;
});