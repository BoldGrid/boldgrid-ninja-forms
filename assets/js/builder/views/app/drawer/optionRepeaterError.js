define( [], function() {
	var view = Marionette.ItemView.extend({
		tagName: 'div',
		className: 'nf-error',
		template: '#tmpl-nf-edit-setting-option-repeater-error',

		templateHelpers: function() {
			var that = this;
			return {
				renderErrors: function() {
				    if ( 'undefined' != typeof that.errors ) {
    					return that.errors[ Object.keys( errors )[0] ];
 					} else {
 						return '';
 					}
				}
			}
		}
	});

	return view;
} );