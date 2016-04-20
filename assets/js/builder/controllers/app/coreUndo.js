/**
 * All of the core undo functions. Listens on the 'changes' channel for an undo request.
 * 
 * @package Ninja Forms builder
 * @subpackage Main App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			nfRadio.channel( 'changes' ).reply( 'undo:changeSetting', this.undoChangeSetting, this );
			nfRadio.channel( 'changes' ).reply( 'undo:addObject', this.undoAddObject, this );
			nfRadio.channel( 'changes' ).reply( 'undo:removeObject', this.undoRemoveObject, this );
			nfRadio.channel( 'changes' ).reply( 'undo:duplicateObject', this.undoDuplicateObject, this );

			nfRadio.channel( 'changes' ).reply( 'undo:sortFields', this.undoSortFields, this );
			nfRadio.channel( 'changes' ).reply( 'undo:addListOption', this.undoAddListOption, this );
			nfRadio.channel( 'changes' ).reply( 'undo:removeListOption', this.undoRemoveListOption, this );
			nfRadio.channel( 'changes' ).reply( 'undo:sortListOptions', this.undoSortListOptions, this );
		},

		/**
		 * Undo settings that have been changed.
		 * 
		 * @since  3.0
		 * @param  backbone.model 	change 	model of our change
		 * @param  boolean 			undoAll are we in the middle of an undo all action?
		 * @return void
		 */
		undoChangeSetting: function( change, undoAll ) {
			var fieldModel = change.get( 'model' );
			var changes = change.get( 'changes' );
			var attr = changes.attr;
			var before = changes.before;
			fieldModel.set( attr, before );
			this.maybeRemoveChange( change, undoAll );
		},

		/**
		 * Undo adding a field or an action.
		 * Loops through our change collection and removes any change models based upon the one we're removing.
		 * 
		 * @since  3.0
		 * @param  backbone.model 	change 	model of our change
		 * @param  boolean 			undoAll are we in the middle of an undo all action?
		 * @return void
		 */
		undoAddObject: function( change, undoAll ) {
			var objectModel = change.get( 'model' );
			var collection = change.get( 'data' ).collection;

			delete collection.newIDs[ objectModel.get( 'id' ) ];
			
			if ( ! undoAll ) {
				var changeCollection = nfRadio.channel( 'changes' ).request( 'get:collection' );
				var results = changeCollection.where( { model: objectModel } );

				_.each( results, function( model ) {
					if ( model !== change ) {
						changeCollection.remove( model );
					}
				} );				
			}
			
			collection.remove( objectModel );
			this.maybeRemoveChange( change, undoAll );
		},		

		/**
		 * Undo adding a field or an action.
		 * Loops through our change collection and removes any change models based upon the one we're removing.
		 * 
		 * @since  3.0
		 * @param  backbone.model 	change 	model of our change
		 * @param  boolean 			undoAll are we in the middle of an undo all action?
		 * @return void
		 */
		undoDuplicateObject: function( change, undoAll ) {
			var objectModel = change.get( 'model' );
			var objectCollection = change.get( 'data' ).collection;

			if ( ! undoAll ) {
				var changeCollection = nfRadio.channel( 'changes' ).request( 'get:collection' );
				var results = changeCollection.where( { model: objectModel } );

				_.each( results, function( model ) {
					if ( model !== change ) {
						changeCollection.remove( model );
					}
				} );				
			}

			objectCollection.remove( objectModel );
			this.maybeRemoveChange( change, undoAll );
		},

		/**
		 * Undo removing a field or an action.
		 * 
		 * @since  3.0
		 * @param  backbone.model 	change 	model of our change
		 * @param  boolean 			undoAll are we in the middle of an undo all action?
		 * @return void
		 */
		undoRemoveObject: function( change, undoAll ) {
			var dataModel = change.get( 'model' );
			var collection = change.get( 'data' ).collection;

			nfRadio.channel( dataModel.get( 'objectDomain' ) ).request( 'add', dataModel );

			delete collection.removedIDs[ dataModel.get( 'id' ) ];
			
			if ( ! undoAll ) {
				var changeCollection = nfRadio.channel( 'changes' ).request( 'get:collection' );
				var results = changeCollection.where( { model: dataModel } );

				_.each( results, function( model ) {
					if ( model !== change ) {
						model.set( 'disabled', false );
					}
				} );				
			}

			// Trigger a reset on our field collection so that our view re-renders
			collection.trigger( 'reset', collection );

			this.maybeRemoveChange( change, undoAll );
		},

		/**
		 * Undo field sorting.
		 * 
		 * @since  3.0
		 * @param  backbone.model 	change 	model of our change
		 * @param  boolean 			undoAll are we in the middle of an undo all action?
		 * @return void
		 */
		undoSortFields: function( change, undoAll ) {
			var data = change.get( 'data' );
			var fields = data.fields;

			var fieldCollection = nfRadio.channel( 'fields' ).request( 'get:collection' );
			_.each( fields, function( changeModel ) {
				var before = changeModel.before;
				var fieldModel = changeModel.model;
				fieldModel.set( 'order', before );
				// console.log( 'set ' + fieldModel.get( 'label' ) + ' to ' + before );
			} );
			// console.log( fieldCollection.where( { label: 'Name' } ) );
			// console.log( fieldCollection.where( { label: 'Email' } ) );


			fieldCollection.sort();
			this.maybeRemoveChange( change, undoAll );
		},

		undoAddListOption: function( change, undoAll ) {
			var model = change.get( 'model' );

			if ( ! undoAll ) {
				var changeCollection = nfRadio.channel( 'changes' ).request( 'get:collection' );
				var results = changeCollection.where( { model: model } );

				_.each( results, function( changeModel ) {
					if ( changeModel !== change ) {
						changeCollection.remove( changeModel );
					}
				} );				
			}

			model.collection.remove( model );
			this.maybeRemoveChange( change, undoAll );
		},

		undoRemoveListOption: function( change, undoAll ) {
			var model = change.get( 'model' );
			var collection = change.get( 'data' ).collection;
			collection.add( model );

			if ( ! undoAll ) {
				var changeCollection = nfRadio.channel( 'changes' ).request( 'get:collection' );
				var results = changeCollection.where( { model: model } );

				_.each( results, function( model ) {
					if ( model !== change ) {
						model.set( 'disabled', false );
					}
				} );				
			}

			this.maybeRemoveChange( change, undoAll );
		},

		undoSortListOptions: function( change, undoAll ) {
			var data = change.get( 'data' );
			var collection = data.collection;
			
			var objModels = data.objModels;

			_.each( objModels, function( changeModel ) {
				var before = changeModel.before;
				var optionModel = changeModel.model;
				optionModel.set( 'order', before );
			} );				


			collection.sort();
			this.maybeRemoveChange( change, undoAll );
		},

		/**
		 * If our undo action was requested to 'remove' the change from the collection, remove it.
		 * 
		 * @since  3.0
		 * @param  backbone.model 	change 	model of our change
		 * @param  boolean 			remove 	should we remove this item from our change collection
		 * @return void
		 */
		maybeRemoveChange: function( change, undoAll ) {			
			var undoAll = typeof undoAll !== 'undefined' ? undoAll : false;
			if ( ! undoAll ) {
				// Update preview.
				nfRadio.channel( 'app' ).request( 'update:db' );
				var changeCollection = nfRadio.channel( 'changes' ).request( 'get:collection' );
				changeCollection.remove( change );
				if ( 0 == changeCollection.length ) {
					nfRadio.channel( 'app' ).request( 'update:setting', 'clean', true );
					nfRadio.channel( 'app' ).request( 'close:drawer' );
				}
			}
		}

	});

	return controller;
} );