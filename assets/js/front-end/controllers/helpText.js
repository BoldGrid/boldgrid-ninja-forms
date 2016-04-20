/**
 * When a form is loaded, enable any help text that appears on the page.
 */
define([], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			this.listenTo( nfRadio.channel( 'form' ), 'render:view', this.initHelpText );
		},

		initHelpText: function( view ) {
			jQuery( view.el ).find( '.nf-help' ).each( function() {
				var jBox = jQuery( this ).jBox( 'Tooltip', {
					theme: 'TooltipBorder',
					content: jQuery( this ).data( 'text' )
				});
			} );
		}
	});

	return controller;
} );