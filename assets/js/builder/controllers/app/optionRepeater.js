/**
 * Handles tasks associated with our option-repeater.
 * 
 * Return our repeater child view.
 *
 * Also listens for changes to the options settings.
 * 
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['models/app/optionRepeaterModel', 'models/app/optionRepeaterCollection', 'views/app/drawer/optionRepeaterComposite'], function( listOptionModel, listOptionCollection, listCompositeView ) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			// Respond to requests for the childView for list type fields.
			nfRadio.channel( 'option-repeater' ).reply( 'get:settingChildView', this.getSettingChildView, this );
			
			// Listen for changes to our list options.
			this.listenTo( nfRadio.channel( 'option-repeater' ), 'change:option', this.changeOption );
			this.listenTo( nfRadio.channel( 'option-repeater' ), 'click:addOption', this.addOption );
			this.listenTo( nfRadio.channel( 'option-repeater' ), 'click:deleteOption', this.deleteOption );

			// Respond to requests related to our list options sortable.
			nfRadio.channel( 'option-repeater' ).reply( 'update:optionSortable', this.updateOptionSortable, this );
			nfRadio.channel( 'option-repeater' ).reply( 'stop:optionSortable', this.stopOptionSortable, this );
			nfRadio.channel( 'option-repeater' ).reply( 'start:optionSortable', this.startOptionSortable, this );
		},

		/**
		 * Update an option value in our model.
		 * 
		 * @since  3.0
		 * @param  Object			e          event
		 * @param  backbone.model 	model      option model
		 * @param  backbone.model 	dataModel
		 * @return void
		 */
		changeOption: function( e, model, dataModel, settingModel ) {
			var name = jQuery( e.target ).data( 'id' );
			if ( 'selected' == name ) {
				if ( jQuery( e.target ).attr( 'checked' ) ) {
					var value = 1;
				} else {
					var value = 0;
				}
			} else {
				var value = jQuery( e.target ).val();
			}
			
			var before = model.get( name );

			model.set( name, value );
			// Triger an update on our dataModel
			this.triggerDataModel( model, dataModel );

			var after = value;
			
			var changes = {
				attr: name,
				before: before,
				after: after
			}

			var label = {
				object: dataModel.get( 'objectType' ),
				label: dataModel.get( 'label' ),
				change: 'Option ' + model.get( 'label' ) + ' ' + name + ' changed from ' + before + ' to ' + after
			};

			nfRadio.channel( 'changes' ).request( 'register:change', 'changeSetting', model, changes, label );
			nfRadio.channel( 'option-repeater' ).trigger( 'update:option', model, dataModel, settingModel );
			nfRadio.channel( 'option-repeater-' + settingModel.get( 'name' ) ).trigger( 'update:option', model, dataModel, settingModel );
		},

		/**
		 * Add an option to our list
		 * 
		 * @since 3.0
		 * @param backbone.collection 	collection 	list option collection
		 * @param backbone.model 		dataModel
		 * @return void
		 */
		addOption: function( collection, dataModel ) {
			var modelData = {
				order: collection.length,
				new: true,
				options: {}
			};
			_.each( collection.settingModel.get( 'columns' ), function( col, key ) {
				modelData[ key ] = col.default;

				if( 'undefined' != typeof col.options ){
					modelData.options[ key ] = col.options;
				}
			} );
			var model = new listOptionModel( modelData );
			collection.add( model );

			// Add our field addition to our change log.
			var label = {
				object: dataModel.get( 'objectType' ),
				label: dataModel.get( 'label' ),
				change: 'Option Added',
				dashicon: 'plus-alt'
			};

			nfRadio.channel( 'changes' ).request( 'register:change', 'addListOption', model, null, label );
			nfRadio.channel( 'option-repeater-' + collection.settingModel.get( 'name' ) ).trigger( 'add:option', model );
			nfRadio.channel( 'option-repeater' ).trigger( 'add:option', model );
			this.triggerDataModel( model, dataModel );
		},

		/**
		 * Delete an option from our list
		 * 
		 * @since  3.0
		 * @param backbone.model 		model       list option model
		 * @param backbone.collection 	collection 	list option collection
		 * @param backbone.model 		dataModel
		 * @return void
		 */
		deleteOption: function( model, collection, dataModel ) {
			var newModel = nfRadio.channel( 'app' ).request( 'clone:modelDeep', model );

			// Add our field deletion to our change log.
			var label = {
				object: dataModel.get( 'objectType' ),
				label: dataModel.get( 'label' ),
				change: 'Option ' + newModel.get( 'label' ) + ' Removed',
				dashicon: 'dismiss'
			};

			var data = {
				collection: collection
			}

			nfRadio.channel( 'changes' ).request( 'register:change', 'removeListOption', newModel, null, label, data );
			
			var changeCollection = nfRadio.channel( 'changes' ).request( 'get:collection' );
			var results = changeCollection.where( { model: model } );

			_.each( results, function( changeModel ) {
				if ( 'object' == typeof changeModel.get( 'data' ) ) {
					_.each( changeModel.get( 'data' ), function( dataModel ) {
						if ( dataModel.model == dataModel ) {
							dataModel.model = newModel;
						}
					} );
				}
				changeModel.set( 'model', newModel );
				changeModel.set( 'disabled', true );
			} );

			collection.remove( model );
			nfRadio.channel( 'option-repeater' ).trigger( 'remove:option', model );
			nfRadio.channel( 'option-repeater-' + collection.settingModel.get( 'name' ) ).trigger( 'remove:option', model );
			this.triggerDataModel( model, dataModel );
		},

		/**
		 * Creates an arbitrary value on our collection, then clones and updates that collection.
		 * This forces a change event to be fired on the dataModel where the list option collection data is stored.
		 * 
		 * @since  3.0
		 * @param backbone.collection 	collection 	list option collection
		 * @param backbone.model 		dataModel
		 * @return void
		 */
		triggerDataModel: function( model, dataModel ) {
			nfRadio.channel( 'app' ).trigger( 'update:setting', model );	
		},

		/**
		 * Return our list composite view to the setting collection view.
		 * 
		 * @since  3.0
		 * @param  backbone.model 	model 	settings model
		 * @return void
		 */
		getSettingChildView: function( model ) {
			return listCompositeView;
		},

		/**
		 * When we sort our list options, change the order in our option model and trigger a change.
		 * 
		 * @since  3.0
		 * @param  Object	 		sortable 	jQuery UI element
		 * @param  backbone.model 	setting  	Setting model
		 * @return void
		 */
		updateOptionSortable: function( ui, sortable, setting ) {
			
			var newOrder = jQuery( sortable ).sortable( 'toArray' );
			var dragModel = setting.collection.get( { cid: jQuery( ui.item ).prop( 'id' ) } );
			var data = {
				collection: setting.collection,
				objModels: []
			};

			_.each( newOrder, function( cid, index ) {
				var optionModel = setting.collection.get( { cid: cid } );
				var oldPos = optionModel.get( 'order' );
				optionModel.set( 'order', index );
				var newPos = index;

				data.objModels.push( {
					model: optionModel,
					attr: 'order',
					before: oldPos,
					after: newPos
				} );
			} );
			
			setting.collection.sort( { silent: true } );
			
			var label = {
				object: setting.dataModel.get( 'objectType' ),
				label: setting.dataModel.get( 'label' ),
				change: 'Option ' + dragModel.get( 'label' ) + ' re-ordered from ' + dragModel._previousAttributes.order + ' to ' + dragModel.get( 'order' ),
				dashicon: 'sort'
			};

			nfRadio.channel( 'changes' ).request( 'register:change', 'sortListOptions', dragModel, null, label, data );
			this.triggerDataModel( dragModel, setting.dataModel );
			nfRadio.channel( 'option-repeater' ).trigger( 'sort:option', dragModel, setting );
			nfRadio.channel( 'option-repeater-' + setting.get( 'name' ) ).trigger( 'sort:option', dragModel, setting );
		},

		/**
		 * When we stop sorting our list options, reset our item opacity.
		 * 
		 * @since  3.0
		 * @param  Object ui jQuery UI element
		 * @return void
		 */
		stopOptionSortable: function( ui ) {
			jQuery( ui.item ).css( 'opacity', '' );
		},

		/**
		 * When we start sorting our list options, remove containing divs and set our item opacity to 0.5
		 * 
		 * @since  3.0
		 * @param  Objects ui jQuery UI element
		 * @return void
		 */
		startOptionSortable: function( ui ) {
			jQuery( ui.placeholder ).find( 'div' ).remove();
			jQuery( ui.item ).css( 'opacity', '0.5' ).show();
		}

	});

	return controller;
} );