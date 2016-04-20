/**
 * Collection view that takes our app menu items and renders an individual view for each.
 *
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( ['views/app/menuItem'], function( appMenuItemView ) {
	var view = Marionette.CollectionView.extend( {
		tagName: 'div',
		childView: appMenuItemView,

		/**
		 * When we show this view, get rid of the extra <div> tag added by backbone.
		 * 
		 * @since  3.0
		 * @return void
		 */
		onShow: function() {
			jQuery( this.el ).find( 'li:last' ).unwrap();
		}
	} );

	return view;
} );