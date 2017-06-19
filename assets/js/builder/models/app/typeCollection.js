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
		model: typeModel,
		type: false,

		initialize: function( models, options ) {
			_.each( options, function( option, key ) {
				this[ key ] = option;
			}, this );
		}
	} );
	return collection;
} );