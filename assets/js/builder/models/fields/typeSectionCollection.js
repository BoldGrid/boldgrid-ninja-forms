/**
 * Collection that holds our field models.
 * 
 * @package Ninja Forms builder
 * @subpackage Fields
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['models/fields/typeSectionModel'], function( typeSectionModel ) {
	var collection = Backbone.Collection.extend( {
		model: typeSectionModel
	} );
	return collection;
} );