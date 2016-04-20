define( ['views/fieldCollection','views/afterFields', 'views/beforeFields'], function( fieldCollectionView, afterFields, beforeFields ) {

	var view = Marionette.LayoutView.extend({
		tagName: "nf-section",
		template: "#nf-tmpl-form-layout",

		regions: {
			beforeFields: ".nf-before-fields",
			fields: ".nf-fields",
			afterFields: ".nf-after-fields",
		},

		initialize: function() {
			nfRadio.channel( 'form-' + this.model.get( 'id' ) ).reply( 'get:el', this.getEl, this );
		},

		onRender: function() {
			this.$el = this.$el.children();
			this.$el.unwrap();
			this.setElement( this.$el );
		},

		onShow: function() {

			this.beforeFields.show( new beforeFields( { model: this.model } ) );
			this.fields.show( new fieldCollectionView( { collection: this.options.fieldCollection } ) );
			this.afterFields.show( new afterFields( { model: this.model } ) );
		},

		getEl: function() {
			return this.el;
		},

        templateHelpers: function () {
            return {

                renderClasses: function() {
                    return '';
                }

            };
        }

	});

	return view;
} );