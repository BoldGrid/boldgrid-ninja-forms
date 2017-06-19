define( [], function( ) {

    var view = Marionette.ItemView.extend({
        tagName: "nf-section",
        template: "#tmpl-nf-before-fields",

        templateHelpers: function () {
            return {

                renderFieldsMarkedRequired: function() {

                    var requiredFields = this.fields.filter( { required: 1 } );
                    return ( requiredFields.length ) ? this.fieldsMarkedRequired : '';
                },
            };
        },

    });

    return view;
} );