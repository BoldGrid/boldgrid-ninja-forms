



			
			var progress 	= jQuery( el ).closest( '.nf-field-wrap' ).find( '.nf-file-progress' );
			var bar 		= jQuery( el ).closest( '.nf-field-wrap' ).find( '.nf-file-bar' );
			var percent 	= jQuery( el ).closest( '.nf-field-wrap' ).find( '.nf-file-percent' );
			var status 		= jQuery( el ).closest( '.nf-field-wrap' ).find( '.nf-file-status' );
			var button 		= jQuery( el ).closest( '.nf-field-wrap' ).find( '.nf-file-button' );

			var options = {
	            beforeSerialize: function( formData, options ) {
	            	// if ( typeof tinyMCE !== 'undefined' ) {
	            	// 	tinyMCE.triggerSave();
	            	// }
	            },
				beforeSubmit: function( formData, jqForm, options ) {
					nfRadio.channel( 'form-' + model.get( 'formID' ) ).trigger( 'disable:submit', 'File upload in progress.' );
				},

				beforeSend: function() {
					status.empty();
					button.fadeOut( 'fast', function() {
						progress.fadeIn( 'fast', function() {
					        var percentVal = '0%';
					        bar.width(percentVal)
					        percent.html(percentVal);
						} );
					} );
			    },

			    uploadProgress: function( event, position, total, percentComplete ) {
			        var percentVal = percentComplete + '%';
			        bar.width(percentVal)
			        percent.html(percentVal);
			    },

			    success: function() {
			        var percentVal = '100%';
			        bar.width(percentVal)
			        percent.html(percentVal);
			    },

				complete: function( xhr ) {
					nfRadio.channel( 'form-' + model.get( 'formID' ) ).trigger( 'enable:submit' );
					jQuery( progress ).fadeOut( 'fast', function() {
						var filename = xhr.responseText;
						var link = '<input type="button" class="nf-element nf-file-reset" value="Upload a different file">';
						status.html( filename + ' ' + link );
						status.fadeIn( 'fast' );
						jQuery( el ).parent().unwrap();
						model.set( 'value', 'FILE UPLOAD' );
					} );
				},

				data: {
					action: 'nf_async_upload',
					security: nfFrontEnd.ajaxNonce
				}
			};

			var html = '<form class="nf-file-form" enctype="multipart/form-data" method="post" action="' + nfFrontEnd.adminAjax + '"></form>';
			jQuery( el ).parent().wrap( html );
			jQuery( el ).closest( 'form' ).ajaxSubmit( options );