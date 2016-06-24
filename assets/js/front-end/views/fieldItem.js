define( [], function() {
	var view = Marionette.ItemView.extend({
		tagName: 'div',

		initialize: function() {
    		this.model.on( 'reRender', this.render, this );
    		this.model.on( 'change:errors', this.changeError, this );
    		this.model.on( 'change:addWrapperClass', this.addWrapperClass, this );
    		this.model.on( 'change:removeWrapperClass', this.removeWrapperClass, this );
    		// this.listenTo( nfRadio.channel( 'submit' ), 'before:submit', this.test );

    		this.template = '#nf-tmpl-field-' + this.model.get( 'wrap_template' );
		},

		onBeforeDestroy: function() {
			this.model.off( 'reRender', this.render );
    		this.model.off( 'change:errors', this.changeError );
    		this.model.off( 'change:addWrapperClass', this.addWrapperClass );
    		this.model.off( 'change:removeWrapperClass', this.removeWrapperClass );
		},

		test: function( model ) {
			console.log( 'firing from trigger 1' );
		},

		changeError: function() {
			if ( 0 == this.model.get( 'errors' ).models.length ) {
				this.model.removeWrapperClass( 'nf-error' );
				this.model.removeWrapperClass( 'nf-fail' );
				this.model.addWrapperClass( 'nf-pass' );
			} else {
				this.model.removeWrapperClass( 'nf-pass' );
				this.model.addWrapperClass( 'nf-fail' );
				this.model.addWrapperClass( 'nf-error' );
			}
		},

		addWrapperClass: function() {
			var cl = this.model.get( 'addWrapperClass' );
			if ( '' != cl ) {
				jQuery( this.el ).addClass( cl );
				this.model.set( 'addWrapperClass', '' );
			}
		},

		removeWrapperClass: function() {
			var cl = this.model.get( 'removeWrapperClass' );
			if ( '' != cl ) {
				jQuery( this.el ).removeClass( cl );
				this.model.set( 'removeWrapperClass', '' );
			}
		},

		onRender: function() {
			this.$el = this.$el.children();
			this.$el.unwrap();
			this.setElement( this.$el );

			var el = jQuery( this.el ).children( '.nf-error-wrap' );

    		/*
    		 * If we have an input mask, init that mask.
    		 * TODO: Move this to a controller so that the logic isn't in the view.
    		 */
    		if ( 'undefined' != typeof this.model.get( 'mask' ) && '' != jQuery.trim( this.model.get( 'mask' ) ) ) {
    			if ( 'custom' == this.model.get( 'mask') ) {
    				var mask = this.model.get( 'custom_mask' );
    			} else {
    				var mask = this.model.get( 'mask' );
    			}

    			if ( Number.isInteger( mask ) ) {
    				mask = mask.toString();
    			}

    			jQuery( this.el ).find( '.nf-element' ).mask( mask );
    		}

			nfRadio.channel( this.model.get( 'type' ) ).trigger( 'render:view', this );
			nfRadio.channel( 'fields' ).trigger( 'render:view', this );
		},

		templateHelpers: function () {
	    	return {

				renderElement: function(){
					var tmpl = _.find( this.element_templates, function( tmpl ) {
						if ( 0 < jQuery( '#nf-tmpl-field-' + tmpl ).length ) {
							return true;
						}
					} );
					var template = Marionette.TemplateCache.get( '#nf-tmpl-field-' + tmpl );
					return template( this );
				},

				renderLabel: function() {
					var template = Marionette.TemplateCache.get( '#nf-tmpl-field-label' );
					return template( this );
				},

				renderLabelClasses: function () {
					var classes = '';
					if ( 'undefined' != typeof this.customLabelClasses ) {
						classes = this.customLabelClasses( classes );
					}
					return classes;
				},

				renderPlaceholder: function() {
					var placeholder = this.placeholder;

					if ( 'undefined' != typeof this.customPlaceholder ) {
						placeholder = this.customPlaceholder( placeholder );
					}

					if( '' != jQuery.trim( placeholder ) ) {
						return 'placeholder="' + placeholder + '"';
					} else {
						return '';
					}
				},

				renderWrapClass: function() {
					var wrapClass = 'field-wrap ' + this.type + '-wrap';

					// If we have an old_classname defined, output wrap class for backward compatibility
					if ( 'undefined' != typeof this.old_classname && 0 < jQuery.trim( this.old_classname ).length ) {
						wrapClass += ' ' + this.old_classname + '-wrap';
					}

					if ( 'undefined' != typeof customWrapClass ) {
						wrapClass = customWrapClass( wrapClass );
					}

					return wrapClass;
				},

				renderClasses: function() {
					var classes = this.classes;

					if ( this.error ) {
						classes += ' nf-error';
					} else {
						classes = classes.replace( 'nf-error', '' );
					}

					if ( 'undefined' != typeof this.element_class && 0 < jQuery.trim( this.element_class ).length ) {
						classes += ' ' + this.element_class;
					}

					/*
					 * If we have a function for adding extra classes, add those.
					 */

					if ( 'undefined' != typeof this.customClasses ) {
						classes = this.customClasses( classes );
					}

					return classes;
				},

				maybeDisabled: function() {
					if ( 1 == this.disable_input ) {
						return 'disabled';
					} else {
						return '';
					}
				},

				maybeDisableAutocomplete: function() {
					if ( 1 == this.disable_browser_autocomplete ) {
						return 'autocomplete="off"';
					} else {
						return '';
					}
				},

				maybeInputLimit: function() {
					if ( 'characters' == this.input_limit_type && '' != jQuery.trim( this.input_limit ) ) {
						return 'maxlength="' + this.input_limit + '"';
					} else {
						return '';
					}
				},

				getHelpText: function() {
					this.help_text = jQuery( this.help_text ).html();

					return ( 'undefined' != typeof this.help_text ) ? this.help_text.replace(/"/g, "&quot;") : '';
				},

				maybeRenderHelp: function() {
					var check_text = '<p>' + this.help_text + '</p>';
					if ( 'undefined' != typeof this.help_text && 0 != jQuery.trim( jQuery( check_text ).text() ).length ) {
						return '<span class="fa fa-info-circle nf-help" data-text="' + this.getHelpText() + '"></span>';
					} else {
						return '';
					}
				},

				renderDescText: function() {
					if ( 'undefined' == typeof this.desc_text ) {
						return '';
					}
					var check_text = '<p>' + this.desc_text + '</p>';
					if ( 0 != jQuery.trim( jQuery( check_text ).text() ).length ) {
						return '<div class="nf-field-description">' + this.desc_text + '</div>';
					} else {
						return '';
					}
				}
			};
		},

		events: {
			'change .nf-element': 'fieldChange',
			'keyup .nf-element': 'fieldKeyup',
			'click .nf-element': 'fieldClick',
			'click .extra': 'extraClick',
			'blur .nf-element': 'fieldBlur'
		},

		fieldChange: function( e ) {
			var el = jQuery( e.currentTarget );
			var response = nfRadio.channel( 'nfAdmin' ).request( 'change:field', el, this.model );
		},

		fieldKeyup: function( e ) {
			var el = jQuery( e.currentTarget );
			var keyCode = e.keyCode;
			nfRadio.channel( 'field-' + this.model.get( 'id' ) ).trigger( 'keyup:field', el, this.model, keyCode );
			nfRadio.channel( this.model.get( 'type' ) ).trigger( 'keyup:field', el, this.model, keyCode );
			nfRadio.channel( 'fields' ).trigger( 'keyup:field', el, this.model, keyCode );
		},

		fieldClick: function( e ) {
			var el = jQuery( e.currentTarget );
			nfRadio.channel( 'field-' + this.model.get( 'id' ) ).trigger( 'click:field', el, this.model );
			nfRadio.channel( this.model.get( 'type' ) ).trigger( 'click:field', el, this.model );
			nfRadio.channel( 'fields' ).trigger( 'click:field', el, this.model );
		},

		extraClick: function( e ) {
			nfRadio.channel( 'field-' + this.model.get( 'id' ) ).trigger( 'click:extra', e, this.model );
			nfRadio.channel( this.model.get( 'type' ) ).trigger( 'click:extra', e, this.model );
			nfRadio.channel( 'fields' ).trigger( 'click:extra', e, this.model );
		},

		fieldBlur: function( e ) {
			var el = jQuery( e.currentTarget );
			nfRadio.channel( 'field-' + this.model.get( 'id' ) ).trigger( 'blur:field', el, this.model );
			nfRadio.channel( this.model.get( 'type' ) ).trigger( 'blur:field', el, this.model );
			nfRadio.channel( 'fields' ).trigger( 'blur:field', el, this.model );
		}
	});

	return view;
} );
