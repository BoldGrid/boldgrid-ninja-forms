define( ['views/app/drawer/itemSetting'], function( itemSettingView ) {
	var view = Marionette.CompositeView.extend( {
		template: '#tmpl-nf-edit-setting-wrap',
		childView: itemSettingView,

		initialize: function( data ) {
			this.collection = this.model.get( 'settings' );
			this.childViewOptions = { dataModel: data.dataModel };
			this.dataModel = data.dataModel;
			var deps = this.model.get( 'deps' );
			if ( deps ) {
				for ( var name in deps ) {
				    if ( deps.hasOwnProperty( name ) ) {
				    	this.dataModel.on( 'change:' + name, this.render, this );
				    }
				}
			}
			this.model.on( 'rerender', this.render, this );
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

		onBeforeRender: function() {
			nfRadio.channel( 'app' ).trigger( 'before:renderSetting', this.model, this.dataModel );
			nfRadio.channel( 'setting-type-' + this.model.get( 'type' ) ).trigger( 'before:renderSetting', this.model, this.dataModel, this );
			nfRadio.channel( 'setting-' + this.model.get( 'name' ) ).trigger( 'before:renderSetting', this.model, this.dataModel, this );
		},

		onRender: function() {
			/*
			 * Send out a radio message.
			 */
			nfRadio.channel( 'setting-' + this.model.get( 'name' ) ).trigger( 'render:setting', this.model, this.dataModel, this );
			nfRadio.channel( 'setting-type-' + this.model.get( 'type' ) ).trigger( 'render:setting', this.model, this.dataModel, this );
		},

		templateHelpers: function () {
			var that = this;
	    	return {
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
	    		renderSetting: function(){
	    			var setting = nfRadio.channel( 'app' ).request( 'get:template',  '#tmpl-nf-edit-setting-' + this.type );
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

				renderError: function() {
					if ( this.error ) {
						return this.error;
					}
					return '';
				}
			}
		},

		attachHtml: function( collectionView, childView ) {
			jQuery( collectionView.el ).find( '.nf-field-sub-settings' ).append( childView.el );
		}
	} );

	return view;
} );