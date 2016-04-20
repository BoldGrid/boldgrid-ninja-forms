/**
 * Model that represents our list options.
 * 
 * @package Ninja Forms builder
 * @subpackage Fields
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['models/app/optionRepeaterModel'], function( listOptionModel ) {
	var collection = Backbone.Collection.extend( {
		model: listOptionModel,
		comparator: 'order',

		initialize: function( models, options ) {
			// Listen to the 'sort' event
			this.on( 'sort', this.changeCollection, this );
			// Listen to the 'add' event
			this.on( 'add', this.addOption, this );
			this.settingModel = options.settingModel;
		},

		changeCollection: function() {
			// Trigger a 'sort:options' event so that our field model can update
			nfRadio.channel( 'option-repeater' ).trigger( 'sort:options', this );
			nfRadio.channel( 'option-repeater-' + this.settingModel.get( 'name' ) ).trigger( 'sort:options', this );
		},

		addOption: function( model, collection ) {
			model.set( 'settingModel', this.settingModel );
		}
	} );
	return collection;
} );