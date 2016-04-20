/**
 * Handles mobile-specific JS for our fields domain.
 * 
 * @package Ninja Forms builder
 * @subpackage Fields
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			// Listen for the start of our sorting.
			// this.listenTo( nfRadio.channel( 'app' ), 'render:fieldsSortable', this.initWiggle );
			// Listen for when we start sorting.
			this.listenTo( nfRadio.channel( 'fields' ), 'sortable:start', this.startWiggle );
			// Listen for when we stop sorting.
			this.listenTo( nfRadio.channel( 'fields' ), 'sortable:stop', this.stopWiggle );
		},

		initWiggle: function( view ) {
			if ( nfRadio.channel( 'app' ).request( 'is:mobile' ) ) {
				jQuery( view.el ).find( '.nf-field-wrap' ).on( 'taphold', function() {
					jQuery( this ).ClassyWiggle( 'start', { degrees: ['.65', '1', '.65', '0', '-.65', '-1', '-.65', '0'], delay: 50 } );
				} );
			}
		},

		startWiggle: function( ui ) {
			if ( nfRadio.channel( 'app' ).request( 'is:mobile' ) ) {
				jQuery( ui.item ).removeClass( 'ui-sortable-helper' ).ClassyWiggle( 'stop' );
				jQuery( ui.helper ).css( 'opacity', '0.75' ).ClassyWiggle( 'start', { degrees: ['.5', '1', '.5', '0', '-.5', '-1', '-.5', '0'] } );
			}
		},

		stopWiggle: function( ui ) {
			if ( nfRadio.channel( 'app' ).request( 'is:mobile' ) ) {
				jQuery( ui.helper ).ClassyWiggle( 'stop' );
				jQuery( ui.item ).removeClass( 'ui-sortable-helper drag-selected' );
			}
		}
	});

	return controller;
} );
