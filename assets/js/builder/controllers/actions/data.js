/**
 * Handles interactions with our actions collection.
 * 
 * @package Ninja Forms builder
 * @subpackage Actions
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['models/actions/actionCollection', 'models/actions/actionModel'], function( actionCollection, actionModel ) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			// Load our action collection from our localized form data
			this.collection = new actionCollection( preloadedFormData.actions );
			this.collection.tmpNum = 1;

			if ( 0 != this.collection.models.length ) {
				var that = this;
				_.each( this.collection.models, function( action ) {
					if ( ! jQuery.isNumeric( action.get( 'id' ) ) ) {
						that.collection.tmpNum++;
					}
				} );
			}
			// Set our removedIDs to an empty object. This will be populated when a action is removed so that we can add it to our 'deleted_actions' object.
			this.collection.removedIDs = {};

			// Respond to requests for data about actions and to update/change/delete actions from our collection.
			nfRadio.channel( 'actions' ).reply( 'get:collection', this.getCollection, this );
			nfRadio.channel( 'actions' ).reply( 'get:action', this.getAction, this );
			nfRadio.channel( 'actions' ).reply( 'get:tmpID', this.getTmpID, this );

			nfRadio.channel( 'actions' ).reply( 'add', this.addAction, this );
			nfRadio.channel( 'actions' ).reply( 'delete', this.deleteAction, this );
		},

		getCollection: function() {
			return this.collection;
		},

		getAction: function( id ) {
			return this.collection.get( id );
		},

		/**
		 * Add a action to our collection. If silent is passed as true, no events will trigger.
		 * 
		 * @since 3.0
		 * @param Object 	data 	action data to insert
		 * @param bool 		silent 	prevent events from firing as a result of adding	 	
		 */
		addAction: function( data, silent ) {
			silent = silent || false;

			if ( false === data instanceof Backbone.Model ) {
				var model = new actionModel( data );
			} else {
				var model = data;
			}

			this.collection.add( model, { silent: silent } );
			// Set our 'clean' status to false so that we get a notice to publish changes
			nfRadio.channel( 'app' ).request( 'update:setting', 'clean', false );

			return model;
		},

		/**
		 * Delete a action from our collection.
		 * 
		 * @since  3.0
		 * @param  backbone.model 	model 	action model to be deleted
		 * @return void
		 */
		deleteAction: function( model ) {
			this.collection.remove( model );
			// Set our 'clean' status to false so that we get a notice to publish changes
			nfRadio.channel( 'app' ).request( 'update:setting', 'clean', false );
			nfRadio.channel( 'app' ).request( 'update:db' );

		},


		/**
		 * Return a new tmp id for our actions.
		 * Gets the action collection length, adds 1, then returns that prepended with 'tmp-'.
		 * 
		 * @since  3.0
		 * @return string
		 */
		getTmpID: function() {
			var tmpNum = this.collection.tmpNum;
			this.collection.tmpNum++;
			return 'tmp-' + tmpNum;
		}
	});

	return controller;
} );