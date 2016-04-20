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
            this.listenTo( nfRadio.channel( 'fields' ), 'drop:fieldType', this.dropField );
            this.listenTo( nfRadio.channel( 'fields' ), 'add:stagedField', this.stageField );
        },

        dropField: function( type, tmpID ) {

            if( 'password' == type ) {

                var model = nfRadio.channel( 'fields').request( 'get:field', tmpID );

                var order = model.get( 'order' );

                nfRadio.channel( 'fields' ).request( 'delete', model );

                _.each( [ 'password', 'passwordconfirm' ], function( type ) {

                    var fieldType = nfRadio.channel( 'fields' ).request( 'get:type', type );

                    var newField = {
                        id: nfRadio.channel( 'fields' ).request( 'get:tmpID' ),
                        type: type,
                        label: fieldType.get( 'nicename' ),
                        order: order
                    };

                    nfRadio.channel('fields').request('add', newField );
                });
            }

        },

        stageField: function( model ) {

            var field_slug = model.get( 'slug' );

            if( 'password' == field_slug ) {

                nfRadio.channel( 'fields' ).request( 'remove:stagedField', '', model );

                _.each( [ 'password', 'passwordconfirm' ], function( type ) {

                    var silent = ( type == field_slug );
                    nfRadio.channel('fields').request('add:stagedField', type, silent );
                });
            }
        }

    });

    return controller;
} );