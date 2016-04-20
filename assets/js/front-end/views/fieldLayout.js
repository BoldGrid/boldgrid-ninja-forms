define( ['views/fieldItem', 'views/beforeField', 'views/afterField'], function( fieldItem, beforeField, afterField ) {

    var view = Marionette.LayoutView.extend({
        tagName: "nf-section",
        template: "#nf-tmpl-field-layout",

        regions: {
            beforeField: ".nf-before-field",
            field: ".nf-field",
            afterField: ".nf-after-field",
        },

        onRender: function() {
            this.$el = this.$el.children();
            this.$el.unwrap();
            this.setElement( this.$el );
        },

        onShow: function() {
            this.beforeField.show( new beforeField( { model: this.model } ) );
            this.field.show( new fieldItem( { model: this.model } ) );
            this.afterField.show( new afterField( { model: this.model } ) );
        }

    });

    return view;
} );