/**
 * Creates notices for our fields domain.
 * 
 * @package Ninja Forms builder
 * @subpackage Fields
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			this.listenTo( nfRadio.channel( 'fields' ), 'add:stagedField', this.addStagedField );
		},

		addStagedField: function( model ) {
			nfRadio.channel( 'notices' ).request( 'add', 'addStagedField', model.get( 'nicename' ) + ' added to staging' );
		}
	});

	return controller;
} );