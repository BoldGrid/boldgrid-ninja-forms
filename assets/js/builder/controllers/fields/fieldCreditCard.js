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
          this.listenTo( nfRadio.channel( 'fields' ), 'after:addField', this.dropCreditCardField );
        },

        dropCreditCardField: function( fieldModel ) {

            if( 'creditcard' == fieldModel.get( 'type' ) ) {

                var order = fieldModel.get( 'order' );

                nfRadio.channel( 'fields' ).request( 'delete', fieldModel );

                _.each( [ 'creditcardfullname', 'creditcardnumber', 'creditcardcvc', 'creditcardexpiration', 'creditcardzip'], function( type ) {

                    var fieldType = nfRadio.channel( 'fields' ).request( 'get:type', type );

                    var newField = {
                        id: nfRadio.channel( 'fields' ).request( 'get:tmpID' ),
                        type: type,
                        label: fieldType.get( 'nicename' ),
                        order: order
                    };

                    nfRadio.channel( 'fields' ).request( 'add', newField );
                });
            }

        },

        stageCreditCardField: function( model ) {

            if( 'creditcard' == model.get( 'slug' ) ) {

                nfRadio.channel( 'fields' ).request( 'remove:stagedField', '', model );

                _.each( [ 'creditcardfullname', 'creditcardnumber', 'creditcardcvc', 'creditcardexpiration', 'creditcardzip'], function( type ) {
                    nfRadio.channel('fields').request('add:stagedField', type );
                });
            }
        }

    });

    return controller;
} );