/**
 * Single action table row
 *
 * TODO: make dynamic
 *
 * @package Ninja Forms builder
 * @subpackage Actions
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['views/app/itemControls'], function( itemControlsView ) {
	var view = Marionette.LayoutView.extend({
		tagName: 'tr',
		template: '#tmpl-nf-action-item',

		regions: {
			itemControls: '.nf-item-controls'
		},

		initialize: function() {
			this.template = nfRadio.channel( 'actions' ).request( 'get:actionItemTemplate' ) || this.template;
			this.model.on( 'change:label', this.render, this );
			this.model.on( 'change:editActive', this.render, this );
			this.model.on( 'change:active', this.maybeDeactivate, this );
		},

		onBeforeDestroy: function() {
			this.model.off( 'change:label', this.render );
			this.model.off( 'change:editActive', this.render );
			this.model.off( 'change:active', this.maybeDeactivate );
		},

		onRender: function() {
			if ( this.model.get( 'editActive' ) ) {
				jQuery( this.el ).addClass( 'active' );
			} else {
				jQuery( this.el ).removeClass( 'active' );
			}

			this.maybeDeactivate();

			this.itemControls.show( new itemControlsView( { model: this.model } ) );
		},

		maybeDeactivate: function() {
			if ( 0 == this.model.get( 'active' ) ) {
				jQuery( this.el ).addClass( 'deactivated' );
			} else {
				jQuery( this.el ).removeClass( 'deactivated' );
			}
		},

		events: {
			'change input': 'changeToggle',
			'click': 'maybeClickEdit'
		},

		maybeClickEdit: function( e ) {
			if ( 'TR' == jQuery( e.target ).parent().prop( 'tagName' ) ) {
				nfRadio.channel( 'app' ).trigger( 'click:edit', e, this.model );
			}
		},

		changeToggle: function( e ) {
			var setting = jQuery( e.target ).data( 'setting' );
			var settingModel = nfRadio.channel( 'actions' ).request( 'get:settingModel', setting );
			console.log( settingModel );
			console.log( this.model );
			nfRadio.channel( 'app' ).request( 'change:setting', e, settingModel, this.model );
			nfRadio.channel( 'app' ).request( 'update:db' );
		},

		templateHelpers: function() {
			return {
				renderToggle: function( settingName ) {
					this.settingName = settingName || 'active';
					var actionLabel = this.label;
					this.label = '';
					this.value = this[ this.settingName ];
					this.name = this.id + '-' + this.settingName;
					var html = nfRadio.channel( 'app' ).request( 'get:template',  '#tmpl-nf-edit-setting-toggle' );
					html = html( this );
					this.label = actionLabel;
					return html;
				},

				renderTypeNicename: function() {
					var type = nfRadio.channel( 'actions' ).request( 'get:type', this.type );
					if ( 'undefined' == typeof type ) return;

					return type.get( 'nicename' );
				},

				renderTooltip: function() {
					if ( this.help ) {
						return '<a class="nf-help" href="#" tabindex="-1"><span class="dashicons dashicons-admin-comments"></span></a><div class="nf-help-text">' + this.help + '</div>';
					} else {
						return '';
					}
				},

				renderMergeTags: function() {
					if ( this.use_merge_tags ) {
						return '<span class="dashicons dashicons-list-view merge-tags"></span>';
					} else {
						return '';
					}
				}
			}
		}
	});

	return view;
} );
