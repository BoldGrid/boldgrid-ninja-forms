/**
 * Handles our saved fields type section.
 * 
 * @package Ninja Forms builder
 * @subpackage Fields - New Field Drawer
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['models/fields/typeSectionCollection'], function( fieldTypeSectionCollection ) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			// Create our collection for saved fields
			this.collection = new fieldTypeSectionCollection( [
				{ 
					id: 'saved',
					nicename: 'Saved Fields',
					classes: 'nf-saved',
					fieldTypes: []
				}
			] );
			// Respond to requests for our saved fields collection.
            nfRadio.channel( 'drawer' ).reply( 'get:savedFields', this.getSavedFields, this );
		},

        getSavedFields: function() {
            return this.collection;
        }
	});

	return controller;
} );