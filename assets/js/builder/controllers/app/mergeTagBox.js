/**
 * @package Ninja Forms builder
 * @subpackage Merge Tag Box
 * @copyright (c) 2017 WP Ninjas
 * @since 3.1
 */

define( [
    'models/app/mergeTagModel',
    'models/app/mergeTagLookupCollection',
    'views/app/drawer/mergeTag',
    'views/app/drawer/mergeTagList',
    'views/app/drawer/mergeTagGroup',
    'views/app/drawer/mergeTagGroupList',
    'views/app/drawer/mergeTagFilter',
    'views/app/drawer/mergeTagBox'
], function(
    MergeTagModel,
    MergeTagLookupCollection,
    MergeTagView,
    MergeTagListView,
    MergeTagGroupView,
    MergeTagGroupListView,
    MergeTagFilterView,
    MergeTagBoxLayout
) {
    var controller = Marionette.Object.extend( {

        caret: 0, // Track the caret position of the current setting's input.
        old: '', // THe old merge tag that will be replaced.

        initialize: function(){

            this.listenTo( nfRadio.channel( 'drawer' ), 'render:settingGroup', function(){
                jQuery( '.merge-tags' ).off( 'click' );
                jQuery( '.merge-tags' ).on( 'click', this.mergeTagsButtonClick );
            });

            this.listenTo( nfRadio.channel( 'app' ), 'after:appStart', this.afterAppStart );
            this.listenTo( nfRadio.channel( 'app' ), 'before:renderSetting', this.beforeRenderSetting );
            this.listenTo( nfRadio.channel( 'drawer' ), 'before:close', this.beforeDrawerClose );

            var that = this;
            nfRadio.channel( 'mergeTags' ).reply( 'set:caret', function( position ){
               that.caret = position;
            });
            nfRadio.channel( 'mergeTags' ).reply( 'get:caret', function(){
                return that.caret;
            });

            var that = this;
            nfRadio.channel( 'mergeTags' ).reply( 'set:old', function( value ){
                that.old = value;
            });
            nfRadio.channel( 'mergeTags' ).reply( 'get:old', function(){
                return that.old;
            });

            nfRadio.channel( 'mergeTags' ).reply( 'insert:tag', this.insertTag.bind( this ) );

            /** OPTION REPEATER */
            this.listenTo( nfRadio.channel( 'option-repeater' ), 'add:option', function( model ){
                var selector = '#' + model.cid + ' .has-merge-tags input.setting';
                jQuery( selector ).on( 'focus', function( event ){
                   that.focusCallback( event, selector, 'option-repeater' );
                });
                jQuery( selector ).on( 'keyup', function( event ){
                    that.keyupCallback( event, selector, 'option-repeater' );
                });
                jQuery( selector ).siblings( '.nf-list-options .merge-tags' ).off( 'click' );
                jQuery( selector ).siblings( '.nf-list-options .merge-tags' ).on( 'click', this.mergeTagsButtonClick );
            } );
            this.listenTo( nfRadio.channel( 'drawer' ), 'opened', function(){
                jQuery( '.nf-list-options .merge-tags' ).off( 'click' );
                jQuery( '.nf-list-options .merge-tags' ).on( 'click', this.mergeTagsButtonClick );
            } );

            /* CALCULATIONS */
            this.listenTo( nfRadio.channel( 'setting-calculations-option' ), 'render:setting', this.renderSetting );
            // this.listenTo( nfRadio.channel( 'setting-calculations-option' ), 'render:setting', function( settingModel, dataModel, view ){
            //     view.$el.find( '.merge-tags' ).on( 'click', this.mergeTagsButtonClick );
            // } );
            this.listenTo( nfRadio.channel( 'drawer' ), 'opened', function(){
                jQuery( '.nf-list-options.calculations .merge-tags' ).off( 'click' );
                jQuery( '.nf-list-options.calculations .merge-tags' ).on( 'click', this.mergeTagsButtonClick );
            } );

            /* SUMMERNOTE */
            this.listenTo( nfRadio.channel( 'summernote' ), 'focus', function( e, selector ) {
                that.focusCallback( false, selector, 'rte' );
            } );
            this.listenTo( nfRadio.channel( 'summernote' ), 'keydown', function( e, selector ){
                jQuery( selector ).closest( '.nf-setting' ).find( '.setting' ).summernote( 'saveRange' );
            } );
            this.listenTo( nfRadio.channel( 'summernote' ), 'keyup', function( e, selector ){
                that.keyupCallback( e, selector, 'rte' );
            } );
            this.listenTo( nfRadio.channel( 'drawer' ), 'opened', function(){
                jQuery( '.note-editor .merge-tags' ).off( 'click' );
                jQuery( '.note-editor .merge-tags' ).on( 'click', this.mergeTagsButtonClick );
            } );

            jQuery( document ).on( 'keyup', function( event ){
                if( 27 == event.keyCode ){
                    nfRadio.channel( 'mergeTags' ).request( 'insert:tag', '' );
                    // Copied from KeyupCallback.
                    jQuery( '#merge-tags-box' ).css( 'display', 'none' );
                    nfRadio.channel( 'drawer' ).request( 'enable:close' );
                    jQuery( '#merge-tags-box' ).removeClass();
                    jQuery( '.merge-tag-focus' ).blur();
                    jQuery( '.merge-tag-focus' ).removeClass( 'merge-tag-focus' );
                    jQuery( '.merge-tag-focus-overlay' ).removeClass( 'merge-tag-focus-overlay' );
                }
            });

            /**
             * Listen to the Field Changes (add, delete, update) and update the Merge Tags.
             */
            this.listenTo( Backbone.Radio.channel( 'fields' ), 'add:field',    this.afterAppStart );
            this.listenTo( Backbone.Radio.channel( 'fields' ), 'delete:field', this.afterAppStart );
            this.listenTo( Backbone.Radio.channel( 'fieldSetting-key' ), 'update:setting', this.afterAppStart );

            /** ... and Calc updates. */
            this.listenTo( Backbone.Radio.channel( 'calcs' ), 'update:calc', this.afterAppStart );
        },

        afterAppStart: function() {
            var mergeTagCollection = nfRadio.channel( 'mergeTags' ).request( 'get:collection' );
            var mergeTags = [];
            mergeTagCollection.each( function( section ){
                section.get( 'tags' ).each( function( tag ){
                    mergeTags.push({
                        label: tag.get( 'label' ),
                        tag:   tag.get( 'tag' ),
                        section: section.get( 'id' )
                    });
                });
            });
            var layout = new MergeTagBoxLayout();
            layout.render();
            var tagCollection = new MergeTagLookupCollection( mergeTags );
            var mergeTagListView = new MergeTagListView({
                collection: tagCollection
            });
            var mergeTagGroupListView = new MergeTagGroupListView({
                collection: mergeTagCollection
            });

            layout.getRegion('tags').show(mergeTagListView);
            layout.getRegion('sections').show(mergeTagGroupListView);
            layout.getRegion('filter').show(new MergeTagFilterView);
        },

        beforeRenderSetting: function( settingModel, dataModel ){
            if( 'undefined' == typeof settingModel.get( 'use_merge_tags' ) ) return;
            if( ! settingModel.get( 'use_merge_tags' ) ) return;
            var name = settingModel.get( 'name' );
            this.listenTo( nfRadio.channel( 'setting-' + name ), 'render:setting', this.renderSetting );
        },

        renderSetting: function( settingModel, dataModel, view ){

            view.$el.find( '.merge-tags' ).off( 'click' );
            view.$el.find( '.merge-tags' ).on( 'click', this.mergeTagsButtonClick );

            if( 0 == jQuery( '#merge-tags-box' ).length ) this.afterAppStart();

            // Track Scrolling.
            jQuery( '#nf-drawer' ).on( 'scroll', function(){
               // COPIED AND MODIFIED FROM FOCUS
                if( 0 == jQuery( '.merge-tag-focus' ).length ) return;

                var rteEditor = jQuery( '.merge-tag-focus' ).closest( '.nf-setting' ).find( '.note-editor' );
                if( 0 != rteEditor.length ){
                    var posY = rteEditor.offset().top - jQuery(window).scrollTop();
                    var height = rteEditor.outerHeight();
                } else {
                    var posY = jQuery('.merge-tag-focus').offset().top - jQuery(window).scrollTop();
                    var height = jQuery('.merge-tag-focus').outerHeight();
                }
                jQuery( '#merge-tags-box' ).css( 'top', posY + height );

                var boxHeight = jQuery( '#merge-tags-box' ).outerHeight();
                jQuery( '#nf-drawer' ).css( 'padding-bottom', boxHeight + 'px' );

                var repeaterRow = jQuery( '.merge-tag-focus' ).closest( '.nf-list-options-tbody' );
                if( 0 != repeaterRow.length ){
                    var left = repeaterRow.offset().left - jQuery(window).scrollLeft();
                    jQuery( '#merge-tags-box' ).css( 'left', left );
                } else {
                    var posX = jQuery( '.merge-tag-focus' ).closest( '.nf-settings' ).offset().left - jQuery(window).scrollLeft();
                    jQuery( '#merge-tags-box' ).css( 'left', posX );
                    jQuery( '#merge-tags-box' ).css( 'width', jQuery( '.merge-tag-focus' ).closest( '.nf-settings' ).width() );
                }
            });

            // On input focus, move the Merge Tag Box into position.
            jQuery( view.el ).find( '.setting' ).on( 'focus', this.focusCallback );

            // TODO: Maybe move to view events.
            // On input keyup, maybe show Merge Tag Box.
            jQuery( view.el ).find( '.setting' ).on( 'keyup', this.keyupCallback );
        },

        // TODO: Maybe move to view class.
        beforeDrawerClose: function(){
            jQuery( '#merge-tags-box' ).css( 'display', 'none' );
            nfRadio.channel( 'drawer' ).request( 'enable:close' );
            // jQuery( 'body' ).append( jQuery( '#merge-tags-box' ) );
        },

        insertTag: function( tag ) {

            var $input = jQuery( '.merge-tag-focus' );

            if( 0 != $input.closest( '.nf-setting' ).first().find( '.note-editable' ).length ){
                $input = $input.closest( '.nf-setting' ).first().find( '.note-editable' );
            }

            if( 1 < $input.length ){ $input = $input.first(); }

            if( $input.hasClass( 'note-editable' ) ){
                var str = $input.closest( '.nf-setting' ).find( '.setting' ).summernote( 'code' );
            } else {
                var str = $input.val();
            }

            var find = nfRadio.channel( 'mergeTags' ).request( 'get:old' );
            var replace = tag;
            var caretPos = nfRadio.channel( 'mergeTags' ).request( 'get:caret' );

            var patt = /{([a-z0-9]|:|_||-})*/g;

            // Loop through matches to find insert/replace index range.
            // Reference: http://codepen.io/kjohnson/pen/36c3a782644dfff40fe3c1f05f8739d9?editors=0012
            while (match = patt.exec(str)) {
                if (find != match[0]) continue; // This isn't the match you are looking for...
                var string = str.slice(0, match.index) + replace + str.slice(patt.lastIndex); // Fancy replace for the specifc match, using the index/position.

                if( $input.hasClass( 'note-editable' ) ){
                    $input.closest( '.nf-setting' ).find( '.setting' ).summernote( 'code', string );

                    // Reposition the caret. http://stackoverflow.com/a/6249440 TODO: Determine the appropriate childNode.
                    var el = $input;
                    var childNode = null; // Default to first childNode.
                    _.each( el[0].childNodes, function( node, index ){
                        if( childNode ) return;
                        if( ! node.nodeValue && ! node.innerHTML ) return;
                        if( node.nodeValue ) {
                            var position = node.nodeValue.indexOf(replace) + find.length;
                        } else if( node.innerHTML ){
                            var position = node.innerHTML.indexOf(replace) + find.length;
                        }
                        if( caretPos == position ) childNode = el[0].childNodes[index];
                    });
                    if( ! childNode ) childNode = el[0].childNodes[0];
                    var offset = caretPos - find.length + replace.length;
                    var range = document.createRange();
                    var sel = window.getSelection();
                    if( 0 != childNode.childNodes.length ) {
                        try{
                           range.setStart(childNode.childNodes[0], offset); 
                        } catch( err ) {
                            console.log( 'error' );
                        }
                        
                    } else {
                        try {
                            range.setStart(childNode, offset);
                        } catch( err ) {
                            console.log( 'error' );
                        }
                        
                    }
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);


                } else {
                    $input.val(string); // Update input value with parsed string.
                    $input.change(); // Trigger a change event after inserting the merge tag so that it saves to the model.
                    $input.caret(caretPos - find.length + replace.length); // Update Carept Position.
                }

            }

            jQuery( '#merge-tags-box' ).css( 'display', 'none' );
            nfRadio.channel( 'drawer' ).request( 'enable:close' );
            $input.removeClass( 'merge-tag-focus' );
            $input.closest( '.merge-tag-focus-overlay' ).removeClass( 'merge-tag-focus-overlay' );
        },

        mergeTagsButtonClick: function( e ){

            var $this = jQuery( this );

            if( $this.siblings().hasClass( 'merge-tag-focus' ) ){
                nfRadio.channel( 'mergeTags' ).request( 'insert:tag', '' );
                jQuery( '#merge-tags-box' ).css( 'display', 'none' );
                nfRadio.channel( 'drawer' ).request( 'enable:close' );
                jQuery( '.merge-tag-focus' ).removeClass( 'merge-tag-focus' );
                jQuery( '.merge-tag-focus-overlay' ).removeClass( 'merge-tag-focus-overlay' );
                return;
            }

            if( 0 !== $this.closest( '.nf-setting, .nf-table-row' ).find( '.note-tools' ).length ){
                var $inputSetting = $this.closest( '.note-editor' ).siblings( '.setting' ).first();
                $this.closest( '.nf-setting' ).find( '.setting' ).summernote( 'insertText', '{' );
            } else {
                var $inputSetting = $this.siblings( '.setting' ).first();
                var text = $inputSetting.val() || '';
                $inputSetting.val( text + '{' ).change();
                nfRadio.channel('mergeTags').request('set:caret', text.length + 1 );
            }

            if( $this.parent().hasClass( 'note-tools' ) ){
                // $this.closest( '.nf-setting' ).find( '.setting' ).summernote( 'insertText', '{' );
            }

            nfRadio.channel('mergeTags').request('set:old', '{' );

            $inputSetting.addClass( 'merge-tag-focus' );

            // Disable browser autocomplete.
            var autocomplete = $this.attr( 'autocomplete' );
            $this.attr( 'autocomplete', 'off' );
            $this.data( 'autocomplete', autocomplete );

            var $overlayElement = $this.closest( '.nf-setting, .nf-table-row' );
            if( 0 != $overlayElement.find( '.note-editor' ).length ){
                $overlayElement.find('.note-editor' ).addClass('merge-tag-focus-overlay');
            } else {
                $overlayElement.addClass('merge-tag-focus-overlay');
            }

            jQuery( '#merge-tags-box' ).css( 'display', 'block' );
            nfRadio.channel( 'drawer' ).request( 'prevent:close' );

            jQuery( '.merge-tag-focus-overlay' ).off( 'click' );
            jQuery( '.merge-tag-focus-overlay' ).on( 'click', function( e ) {
                if ( jQuery( e.target ).hasClass( 'note-editor' ) ) {
                    nfRadio.channel( 'mergeTags' ).request( 'insert:tag', '' );
                    jQuery( '#merge-tags-box' ).css( 'display', 'none' );
                    nfRadio.channel( 'drawer' ).request( 'enable:close' );
                    jQuery( '#merge-tags-box' ).removeClass();
                    jQuery( '.merge-tag-focus' ).removeClass( 'merge-tag-focus' );
                    jQuery( '.merge-tag-focus-overlay' ).removeClass( 'merge-tag-focus-overlay' );
                }
            } );

            setTimeout(function(){
                jQuery( '#merge-tags-box' ).find( '.merge-tag-filter' ).find( 'input' ).focus();
            }, 500 );
        },

        focusCallback: function( e, target, type ){

            var type = type || 'setting';
            var $this = ( 'undefined' == typeof target ) ? jQuery( this ) : jQuery( target );

            jQuery( '.merge-tag-focus' ).each(function(index, el){
                if( this == el ) return;
                el.removeClass( 'merge-tag-focus' );
            });

            if( 'rte' == type ) {
                var posY = $this.closest( '.nf-setting' ).find( '.note-editor' ).offset().top - jQuery(window).scrollTop();
                var height = $this.closest( '.nf-setting' ).find( '.note-editor' ).outerHeight();
            } else {
                var posY = $this.offset().top - jQuery(window).scrollTop();
                var height = $this.outerHeight();
            }
            jQuery( '#merge-tags-box' ).css( 'top', posY + height );

            var repeaterRow = $this.closest( '.nf-list-options-tbody' );
            if( 0 != repeaterRow.length ) {
                var left = repeaterRow.offset().left - jQuery(window).scrollLeft();
                jQuery( '#merge-tags-box' ).css( 'left', left );
            } else if( 'rte' == type ) {
                var posX = $this.closest( '.nf-setting' ).find( '.note-editor' ).offset().left - jQuery(window).scrollLeft();
                jQuery( '#merge-tags-box' ).css( 'left', posX );
                jQuery( '#merge-tags-box' ).css( 'width', $this.closest( '.nf-setting' ).find( '.note-editor' ).width() );
            }
            else
            {
                var posX = jQuery( this ).closest( '.nf-settings' ).offset().left - jQuery(window).scrollLeft();
                jQuery( '#merge-tags-box' ).css( 'left', posX );
                jQuery( '#merge-tags-box' ).css( 'width', $this.closest( '.nf-settings' ).width() );
            }

            var dataID = jQuery( this ).data( 'id' );
            if( dataID && 'eq' != dataID ) return;

            // var offset = jQuery( view.el ).find( '.setting' ).parent().outerHeight();
            // jQuery( view.el ).find( '.setting' ).parent().append( jQuery( '#merge-tags-box' ) );
            // jQuery( '#merge-tags-box' ).css( 'top', offset );
        },

        keyupCallback: function( event, target, type ){

            var type = type || 'setting';

            if( /* ENTER */ 13 == event.keyCode ){

                // Get top listed merge tag.
                var firstFilteredTag = jQuery( '#merge-tags-box .merge-tag-list ul li span' ).first().data( 'tag' );

                nfRadio.channel( 'mergeTags' ).request( 'insert:tag', firstFilteredTag );

                // COPIED FROM BELOW
                jQuery( '#merge-tags-box' ).css( 'display', 'none' );
                nfRadio.channel( 'drawer' ).request( 'enable:close' );
                jQuery( '#merge-tags-box' ).removeClass();
                jQuery( '.merge-tag-focus' ).removeClass( 'merge-tag-focus' );
                jQuery( '.merge-tag-focus-overlay' ).removeClass( 'merge-tag-focus-overlay' );

                return;
            }

            // Get the value.
            // var value = jQuery( summernote ).summernote( 'code' );
            // Update the value.
            // jQuery( summernote ).closest( '.nf-setting' ).find( '.note-editable' ).html( value );

            if( 'undefined' != typeof target ) {
                var $this = jQuery(target);
            } else {
                var $this = jQuery( this );
            }

            // TODO: Disable Browser Autocomplete
            // $this.attr()


            var dataID = jQuery( this ).data( 'id' );
            if( dataID && 'eq' != dataID ) return;

            // Store the current caret position.
            if( 'rte' == type ){
                var range = $this.summernote('createRange');
                if( range ) {
                    var caretPos = range.so; // or .eo?
                } else {
                    var caretPos = 0;
                }
                $this.closest( '.nf-setting' ).find( '.setting' ).summernote( 'saveRange' );
            } else {
                var caretPos = $this.caret();
            }
            nfRadio.channel( 'mergeTags' ).request( 'set:caret', caretPos );

            // Find merge tags.
            if( 'rte' == type ) {
                var mergetags = $this.summernote( 'code' ).match(new RegExp(/{([a-z0-9]|:|_|-|})*/g));
            } else {
                var mergetags = $this.val().match(new RegExp(/{([a-z0-9]|:|_|-|})*/g));
            }

            // Filter out closed merge tags.
            mergetags = _.filter(mergetags, function(mergetag) {
                return -1 == mergetag.indexOf( '}' ); // Filter out "closed" merge tags.
            });

            // If an open merge tag is found, show the Merge Tag Box, else hide.
            if( 0 !== mergetags.length ) {

                nfRadio.channel( 'mergeTags' ).request( 'set:old', mergetags[0] );

                jQuery('#merge-tags-box').css( 'display', 'block' );
                nfRadio.channel( 'drawer' ).request( 'prevent:close' );
                $this.addClass('merge-tag-focus');

                var boxHeight = jQuery( '#merge-tags-box' ).outerHeight();
                jQuery( '#nf-drawer' ).css( 'padding-bottom', boxHeight + 'px' );

                // Disable browser autocomplete.
                var autocomplete = $this.attr( 'autocomplete' );
                $this.attr( 'autocomplete', 'off' );
                $this.data( 'autocomplete', autocomplete );

                var $overlayElement = $this.closest( '.nf-setting, .nf-table-row' );
                if( 0 != $overlayElement.find( '.note-editor' ).length ){
                    $overlayElement.find('.note-editor' ).addClass('merge-tag-focus-overlay');
                } else {
                    $overlayElement.addClass('merge-tag-focus-overlay');
                }

                $overlayElement.off( 'click' );
                $overlayElement.on( 'click', function( event ){
                    var elementClasses = jQuery( event.target ).attr( 'class' ) || [];
                    if( -1 !== elementClasses.indexOf( 'merge-tag-focus-overlay' ) ){
                        nfRadio.channel( 'mergeTags' ).request( 'insert:tag', '' );
                        jQuery( '#merge-tags-box' ).css( 'display', 'none' );
                        nfRadio.channel( 'drawer' ).request( 'enable:close' );
                        jQuery( '#merge-tags-box' ).removeClass();
                        jQuery( '.merge-tag-focus' ).removeClass( 'merge-tag-focus' );
                        jQuery( '.merge-tag-focus-overlay' ).removeClass( 'merge-tag-focus-overlay' );
                    }
                });

                var value = mergetags[0].replace( '{', '' );
                nfRadio.channel( 'merge-tags' ).request( 'filtersearch', value );
            } else {
                jQuery( '#merge-tags-box' ).css( 'display', 'none' );
                nfRadio.channel( 'drawer' ).request( 'enable:close' );
                jQuery( '#merge-tags-box' ).removeClass();
                jQuery( '.merge-tag-focus' ).removeClass( 'merge-tag-focus' );
                jQuery( '.merge-tag-focus-overlay' ).removeClass( 'merge-tag-focus-overlay' );
            }
        }

    } );

    return controller;
} );
