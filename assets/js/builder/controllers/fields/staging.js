/**
 * Handles most things related to our staging area:
 * 1) Creates a collection
 * 2) Listens for requests to CRUD items from the collection
 * 3) Adds our staged fields to the fields sortable when the drawer is closed
 * 
 * @package Ninja Forms builder
 * @subpackage Fields - New Field Drawer
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['models/fields/stagingCollection'], function( stagingCollection ) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			// Create our staged fields collection
			this.collection = new stagingCollection();
			// Respond to requests related to our staging area.
		    nfRadio.channel( 'fields' ).reply( 'add:stagedField', this.addStagedField, this );
			nfRadio.channel( 'fields' ).reply( 'remove:stagedField', this.removeStagedField, this );
			nfRadio.channel( 'fields' ).reply( 'get:staging', this.getStagingCollection, this );
			nfRadio.channel( 'fields' ).reply( 'sort:staging', this.sortStagedFields, this );
			nfRadio.channel( 'fields' ).reply( 'clear:staging', this.clearStagedFields, this );
			// Listen to our remove staged field click event.
			this.listenTo( nfRadio.channel( 'drawer-addField' ), 'click:removeStagedField', this.removeStagedField );
			// Listen to our event that fires just before a drawer is closed.
			this.listenTo( nfRadio.channel( 'drawer-addField' ), 'before:closeDrawer', this.beforeCloseDrawer );
		},

		getStagingCollection: function() {
			return this.collection;
		},

		/**
		 * Add a field to our staging area
		 * 
		 * @since 3.0
		 * @param string type Type of field we're adding
		 * @return tmpID
		 */
		addStagedField: function( type, silent ) {
			var silent = silent || false;
			// Get our type model from the string.
			var fieldType = nfRadio.channel( 'fields' ).request( 'get:type', type );
			// Our tmp ID is a string with the time appended to make it unique.
			var tmpID = 'nf-staged-field-' + jQuery.now();
			// Object that will be added to our staging collection.
			var data = {
				id: tmpID,
				// i.e. firstname, textbox, etc.
				slug: fieldType.get( 'type' ),
				// i.e. First Name, Textbox, etc.
				nicename: fieldType.get( 'nicename' ),
				// i.e. calendar, envelope, etc.
				icon: fieldType.get( 'icon' )
			}
			// 
			var model = this.collection.add( data );

			if( ! silent ) nfRadio.channel( 'fields').trigger( 'add:stagedField', model );

			return tmpID;
		},

		/**
		 * Remove a field from staging
		 * 
		 * @since  3.0
		 * @param  Object 			e     	Event
		 * @param  Backbone.model 	model 	staged field model to remove
		 * @return void
		 */
		removeStagedField: function( e, model ) {
			this.collection.remove( model );
			nfRadio.channel( 'fields' ).trigger( 'remove:stagedField', model );
		},

		/**
		 * Adds our staged fields to the main fields sortable before the drawer is closed.
		 * 
		 * @since  3.0
		 * @return void
		 */
		beforeCloseDrawer: function() {
			if ( 0 != this.collection.models.length ) { // Make sure that we have models
				// Get our field collection.
				var fieldCollection = nfRadio.channel( 'fields' ).request( 'get:collection' );

				var fields = [];
				// Loop through our staging collection
				_.each( this.collection.models, function( model ) {
					// Get a tmp ID for our new field.
					var tmpID = nfRadio.channel( 'fields' ).request( 'get:tmpID' );
					// Create an object that can be added as a model.
					var tmpField = { id: tmpID, label: model.get( 'nicename' ), type: model.get( 'slug' ) };
					// Add our new field.
					var newModel = nfRadio.channel( 'fields' ).request( 'add',  tmpField, false );
					// Add our field addition to our change log.
					var label = {
						object: 'Field',
						label: newModel.get( 'label' ),
						change: 'Added',
						dashicon: 'plus-alt'
					};
					var data = {
						collection: fieldCollection
					}
					nfRadio.channel( 'changes' ).request( 'register:change', 'addObject', newModel, null, label, data );
			
				} );
				// Trigger a reset on our field collection so that our view re-renders
				fieldCollection.trigger( 'reset', fieldCollection );
				// Empty the staging collection
				this.collection.reset();
			}
			// Sort our fields.
			nfRadio.channel( 'fields' ).request( 'sort:fields', null, null, false );
		},

		/**
		 * Sort our staging area by the 'order' attribute.
		 * 
		 * @since  3.0
		 * @return void
		 */
		sortStagedFields: function() {
			// Get our staged fields sortable.
			var sortableEl = nfRadio.channel( 'app' ).request( 'get:stagedFieldsEl' );
			// Get the current order using jQuery sortable. Will be an array of IDs: [tmp-blah, tmp-blah]
			var order = jQuery( sortableEl ).sortable( 'toArray' );
			// Loop through our models
			_.each( this.collection.models, function( field ) {
				// Search our order array for this field.
				var search = field.get( 'id' );
				var pos = order.indexOf( search );
				// Update our staged field model with the new order.
				field.set( 'order', pos );
			} );
			// Sort our staging collection.
			this.collection.sort();
		},

		clearStagedFields: function() {
			this.collection.reset();
		}

	});

	return controller;
} );