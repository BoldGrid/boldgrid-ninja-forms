/**
 * Collection that holds our action models. 
 * This is the actual action data created by the user.
 *
 * We listen to the add and remove events so that we can push the new id to either the new action or removed action property.
 * 
 * @package Ninja Forms builder
 * @subpackage Actions
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['models/actions/actionModel'], function( actionModel ) {
	var collection = Backbone.Collection.extend( {
		model: actionModel,
		comparator: 'order',
		tmpNum: 1,

		initialize: function() {
			this.on( 'add', this.addAction, this );
			this.on( 'remove', this.removeAction, this );
			this.newIDs = [];
		},

		/**
		 * When we add a field, push the id onto our new action property.
		 * This lets us tell the server that this is a new field to be added rather than a field to be updated.
		 * 
		 * @since 3.0
		 * @param void
		 */
		addAction: function( model ) {
			this.newIDs.push( model.get( 'id' ) );
		},

		/**
		 * When we remove a field, push the id onto our removed action property.
		 * 
		 * @since 3.0
		 * @param void
		 */
		removeAction: function( model ) {
			this.removedIDs[ model.get( 'id' ) ] = model.get( 'id' );
		}
	} );
	return collection;
} );