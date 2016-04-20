define( ['views/app/drawer/mergeTagsContent', 'views/app/drawer/settingError'], function( mergeTagsContentView, settingErrorView ) {
	var view = Marionette.LayoutView.extend({
		tagName: 'div',
		template: '#nf-tmpl-edit-setting-wrap',

		regions: {
			error: '.nf-setting-error'
		},

		initialize: function( data ) {
			this.dataModel = data.dataModel;
			/*
			 * Send out a request on the setting-type-{type} channel asking if we should render on dataModel change.
			 * Defaults to true.
			 * This lets specific settings, like RTEs, say that they don't want to be re-rendered when their data model changes.
			 */
			var renderOnChange = ( 'undefined' == typeof nfRadio.channel( 'setting-type-' + this.model.get( 'type' ) ).request( 'renderOnChange' ) ) ? true: nfRadio.channel( 'setting-type-' + this.model.get( 'type' ) ).request( 'renderOnChange' );
			
			if ( renderOnChange ) {
				this.dataModel.on( 'change:' + this.model.get( 'name' ), this.render, this );
			}

			this.model.on( 'change:error', this.renderError, this );

			var deps = this.model.get( 'deps' );
			if ( deps ) {
				for ( var name in deps ) {
				    if ( deps.hasOwnProperty( name ) ) {
				    	this.dataModel.on( 'change:' + name, this.render, this );
				    }
				}
			}

            var remote = this.model.get( 'remote' );
			if( remote ) {

                if( 'undefined' != typeof remote.refresh || remote.refresh ) {
                    // Add 'update' icons
                    var label = this.model.get('label');
                    this.model.set('label', label + ' <a class="extra"><span class="dashicons dashicons-update"></span></a>');
                }

				nfRadio.channel( 'setting' ).trigger( 'remote', this.model, this.dataModel, this );
				this.model.on( 'rerender', this.render, this );
			}

			/*
			 * When our drawer opens, send out a radio message on our setting type channel.
			 */
			this.listenTo( nfRadio.channel( 'drawer' ), 'opened', this.drawerOpened );

			/*
			 * When our drawer closes, send out a radio message on our setting type channel.
			 */
			this.listenTo( nfRadio.channel( 'drawer' ), 'closed', this.drawerClosed );
		},

		onBeforeDestroy: function() {
			this.dataModel.off( 'change:' + this.model.get( 'name' ), this.render );
			this.model.off( 'change:error', this.renderError );

			var deps = this.model.get( 'deps' );
			if ( deps ) {
				for (var name in deps) {
				    if ( deps.hasOwnProperty( name ) ) {
				    	this.dataModel.off( 'change:' + name, this.render );
				    }
				}
			}

			if( this.model.get( 'remote' ) ) {
				this.model.off( 'rerender', this.render, this );
			}

			/*
			 * Send out a radio message.
			 */
			nfRadio.channel( 'setting-' + this.model.get( 'name' ) ).trigger( 'destroy:setting', this.model, this.dataModel, this );
			nfRadio.channel( 'setting-type-' + this.model.get( 'type' ) ).trigger( 'destroy:setting', this.model, this.dataModel, this );
		},

		onBeforeRender: function() {
			nfRadio.channel( 'app' ).trigger( 'before:renderSetting', this.model, this.dataModel );
			nfRadio.channel( 'setting-type-' + this.model.get( 'type' ) ).trigger( 'before:renderSetting', this.model, this.dataModel, this );
			nfRadio.channel( 'setting-' + this.model.get( 'name' ) ).trigger( 'before:renderSetting', this.model, this.dataModel, this );
		},

		onRender: function() {
			this.mergeTagsContentView = false;
			var that = this;

			/*
			 * Send out a radio message.
			 */
			nfRadio.channel( 'setting-' + this.model.get( 'name' ) ).trigger( 'render:setting', this.model, this.dataModel, this );
			nfRadio.channel( 'setting-type-' + this.model.get( 'type' ) ).trigger( 'render:setting', this.model, this.dataModel, this );

			jQuery( this.el ).find( '.nf-help' ).each(function() {
				var content = jQuery(this).next('.nf-help-text');
				jQuery( this ).jBox( 'Tooltip', {
					content: content,
					maxWidth: 200,
					theme: 'TooltipBorder',
					trigger: 'click',
					closeOnClick: true
				})
		    });

		    if ( this.model.get( 'use_merge_tags' ) ) {
		    	nfRadio.channel( 'mergeTags' ).request( 'init', this );
		    }

			/*
			 * Apply Setting Field Masks
			 */
			var mask = this.model.get( 'mask' );

			if( typeof mask != "undefined" ){

				var input = jQuery( this.$el ).find( 'input' );

				switch( mask.type ){
					case 'numeric':
						input.autoNumeric({
							aSep: thousandsSeparator,
							aDec: decimalPoint
						});
						break;
					case 'currency':
						input.autoNumeric({
							aSign: '$', // TODO: Use form setting
							aSep: thousandsSeparator,
							aDec: decimalPoint
						});
						break;
					case 'custom':
						if( mask.format ) input.mask( mask.format )
						break;
					default:
						// TODO: Error Logging.
						console.log( 'Notice: Mask type of "' + mask.type + '" is not supported.' );
				}
			}
			
			this.renderError();
		},

		onShow: function() {			
			/*
			 * Send out a radio message.
			 */
			nfRadio.channel( 'setting-' + this.model.get( 'name' ) ).trigger( 'show:setting', this.model, this.dataModel, this );
			nfRadio.channel( 'setting-type-' + this.model.get( 'type' ) ).trigger( 'show:setting', this.model, this.dataModel, this );
		},

		onAttach: function() {			
			/*
			 * Send out a radio message.
			 */
			nfRadio.channel( 'setting-' + this.model.get( 'name' ) ).trigger( 'attach:setting', this.model, this.dataModel, this );
			nfRadio.channel( 'setting-type-' + this.model.get( 'type' ) ).trigger( 'attach:setting', this.model, this.dataModel, this );
		},

		renderError: function() {
			if ( this.model.get( 'error' ) ) {
				jQuery( this.el ).find( '.nf-setting' ).addClass( 'nf-error' );
				this.error.show( new settingErrorView( { model: this.model } ) );
			} else {
				jQuery( this.el ).find( '.nf-setting' ).removeClass( 'nf-error' );
				this.error.empty();
			}
		},

		templateHelpers: function () {
			var that = this;
	    	return {

	    		renderVisible: function() {
					if ( this.deps ) {
						for (var name in this.deps) {
						    if ( this.deps.hasOwnProperty( name ) ) {
						        if ( that.dataModel.get( name ) != this.deps[ name ] ) {
						        	return 'style="display:none;"';
						        }
						    }
						}
					}
	    			return '';
	    		},

	    		renderSetting: function(){
	    			if ( 'undefined' != typeof that.dataModel.get( this.name ) ) {
	    				this.value = that.dataModel.get( this.name );
	    			} else if ( 'undefined' == typeof this.value ) {
	    				this.value = '';
	    			}

					var setting = _.template( jQuery( '#nf-tmpl-edit-setting-' + this.type ).html() );

					return setting( this );
				},

				renderLabelClasses: function() {
					var classes = '';
					if ( this.use_merge_tags ) {
						classes += ' has-merge-tags';
					}
					if ( 'rte' == this.type ) {
						classes += ' rte';
					}

					return classes;
				},

				renderClasses: function() {
					var classes = 'nf-setting ';
					if ( 'undefined' != typeof this.width ) {
						classes += 'nf-' + this.width;
					} else {
						classes += ' nf-one-half';
					}

					if ( this.error ) {
						classes += ' nf-error';
					}

					return classes;
				},

				renderTooltip: function() {
					if ( this.help ) {
						return '<a class="nf-help" href="#"><span class="dashicons dashicons-admin-comments"></span></a><div class="nf-help-text">' + this.help + '</div>';
					} else {
						return '';
					}
				},

				renderMergeTags: function() {
					if ( this.use_merge_tags && ! this.hide_merge_tags ) {
						return '<span class="dashicons dashicons-list-view merge-tags"></span>';
					} else {
						return '';
					}
				},

				renderPlaceholder: function() {
					if ( this.placeholder ) {
						return 'placeholder="' + this.placeholder + '"';
					} else {
						return '';
					}
				}
			}
		},

		events: {
			'change .setting': 'changeSetting',
			'keyup .setting': 'keyUpSetting',
			'click .setting': 'clickSetting',
			'click .extra': 'clickExtra'
		},

		changeSetting: function( e ) {
			nfRadio.channel( 'app' ).trigger( 'change:setting', e, this.model, this.dataModel );
		},

		keyUpSetting: function( e ) {
			nfRadio.channel( 'app' ).trigger( 'keyup:setting', e, this.model, this.dataModel );
			nfRadio.channel( 'setting-' + this.model.get( 'name' ) ).trigger( 'keyup:setting', e, this.model, this.dataModel );
		},

		clickSetting: function( e ) {
			nfRadio.channel( 'app' ).trigger( 'click:setting', e, this.model, this.dataModel );
			nfRadio.channel( 'setting-type-' + this.model.get( 'type' ) ).trigger( 'click:setting', e, this.model, this.dataModel, this );
		},

		clickExtra: function( e ) {
			nfRadio.channel( 'setting-type-' + this.model.get( 'type' ) ).trigger( 'click:extra', e, this.model, this.dataModel, this );
			nfRadio.channel( 'setting-type-' + this.model.get( 'name' ) ).trigger( 'click:extra', e, this.model, this.dataModel, this );
		},

		drawerOpened: function() {
			nfRadio.channel( 'setting-type-' + this.model.get( 'type' ) ).trigger( 'drawer:opened', this.model, this.dataModel, this );
		},

		drawerClosed: function() {
			nfRadio.channel( 'setting-type-' + this.model.get( 'type' ) ).trigger( 'drawer:closed', this.model, this.dataModel, this );
		}
	});

	return view;
} );
