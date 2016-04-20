define(['models/fileCollection', 'views/fileCollection'], function( fileCollection, fileCollectionView ) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			this.listenTo( nfRadio.channel( 'file' ), 'init:model', this.initFile );
			this.listenTo( nfRadio.channel( 'file' ), 'render:view', this.renderView );
		},

		renderFileInput: function() {
			var template = _.template( jQuery( '#nf-tmpl-field-file-input' ).html() );
			return template( this );
		},

		initFile: function( model ) {
			model.set( 'files', new fileCollection() );
			model.set( 'renderFileInput', this.renderFileInput );

			this.listenTo( nfRadio.channel( 'file' ), 'change:field', this.changeFile );
			this.listenTo( nfRadio.channel( 'fields' ), 'click:field', this.clickFileButton );
		},

		renderView: function( fieldView ) {
			var el = jQuery( fieldView.el ).children( '.nf-files-table' );
    		fieldView.fileCollectionView = new fileCollectionView( { el: el, collection: fieldView.model.get( 'files' ), thisModel: this.model } );

    		fieldView.model.bind( 'change:files', this.changeCollection, fieldView );
		},

		changeCollection: function() {
			this.fileCollectionView.render();
		},

		clickFileButton: function( el, model ) {
			if ( jQuery( el ).hasClass( 'nf-file-button' ) || jQuery( el ).hasClass( 'nf-file-reset' ) ) {
				jQuery( el ).closest( '.nf-field-wrap' ).find( 'input[type=file].nf-element' ).click();
			}
		},

		changeFile: function( el, model ) {
			if ( '' == jQuery( el ).val() ) {
				return false;
			}

			var filename = jQuery( el )[0].files[0].name;
			console.log( jQuery( el ).length );

			var slug = '';
		    var trimmed = jQuery.trim( filename );
		    slug = trimmed.replace(/[^a-z0-9-]/gi, '-').
		    replace(/-+/g, '-').
		    replace(/^-|-$/g, '');
    
		    var fileCollection = model.get( 'files' );
		    if ( ! fileCollection.get( slug ) ) {

		    	var fileInput = jQuery( el );
		    	var fileInputClone = jQuery( el ).clone();
		    	jQuery( fileInput ).removeClass( 'nf-element' ).off();
		    	jQuery( fileInputClone ).val('');
		    	jQuery( fileInput ).replaceWith( fileInputClone );

		  //   	var html = '<form class="nf-file-form" enctype="multipart/form-data" method="post" action="' + nfFrontEnd.adminAjax + '"></form>';
				// jQuery( el ).wrap( html );

			    fileCollection.add( { id: slug, filename: filename, fileInput: fileInput } );

			    model.set( 'files', fileCollection );
			    model.trigger( 'change:files', model );
		    }
		}
	});

	return controller;
} );