/**
 * When a form is loaded, enable any rtes in textareas.
 */
define([], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			this.listenTo( nfRadio.channel( 'textarea' ), 'render:view', this.initTextareaRTEs );
			this.listenTo( nfRadio.channel( 'fields' ), 'click:extra', this.clickExtra );

			// Instantiates the variable that holds the media library frame.
			this.meta_image_frame;

			jQuery.summernote.options.icons = {
		        'align': 'dashicons dashicons-editor-alignleft',
		        'alignCenter': 'dashicons dashicons-editor-aligncenter',
		        'alignJustify': 'dashicons dashicons-editor-justify',
		        'alignLeft': 'dashicons dashicons-editor-alignleft',
		        'alignRight': 'dashicons dashicons-editor-alignright',
		        'indent': 'dashicons dashicons-editor-indent',
		        'outdent': 'dashicons dashicons-editor-outdent',
		        // 'arrowsAlt': 'dashicons fa-arrows-alt',
		        'bold': 'dashicons dashicons-editor-bold',
		        'caret': 'dashicons dashicons-arrow-down',
		        // 'circle': 'dashicons fa-circle',
		        'close': 'dashicons dashicons-dismiss',
		        'code': 'dashicons dashicons-editor-code',
		        'eraser': 'dashicons dashicons-editor-removeformatting',
		        // 'font': 'dashicons fa-font',
		        // 'frame': 'dashicons fa-frame',
		        'italic': 'dashicons dashicons-editor-italic',
		        'link': 'dashicons dashicons-admin-links',
		        'unlink': 'dashicons dashicons-editor-unlink',
		        'magic': 'dashicons dashicons-editor-paragraph',
		        // 'menuCheck': 'dashicons fa-check',
		        'minus': 'dashicons dashicons-minus',
		        'orderedlist': 'dashicons dashicons-editor-ol',
		        // 'pencil': 'dashicons fa-pencil',
		        // 'picture': 'dashicons fa-picture-o',
		        // 'question': 'dashicons fa-question',
		        'redo': 'dashicons dashicons-redo',
		        'square': 'dashicons fa-square',
		        // 'strikethrough': 'dashicons fa-strikethrough',
		        // 'subscript': 'dashicons fa-subscript',
		        // 'superscript': 'dashicons fa-superscript',
		        'table': 'dashicons dashicons-editor-table',
		        // 'textHeight': 'dashicons fa-text-height',
		        // 'trash': 'dashicons fa-trash',
		        'underline': 'dashicons dashicons-editor-underline',
		        'undo': 'dashicons dashicons-undo',
		        'unorderedlist': 'dashicons dashicons-editor-ul',
		        // 'video': 'dashicons fa-youtube-play'
		      }

		      this.currentContext = {};

		},

		initTextareaRTEs: function( view ) {
			if ( 1 != view.model.get( 'textarea_rte' ) ) {
				return false;
			}
			/*
			 * Custom Button for links
			 */
			var that = this;
			// var linkButton = this.linkButton();
			var linkButton = function( context ) {
				return that.linkButton( context );
			}
			var mediaButton = function( context ) {
				return that.mediaButton( context );
			}

			var toolbar = [
				[ 'paragraphStyle', ['style'] ],
				[ 'fontStyle', [ 'bold', 'italic', 'underline','clear' ] ],
				[ 'lists', [ 'ul', 'ol' ] ],
			    [ 'paragraph', [ 'paragraph' ] ],
			    [ 'customGroup', [ 'linkButton', 'unlink' ] ],
			    [ 'table', [ 'table' ] ],
			    [ 'actions', [ 'undo', 'redo' ] ],
			];

			if ( 1 == view.model.get( 'textarea_media' ) && 0 != userSettings.uid ) {
				toolbar.push( [ 'tools', [ 'mediaButton' ] ] );
			}

			jQuery( view.el ).find( '.nf-element' ).summernote( {
				toolbar: toolbar,
				buttons: {
					linkButton: linkButton,
					mediaButton: mediaButton
				},
				height: 150,   //set editable area's height
				codemirror: { // codemirror options
				    theme: 'monokai',
				    lineNumbers: true
				},
				prettifyHtml: true,
				callbacks: {
					onChange: function( e ) {
						view.model.set( 'value', jQuery( this ).summernote( 'code' ) );
					}
				}
			} );
		},

		linkButton: function( context ) {
			var that = this;
			var ui = jQuery.summernote.ui;
			var linkButton = _.template( jQuery( '#nf-tmpl-rte-link-button' ).html() );
			var linkDropdown = _.template( jQuery( '#nf-tmpl-rte-link-dropdown' ).html() );
			return ui.buttonGroup([
				ui.button({
	            className: 'dropdown-toggle',
	            contents: linkButton({}),
	            tooltip: 'Insert Link',
	            click: function( e ) {
	            	that.clickLinkButton( e, context );
	            },
	            data: {
	              toggle: 'dropdown'
	            }
	          }),
				ui.dropdown([
	            ui.buttonGroup({
	              children: [
	                ui.button({
	                  contents: linkDropdown({}),
	                  tooltip: ''
	                }),
	              ]
	            })
	          ])
			]).render();
		},

		mediaButton: function( context ) {
			var that = this;
			var ui = jQuery.summernote.ui;
			var mediaButton = _.template( jQuery( '#nf-tmpl-rte-media-button' ).html() );
			return ui.button({
	            className: 'dropdown-toggle',
	            contents: mediaButton({}),
	            tooltip: 'Insert Media',
	            click: function( e ) {
	            	that.openMediaManager( e, context );
	            }
	          }).render();
		},

		openMediaManager: function( e, context ) {
			context.invoke( 'editor.saveRange' );
			// If the frame already exists, re-open it.
			if ( this.meta_image_frame ) {
				this.meta_image_frame.open();
				return;
			}

			// Sets up the media library frame
			this.meta_image_frame = wp.media.frames.meta_image_frame = wp.media({
				title: 'Select a file',
				button: { text:  'insert' }
			});

			var that = this;

			// Runs when an image is selected.
			this.meta_image_frame.on('select', function(){

				// Grabs the attachment selection and creates a JSON representation of the model.
				var media_attachment = that.meta_image_frame.state().get('selection').first().toJSON();
				that.insertMedia( media_attachment, context );
			});

			// Opens the media library frame.
			this.meta_image_frame.open();
		},

		clickLinkButton: function ( e, context ) {
			var range = context.invoke( 'editor.createRange' );
			context.invoke( 'editor.saveRange' );
			var text = range.toString()
			this.currentContext = context;

			jQuery( e.target ).closest( '.note-customGroup > .note-btn-group' ).on ('hide.bs.dropdown', function ( e ) {
				return false;
			});

			jQuery( e.target ).closest( '.note-customGroup > .note-btn-group' ).on ('shown.bs.dropdown', function ( e ) {
				jQuery( e.target ).parent().parent().find( '.link-text' ).val( text );
				jQuery( e.target ).parent().parent().find( '.link-url' ).focus();
			});
		},

		clickExtra: function( e ) {
			var textEl = jQuery( e.target ).parent().find( '.link-text' );
			var urlEl = jQuery( e.target ).parent().find( '.link-url' );
			var isNewWindowEl = jQuery( e.target ).parent().find( '.link-new-window' );
			this.currentContext.invoke( 'editor.restoreRange' );
			if ( jQuery( e.target ).hasClass( 'insert-link' ) ) {
				var text = textEl.val();
				var url = urlEl.val();
				var isNewWindow = ( isNewWindowEl.prop( 'checked' ) ) ? true: false;
				if ( 0 != text.length && 0 != url.length ) {
					this.currentContext.invoke( 'editor.createLink', { text:text, url: url, isNewWindow: isNewWindow } );
				}
			}
			textEl.val( '' );
			urlEl.val( '' );
			isNewWindowEl.prop( 'checked', false );
			jQuery( e.target ).closest( 'div.note-btn-group.open' ).removeClass( 'open' );
		},

		insertMedia: function( media, context ) {
			context.invoke( 'editor.restoreRange' );
			if ( 'image' == media.type ) {
				context.invoke( 'editor.insertImage', media.url );
			} else {
				context.invoke( 'editor.createLink', { text: media.filename, url: media.url } );
			}

		}
	});

	return controller;
} );