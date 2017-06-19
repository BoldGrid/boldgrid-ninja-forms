define( [], function() {
	var view = Marionette.ItemView.extend({
		tagName: 'div',
		template: '#tmpl-nf-import-options',

		initialize: function() {
			this.listenTo( nfRadio.channel( 'setting-type-options' ), 'click:extra', this.maybeOpenImport );
		},

		onAttach: function() {
			console.log( jQuery( this.el ).parent().parent() );

		},

		renderImportButton: function() {

		},

		onBeforeDestroy: function() {
			// this.model.off( 'change:addSavedLoading', this.render );
		},

		events: {
			'click .nf-button': 'clickImportOptions'
		},

		clickImportOptions: function( e ) {
			nfRadio.channel( 'drawer' ).trigger( 'click:ImportOptions', e, this.model );
		},

		maybeOpenImport: function( e, settingModel, DataModel, settingView ) {
			console.log( e );
		}
	});

	return view;
} );
