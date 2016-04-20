define( ['views/app/itemControls'], function( itemControlsView ) {
	var view = Marionette.LayoutView.extend({
		tagName: 'div',
		template: '#nf-tmpl-main-content-field',

		regions: {
			itemControls: '.nf-item-controls'
		},

		initialize: function() {
			this.model.on( 'change:editActive', this.render, this );
			this.model.on( 'change:label', this.render, this );
			this.model.on( 'change:required', this.render, this );
			this.model.on( 'change:id', this.render, this );
		},

		onBeforeDestroy: function() {
			this.model.off( 'change:editActive', this.render );
			this.model.off( 'change:label', this.render );
			this.model.off( 'change:required', this.render );
			this.model.off( 'change:id', this.render );
		},

		onRender: function() {
			this.$el = this.$el.children();
			this.$el.unwrap();
			this.setElement( this.$el );

			this.itemControls.show( new itemControlsView( { model: this.model } ) );
			jQuery( this.el ).disableSelection();

			if ( nfRadio.channel( 'app' ).request( 'is:mobile' ) ) {
				jQuery( this.el ).on( 'taphold', function( e, touch ) {
					if ( ! jQuery( e.target ).hasClass( 'nf-edit-settings' ) ) {
						jQuery( this ).addClass( 'ui-sortable-helper drag-selected' );
						jQuery( this ).ClassyWiggle( 'start', { degrees: ['.65', '1', '.65', '0', '-.65', '-1', '-.65', '0'], delay: 50 } );
					}
				} );
			}
		},

		templateHelpers: function () {
	    	return {
	    		renderClasses: function() {
	    			var classes = 'nf-field-wrap';
	    			if ( this.editActive ) {
	    				classes += ' active';
	    			}
	    			return classes;
	    		},
	    		renderRequired: function() {
	    			if ( 1 == this.required ) {
	    				return '<span class="required">*</span>';
	    			} else {
	    				return '';
	    			}
	    		},
	    		getFieldID: function() {
					if ( jQuery.isNumeric( this.id ) ) {
						return 'field-' + this.id;
					} else {
						return this.id;
					}
				},
				renderIcon: function() {
					var type = nfRadio.channel( 'fields' ).request( 'get:type', this.type );
					return '<span class="fa fa-' + type.get( 'icon' ) + '"></span>';
				}
			};
		},

		events: {
			'click': 'maybeClickEdit',
			'singletap': 'maybeTapEdit',
			'swipeleft': 'swipeLeft',
			'swiperight': 'swipeRight',
			'tapend': 'tapend'
		},

		maybeClickEdit: function( e ) {
			if ( ( jQuery( e.target ).parent().hasClass( 'nf-fields-sortable' ) || jQuery( e.target ).parent().hasClass( 'nf-field-wrap' ) ) && ! nfRadio.channel( 'app' ).request( 'is:mobile' ) ) {
				nfRadio.channel( 'app' ).trigger( 'click:edit', e, this.model );
			}
		},

		maybeTapEdit: function( e ) {
			if ( jQuery( e.target ).parent().hasClass( 'nf-fields-sortable' ) ) {
				nfRadio.channel( 'app' ).trigger( 'click:edit', e, this.model );
			}
		},

		swipeLeft: function( e, touch ) {
			jQuery( touch.startEvnt.target ).closest( 'div' ).find( '.nf-item-duplicate' ).show();
			jQuery( touch.startEvnt.target ).closest( 'div' ).find( '.nf-item-delete' ).show();
		},

		swipeRight: function( e, touch ) {
			jQuery( touch.startEvnt.target ).closest( 'div' ).find( '.nf-item-duplicate' ).hide();
			jQuery( touch.startEvnt.target ).closest( 'div' ).find( '.nf-item-delete' ).hide();
		},

		tapend: function( e, touch ) {
			jQuery( this.el ).ClassyWiggle( 'stop' );
			jQuery( this.el ).removeClass( 'ui-sortable-helper drag-selected' );
		}

	});

	return view;
} );
