/**
 * Config file for our merge tags.
 *
 * this.collection represents all of our registered merge tags.
 * 
 * @package Ninja Forms builder
 * @subpackage Main App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [
	'models/app/mergeTagCollection'
	], function(
	mergeTagCollection
	) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			this.tagSectionCollection = new mergeTagCollection();
			var that = this;
			_.each( mergeTags, function( tagSection ) {
				if ( tagSection.tags ) {
					var tags = new mergeTagCollection( tagSection.tags );
				} else {
					var tags = '';
				}

				that.tagSectionCollection.add( {
					id: tagSection.id,
					label: tagSection.label,
					tags: tags,
					default_group: tagSection.default_group
				} );
			} );

			var fieldTags = this.tagSectionCollection.get( 'fields').get( 'tags' );

			var fieldCollection = nfRadio.channel( 'fields' ).request( 'get:collection' );
			_.each( fieldCollection.models, function( field ) {
				// TODO: Make this dynamic
				if ( 'submit' !== field.get( 'type' ) ) {
					fieldTags.add( {
						id: field.get( 'id' ),
						label: field.get( 'label' ),
						tag: that.getFieldKeyFormat( field.get( 'key' ) )
					} );					
				}
			} );

			var calcTags = new mergeTagCollection();

			var formModel = nfRadio.channel( 'app' ).request( 'get:formModel' );
			var calcCollection = formModel.get( 'settings' ).get( 'calculations' );
			_.each( calcCollection, function( calc ) {
				calcTags.add( {
					label: calc.name,
					tag: '{calc:' + calc.name + '}'
				} );					
				
			} );

			this.tagSectionCollection.get( 'calcs' ).set( 'tags', calcTags );

			this.currentElement = {};
			this.settingModel = {};
			this.open = false;

			nfRadio.channel( 'mergeTags' ).reply( 'init', this.initMergeTags, this );

			this.listenTo( nfRadio.channel( 'mergeTags' ), 'click:mergeTag', this.clickMergeTag );
			this.listenTo( nfRadio.channel( 'fields' ), 'add:field', this.addFieldTags );
			this.listenTo( nfRadio.channel( 'fields' ), 'delete:field', this.deleteFieldTags );
			this.listenTo( nfRadio.channel( 'option-repeater-calculations' ), 'update:option', this.updateCalcTags );
			this.listenTo( nfRadio.channel( 'option-repeater-calculations' ), 'remove:option', this.updateCalcTags );

			
			nfRadio.channel( 'mergeTags' ).reply( 'update:currentElement', this.updateCurrentElement, this );
			nfRadio.channel( 'mergeTags' ).reply( 'update:currentSetting', this.updateCurrentSetting, this );

			// Listen for requests for our mergeTag collection.
			nfRadio.channel( 'mergeTags' ).reply( 'get:collection', this.getCollection, this );
			nfRadio.channel( 'mergeTags' ).reply( 'get:mergeTag', this.getSectionModel, this );

			// When we edit a key, check for places that key might be used.
			this.listenTo( nfRadio.channel( 'fieldSetting-key' ), 'update:setting', this.updateKey );

			// Reply to requests to check a data model for a field key when one is updated.
			nfRadio.channel( 'app' ).reply( 'replace:fieldKey', this.replaceFieldKey, this );

			// Reply to requests to check a data model for a field key when one is updated.
			nfRadio.channel( 'app' ).reply( 'get:fieldKeyFormat', this.getFieldKeyFormat, this );

			/*
			 * TODO: Hotkey support for adding tags.
			 *
			
			this.listenTo( nfRadio.channel( 'hotkeys' ), 'open:mergeTags', this.openMergeTags );
			this.listenTo( nfRadio.channel( 'hotkeys' ), 'up:mergeTags', this.upMergeTags );
			this.listenTo( nfRadio.channel( 'hotkeys' ), 'down:mergeTags', this.downMergeTags );
			this.listenTo( nfRadio.channel( 'hotkeys' ), 'return:mergeTags', this.returnMergeTags );
			nfRadio.channel( 'mergeTags' ).reply( 'update:open', this.updateOpen, this );
			*/
		},

		/**
		 * Init merge tags within the passed view.
		 * @since  3.0
		 * @param  backbone.view view to be searched for merge tags.
		 * @return void
		 */
		initMergeTags: function( view ) {
			var mergeTagsView = nfRadio.channel( 'mergeTags' ).request( 'get:view' );
			var that = this;
			/*
			 * Apply merge tags jQuery plugin.
			 *
			 * Prevent jBox from being called multiple times on the same element
			 */
			this.jBoxes = {};
			var that = this;
			jQuery( view.el ).find( '.merge-tags' ).each(function() {
				if ( 'undefined' == typeof jQuery( this ).data( 'jBox-id' ) ) {
					var jBox = jQuery( this ).jBox( 'Tooltip', {
						title: 'Insert Merge Tag',
						trigger: 'click',
						position: {
							x: 'center',
							y: 'bottom'
						},
						closeOnClick: 'body',
						closeOnEsc: true,
						theme: 'TooltipBorder',
						maxHeight: 200,

						onOpen: function() {
							mergeTagsView.reRender( view.model );
							this.setContent( jQuery( '.merge-tags-content' ) );
							var currentElement = jQuery( this.target ).prev( '.setting' );
							if ( 0 == currentElement.length ) {
								currentElement = jQuery( view.el ).find( '.setting' );
							}
													
							that.updateCurrentSetting( view.model );
							that.updateCurrentElement( currentElement );
							// nfRadio.channel( 'drawer' ).request( 'prevent:close', 'merge-tags' );
						},
						onClose: function() {
							// nfRadio.channel( 'drawer' ).request( 'enable:close', 'merge-tags' );
						}
					});
					
					jQuery( this ).data( 'jBox-id', jBox.id );					
				}
		    });
		},

		clickMergeTag: function( e, tagModel ) {
			/*
			 * TODO: Make this more dynamic.
			 * Currently, the RTE is the only section that modifies how merge tags work,
			 * but another type of setting might need to do this in the future.
			 */
			if ( 'rte' != this.settingModel.get( 'type' ) ) {
				var currentValue = jQuery( this.currentElement ).val();
				var currentPos = jQuery( this.currentElement ).caret();
				var newPos = currentPos + tagModel.get( 'tag' ).length;
				currentValue = currentValue.substr( 0, currentPos ) + tagModel.get( 'tag' ) + currentValue.substr( currentPos );
				jQuery( this.currentElement ).val( currentValue ).caret( newPos ).trigger( 'change' );				
			} else { // We're in an RTE
				jQuery( this.currentElement ).summernote( 'insertText', tagModel.get( 'tag' ) );
			}

		},

		addFieldTags: function( fieldModel ) {
			// TODO: Make this dynamic
			if ( 'submit' !== fieldModel.get( 'type' ) ) {
				this.tagSectionCollection.get( 'fields' ).get( 'tags' ).add( {
					id: fieldModel.get( 'id' ),
					label: fieldModel.get( 'label' ),
					tag: this.getFieldKeyFormat( fieldModel.get( 'key' ) )
				} );
			}
		},

		deleteFieldTags: function( fieldModel ) {
			var fieldID = fieldModel.get( 'id' );
			var tagModel = this.tagSectionCollection.get( 'fields' ).get( 'tags' ).get( fieldID );
			this.tagSectionCollection.get( 'fields' ).get( 'tags' ).remove( tagModel );
		},

		updateCalcTags: function( optionModel ) {
			var calcTags = new mergeTagCollection();

			var formModel = nfRadio.channel( 'app' ).request( 'get:formModel' );
			var calcCollection = formModel.get( 'settings' ).get( 'calculations' );

			_.each( calcCollection.models, function( calc ) {
				calcTags.add( {
					label: calc.get( 'name' ),
					tag: '{calc:' + calc.get( 'name' ) + '}'
				} );
			} );

			this.tagSectionCollection.get( 'calcs' ).set( 'tags', calcTags );
		},

		openMergeTags: function( e ) {
			if ( 'TEXTAREA' == jQuery( e.target )[0].tagName || 'INPUT' == jQuery( e.target )[0].tagName ) {
				jQuery( e.target ).parent().find( '.merge-tags' ).click();
			}
		},

		returnMergeTags: function( e ) {
			if ( this.open ) {
				e.preventDefault();
				var currentModel = this.fields.where( { 'active': true } )[0];
				if ( currentModel ) {
					this.clickMergeTag( e, currentModel );
				}
			}
		},

		upMergeTags: function( e ) {
			if ( this.open ) {
				e.preventDefault();
				this.changeActiveTag( 'up' );
			}
		},

		downMergeTags: function( e ) {
			if ( this.open ) {
				e.preventDefault();
				this.changeActiveTag( 'down' );
			}
		},

		changeActiveTag: function( dir ) {
			if ( 'down' == dir ) {
				var inc = 1;
			} else {
				var inc = -1
			}
			// First, check to see if a field is currently active.
			if( 0 < this.fields.where( { 'active': true } ).length ) {
				var currentModel = this.fields.where( { 'active': true } )[0];
				var currentIndex = this.fields.indexOf( currentModel );
				currentModel.set( 'active', false );

				var nextModel = this.fields.models[ currentIndex + inc ];
				if ( nextModel ) {
					nextModel.set( 'active', true );
				} else {

				}
				
			} else if ( 0 < this.fields.where( { 'active': true } ) ) { // There aren't any active fields. Check for active system tags.
				console.log( 'system' );
			} else if ( 0 < this.userInfo.where( { 'active': true } ) ) { // No active user info LIs.
				console.log( 'userinfo' );
			} else { // No active LIs. We haven't made any active yet, or we've gotten to the bottom of the list.
				// Make sure that we have fields
				if ( 0 < this.fields.models.length ) {
					// Set our first field to active.
					this.fields.models[0].set( 'active', true );
				} else {
					// Set our first system model to active.
					this.system.models[0].set( 'active', true );
				}
			}
		},

		updateCurrentElement: function( element ) {
			this.currentElement = element;
		},

		updateCurrentSetting: function( settingModel ) {
			this.settingModel = settingModel;
		},

		getCollection: function() {
			return this.tagSectionCollection;
		},

		getSectionModel: function( id ) {
			return this.tagSectionCollection.get( id );
		},

		updateOpen: function( open ) {
			this.open = open;
			_.each( this.tagSectionCollection.get( 'fields' ).models, function( model ) {
				model.set( 'active', false );
			} );
		},

		updateKey: function( fieldModel ) {
			var newKey = fieldModel.get( 'key' );
			var oldTag = this.tagSectionCollection.get( 'fields' ).get( 'tags' ).get( fieldModel.get( 'id' ) );
			if ( 'undefined' != typeof oldTag ) {
				oldTag.set( 'tag', this.getFieldKeyFormat( newKey ) );				
			}

		},

		getFieldKeyFormat: function( key ) {
			return '{field:' + key + '}';
		},

		replaceFieldKey: function( dataModel, keyModel, settingModel ) {
			var oldKey = this.getFieldKeyFormat( keyModel._previousAttributes[ 'key' ] );
			var newKey = this.getFieldKeyFormat( keyModel.get( 'key' ) );
			var settingName = settingModel.get( 'name' );
			var oldVal = dataModel.get( settingName );
			if ( 'string' == typeof oldVal ) {
				var re = new RegExp( oldKey, 'g' );
				newVal = oldVal.replace( re, newKey );
				dataModel.set( settingName, newVal );
			}
		}

	});

	return controller;
} );