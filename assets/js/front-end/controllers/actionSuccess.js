define([], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			this.listenTo( nfRadio.channel( 'forms' ), 'submit:response', this.actionSubmit );
		},

		actionSubmit: function( response ) {
			if ( _.size( response.errors ) == 0 && 'undefined' != typeof response.data.actions ) {
				if ( 'undefined' != typeof response.data.actions.success_message && '' != response.data.actions.success_message ) {
					var form_id = response.data.form_id;
					var success_message = jQuery( '#nf-form-' + form_id + '-cont .nf-response-msg' );
					
					success_message.html( response.data.actions.success_message ).show();
					
					//Let's check if the success message is already fully visible in the viewport without scrolling
					var top_of_success_message = success_message.offset().top;
					var bottom_of_success_message = success_message.offset().top + success_message.outerHeight();
					var bottom_of_screen = jQuery(window).scrollTop() + jQuery(window).height();
					var top_of_screen = jQuery(window).scrollTop();

					var the_element_is_visible = ((bottom_of_screen > bottom_of_success_message) && (top_of_screen < top_of_success_message));

					if(!the_element_is_visible){
						//The element isn't visible, so let's scroll to the success message as in the previous release, but with a short animation
						jQuery('html, body').animate({
							scrollTop: ( success_message.offset().top - 50 )
						}, 300 );
					}	
				}
			}
		}

	});

	return controller;
} );
