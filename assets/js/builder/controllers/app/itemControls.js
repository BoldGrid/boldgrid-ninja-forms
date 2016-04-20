/**
 * Listens for clicks on our action item action buttons.
 * 
 * @package Ninja Forms builder
 * @subpackage Fields - Main Sortable
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			// Listen for clicks to edit, delete, duplicate actions.
			this.listenTo( nfRadio.channel( 'app' ), 'click:edit', this.clickEdit );
			this.listenTo( nfRadio.channel( 'app' ), 'click:delete', this.clickDelete );
			this.listenTo( nfRadio.channel( 'app' ), 'click:duplicate', this.clickDuplicate );

			// Listen for our drawer close and remove our active edit state
		},

		/**
		 * Open a drawer with our action model for editing settings.
		 * 
		 * @since  3.0
		 * @param  Object			e     	event
		 * @param  backbone.model 	model 	action model
		 * @return void
		 */
		clickEdit: function( e, model ) {
			var currentDomain = nfRadio.channel( 'app' ).request( 'get:currentDomain' );
			var currentDomainID = currentDomain.get( 'id' );
			var type = nfRadio.channel( currentDomainID ).request( 'get:type' , model.get( 'type' ) );
			nfRadio.channel( 'app' ).request( 'open:drawer', 'editSettings', { model: model, groupCollection: type.get( 'settingGroups' ) } );
		},

		/**
		 * Delete a action model from our collection
		 * 
		 * @since  3.0
		 * @param  Object			e     	event
		 * @param  backbone.model 	model 	action model
		 * @return void
		 */
		clickDelete: function( e, dataModel ) {
			var newModel = nfRadio.channel( 'app' ).request( 'clone:modelDeep', dataModel );

			// Add our action deletion to our change log.
			var label = {
				object: dataModel.get( 'objectType' ),
				label: dataModel.get( 'label' ),
				change: 'Removed',
				dashicon: 'dismiss'
			};

			var data = {
				collection: dataModel.collection
			};

			var changeCollection = nfRadio.channel( 'changes' ).request( 'get:collection' );
			var results = changeCollection.where( { model: dataModel } );

			_.each( results, function( changeModel ) {
				var data = changeModel.get( 'data' );
				if ( 'undefined' != typeof data.fields ) {
					_.each( data.fields, function( field, index ) {
						if ( field.model == dataModel ) {
							data.fields[ index ].model = newModel;					
						}
					} );
				}
				changeModel.set( 'data', data );
				changeModel.set( 'model', newModel );
				changeModel.set( 'disabled', true );
			} );

			nfRadio.channel( 'changes' ).request( 'register:change', 'removeObject', newModel, null, label, data );
			
			var currentDomain = nfRadio.channel( 'app' ).request( 'get:currentDomain' );
			var currentDomainID = currentDomain.get( 'id' );
			nfRadio.channel( currentDomainID ).request( 'delete', dataModel );
		},

		/**
		 * Duplicate a action within our collection, adding the word "copy" to the label.
		 * 
		 * @since  3.0
		 * @param  Object			e     	event
		 * @param  backbone.model 	model 	action model
		 * @return void
		 */
		clickDuplicate: function( e, model ) {
			var newModel = nfRadio.channel( 'app' ).request( 'clone:modelDeep', model );
			var currentDomain = nfRadio.channel( 'app' ).request( 'get:currentDomain' );
			var currentDomainID = currentDomain.get( 'id' );

			// Change our label.
			newModel.set( 'label', newModel.get( 'label' ) + ' Copy' );
			// Update our ID to the new tmp id.
			var tmpID = nfRadio.channel( currentDomainID ).request( 'get:tmpID' );
			newModel.set( 'id', tmpID );
			// Add new model.
			nfRadio.channel( currentDomainID ).request( 'add', newModel );
			
			// Add our action addition to our change log.
			var label = {
				object: model.get( 'objectType' ),
				label: model.get( 'label' ),
				change: 'Duplicated',
				dashicon: 'admin-page'
			};

			var data = {
				collection: nfRadio.channel( currentDomainID ).request( 'get:collection' )
			}

			nfRadio.channel( 'changes' ).request( 'register:change', 'duplicateObject', newModel, null, label, data );
			
			model.trigger( 'change:label', model );

			// Update preview.
			nfRadio.channel( 'app' ).request( 'update:db' );
		}

	});

	return controller;
} );