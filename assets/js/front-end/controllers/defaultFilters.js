/**
 * Default filters
 * 
 * @package Ninja Forms builder
 * @subpackage Main App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [ 'views/fieldCollection', 'models/fieldCollection' ], function( FieldCollectionView, FieldCollection ) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			this.listenTo( nfRadio.channel( 'form' ), 'before:filterData', this.registerDefaultDataFilter );
		},

		registerDefaultDataFilter: function( formModel ) {
			/*
			 * Set our default formContent load filter
			 */
			nfRadio.channel( 'formContent' ).request( 'add:loadFilter', this.defaultFormContentLoad, 10, this );
			/*
			 * Set our default formContentView.
			 */
			nfRadio.channel( 'formContent' ).request( 'add:viewFilter', this.defaultFormContentView, 10, this );
		},

		defaultFormContentLoad: function( formContentData, formModel, context ) {
			var fieldCollection = formModel.get( 'fields' );
			/*
			 * If we only have one load filter, we can just return the field collection.
			 */
			var formContentLoadFilters = nfRadio.channel( 'formContent' ).request( 'get:loadFilters' );
			var sortedArray = _.without( formContentLoadFilters, undefined );
			if ( 1 == sortedArray.length || 'undefined' == typeof formContentData || true === formContentData instanceof Backbone.Collection ) return formModel.get( 'fields' );

        	var fieldModels = _.map( formContentData, function( key ) {
        		return formModel.get( 'fields' ).findWhere( { key: key } );
        	}, this );

        	var currentFieldCollection = new FieldCollection( fieldModels );

        	fieldCollection.on( 'reset', function( collection ) {
        		var resetFields = [];
        		currentFieldCollection.each( function( fieldModel ) {
        			if ( 'submit' != fieldModel.get( 'type' ) ) {
        				resetFields.push( collection.findWhere( { key: fieldModel.get( 'key' ) } ) );
        			} else {
        				resetFields.push( fieldModel );
        			}
        		} );

                currentFieldCollection.options = { formModel: formModel };
        		currentFieldCollection.reset( resetFields );
        	} );

        	return currentFieldCollection;
        },

        defaultFormContentView: function() {
        	return FieldCollectionView;
        }

	});

	return controller;
} );