/**
 * Collection that holds our field models.
 * This is the actual field data created by the user.
 *
 * We listen to the add and remove events so that we can push the new id to either the new fields or removed fields property.
 *
 * @package Ninja Forms builder
 * @subpackage Fields
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['models/fields/fieldModel'], function( fieldModel ) {
	var collection = Backbone.Collection.extend( {
		model: fieldModel,
		comparator: function( model ){
			return parseInt( model.get( 'order' ) );
		},
		tmpNum: 1,

		initialize: function() {
			this.on( 'add', this.addField, this );
			this.on( 'remove', this.removeField, this );

			this.listenTo( this, 'add:field', this.addNewField );
			this.listenTo( this, 'append:field', this.appendNewField );
			this.listenTo( this, 'remove:field', this.removeFieldResponse );
			this.newIDs = [];
		},

		/**
		 * When we add a field, push the id onto our new fields property.
		 * This lets us tell the server that this is a new field to be added rather than a field to be updated.
		 *
		 * @since 3.0
		 * @param void
		 */
		addField: function( model ) {
			this.newIDs.push( model.get( 'id' ) );
		},

		/**
		 * When we remove a field, push the id onto our removed fields property.
		 *
		 * @since 3.0
		 * @param void
		 */
		removeField: function( model ) {
			this.removedIDs = this.removedIDs || {};
			this.removedIDs[ model.get( 'id' ) ] = model.get( 'id' );
		},

		addNewField: function( model ) {
			this.add( model );
		},

		appendNewField: function( model ) {
			if ( 0 == this.length ) {
				var order = 0;
			} else {
				var order = this.at( this.length -1 ).get( 'order' ) + 1;
			}

			model.set( 'order', order, { silent: true } );
			this.add( model );
		},

		removeFieldResponse: function( model ) {
			this.remove( model );
		},

		fieldExists: function( fieldModel ) {
			return -1 != this.indexOf( fieldModel );
		}
	} );
	return collection;
} );
