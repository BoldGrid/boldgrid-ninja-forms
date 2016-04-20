/**
 * Collection of our type settings groups.
 * 
 * @package Ninja Forms builder
 * @subpackage Fields
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['models/app/settingGroupModel'], function( settingGroupModel ) {
	var collection = Backbone.Collection.extend( {
		model: settingGroupModel
	} );
	return collection;
} );