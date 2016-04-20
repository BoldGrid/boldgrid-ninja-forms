define( ['views/app/drawer/optionRepeaterOption', 'views/app/drawer/optionRepeaterEmpty', 'models/app/optionRepeaterCollection'], function( listOptionView, listEmptyView, listOptionCollection ) {
	var view = Marionette.CompositeView.extend( {
		template: '#nf-tmpl-edit-setting-wrap',
		childView: listOptionView,
		emptyView: listEmptyView,
		reorderOnSort: false,

		initialize: function( data ) {

			/*
			 * Our options are stored in our database as objects, not collections.
			 * Before we attempt to render them, we need to convert them to a collection if they aren't already one.
			 */ 
			var optionCollection = data.dataModel.get( this.model.get( 'name' ) );

			if ( false == optionCollection instanceof Backbone.Collection ) {
				optionCollection = new listOptionCollection( [], { settingModel: this.model } );
				optionCollection.add( data.dataModel.get( this.model.get( 'name' ) ) );
				data.dataModel.set( this.model.get( 'name' ), optionCollection, { silent: true } );
			}

			this.collection = optionCollection;
			this.dataModel = data.dataModel;
			this.childViewOptions = { settingModel: this.model, collection: this.collection, dataModel: data.dataModel, columns: this.model.get( 'columns' ) };

			var deps = this.model.get( 'deps' );
			if ( deps ) {
				for ( var name in deps ) {
				    if ( deps.hasOwnProperty( name ) ) {
				    	this.dataModel.on( 'change:' + name, this.render, this );
				    }
				}
			}
		},

		onBeforeDestroy: function() {
			var deps = this.model.get( 'deps' );
			if ( deps ) {
				for (var name in deps) {
				    if ( deps.hasOwnProperty( name ) ) {
				    	this.dataModel.off( 'change:' + name, this.render );
				    }
				}
			}
		},

		onRender: function() {
			// this.$el = this.$el.children();
			// this.$el.unwrap();
			// this.setElement( this.$el );

			// this.$el = this.$el.children();
			// this.$el.unwrap();
			// this.setElement( this.$el );
		
			var that = this;
			jQuery( this.el ).find( '.nf-list-options-tbody' ).sortable( {
				handle: '.handle',
				helper: 'clone',
				placeholder: 'nf-list-options-sortable-placeholder',
				forcePlaceholderSize: true,
				opacity: 0.95,
				tolerance: 'pointer',

				start: function( e, ui ) {
					nfRadio.channel( 'option-repeater' ).request( 'start:optionSortable', ui );
				},

				stop: function( e, ui ) {
					nfRadio.channel( 'option-repeater' ).request( 'stop:optionSortable', ui );
				},

				update: function( e, ui ) {
					nfRadio.channel( 'option-repeater' ).request( 'update:optionSortable', ui, this, that );
				}
			} );

			nfRadio.channel( 'mergeTags' ).request( 'init', this );

			/*
			 * Send out a radio message.
			 */
			nfRadio.channel( 'setting-' + this.model.get( 'name' ) ).trigger( 'render:setting', this.model, this.dataModel, this );
		},

		templateHelpers: function () {
			var that = this;
	    	return {
	    		renderHeaders: function() {
	    			var columns = '<div>&nbsp;</div>';
	    			_.each( this.columns, function( col ) {
	    				columns += '<div>' + col.header + '</div>';
	    			} );
	    			columns += '<div>&nbsp;</div>';
					return columns;
				},

	    		renderSetting: function() {
					var setting = _.template( jQuery( '#nf-tmpl-edit-setting-' + this.type ).html() );
					return setting( this );
				},

				renderClasses: function() {
					var classes = '';
					if ( 'undefined' != typeof this.width ) {
						classes += this.width;
					} else {
						classes += ' one-half';
					}

					if ( this.error ) {
						classes += ' nf-error';
					}

					return classes;
				},

				renderVisible: function() {
					if ( this.deps ) {
						for (var name in this.deps) {
						    if ( this.deps.hasOwnProperty( name ) ) {
						        if ( that.dataModel.get( name ) !== this.deps[ name ] ) {
						        	return 'style="display:none;"';
						        }
						    }
						}
					}
	    			return '';
	    		},

				renderError: function() {
					if ( this.error ) {
						return this.error;
					}
					return '';
				},

				renderFieldsetClasses: function() {
					return that.model.get( 'name' );
				}
			};
		},

		attachHtml: function( collectionView, childView ) {
			jQuery( collectionView.el ).find( '.nf-list-options-tbody' ).append( childView.el );
			nfRadio.channel( 'mergeTags' ).request( 'init', this );
		},

		events: {
			'click .nf-add-new': 'clickAddOption'
		},

		clickAddOption: function( e ) {
			nfRadio.channel( 'option-repeater' ).trigger( 'click:addOption', this.collection, this.dataModel );
		}
	} );

	return view;
} );