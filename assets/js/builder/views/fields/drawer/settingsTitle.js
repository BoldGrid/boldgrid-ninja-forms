/**
 * Fields settings title view.
 * 
 * @package Ninja Forms builder
 * @subpackage Fields
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['views/fields/drawer/addSavedField'], function( addSavedFieldView ) {
	var view = Marionette.LayoutView.extend({
		tagName: 'div',
		template: '#nf-tmpl-drawer-content-edit-settings-title-fields',

		initialize: function() {
			this.model.on( 'change:isSaved', this.render, this );
			this.model.on( 'change:label', this.renderjBoxContent, this );
		},

		regions: {
			addSaved: '.nf-add-saved-field'
		},

		onBeforeDestroy: function() {
			this.model.off( 'change:isSaved', this.render );
			this.addSavedjBox.destroy();
			this.model.unset( 'jBox', { silent: true } );
		},

		onRender: function() {
			this.renderjBoxContent();
			var that = this;
			this.addSavedjBox = new jBox( 'Tooltip', {
				trigger: 'click',
				title: 'Add to Saved Fields',
				position: {
					x:'left',
					y:'center'
				},
				outside:'x',
				closeOnClick: 'body',

				onCreated: function() {
					this.setContent( jQuery( that.el ).find( '.nf-add-saved-field' ) );
				}
			} );
			this.addSavedjBox.attach( jQuery( this.el ).find( '.dashicons') );
			this.model.set( 'jBox', this.addSavedjBox, { silent: true } );
		},

		renderjBoxContent: function() {
			if ( this.addSaved ) {
				this.addSaved.show( new addSavedFieldView( { model: this.model } ) );
			}
		},

		templateHelpers: function () {
	    	return {
	    		renderTypeNicename: function() {
	    			var currentDomain = nfRadio.channel( 'app' ).request( 'get:currentDomain' );
					var domainID = currentDomain.get( 'id' );
	    			var type = nfRadio.channel( domainID ).request( 'get:type', this.type );
	    			var displayName = type.get( 'nicename' );

	    			if ( this.isSaved ) {
	    				var realType = nfRadio.channel( domainID ).request( 'get:type', type.get( 'type' ) );
	    				displayName += ' - ' + realType.get( 'nicename' );
	    			}
	    			return displayName;
				},
				
				renderSavedStar: function() {
					if ( this.isSaved ) {
						var star = 'filled';
					} else {
						var star = 'empty';
					}
					return '<span class="dashicons dashicons-star-' + star + '"></span>'
				}
			};
		}
	});

	return view;
} );