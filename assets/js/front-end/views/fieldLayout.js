define( ['views/fieldItem', 'views/beforeField', 'views/afterField'], function( fieldItem, beforeField, afterField ) {

    var view = Marionette.LayoutView.extend({
        tagName: "nf-field",
        template: "#nf-tmpl-field-layout",

        regions: {
            beforeField: ".nf-before-field",
            field: ".nf-field",
            afterField: ".nf-after-field",
        },

        initialize: function() {
            this.model.on( 'change:visible', this.render, this );
        },

        onShow: function() {
            // this.beforeField.show( new beforeField( { model: this.model } ) );
            // this.field.show( new fieldItem( { model: this.model } ) );
            // this.afterField.show( new afterField( { model: this.model } ) );
        },

        onRender: function() {
            if ( this.model.get( 'visible' ) ) {
                this.beforeField.show( new beforeField( { model: this.model } ) );
                this.field.show( new fieldItem( { model: this.model } ) );
                this.afterField.show( new afterField( { model: this.model } ) );
            } else {
                this.beforeField.empty();
                this.field.empty();
                this.afterField.empty();
            }
        },

        templateHelpers: function() {
            return {
                renderContainerClass: function() {
                    var containerClass = ' label-' + this.label_pos + ' ';
                    // If we have a description position, add that to our container.
                    if ( 'undefined' != typeof this.desc_pos ) {
                        containerClass += 'desc-' + this.desc_pos + ' ';
                    }
                    // if we have a container_class field setting, add that to our container.
                    if ( 'undefined' != typeof this.container_class && 0 < jQuery.trim( this.container_class ).length ) {
                        containerClass += this.container_class + ' ';
                    }

                    return containerClass;
                }
            }
        }

    });

    return view;
} );
