/**
 *
 * @package Ninja Forms builder
 * @subpackage Main App
 * @copyright (c) 2017 WP Ninjas
 * @since 3.0.30
 */
define( [], function() {
    var controller = Marionette.Object.extend( {
        initialize: function() {
            // When the media button is clicked, open the media manager.
            this.listenTo( nfRadio.channel( 'setting-type-media' ), 'click:extra', this.clickExtra );
        },

        clickExtra: function( e, settingModel, dataModel, settingView ) {
            var textEl = jQuery( e.target ).parent().find( '.setting' );

            if ( jQuery( e.target ).hasClass( 'open-media-manager' ) ) {
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
                    textEl.val( media_attachment.url ).change();
                });

                // Opens the media library frame.
                this.meta_image_frame.open();
            }
        },
    });

    return controller;
} );