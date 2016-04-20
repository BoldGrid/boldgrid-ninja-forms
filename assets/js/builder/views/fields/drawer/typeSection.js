define( [], function() {
	var view = Marionette.ItemView.extend({
		tagName: 'div',
		template: '#nf-tmpl-drawer-field-type-section',

		initialize: function() {
			_.bindAll( this, 'render' );
			nfRadio.channel( 'fields' ).reply( 'get:typeSection', this.getTypeSection, this );
		},

		onRender: function() {
			this.$el = this.$el.children();
			this.$el.unwrap();
			this.setElement( this.$el );

			this.dragging = false;
			var that = this;
			/*
			 * If we're on a mobile device, we don't want to enable dragging for our field type buttons.
			 */
			if ( ! nfRadio.channel( 'app' ).request( 'is:mobile' ) ) {
				jQuery( this.el ).find( 'div.nf-field-type-draggable' ).draggable( {
					opacity: 0.9,
					tolerance: 'intersect',
					scroll: false,
					connectToSortable: '.nf-field-type-droppable',

					helper: function( e ) {
						var width = jQuery( e.target ).parent().width();
						var height = jQuery( e.target ).parent().height();
						var element = jQuery( e.target ).parent().clone();
						var left = width / 4;
						var top = height / 2;
						jQuery( this ).draggable( 'option', 'cursorAt', { top: top, left: left } );

						return element;
					},

					start: function( e, ui ) {
						that.dragging = true;
						nfRadio.channel( 'drawer-addField' ).trigger( 'startDrag:type', this, ui );
					},

					stop: function( e, ui ) {
						that.dragging = false;
						nfRadio.channel( 'drawer-addField' ).trigger( 'stopDrag:type', this, ui );
					}

				} ).disableSelection();

				jQuery( this.el ).find( '.nf-item' ).focus( function() {
			    	jQuery( this ).addClass( 'active' );
			    } ).blur( function() {
			    	jQuery( this ).removeClass( 'active' );
			    } );
			}
		},

		events: {
			'click .nf-item': 'clickFieldType',
			'keydown .nf-item': 'maybeClickFieldType',
			'mousedown .nf-item': 'mousedownFieldType'
		},

		clickFieldType: function( e ) {
			if ( ! this.dragging ) {
				nfRadio.channel( 'drawer' ).trigger( 'click:fieldType', e );
			}
		},

		mousedownFieldType: function( e ) {
			jQuery( e.target).addClass( 'clicked' );
			setTimeout( function() {
				jQuery( e.target ).removeClass( 'clicked' );
			}, 1500 );
		},

		maybeClickFieldType: function( e ) {
			if ( 13 == e.keyCode ) {
				this.clickFieldType( e );
				nfRadio.channel( 'drawer' ).request( 'clear:filter' );
			}
		},

		templateHelpers: function() {
			return {
				renderFieldTypes: function() {
			        var html = '';
			        var that = this;
			        _.each( this.fieldTypes, function( id ) {
			            var type = nfRadio.channel( 'fields' ).request( 'get:type', id );
			            var nicename = type.get( 'nicename' );
			            var icon = type.get( 'icon' );
			            var renderType = _.template( jQuery( '#nf-tmpl-drawer-field-type-button' ).html() );
			            html += renderType( { id: id, nicename: nicename, icon: icon, type: type, savedField: that.isSavedField } );
			        } );
			        return html;
				},

				isSavedField: function() {
					if( this.type.get( 'savedField' ) ) {
						return 'nf-saved';
					} else {
						return '';
					}
				}
			}
		},

		getTypeSection: function() {
			return this.el;
		}
	});

	return view;
} );
