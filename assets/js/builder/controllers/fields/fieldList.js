/**
 * Listens to our app channel to add the individual List Fields.
 *
 * @package Ninja Forms builder
 * @subpackage Main App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
    var controller = Marionette.Object.extend( {
        initialize: function() {
            this.listenTo( nfRadio.channel( 'option-repeater-option-label' ), 'update:option', this.updateOptionLabel );
            this.listenTo( nfRadio.channel( 'option-repeater-option-value' ), 'update:option', this.updateOptionValue );
        },

        updateOptionLabel: function( e, model, dataModel, settingModel ) {

            if( 'list' != fieldTypeData[ dataModel.get( 'type' ) ].parentType ) return;

            if( model.get( 'manual_value' ) ) return;

            value = jQuery.slugify( model.get( 'label' ), { separator: '-' } );

            model.set( 'value', value );
            model.trigger( 'change', model );

            // TODO: Set focus on value input
            // jQuery( e.target ).closest( 'nf-table-row' ).find( '*[data-id="value"] ).focus();
        },

        updateOptionValue: function( e, model, dataModel, settingModel ) {

            if( 'list' != fieldTypeData[ dataModel.get( 'type' ) ].parentType ) return;

            model.set( 'manual_value', true );
        },

    });

    return controller;
} );