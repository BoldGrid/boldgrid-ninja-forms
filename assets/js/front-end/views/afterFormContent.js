define( ['views/formErrorCollection', 'views/honeyPot'], function( FormErrors, HoneyPot ) {

    var view = Marionette.LayoutView.extend({
        tagName: "nf-section",
        template: "#tmpl-nf-after-fields",

		regions: {
			errors: ".nf-form-errors",
            hp: ".nf-form-hp"
		},

        onShow: function() {
        	this.errors.show( new FormErrors( { collection: this.model.get( 'errors' ) } ) );
            this.hp.show( new HoneyPot( { model: this.model } ) );
        }

    });

    return view;
} );