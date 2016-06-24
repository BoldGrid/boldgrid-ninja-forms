/**
 * Handles clicks and dragging for our action types.
 * 
 * @package Ninja Forms builder
 * @subpackage Fields - New Field Drawer
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['models/actions/actionCollection', 'models/actions/actionModel'], function( actionCollection, actionModel ) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			this.listenTo( nfRadio.channel( 'actions' ), 'click:addAction', this.addAction );

			nfRadio.channel( 'actions' ).reply( 'add:actionType', this.addAction, this );
		},

		/**
		 * Add an action to our collection. If silent is passed as true, no events will trigger.
		 * 
		 * @since 3.0
		 * @param Object 	data 	action data to insert
		 * @param bool 		silent 	prevent events from firing as a result of adding	 	
		 */
		addAction: function( type ) {
			var data = {
				id: nfRadio.channel( 'actions' ).request( 'get:tmpID' ),
				type: type.get( 'id' ),
				label: type.get( 'nicename' )
			}
			var newModel = nfRadio.channel( 'actions' ).request( 'add', data );
			var label = {
				object: 'Action',
				label: newModel.get( 'label' ),
				change: 'Added',
				dashicon: 'plus-alt'
			};

			var data = {
				collection: nfRadio.channel( 'actions' ).request( 'get:collection' )
			}

			nfRadio.channel( 'changes' ).request( 'register:change', 'addObject', newModel, null, label, data );
			nfRadio.channel( 'app' ).trigger( 'click:edit', {}, newModel );
		}
	});

	return controller;
} );