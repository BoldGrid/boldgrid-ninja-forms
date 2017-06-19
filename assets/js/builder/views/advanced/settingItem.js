define( [], function() {
	var view = Marionette.ItemView.extend({
		tagName: 'div',
		template: '#tmpl-nf-form-setting-type',

		onBeforeDestroy: function() {
			this.model.off( 'change:editActive', this.updateActiveClass );
		},

		initialize: function() {
			this.model.on( 'change:editActive', this.updateActiveClass, this );
		},

		events: {
			'click': 'clickEdit'
		},

		clickEdit: function( e ) {
			nfRadio.channel( 'settings' ).trigger( 'click:edit', e, this.model );
		},

		templateHelpers: function() {
			return {
				renderClasses: function() {
					var classes = 'nf-setting-wrap ' + this.id;
	    			if ( this.editActive ) {
	    				classes += ' active';
	    			}
	    			return classes;
				}
			}
		},

		updateActiveClass: function() {
			if ( this.model.get( 'editActive' ) ) {
				jQuery( this.el ).find( '.nf-setting-wrap' ).addClass( 'active' );
			} else {
				jQuery( this.el ).find( '.nf-setting-wrap' ).removeClass( 'active' );
			}
		}
	});

	return view;
} );