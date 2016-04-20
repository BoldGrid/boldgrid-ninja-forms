/**
 * Collection that holds our field type models. 
 * 
 * @package Ninja Forms builder
 * @subpackage Fields
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['models/app/typeModel'], function( typeModel ) {
	var collection = Backbone.Collection.extend( {
		model: typeModel
	} );
	return collection;
} );