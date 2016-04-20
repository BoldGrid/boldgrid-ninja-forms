/**
 * Collection of staged fields.
 * 
 * @package Ninja Forms builder
 * @subpackage Fields
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['models/fields/stagingModel'], function( stagingModel ) {
	var collection = Backbone.Collection.extend( {
		model: stagingModel,
		comparator: 'order'
	} );
	return collection;
} );