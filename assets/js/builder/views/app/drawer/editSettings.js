define( ['views/app/drawer/itemSettingGroupCollection'], function( itemSettingGroupCollectionView ) {
	var view = Marionette.LayoutView.extend({
		tagName: 'div',
		template: '#nf-tmpl-drawer-content-edit-settings',

		regions: {
			settingTitle: '.nf-setting-title',
			settingGroups: '.nf-setting-groups'
		},

		initialize: function( data ) {
			this.dataModel = data.model;
			this.groupCollection = data.groupCollection;
		},

		onRender: function() {
			var currentDomain = nfRadio.channel( 'app' ).request( 'get:currentDomain' );
			var titleView = currentDomain.get( 'getSettingsTitleView' ).call( currentDomain, { model: this.model } );

			this.settingTitle.show( titleView );
			this.settingGroups.show( new itemSettingGroupCollectionView( { collection: this.groupCollection, dataModel: this.dataModel } ) );
		},

		templateHelpers: function () {
	    	return {
	    		maybeRenderTitle: function() {
	    			if ( 'undefined' !== typeof this.type ) {
	    				var title = _.template( jQuery( '#nf-tmpl-drawer-content-edit-settings-title' ).html() );
	    				return title( this );
	    			} else {
	    				return '';
	    			}
	    		},

	    		renderTypeNicename: function() {
	    			var currentDomain = nfRadio.channel( 'app' ).request( 'get:currentDomain' );
					var domainID = currentDomain.get( 'id' );
	    			var type = nfRadio.channel( domainID ).request( 'get:type', this.type );
	    			return type.get( 'nicename' );
				},
			};
		},
	});

	return view;
} );