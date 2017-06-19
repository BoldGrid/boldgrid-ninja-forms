define( [ 'views/afterFormContent', 'views/beforeFormContent', 'models/fieldCollection' ], function( AfterFormContent, BeforeFormContent, FieldCollection ) {

	var view = Marionette.LayoutView.extend({
		tagName: "nf-section",
		template: "#tmpl-nf-form-layout",

		regions: {
			beforeFormContent: ".nf-before-form-content",
			formContent: ".nf-form-content",
			afterFormContent: ".nf-after-form-content"
		},

		initialize: function() {
			nfRadio.channel( 'form-' + this.model.get( 'id' ) ).reply( 'get:el', this.getEl, this );
			
			/*
			 * If we need to hide a form, set the visibility of this form to hidden.
			 */
			 this.listenTo( this.model, 'hide', this.hide );
		},

		onRender: function() {
			this.$el = this.$el.children();
			this.$el.unwrap();
			this.setElement( this.$el );
		},

		onShow: function() {
			this.beforeFormContent.show( new BeforeFormContent( { model: this.model } ) );
			
			/*
			 * Set our formContentData to our form setting 'formContentData'
			 */
			var formContentData = this.model.get( 'formContentData' );
			
			/*
			 * Check our fieldContentViewsFilter to see if we have any defined.
			 * If we do, overwrite our default with the view returned from the filter.
			 */
			var formContentViewFilters = nfRadio.channel( 'formContent' ).request( 'get:viewFilters' );
			
			/* 
			* Get our first filter, this will be the one with the highest priority.
			*/
			var sortedArray = _.without( formContentViewFilters, undefined );
			var callback = _.first( sortedArray );
			formContentView = callback();
			
			var options = {
				data: formContentData,
				formModel: this.model
			};
			
			/*
			 * If we have a collection, pass the returned data as the collection.
			 *
			 * If we have a model, pass the returned data as the collection.
			 */
			if ( false !== formContentData instanceof Backbone.Collection ) {
				options.collection = formContentData;
			} else if ( false !== formContentData instanceof Backbone.Model ) {
				options.model = formContentData;
			}

			this.formContent.show( new formContentView( options ) );
			this.afterFormContent.show( new AfterFormContent( { model: this.model } ) );
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
        },

        hide: function() {
        	jQuery( this.el ).hide();
        }

	});

	return view;
} );