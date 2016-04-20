/**
 * Collection that holds our action type models. 
 * 
 * @package Ninja Forms builder
 * @subpackage Actions
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['models/actions/typeModel'], function( actionTypeModel ) {
	var collection = Backbone.Collection.extend( {
		model: actionTypeModel
	} );
	return collection;
} );