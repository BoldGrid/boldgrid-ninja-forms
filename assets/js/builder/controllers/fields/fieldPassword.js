/**
 * Listens to our app channel to add the individual Credit Card Fields.
 *
 * @package Ninja Forms builder
 * @subpackage Main App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
    var controller = Marionette.Object.extend( {
        initialize: function() {
            this.listenTo( nfRadio.channel( 'fields' ), 'after:addField', this.addField );
        },

        addField: function( model ) {

            if( 'password' == model.get( 'type' ) ) {

                var order = model.get( 'order' );

                var confirm = this.insertField( 'passwordconfirm', order + 1 );

                confirm.set( 'confirm_field', model.get( 'key' ) );
            }
        },

        insertField: function( type, order ) {
            var fieldType = nfRadio.channel( 'fields' ).request( 'get:type', type );

            var newField = {
                id: nfRadio.channel( 'fields' ).request( 'get:tmpID' ),
                type: type,
                label: fieldType.get( 'nicename' ),
                order: order
            };

            return nfRadio.channel('fields').request('add', newField );
        }
    });

    return controller;
} );