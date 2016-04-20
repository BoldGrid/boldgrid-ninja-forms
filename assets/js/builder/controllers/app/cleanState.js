/**
 * Change the clean state of our app when settings are changed.
 * 
 * @package Ninja Forms builder
 * @subpackage Main App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			/*
			 * Set an array of field model attributes to ignore.
			 * This list will be filtered just before we ignore anything.
			 */ 
			this.ignoreAttributes = [
				'editActive'
			];

			this.listenTo( nfRadio.channel( 'app' ), 'update:setting', this.setAppClean );
		},

		setAppClean: function( model ) {
			for( var attr in model.changedAttributes() ) {
				var changedAttr = attr;
				var after = model.changedAttributes()[ attr ];
			}

			var ignoreAttributes = nfRadio.channel( 'undo-' + model.get( 'type' ) ).request( 'ignore:attributes', this.ignoreAttributes ) || this.ignoreAttributes;
			
			if ( -1 != this.ignoreAttributes.indexOf( attr ) ) {
				return false;
			}
			nfRadio.channel( 'app' ).request( 'update:setting', 'clean', false );
		}

	});

	return controller;
} );