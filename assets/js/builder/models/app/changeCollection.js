/**
 * Holds all of our change models.
 * 
 * @package Ninja Forms builder
 * @subpackage Fields
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['models/app/changeModel'], function( domainModel ) {
	var collection = Backbone.Collection.extend( {
		model: domainModel,

		comparator: function( model ) {
			var id = parseInt( model.cid.replace( 'c', '' ) );
			return -id;
		}
	} );
	return collection;
} );