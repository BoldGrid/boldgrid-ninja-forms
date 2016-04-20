/**
 * Add action drawer.
 *
 * TODO: make dynamic
 * 
 * @package Ninja Forms builder
 * @subpackage Actions
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['views/actions/drawer/typeCollection'], function( actionTypeCollectionView ) {

	var view = Marionette.LayoutView.extend( {
		template: '#nf-tmpl-drawer-content-add-action',

		regions: {
			primary: '#nf-drawer-primary',
			secondary: '#nf-drawer-secondary'
		},

		initialize: function() {
			this.listenTo( nfRadio.channel( 'drawer' ), 'filter:actionTypes', this.filteractionTypes );
			this.listenTo( nfRadio.channel( 'drawer' ), 'clear:filter', this.removeactionTypeFilter );
		
			this.installedActions = nfRadio.channel( 'actions' ).request( 'get:installedActions' );
			this.primaryCollection = this.installedActions;

			this.availableActions = nfRadio.channel( 'actions' ).request( 'get:availableActions' );
			this.secondaryCollection = this.availableActions;
		},

		onShow: function() {
			this.primary.show( new actionTypeCollectionView( { collection: this.primaryCollection } ) );
			this.secondary.show( new actionTypeCollectionView( { collection: this.secondaryCollection } ) );
		},

		getEl: function() {
			return jQuery( this.el ).parent();
		},

		filteractionTypes: function( filteredInstalled, filteredAvailable ) {
			this.primary.reset();
			this.secondary.reset();
			this.primary.show( new actionTypeCollectionView( { collection: filteredInstalled } ) );
			this.secondary.show( new actionTypeCollectionView( { collection: filteredAvailable } ) );
			
		},

		removeactionTypeFilter: function () {
			this.primary.show( new actionTypeCollectionView( { collection: this.installedActions } ) );
			this.secondary.show( new actionTypeCollectionView( { collection: this.availableActions } ) );
		}

	} );

	return view;
} );