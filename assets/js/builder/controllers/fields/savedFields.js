/**
 * If we add a saved field to our form and then update it, set the "isSaved" flag to false.
 * 
 * @package Ninja Forms builder
 * @subpackage Fields
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var controller = Marionette.Object.extend( {
		ignoreAttributes: [
			'editActive',
			'order',
			'isSaved',
			'jBox'
		],

		initialize: function() {
			this.listenTo( nfRadio.channel( 'fields' ), 'update:setting', this.updateField );
			// Listen to clicks on our add saved field button.
			this.listenTo( nfRadio.channel( 'drawer' ), 'click:addSavedField', this.clickAddSavedField, this );
		},

		updateField: function( dataModel ) {
			if ( dataModel.get( 'isSaved' ) ) {
				
				var modified = false;
				var changedAttributes = _.keys( dataModel.changedAttributes() );
				var that = this;
				_.each( changedAttributes, function( changed ) {
					if ( -1 == that.ignoreAttributes.indexOf( changed ) ) {
						modified = true;
					}
				} );
				
				if ( modified ) {
					dataModel.set( 'isSaved', false );
				}
			}
		},

		clickAddSavedField: function( e, dataModel ) {
			var modelClone = nfRadio.channel( 'app' ).request( 'clone:modelDeep', dataModel );

			var fieldData = modelClone.attributes;
			fieldData.isSaved = true;

			delete fieldData.jBox;
			delete fieldData.editActive;
			delete fieldData.created_at;
			delete fieldData.order;
			delete fieldData.id;
			delete fieldData.formID;
			delete fieldData.parent_id;
			
			var type = nfRadio.channel( 'fields' ).request( 'get:type', fieldData.type );
			var newType = _.clone( type.attributes );

			var nicename = jQuery( e.target ).parent().parent().find( 'input' ).val();
			console.log( nicename );
			newType.nicename = nicename;
			fieldData.label = nicename;
			fieldData.nicename = nicename;
			dataModel.set( 'addSavedLoading', true );
			var newTypeDefaults = JSON.stringify( fieldData );

			jQuery.post( ajaxurl, { action: 'nf_create_saved_field', field: newTypeDefaults, security: nfAdmin.ajaxNonce }, function( response ) {
				response = JSON.parse( response );
				newType.id = response.data.id;
				newType.nicename = nicename;
				newType.settingDefaults = fieldData;

				var typeCollection = nfRadio.channel( 'fields' ).request( 'get:typeCollection' );
				var newModel = typeCollection.add( newType );

				var typeSections = nfRadio.channel( 'fields' ).request( 'get:typeSections' );
				typeSections.get( 'saved' ).get( 'fieldTypes' ).push( newType.id );

				// dataModel.set( 'type', response.data.id );
				dataModel.set( 'addSavedLoading', false );
				dataModel.unset( 'addSavedLoading', { silent: true } );
				dataModel.get( 'jBox' ).close();
				// dataModel.set( 'isSaved', true );

				nfRadio.channel( 'notices' ).request( 'add', 'addSaved', 'Saved Field Added' );
			} );
		}
	});

	return controller;
} );