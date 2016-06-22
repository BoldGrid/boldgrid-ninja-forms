var IMHWPB = IMHWPB || {};

IMHWPB.Media = function( $ ) {
	var self = this;

	this.search_params = '';
	this.location = '';
	$( function() {
		self.on_page_load();
	} );

	/**
	 * All Page load Actions
	 */
	this.on_page_load = function() {
		if ( typeof IMHWPB.Globals !== 'undefined' && IMHWPB.Globals.isIframe ) {
			self.iframe_onload();
		}
	}

	
	/**
	 * Create New Tabs for the newly created window This function is called by
	 * an iframe
	 */
	this.build_tabs = function( tabs ) {
		var tabs_html = '';
		$.each( tabs, function( key, details ) {
			if ( details.content[0] ) {
				tabs_html += '<a class="media-menu-item" data-tabname="' + key + '" href="#">'
					+ details.name + '</a>';
			}
		} );
		return tabs_html;
	};
	
	/**
	 * When one of our iframes load up, activate the layout appearance
	 */
	this.handle_iframe_load = function( tabs ) {
		// Unhide the selection panels
		var $container 		 = $( '#__wp-uploader-id-0' );
		var $media_router 	 = $( '.media-router' );
		var $media_toolbar 	 = $( '.media-toolbar-primary' );
		var $media_selection = $( '.media-selection' );

		$container.removeClass( 'hide-toolbar' );
		$container.removeClass( 'hide-router' );

		// Create Tabs
		$media_router.html( self.build_tabs( tabs ) );

		// Change Submission button (should break binds)
		$media_toolbar
			.html( '<a href="#" class="button media-button button-primary button-primary-disabled button-large">Insert into page</a>' );

		// Hide Selected images
		$media_selection.addClass( 'empty' );

		// Duplicate the media navbars, but only to our newly created media menu
		// items.
		self.setup_top_tab_nav();

		// Everytime a tab is clicked we should display the appropriate section
		self.register_tab_click_events();
		
		self.insert_to_page_event();
		
	};
	

	/**
	 * Duplicate the media navbars
	 */
	this.setup_top_tab_nav = function() {
		$( '.media-menu-item' ).on( 'click', function() {
			// Remove all other active
			$( this ).parent().find( '.media-menu-item' ).removeClass( 'active' );

			// Active the one that was just clicked
			$( this ).addClass( 'active' );
		} );
	};

	/**
	 * Actions that occur when a tab is clicked
	 */
	this.register_tab_click_events = function() {
		$( '.media-router .media-menu-item' ).on(
			'click',
			function() {
				$( '.media-iframe iframe' )[ 0 ].contentWindow.IMHWPB.Media.instance
					.enable_iframe_content( $( this ).data( 'tabname' ) );
			} );

		$( '.media-router .media-menu-item:first' ).click();
	};

	/**
	 * Grab the selected layouts and insert them into the editor @ cursor
	 * location.
	 */
	this.insert_to_page_event = function() {
		$( '.media-toolbar .media-button' )
			.on(
				'click',
				function(e) {
					e.preventDefault();
					if ($(this).hasClass('button-primary-disabled') == false) {
						var child_window = $( '.media-iframe iframe' )[ 0 ].contentWindow.IMHWPB.Media.instance;
						var html_to_insert = child_window.find_selected_elements();
						child_window.uncheck_all();
						$( '.media-modal-close' ).click();

						var is_shortcode = html_to_insert.match(/^\[.+\]$/);
						var $inserting = null;
						if ( false == is_shortcode || null == is_shortcode ) {
							$inserting = $(html_to_insert);
						}

						if ( $inserting && IMHWPB.WP_MCE_Draggable.draggable_instance && 
							$inserting.is( IMHWPB.WP_MCE_Draggable.draggable_instance.row_selectors_string )) {
							
							var current_node = tinymce.activeEditor.selection.getNode();
							var $closest_column = $(current_node).closest_context(
								IMHWPB.WP_MCE_Draggable.draggable_instance.column_selectors_string, 
								IMHWPB.WP_MCE_Draggable.draggable_instance.$master_container );
							var $row = $(current_node)
								.closest_context( IMHWPB.WP_MCE_Draggable.draggable_instance.row_selectors_string, 
									IMHWPB.WP_MCE_Draggable.draggable_instance.$master_container);
							
							//If We are inside a column, prepend
							if ( $closest_column.length && $closest_column.is('div') ) {
								$closest_column.prepend( $inserting );
							//If we are inside a $row, insert before
							} else if ( $row.length ) {
								$row.before ( $inserting );
							//Else insert at top
							} else {
								$(tinyMCE.activeEditor.getBody()).prepend( $inserting );
							}
							
							IMHWPB.WP_MCE_Draggable.draggable_instance.validate_markup();
							tinymce.activeEditor.fire('setContent');
							tinymce.activeEditor.focus();
						} else {
							// Insert into TinyMCE
							send_to_editor( html_to_insert );
							//tinymce.activeEditor.execCommand( 'mceInsertContent', false, html_to_insert );
							//wp.media.editor.insert( html_to_insert );
						}
					}
				} );
	};
	
	/**
	 * Disabled or enables the insert to page button
	 */ 
	this.toggle_insert_button = function (enable) {
		var $insert_button = $('.media-toolbar').find('.button');
		if (enable === true) {
			$insert_button.removeClass('button-primary-disabled');   
		} else if (enable === false) {
			$insert_button.addClass('button-primary-disabled');
		}
	};

	/**
	 * iFrame functions: Functions below this point are only modify content
	 * within the iframe.
	 */

	/**
	 * FInd the current geo location of a user
	 */
	this.find_current_location = function() {
		if ( typeof (navigator) == 'object' && typeof (navigator.geolocation) == 'object' ) {
			navigator.geolocation.getCurrentPosition( function( location ) {
				self.location = {
					'center' : [ location.coords.latitude, location.coords.longitude ].join( ',' )
				}
			} );
		}
	}
	
	/**
	 * All actions that occur when an iframe is loaded.
	 */
	this.iframe_onload = function() {
		var thumnail_action = null;

		switch ( IMHWPB.Globals[ 'tab-details' ][ 'type' ] ) {
			case 'api':
				thumnail_action = self.find_api_content;
				self.bind_search_form();
				self.find_current_location();
				break;
			case 'html':
				// insert content into the page
				thumnail_action = self.insert_image;
				break;
			case 'shortcode-form':
				// insert content into the page
				thumnail_action = self.insert_markup;
				self.bind_checkbox_selections();
				break;
		}

		parent.IMHWPB.Media.instance.handle_iframe_load( IMHWPB.Globals.tabs );
		self.disable_insert_button();
		self.prevent_attachment_content_actions();
		self.register_sidebar_event_handlers();
		self.register_attachment_click_events( thumnail_action,
			IMHWPB.Globals[ 'tab-details' ][ 'selection-type' ] );
	
		//This needs to occur after  register_attachment_click_events
		//so, it cannot be done in the switch
		if ( IMHWPB.Globals[ 'tab-details' ][ 'type' ] == 'shortcode-form' ) {
			self.preselect_form();
		}
	};
	
	this.prevent_attachment_content_actions = function () {
		$('.centered-content-boldgrid').on('click', 'button, a', function () {
			return false;
		});
	};
	
	this.preselect_form = function () {
		parent.jQuery(parent).on('boldgrid_edit_form', function ( event, form ) {
			self.select_form_action( form );
		});

		if (typeof parent.IMHWPB.editform != "undefined" && parent.IMHWPB.editform ) {
			self.select_form_action( parent.IMHWPB.editform );
		}
	};
	
	this.select_form_action = function ( form ) {
		var settings = form.shortcode.attrs.named;
		var $media_sidebar = $('.media-sidebar-boldgrid');
		self.deselect_all_attachments();
		
		var $title_checkbox = $media_sidebar.find("#title-toggle-boldgrid");
		var $desc_checkbox = $media_sidebar.find("#description-enable-boldgrid");
		var $ajax_checkbox = $media_sidebar.find("#ajax-enable-boldgrid");
		self.preselect_checkbox($title_checkbox, settings.title);
		self.preselect_checkbox($desc_checkbox, settings.description);
		self.preselect_checkbox($ajax_checkbox, settings.ajax);
		
		//Preset Tab index
		var $tab_index_wrapper = $media_sidebar.find('#tabindex-wrapper-boldgrid');
		if ( settings.tabindex ) {
			$tab_index_wrapper.find('input').val(settings.tabindex);
			$tab_index_wrapper.removeClass('hidden');
		} else {
			$tab_index_wrapper.find('input').val('');
			$tab_index_wrapper.addClass('hidden');
		}
		
		$('[data-form-id-boldgrid="' + settings.id + '"]').find('.attachment-preview').click();
	}
	
	this.preselect_checkbox = function ( $checkbox, value ) {
		if ($checkbox.length) {
			if ( value == "true" ) {
				$checkbox.val(true);
				$checkbox.prop("checked", true);
			} else {
				$checkbox.val(false);
				$checkbox.prop("checked", false);
			}
		}
	};
	
	this.bind_checkbox_selections = function () {
		var $media_sidebar = $('.media-sidebar-boldgrid');
		$media_sidebar.on('submit', 'form', function () {
			return false;
		});
		
		$media_sidebar.find('#title-toggle-boldgrid').on('click', function () {
			self.set_sidebar_title_visibility();
		});
		
		$media_sidebar.find('#description-enable-boldgrid').on('click', function () {
			self.set_sidebar_description_visibility();
		});
	};
	
	this.set_sidebar_title_visibility = function () {
		var $title = $('.media-sidebar-boldgrid').find('.gform_title');
		if ($('#title-toggle-boldgrid').prop('checked')) {
			$title.show();
		} else {
			$title.hide();
		}
	};
	this.set_sidebar_description_visibility = function () {
		var $description = $('.media-sidebar-boldgrid').find('.gform_description');
		if ($('#description-enable-boldgrid').prop('checked')) {
			$description.show();
		} else {
			$description.hide();
		}
	};

	this.register_sidebar_event_handlers = function () {
		$('.media-sidebar-boldgrid a[title="advanced-options"]').on('click', function ( event ) {
			event.preventDefault();
			$('#tabindex-wrapper-boldgrid').toggleClass('hidden');
		});
		
	};

	/**
	 * When the image on the sidebar changes, check if the image src is filled.
	 * If so set the insert button accordingly
	 */
	this.disable_insert_button = function () {
		$('.media-sidebar img').on('load', function () {
			if ($(this).attr('src')) {
			   parent.IMHWPB.Media.instance.toggle_insert_button(true);
			} else {
			   parent.IMHWPB.Media.instance.toggle_insert_button(false);
			}
		});
	};

	/**
	 * Updates the map
	 */
	this.perform_search = function () {
		self.search_params = {
			'center' : $( 'input[name="map-search-imhwpb"]' ).val()
		};
		self.find_api_content( $( '.attachment.selected' ) );
	};
	
	/**
	 * Initializes the binds needed for searching for maps
	 */
	this.bind_search_form = function() {

		$( '#search-map-imhwpb' ).on( 'submit', function( e ) {
			e.preventDefault();
			self.perform_search();
		} );
		
		$('.media-sidebar .searchbutton').on('click', function () {
			self.perform_search();
		});
		
		$( '#search-map-imhwpb select[name="select-size-imhwpb"]' ).on('change', function () {
			if ($(this).val() == 'custom') {
				$('#map-dimensions-imhwpb').removeClass('hidden');
			} else {
				$('#map-dimensions-imhwpb').addClass('hidden');
			}
		});
	};

	/**
	 * Handles the top tabs functionality.
	 */
	this.enable_iframe_content = function( tab_name ) {
		$( '.attachments' ).addClass( 'hidden' );
		$( '.attachments[data-tabname="' + tab_name + '"]' ).removeClass( 'hidden' );
	};

	/**
	 * Determine which items were selected.
	 */
	this.find_selected_elements = function() {
		var html = '';
		
		switch( IMHWPB.Globals[ 'tab-details' ][ 'type' ]) {
			case 'html':
				$( '.attachment[aria-checked="true"]' ).each( function() {
					var id = $( this ).data( 'id' );
					var tab_name = $( this ).closest( '.attachments' ).data( 'tabname' );
					html += IMHWPB.Globals.tabs[ tab_name ][ 'content' ][ id ][ 'html' ];
				} );
				break;
			case 'api':
				var query_string = $.param(self.search_params.center);
				html = '<a href="http://maps.google.com/?q=' + self.search_params.center +
				'"><img src="' + $('.media-sidebar').find('img').attr('src') + '"></a>';
				break;
			case 'shortcode-form':
				var form_id = $( '.attachment[aria-checked="true"]' ).data('form-id-boldgrid');
				html = self.create_form_shortcode ( form_id );
				break;
		}
		
		return html;
	};
	
	this.create_form_shortcode = function ( form_id ) {
		var $media_sidebar = $('.media-sidebar-boldgrid');
		var title 		= $media_sidebar.find('#title-toggle-boldgrid').prop('checked');
		var description = $media_sidebar.find('#description-enable-boldgrid').prop('checked');
		var ajax 		= $media_sidebar.find('#ajax-enable-boldgrid').prop('checked');
		var tabindex	= $media_sidebar.find('#tabindex-wrapper-boldgrid input').val();
		
		title = title ? ' title="true"' : ' title="false"';
		description = description ? ' description="true"' : ' description="false"';
		ajax = ajax ? ' ajax="true"' : '';
		tabindex = tabindex != '' ? ' tabindex="' + tabindex + '"' : '';
		
		return '[ninja_forms id="' + form_id + '"]';
	};

	/**
	 * Uncheck all selected options
	 */
	this.uncheck_all = function() {
		$( '.attachment[aria-checked="true"]' ).each( function() {
			$( this ).attr( 'aria-checked', false );
			$( this ).removeClass( 'details selected' );
			$( '.media-sidebar > div' ).addClass( 'hidden' );
		} );
	};

	/**
	 * Based on the sidebar form, determine image size
	 */
	this.find_selected_map_size = function() {
		var $media_sidebar = $( ".media-sidebar" );
		var select = $media_sidebar.find( 'select[name="select-size-imhwpb"]' );
		var selected_option = select.find( "option:selected" );
		var preset_width = selected_option.data( 'width' );
		var preset_height = selected_option.data( 'height' );

		if ( select.val() == 'custom' ) {
			preset_width = $media_sidebar.find( 'input[name="custom-width-imhwpb"]' )
				.val();
			preset_height = $media_sidebar.find( 'input[name="custom-height-imhwpb"]' )
				.val();
		}

		return {
			'size' : preset_width + 'x' + preset_height
		};
	}

	/**
	 * Populates sidebar with new data 
	 */
	this.find_api_content = function( $attachment ) {
		var tab_name = $attachment.closest( '.attachments' ).data( 'tabname' );
		var map_params = IMHWPB.Globals.tabs[ tab_name ][ 'content' ][ $attachment.data( 'id' ) ][ 'map-params' ];

		if ( !self.search_params.center || 
				IMHWPB.Globals[ 'tab-details' ]['default-location-setting'] == self.search_params) {
			
			if ( self.location ) {
				self.search_params = self.location;
			} else {
				self.search_params = IMHWPB.Globals[ 'tab-details' ]['default-location-setting'];
			}
		}

		var src = IMHWPB.Globals[ 'tab-details' ][ 'base-url' ]
			+ '?'
			+ $.param( $.extend( self.search_params, map_params, self
				.find_selected_map_size() ) );
		self.image_replacement( src );
	};

	/**
	 * Insert an image into the side bar
	 */
	this.insert_image = function( $attachment ) {
		// Take the image and replace the image in the right side
		// pane with it every time you click on an attachment, no matter
		// what
		if ( $attachment.data('html-type') != 'raw' ) {
			var src = $attachment.find( 'img' ).attr( 'src' );
			self.image_replacement( src );
		} else {
			self.image_replacement( '' );
			var $media_sidebar = $( '.media-sidebar' );
			var form_markup = $attachment.find('.centered-content-boldgrid').html();
			$media_sidebar.find('.centered-content-boldgrid').html( '<div>' + form_markup + '</div>');
			$media_sidebar.find( '.fullwidth-imhwpb' ).addClass('hidden');
			$media_sidebar.find( '> div' ).removeClass( 'hidden' );
			var resized_height = $media_sidebar.find('.centered-content-boldgrid > div')[0].getBoundingClientRect().height;
			$('.boldgrid-markup-container').css({'height': parseInt(resized_height) + 15 + 'px'});
			parent.IMHWPB.Media.instance.toggle_insert_button(true);
		}
	};
	
	this.insert_markup = function ( $attachment ) {
		var $media_sidebar = $( '.media-sidebar' );
		var form_markup = $attachment.find('.centered').html();
		$('.boldgrid-markup-container').html(form_markup);
		$media_sidebar.find( '> div' ).removeClass( 'hidden' );
		var resized_height = $media_sidebar.find('.ninja-forms-cont')[0].getBoundingClientRect().height;
		$('.boldgrid-markup-container').css({
			'height': parseInt(resized_height) + 15 + 'px'
		});

		var form_id = $attachment.data('form-id-boldgrid');
		
		//Set edit link
		self.insert_edit_link( form_id );
		
		//Make sure that settings are carried over
		self.set_sidebar_title_visibility();
		self.set_sidebar_description_visibility();
		parent.IMHWPB.Media.instance.toggle_insert_button(true);
	};
	
	this.insert_edit_link = function ( form_id ) {
		var src = IMHWPB.Globals['admin-url'] + 'admin.php?page=ninja-forms&tab=builder&form_id=' + form_id;
		var $media_sidebar = $( '.media-sidebar' )
			.find('.editform-link a:first').attr('href', src );
	};
	
	/**
	 * Take an image and replace the src  in the sidebar
	 */
	this.image_replacement = function ( src ) {
		var $media_sidebar = $( '.media-sidebar' );
		$media_sidebar.find('.centered-content-boldgrid').empty();
		$media_sidebar.find( 'img.fullwidth-imhwpb' ).attr( 'src', src ).removeClass('hidden');
		$media_sidebar.find( '> div' ).removeClass( 'hidden' );
	};

	/**
	 * Deselect a single attachment
	 */
	this.deselect_attachment = function( $attachment ) {
		if ( $attachment.hasClass( 'selected' ) == true ) {
			$attachment.removeClass( 'selected' );
			$attachment.attr( 'aria-checked', false );
			$attachment.removeClass( 'details' );
		}
	};

	/**
	 * Deselects all attachments
	 */
	this.deselect_all_attachments = function() {
		$( '.attachment' ).each( function() {
			self.deselect_attachment( $( this ) );
		} );
	};

	/**
	 * Register the media click event action
	 */
	this.register_attachment_click_events = function( onclick_procedure, selection_type ) {
		$( '.attachment' ).on( 'click', function() {
			var $attachment = $( this ).closest( '.attachment' );

			if ( selection_type == 'single-item' ) {
				self.deselect_all_attachments();
			}

			$( '.attachment' ).removeClass( 'details' );
			$attachment.addClass( 'details' );

			if ( $attachment.hasClass( 'selected' ) == false ) {
				$attachment.addClass( 'selected' );
				$attachment.attr( 'aria-checked', true );
			}

			onclick_procedure( $attachment );
		} );

		// When clicking on the deselect option. uncheck the box
		$( '.check[title="Deselect"]' ).on( 'click', function(e) {
			e.stopPropagation();
			var $attachment = $( this ).closest( '.attachment' );
			self.deselect_attachment( $attachment );
			
			$('.media-sidebar > div').addClass('hidden');
			if ($('.attachment.selected').length == 0) {
				parent.IMHWPB.Media.instance.toggle_insert_button(false)
			}
			
		} );
	};
};

IMHWPB.Media.instance = new IMHWPB.Media( jQuery );