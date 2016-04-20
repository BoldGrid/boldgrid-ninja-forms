define( ['views/app/drawer/headerDefault', 'views/app/drawer/footerDefault'], function( defaultHeaderView, defaultFooterView ) {
	var model = Backbone.Model.extend( {
		defaults: {
			getHeaderView: function( data ) {
				return new defaultHeaderView( data );
			},

			getFooterView: function( data ) {
				return new defaultFooterView( data );
			}
		}
	} );
	
	return model;
} );