/**
 * Updates our model when the user changes a setting.
 * 
 * @package Ninja Forms builder
 * @subpackage Main App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			// Respond to requests to update settings.
			nfRadio.channel( 'app' ).reply( 'change:setting', this.changeSetting, this );

			// Listen on our app channel for the change setting event. Fired by the setting view.
			this.listenTo( nfRadio.channel( 'app' ), 'change:setting', this.changeSetting, this );
		},

		/**
		 * When we change our setting, update the model.
		 * 
		 * @since  3.0
		 * @param  Object 			e                event
		 * @param  backbone.model 	settingModel model that holds our field type settings info
		 * @param  backbone.model 	dataModel       model that holds our field settings
		 * @return void
		 */
		changeSetting: function( e, settingModel, dataModel ) {
			var name = settingModel.get( 'name' );
			var before = dataModel.get( name );
			// Sends out a request on the fields-type (fields-text, fields-checkbox, etc) channel to see if that field type needs to return a special value for saving.
			var value = nfRadio.channel( settingModel.get( 'type' ) ).request( 'before:updateSetting', e, dataModel, name, settingModel );
			// If we didn't get a special field-type value, get the value from the event passed.
			if ( 'undefined' == typeof value ) {
				value = jQuery( e.target ).val();
			}
			// Update our field model with the new setting value.
			dataModel.set( name, value, { settingModel: settingModel } );
			// Register our setting change with our change tracker
			var after = value;
			
			var changes = {
				attr: name,
				before: before,
				after: after
			}

			var currentDomain = nfRadio.channel( 'app' ).request( 'get:currentDomain' );
			var currentDomainID = currentDomain.get( 'id' );

			/*
			 * TODO: Make this more dynamic.
			 * Currently, this is a very specific work-around. It should be more generalized.
			 */
			if ( 'toggle' == settingModel.get( 'type' ) ) {
				if ( 1 == before ) {
					before = 'On';
				} else {
					before = 'Off';
				}

				if ( 1 == after ) {
					after = 'On';
				} else {
					after = 'Off';
				}
			}

			var label = {
				object: dataModel.get( 'objectType' ),
				label: dataModel.get( 'label' ),
				change: 'Changed ' + settingModel.get( 'label' ) + ' from ' + before + ' to ' + after
			};

			nfRadio.channel( 'changes' ).request( 'register:change', 'changeSetting', dataModel, changes, label );
		}

	});

	return controller;
} );