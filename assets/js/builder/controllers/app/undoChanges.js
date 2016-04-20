define( [], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			this.listenTo( nfRadio.channel( 'drawer' ), 'click:undoChanges', this.undoChanges, this );
			this.listenTo( nfRadio.channel( 'drawer' ), 'click:undoSingle', this.undoSingle, this );
		},

		undoChanges: function() {
			var changeCollection = nfRadio.channel( 'changes' ).request( 'get:collection' );
			changeCollection.sort();
			var that = this;
			_.each( changeCollection.models, function( change ) {
				that.undoSingle( change, true );
			} );
			changeCollection.reset();
			// Update preview.
			nfRadio.channel( 'app' ).request( 'update:db' );			
			nfRadio.channel( 'app' ).request( 'update:setting', 'clean', true );
			nfRadio.channel( 'app' ).request( 'close:drawer' );
		},

		undoSingle: function( change, undoAll ) {
			nfRadio.channel( 'changes' ).request( 'undo:' + change.get( 'action' ), change, undoAll );
		}

	});

	return controller;
} );