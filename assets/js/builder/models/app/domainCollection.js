/**
 * Holds all of our domain models.
 * 
 * @package Ninja Forms builder
 * @subpackage Fields
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['models/app/domainModel'], function( domainModel ) {
	var collection = Backbone.Collection.extend( {
		model: domainModel
	} );
	return collection;
} );