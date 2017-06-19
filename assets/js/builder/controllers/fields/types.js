/**
 * Creates and stores a collection of field types. This includes all of the settings shown when editing a field.
 *
 * 1) Create our settings sections config
 * 2) Loops over our preloaded data and adds that to our field type collection
 *
 * Also responds to requests for data about field types
 *
 * @package Ninja Forms builder
 * @subpackage Fields
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [
		'models/app/typeCollection',
		'models/fields/typeSectionCollection'
	],
	function(
		TypeCollection,
		SectionCollection
	) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			// Config for our settings sections
			this.sections = new SectionCollection( fieldTypeSections );

			this.listenTo( nfRadio.channel( 'fields' ), 'init:typeModel', this.registerSection );

			// Create our field type collection
			this.collection = new TypeCollection( fieldTypeData, { type: 'fields' } );

			// Respond to requests to get field type, collection, settings, and sections
			nfRadio.channel( 'fields' ).reply( 'get:type', this.getFieldType, this );
			nfRadio.channel( 'fields' ).reply( 'get:typeCollection', this.getTypeCollection, this );
			nfRadio.channel( 'fields' ).reply( 'get:typeSections', this.getTypeSections, this );
			nfRadio.channel( 'fields' ).reply( 'get:savedFields', this.getSavedFields, this );

			// Listen to clicks on field types
			this.listenTo( nfRadio.channel( 'drawer' ), 'click:fieldType', this.addField );
		},

		registerSection: function( typeModel ) {
			if ( 'fields' != typeModel.collection.type || ! typeModel.get( 'section' ) ) return;

			this.sections.get( typeModel.get( 'section' ) ).get( 'fieldTypes' ).push( typeModel.get( 'id' ) );
		},

		/**
		 * Return a field type by id
		 *
		 * @since  3.0
		 * @param  string 			id 	field type
		 * @return backbone.model    	field type model
		 */
		getFieldType: function( id ) {
        	return this.collection.get( id );
        },

        /**
         * Return the entire field type collection
         *
         * @since  3.0
         * @param  string 				id 	[description]
         * @return backbone.collection    	field type collection
         */
		getTypeCollection: function( id ) {
        	return this.collection;
        },

        /**
         * Add a field type to our fields sortable when the field type button is clicked.
         *
         * @since 3.0
         * @param Object e event
         * @return void
         */
        addField: function( e ) {
			var type = jQuery( e.target ).data( 'id' );

			if( e.shiftKey ){
				nfRadio.channel( 'fields' ).request( 'add:stagedField', type );
				return;
			}

        	var fieldModel = nfRadio.channel( 'fields' ).request( 'add', {
				type: type,
				label: nfRadio.channel( 'fields' ).request( 'get:type', type ).get( 'nicename' )
			});

			var label = {
				object: 'Field',
				label: fieldModel.get( 'label' ),
				change: 'Added',
				dashicon: 'plus-alt'
			};

			var data = {
				collection: nfRadio.channel( 'fields' ).request( 'get:collection' )
			}

			nfRadio.channel( 'changes' ).request( 'register:change', 'addObject', fieldModel, null, label, data );

			// Re-Draw the Field Collection
			nfRadio.channel( 'fields' ).request( 'redraw:collection' );
        },

        /**
         * Return our field type settings sections
         *
         * @since  3.0
         * @return backbone.collection field type settings sections
         */
        getTypeSections: function() {
            return this.sections;
        },

        /**
         * Return our saved fields
         *
         * @since  3.0
         * @return backbone.collection
         */
        getSavedFields: function() {
        	this.sections.get( 'saved' );
        }
	});

	return controller;
} );
