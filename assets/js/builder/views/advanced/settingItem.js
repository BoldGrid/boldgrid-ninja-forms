define( [], function() {
	var view = Marionette.ItemView.extend({
		tagName: 'div',
		template: '#nf-tmpl-form-setting-type',

		onBeforeDestroy: function() {
			this.model.off( 'change:editActive', this.render );
		},

		initialize: function() {
			this.model.on( 'change:editActive', this.render, this );
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
					var classes = 'nf-setting-wrap';
	    			if ( this.editActive ) {
	    				classes += ' active';
	    			}
	    			return classes;
				}
			}
		}
	});

	return view;
} );