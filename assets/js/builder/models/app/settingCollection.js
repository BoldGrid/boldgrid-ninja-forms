/**
 * Collections of settings for each field type.
 * 
 * @package Ninja Forms builder
 * @subpackage Fields
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['models/app/settingModel'], function( settingModel ) {
	var collection = Backbone.Collection.extend( {
		model: settingModel,

		initialize: function( models, options ) {
			this.options = options || {};
		}
	} );
	return collection;
} );