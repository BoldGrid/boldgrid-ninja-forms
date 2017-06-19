define( ['views/app/drawer/optionRepeaterError'], function( ErrorView ) {
	var view = Marionette.LayoutView.extend({
		tagName: 'div',
		className: 'nf-table-row',
		template: '#tmpl-nf-edit-setting-option-repeater-default-row',
		id: function() {
			return this.model.cid;
		},

		regions: {
			error: '.nf-option-error'
		},

		initialize: function( data ) {
			this.settingModel = data.settingModel;
			this.dataModel = data.dataModel;
			this.collection = data.collection;
			this.columns = data.columns;
			this.parentView = data.parentView;
			this.model.on( 'change:errors', this.renderErrors, this );

			// Removed because the re-render was breaking tag insertion for merge tags.
			// this.model.on( 'change', this.render, this );

			if ( 'undefined' != typeof this.settingModel.get( 'tmpl_row' ) ) {
				this.template = '#' + this.settingModel.get( 'tmpl_row' );
			}

			this.hasErrors = false;
		},

		onBeforeDestroy: function() {	
			this.model.off( 'change', this.render );
			this.model.off( 'change:errors', this.renderErrors );
		},

		onBeforeRender: function() {
			/*
			 * We want to escape any HTML being output for our label.
			 */
			if ( this.model.get( 'label' ) ) {
				var label = this.model.get( 'label' );
				this.model.set( 'label', _.escape( label ), { silent: true } );
			}
			
		},

		onRender: function() {
			nfRadio.channel( 'mergeTags' ).request( 'init', this );
			/*
			 * Send out a radio message.
			 */
			nfRadio.channel( 'setting-' + this.settingModel.get( 'name' ) + '-option' ).trigger( 'render:setting', this.model, this.dataModel, this );
			/*
			 * We want to unescape any HTML being output for our label.
			 */
			if ( this.model.get( 'label' ) ) {
				var label = this.model.get( 'label' );
				this.model.set( 'label', _.unescape( label ), { silent: true } );
			}
		},

		onShow: function() {
			if ( this.model.get( 'new' ) ) {
				jQuery( this.el ).find( 'input:first' ).focus();
				this.model.set( 'new', false );
			}
		},

		events: {
			'change .setting': 'changeOption',
			'click .nf-delete': 'deleteOption',
			'keyup': 'keyupOption'
		},

		changeOption: function( e ) {
			nfRadio.channel( 'option-repeater' ).trigger( 'change:option', e, this.model, this.dataModel, this.settingModel, this );
		},

		deleteOption: function( e ) {
			nfRadio.channel( 'option-repeater' ).trigger( 'click:deleteOption', this.model, this.collection, this.dataModel, this );
		},

		keyupOption: function( e ) {
			this.maybeAddOption( e );
			nfRadio.channel( 'option-repeater' ).trigger( 'keyup:option', e, this.model, this.dataModel, this.settingModel, this )
			nfRadio.channel( 'option-repeater-' + this.settingModel.get( 'name' ) ).trigger( 'keyup:option', e, this.model, this.dataModel, this.settingModel, this )
		},

		maybeAddOption: function( e ) {
			if ( 13 == e.keyCode ) {
				nfRadio.channel( 'option-repeater' ).trigger( 'click:addOption', this.collection, this.dataModel, this );
				jQuery( this.parentView.children.findByIndex(this.parentView.children.length - 1).el ).find( '[data-id="label"]' ).focus();
			}
		},

		renderErrors: function() {
			
			// if ( jQuery.isEmptyObject( this.model.get( 'errors' ) ) ) {
			// 	return false;
			// }

			/*
			 * We don't want to redraw the entire row, which would remove focus from the eq textarea,
			 * so we add and remove error classes manually.
			 */
			if ( 0 == Object.keys( this.model.get( 'errors' ) ) ) {
                if ( this.hasErrors ) {
				    this.error.empty();
				    jQuery( this.el ).removeClass( 'nf-error' );
                }
			} else {
				this.hasErrors = true;
				this.error.show( new ErrorView( { model: this.model } ) );
				jQuery( this.el ).addClass( 'nf-error' );
			}
		},

		templateHelpers: function() {
			var that = this;
			return {
				getColumns: function() {
					return that.columns;
				},
				renderFieldSelect: function( dataID, value ){
					var fields = nfRadio.channel( 'fields' ).request( 'get:collection' );
					var _return = '<label class="nf-select"><select class="setting" data-id="' + dataID + '">';
					fields.each( function( field ){
						var selected = ( value == field.get( 'key' ) ) ? ' selected' : '';
						_return += '<option value="' + field.get( 'key' ) + '"' + selected + '>' + field.get( 'label' ) + '</option>';
					});
					_return += '</select><div></div></label>';
					return _return;
				},
				renderOptions: function( column, value ) {

					if( 'undefined' == typeof that.options.columns[ column ] ) return;

					var html = '';
					_.each( that.options.columns[ column ].options, function( option ){
						var selected = ( value == option.value ) ? ' selected' : '';
						html += '<option value="' + option.value + '"' +  selected + '>' + option.label + '</option>';
					});
					
					return html;
				}

			}
		}

	});

	return view;
} );
