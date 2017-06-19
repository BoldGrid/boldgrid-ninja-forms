define( [
	'models/fieldCollection',
	'models/formErrorCollection'
	], function(
		FieldCollection,
		ErrorCollection
	) {
	var model = Backbone.Model.extend({
		defaults: {
			beforeForm: '',
			afterForm: '',
			beforeFields: '',
			afterFields: '',
			wrapper_class: '',
			element_class: '',
			hp: '',
			fieldErrors: {},
			extra: {}
		},

		initialize: function() {
			// Loop over settings and map to attributes
			_.each( this.get( 'settings' ), function( value, setting ) {
				this.set( setting, value );
			}, this );

			this.set( 'loadedFields', this.get( 'fields' ) );
			this.set( 'fields', new FieldCollection( this.get( 'fields' ), { formModel: this } ) );
			this.set( 'errors', new ErrorCollection() );

			/*
			 * Send out a radio message so that anyone who wants to filter our content data can register their filters.
			 */
			nfRadio.channel( 'form' ).trigger( 'before:filterData', this );

			/*
			 * Set our formContentData to our form setting 'formContentData'
			 */
			var formContentData = this.get( 'formContentData' );

			/*
			 * The formContentData variable used to be fieldContentsData.
			 * If we don't have a 'formContentData' setting, check to see if we have an old 'fieldContentsData'.
			 * 
			 * TODO: This is for backwards compatibility and should be removed eventually. 
			 */
			if ( ! formContentData ) {
				formContentData = this.get( 'fieldContentsData' );
			}
			
			var formContentLoadFilters = nfRadio.channel( 'formContent' ).request( 'get:loadFilters' );
			/* 
			* Get our first filter, this will be the one with the highest priority.
			*/
			var sortedArray = _.without( formContentLoadFilters, undefined );
			var callback = _.first( sortedArray );
			formContentData = callback( formContentData, this, this );
			
			this.set( 'formContentData', formContentData );

			nfRadio.channel( 'forms' ).trigger( 'init:model', this );
			nfRadio.channel( 'form-' + this.get( 'id' ) ).trigger( 'init:model', this );

			// Fields
			nfRadio.channel( 'form-' + this.get( 'id' ) ).reply( 'get:fieldByKey', this.getFieldByKey, this );

			// Form Errors
			nfRadio.channel( 'form-' + this.get( 'id' ) ).reply( 'add:error',    this.addError, this    );
			nfRadio.channel( 'form-' + this.get( 'id' ) ).reply( 'remove:error', this.removeError, this );

			// Extra Data
			nfRadio.channel( 'form-' + this.get( 'id' ) ).reply( 'get:extra',    this.getExtra,    this );
			nfRadio.channel( 'form-' + this.get( 'id' ) ).reply( 'add:extra',    this.addExtra,    this );
			nfRadio.channel( 'form-' + this.get( 'id' ) ).reply( 'remove:extra', this.removeExtra, this );
		
			// Respond to requests to get this model.
			nfRadio.channel( 'form-' + this.get( 'id' ) ).reply( 'get:form', 	 this.getForm, 	   this );

			nfRadio.channel( 'form' ).trigger( 'loaded', this );
			nfRadio.channel( 'form' ).trigger( 'after:loaded', this );
			nfRadio.channel( 'form-' + this.get( 'id' ) ).trigger( 'loaded', 	 this );
		},

		/*
		 |--------------------------------------------------------------------------
		 | Fields
		 |--------------------------------------------------------------------------
		 */

		getFieldByKey: function( key ) {
			return this.get( 'fields' ).findWhere( { key: key } );
		},

		/*
		 |--------------------------------------------------------------------------
		 | Form Errors
		 |--------------------------------------------------------------------------
		 */

		addError: function( id, msg ) {
			var errors = this.get( 'errors' );
			errors.add( { id: id, msg: msg } );
			nfRadio.channel( 'form-' + this.get( 'id' ) ).trigger( 'add:error', this, id, msg );
		},

		removeError: function( id ) {
			var errors = this.get( 'errors' );
			var errorModel = errors.get( id );
			errors.remove( errorModel );
			nfRadio.channel( 'form-' + this.get( 'id' ) ).trigger( 'remove:error', this, id );
		},

		/*
		 |--------------------------------------------------------------------------
		 | Extra Data
		 |--------------------------------------------------------------------------
		 */

		getExtra: function( key ) {
			var extraData = this.get( 'extra' );
			if( 'undefined' == typeof key ) return extraData;
			return extraData[ key ];
		},

		addExtra: function( key, value ) {
			var extraData = this.get( 'extra' );
			extraData[ key ] = value;
			nfRadio.channel( 'form-' + this.get( 'id' ) ).trigger( 'add:extra', this, key, value );
		},

		removeExtra: function( key ) {
			var extraData = this.get( 'extra' );
			delete extraData[ key ];
			nfRadio.channel( 'form-' + this.get( 'id' ) ).trigger( 'remove:extra', this, key );
		},

		/*
		 |--------------------------------------------------------------------------
		 | Get this form
		 |--------------------------------------------------------------------------
		 */
		getForm: function() {
			return this;
		}
	} );

	return model;
} );