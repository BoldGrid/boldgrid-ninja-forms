( function( window, views, $ ) {
	var postID = $( '#post_ID' ).val() || 0,
		media, boldgrid_form;

    var boldgrid_edit_form = jQuery.Event('boldgrid_edit_form');

	media = {
		state: [],

		edit: function( text, update ) {

			wp.media.editor.open();
			
			IMHWPB.editform = this;
			wp.media.frame.setState( 'iframe:boldgrid_form' );

			//This value will be read from within an iframe, but should be reset to null
			//to prevent going into edit mode.
			//
			setTimeout( function() {
				IMHWPB.editform = null;
			}, 10000 );
			
			$(window).trigger(boldgrid_edit_form, this);
		}
	};

	/**
	 * Define how boldgrid forms should display in the editor
	 */
	boldgrid_form = _.extend( {}, media, {

		initialize: function() {
			var options = this.shortcode.attrs.named;
			var desc = options.description == "true" ? '1' : '0';
			var title = options.title == "true" ? '1' : '0';
			
			var current_selector = 'editor-boldgrid-form-' + options.id;
			if ( $( '#tmpl-' + current_selector ).length ) {
				this.template = wp.media.template( current_selector );
				
				this.render( "<div data-description=" + desc + 
					" data-title=" + title +">" + this.template() + "</div>" );
			} else {
				this.template = wp.media.template( 'editor-boldgrid-not-found' );
				this.render( this.template() );
			}
		},
	    setContent: function( content, callback, rendered ) {
			this.getNodes( function( editor, node, contentNode ) {
				content = content.body || content;
	
				if ( content.indexOf( '<iframe' ) !== -1 ) {
					content += '<div class="wpview-overlay"></div>';
				}
	
				contentNode.innerHTML = '';
				contentNode.appendChild( _.isString( content ) ? editor.dom.createFragment( content ) : content );
	
				callback && callback.call( this, editor, node, contentNode );
			}, rendered );
		}
	} );

	views.register( 'ninja_forms', _.extend( {}, boldgrid_form ) );

	/**
	 * Before Bold grid Initializes add the menu items
	 */
	jQuery(document).on('BoldGridPreInit', function ( event, wp_mce_draggable ) {
		wp_mce_draggable.add_menu_item( 'Insert Form', 'column', function () {
			//On click of the new form, Open the media modal to the forms tab
			wp_mce_draggable.insert_from_media_modal_tab( 'iframe:boldgrid_form' );
		} );
	});
	
} )( window, window.wp.mce.views, window.jQuery );


//Thanks To:
//PRE 4.2
//https://github.com/dtbaker/wordpress-mce-view-and-shortcode-editor
/*(function( $ ) {
	var media = wp.media, shortcode_string = 'ninja_forms';
	wp.mce = wp.mce || {};
	wp.mce.boldgrid_form = {
	    shortcode_data : {},
	    View : {
	        template : media.template( 'editor-boldgrid-form' ),
	        postID : $( '#post_ID' ).val(),
	        initialize : function( options ) {
		        this.shortcode = options.shortcode;
		        wp.mce.boldgrid_form.shortcode_data = this.shortcode;
	        },
	        getHtml : function() {
	        	var options = this.shortcode.attrs.named;
	        	this.template = media.template( 'editor-boldgrid-form-' + options.id )
		        return this.template( options );
	        }
	    },
	    edit : function( node ) {
		    var data = window.decodeURIComponent( $( node ).attr( 'data-wpview-text' ) );
		    var values = this.shortcode_data.attrs.named;
        	var options = this.shortcode.attrs.named;
	    },
	};
	wp.mce.views.register( shortcode_string, wp.mce.boldgrid_form );
}( jQuery ));

*/