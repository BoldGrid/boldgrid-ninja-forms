/**
 * Collection that holds all of our drawer models.
 * 
 * @package Ninja Forms builder
 * @subpackage Fields
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['models/app/drawerModel'], function( drawerModel ) {
	var collection = Backbone.Collection.extend( {
		model: drawerModel
	} );
	return collection;
} );