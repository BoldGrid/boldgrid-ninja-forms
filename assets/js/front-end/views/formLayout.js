define( ['views/fieldCollection','views/afterFields', 'views/beforeFields'], function( fieldCollectionView, afterFields, beforeFields ) {

	var view = Marionette.LayoutView.extend({
		tagName: "nf-section",
		template: "#nf-tmpl-form-layout",

		regions: {
			beforeFields: ".nf-before-fields",
			fields: ".nf-fields",
			afterFields: ".nf-after-fields"
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
			
			/*
			 * Set our fieldContentsData to our form setting 'fieldContentsData'
			 */
			var fieldContentsData = this.model.get( 'fieldContentsData' );

			/*
			 * Set our default fieldContentsView.
			 */
			var fieldContentsView = fieldCollectionView;
			/*
			 * Check our fieldContentViewsFilter to see if we have any defined.
			 * If we do, overwrite our default with the view returned from the filter.
			 */

			var fieldContentsViewFilters = nfRadio.channel( 'fieldContents' ).request( 'get:viewFilters' );
			if ( 'undefined' != typeof fieldContentsData && 0 != fieldContentsViewFilters.length ) {
				/* 
				* Get our first filter, this will be the one with the highest priority.
				*/
				var sortedArray = _.without( fieldContentsViewFilters, undefined );
				var callback = _.first( sortedArray );
				fieldContentsView = callback();
			}
			
			var fieldContentsLoadFilters = nfRadio.channel( 'fieldContents' ).request( 'get:loadFilters' );
			if ( 'undefined' != typeof fieldContentsData && 0 != fieldContentsLoadFilters.length ) {
				/* 
				* Get our first filter, this will be the one with the highest priority.
				*/
				var sortedArray = _.without( fieldContentsLoadFilters, undefined );
				var callback = _.first( sortedArray );
				fieldContentsData = callback( fieldContentsData, this.model );
			} else {
				fieldContentsData = this.options.fieldCollection;
			}

			this.fields.show( new fieldContentsView( { collection: fieldContentsData } ) );
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