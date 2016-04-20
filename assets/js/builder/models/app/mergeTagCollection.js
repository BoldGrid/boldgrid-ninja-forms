/**
 * Collections of merge tags.
 * 
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['models/app/mergeTagModel'], function( mergeTagModel ) {
	var collection = Backbone.Collection.extend( {
		model: mergeTagModel
	} );
	return collection;
} );