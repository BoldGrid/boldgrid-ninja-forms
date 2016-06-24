<div id="nf-pre-builder" style="background:#fff;position:fixed;top:0;right:0;bottom:0;left:0;z-index:9999999;"></div>

<div id="nf-builder" class="grey"></div>

<script id="nf-tmpl-builder" type="text/template">
    <div id="nf-app-admin-header"><div id="nf-logo"></div><a href="admin.php?page=ninja-forms" class="fa fa-times"></a></div>
    <div id="nf-overlay"></div>
    <div id="nf-header"></div>
    <div id="nf-main" class="nf-app-main"></div>
    <div id="nf-menu-drawer"></div>
    <div id="nf-drawer"></div>
    <span class="merge-tags-content" style="display:none;"></span>
</script>

<script id="nf-tmpl-admin-header" type="text/template">
    <div id="nf-app-admin-header"></div>
</script>

<script id="nf-tmpl-header" type="text/template">
    <div id="nf-app-header"></div>
    <div id="nf-app-form-title"></div>
    <div id="nf-app-sub-header"></div>
</script>

<script id="nf-tmpl-header-form-title" type="text/template">
    <h2><%= renderTitle() %></h2>
</script>

<script id="nf-tmpl-sub-header-fields" type="text/template">
    <a class="nf-add-new nf-open-drawer" title="Add New Field" href="#" data-drawerid="addField">Add new field</a>
</script>

<script id="nf-tmpl-sub-header-actions" type="text/template">
    <a class="nf-add-new nf-open-drawer" title="Add New Action" href="#" data-drawerid="addAction">Add new action</a>
</script>

<script id="nf-tmpl-sub-header-settings" type="text/template">

</script>

<script id="nf-tmpl-app-header" type="text/template">
    <!-- <div id="nf-logo"></div> -->
    <ul class="nf-app-menu"></ul>
    <span class="nf-mobile-menu-button"></span>
    <span class="nf-app-buttons"></span>
</script>

<script id="nf-tmpl-app-header-action-button" type="text/template">
    <%= renderPublish() %>
    <%= maybeRenderCancel() %>
</script>

<script id="nf-tmpl-mobile-menu-button" type="text/template">
    <a class="nf-button nf-mobile-menu title="Expand Menu" <%= maybeDisabled() %>" href="#"><span class="dashicons dashicons-editor-ul"></span></a>
</script>

<script id="nf-tmpl-app-header-publish-button" type="text/template">
    <a href="#" <%= publishWidth %> class="nf-button primary <%= maybeDisabled() %> publish" title="Publish">PUBLISH</a>
</script>

<script id="nf-tmpl-add-header-publish-loading" type="text/template">
    <a href="#" <%= publishWidth %> class="nf-button primary <%= maybeDisabled() %> publish" title="Loading">
        <div class="nf-loading">
            <ul>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>
    </a>
</script>

<script id="nf-tmpl-app-header-view-changes" type="text/template">
    <a class="nf-cancel viewChanges" title="View Changes" style="text-decoration: none;" href="#"><span class="dashicons dashicons-backup"></span></a>
</script>

<script id="nf-tmpl-main" type="text/template">
    <div id="nf-main-header" class="nf-app-area"></div>
    <div id="nf-main-content" class="nf-app-area"></div>
</script>

<script id="nf-tmpl-main-header-fields" type="text/template">
    <input class="nf-button secondary nf-change-domain" data-domain="actions" type="button" value="Edit Emails and Actions" />
</script>

<script id="nf-tmpl-main-header-actions" type="text/template">
    <input class="nf-button secondary nf-change-domain" data-domain="settings" type="button" value="Manage Settings" />
</script>

<script id="nf-tmpl-main-header-settings" type="text/template">

</script>

<script id="nf-tmpl-main-content-fields-empty" type="text/template">
    <div class="nf-fields-empty">
        <h3>Add form fields</h3>
        <p>Get started by adding your first form field. <a class="nf-open-drawer" title="Add New Field" href="#" data-drawerid="addField">Just click here and select the fields you want.</a> It’s that easy. Or...
        <h3>Start from a template</h3>
        <a href="?page=ninja-forms&form_id=formtemplate-contactform" class="nf-one-third template-box">
            <div class="template-box-inside">
                <h4>Contact Form</h4>
                <p class="template-desc">Allow your users to contact you with this simple contact form. You can add and remove fields as needed.</p>
            </div>
        </a>
        <a href="?page=ninja-forms&form_id=formtemplate-quoterequest" class="nf-one-third template-box">
            <div class="template-box-inside">
                <h4>Quote Request</h4>
                <p class="template-desc">Start collecting leads with this pre-made Request a quote form. You can add and remove fields as needed.</p>
            </div>
        </a>
        <!-- <a href="#" class="nf-one-third template-box">
            <div class="template-box-inside">
                <h4>Donation Form</h4>
                <p class="template-desc">Start collecting donation payments on your website with this ready-made Donation form. You can add and remove fields as needed.</p>
            </div>
        </a>
        <a href="#" class="nf-one-third template-box">
            <div class="template-box-inside">
                <h4>Billing / Order Form</h4>
                <p class="template-desc">Collect payments for product and service orders with this ready-made form template. You can add and remove fields as needed.</p>
            </div>
        </a>
        <a href="#" class="nf-one-third template-box">
            <div class="template-box-inside">
                <h4>Newsletter Sign Up Form</h4>
                <p class="template-desc">Add subscribers and grow your email list with this newsletter signup form. You can add and remove fields as needed.</p>
            </div>
        </a> -->
    </div>
</script>

<script id="nf-tmpl-main-content-actions-empty" type="text/template">
    <tr>
        <td colspan="4">
            <h3>Add form actions</h3>
            <p>Get started by adding your first form field. Just click the plus and select the actions you want. It’s that easy.</p>
        </td>
    </tr>
</script>

<script id="nf-tmpl-main-content-field" type="text/template">
    <div id="<%= getFieldID() %>" class="<%= renderClasses() %>" data-id="<%= id %>"><%= renderIcon() %><span class="nf-field-label"><%= label %> <%= renderRequired() %></span>
        <div class="nf-item-controls"></div>
    </div>
</script>

<script id="nf-tmpl-item-controls" type="text/template">
    <div class="nf-item-edit nf-item-control"><a href="#" title="Edit"><i class="nf-edit-settings fa fa-cog" aria-hidden="true"></i><!-- <span class="nf-item-editing">Editing <%= objectType %></span> --></a></div>
    <div class="nf-item-duplicate nf-item-control"><a href="#" title="Duplicate (^ + C + click)"><i class="nf-duplicate fa fa-files-o" aria-hidden="true"></i></a></div>
    <div class="nf-item-delete nf-item-control"><a href="#" title="Delete (^ + D + click)"><i class="nf-delete fa fa-trash" aria-hidden="true"></i></a></div>
</script>

<script id="nf-tmpl-action-table" type="text/template">
    <table id="nf-table-display" class="nf-actions-table">
        <thead>
            <tr>
                <th></th>
                <th>Name</th>
                <th>Type</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
</script>

<script id="nf-tmpl-action-item" type="text/template">
    <td><%= renderToggle() %></td>
    <td><%= label %></td>
    <td><%= renderTypeNicename() %></td>
    <td>
        <div class="nf-item-controls"></div>
    </td>
</script>

<script id="nf-tmpl-form-setting-type" type="text/template">
    <div class="<%= renderClasses() %>"><span><%= nicename %></span></div>
</script>

<script id="nf-tmpl-mobile-menu" type="text/template">
    <ul class="primary">
        <li class="nf-publish <%= maybeDisabled() %>">Publish</li>
    </ul>
    <ul class="secondary"></ul>
</script>

<script id="nf-tmpl-mobile-menu-item" type="text/template">
    <li><a href="<%= renderUrl() %>" title="<%= nicename %>" tabindex="-1" target="<%= renderTarget() %>" <%= renderDisabled() %> ><%= renderDashicons() %><%= nicename %></a></li>
</script>

<script id="nf-tmpl-drawer" type="text/template">
    <div id="nf-drawer-header"></div>
    <span id="nf-drawer-content"></span>
    <a class="nf-toggle-drawer" title="Toggle Drawer">
        <span class="dashicons dashicons-admin-collapse"></span><span class="nf-expand-off">Full screen</span><span class="nf-expand-on">Half screen</span>
    </a>
    <span id="nf-drawer-footer"></span>
</script>

<script id="nf-tmpl-drawer-content-add-field" type="text/template">
    <div id="nf-drawer-staging" class="nf-settings nf-stage">
        <div class="nf-reservoir nf-drawer-staged-fields nf-field-type-droppable"></div>
    </div>
    <span id="nf-drawer-primary"></span>
    <span id="nf-drawer-secondary"></span>
</script>

<script id="nf-tmpl-drawer-content-add-action" type="text/template">
    <span id="nf-drawer-primary"></span>
    <span id="nf-drawer-secondary"></span>
</script>

<script id="nf-tmpl-drawer-content-view-changes-item" type="text/template">
    <% if ( ! disabled ) { %>
    <tr>
    <% } else { %>
    <tr class="disabled-row">
    <% } %>

        <td>
            <span class="dashicons dashicons-<%= label.dashicon %>"></span> <span class="nf-changes-item <%= ( disabled ) ? 'disabled' : '' %>"></span>
        </td>
        <td>
            <%= label.object %>
        </td>
        <td>
            <%= label.label %>
        </td>
        <td>
            <%= label.change %>
        </td>
        <td>
            <% if ( ! disabled ) { %>
                <a href="#" title="Undo" class="undoSingle disabled" style="text-decoration:none;">
            <% } %>

            <span class="dashicons dashicons-image-rotate <%= ( disabled ) ? 'disabled' : '' %>"></span>

            <% if ( ! disabled ) { %>
                </a>
            <% } %>
        </td>
    </tr>
</script>

<script id="nf-tmpl-drawer-content-edit-settings" type="text/template">
    <span class="nf-setting-title"></span>
    <span class="nf-setting-groups"></span>
</script>

<script id="nf-tmpl-drawer-content-edit-settings-title-default" type="text/template">
    <h2><%= renderTypeNicename() %></h2>
</script>

<script id="nf-tmpl-drawer-content-edit-settings-title-fields" type="text/template">
    <h2><%= renderSavedStar() %> <%= renderTypeNicename() %></h2>
    <span class="nf-add-saved-field" style="display:none"></span>
</script>

<script id="nf-tmpl-add-saved-field" type="text/template">
    <input type="text" placeholder="Saved Field Name" value="<%= label %>">
    <span class="add-button"></span>
</script>

<script id="nf-tmpl-add-saved-field-button" type="text/template">
    <a href="#" title="Add" class="nf-button primary">Add</a>
</script>

<script id="nf-tmpl-add-saved-field-loading" type="text/template">
    <a href="#" class="nf-button primary">&nbsp;
        <div class="nf-loading">
            <ul>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>
    </a>
</script>

<script id="nf-tmpl-drawer-content-edit-field-setting-group" type="text/template">
    <section class="nf-settings">
        <%= renderLabel() %>
        <span class="nf-field-settings"></span>
    </section>
</script>

<script id="nf-tmpl-drawer-content-edit-setting-group-label" type="text/template">
    <h3 class="toggle"><span class="dashicons dashicons-arrow-<%= renderArrowDir() %>"></span><%= label %></h3>
</script>

<script id="nf-tmpl-drawer-staged-field" type="text/template">
     <span class="nf-item-dock" id="<%= id %>" data-id="<%= slug %>"><span class="fa fa-<%= icon %>"></span><%= nicename %><span class="dashicons dashicons-dismiss"></span>
</script>

<script id="nf-tmpl-drawer-field-type-section" type="text/template">
    <section class="nf-settings <%= classes %>">
        <h3><%= nicename %></h3>
        <%= renderFieldTypes() %>
    </section>
</script>

<script id="nf-tmpl-drawer-field-type-button" type="text/template">
    <div class="nf-field-type-button nf-field-type-draggable <%= savedField() %>" data-id="<%= id %>">
        <div class="nf-item" data-id="<%= id %>" tabindex="0"><span class="fa fa-<%= icon %>"></span><%= nicename %></div>
    </div>
</script>

<script id="nf-tmpl-drawer-action-type-section" type="text/template">
    <section class="nf-settings nf-action-items <%= renderClasses() %>">
        <h3><%= renderNicename() %></h3>
        <span class="action-types"></span>
    </section>
</script>

<script id="nf-tmpl-drawer-action-type-button" type="text/template">
    <div class="nf-one-third nf-action-type-draggable" data-type="<%= id %>">
        <div class="<%= renderClasses() %>" <%= renderStyle() %>><%= nicename %></div>
    </div>
</script>

<script id="nf-tmpl-drawer-header-default" type="text/template">
    <header class="nf-drawer-header">
        <div class="nf-search">
            <input type="search" class="nf-filter" value="" placeholder="Filter" tabindex="-1" />
        </div>
        <a href="#" title="Done" class="nf-button primary nf-close-drawer <%= renderDisabled() %>" tabindex="-1">Done</a>
    </header>
</script>

<script id="nf-tmpl-drawer-header-edit-settings" type="text/template">
    <header class="nf-drawer-header">
        <a href="#" title="Done" class="nf-button primary nf-close-drawer <%= renderDisabled() %>" tabindex="-1">Done</a>
    </header>
</script>

<script id="nf-tmpl-drawer-header-view-changes" type="text/template">
    <header class="nf-drawer-header">
        <div>
            <a href="#" title="Undo All" class="nf-button secondary undoChanges" style="float:left;" tabindex="-1"><span class="dashicons dashicons-backup"></span> Undo All</a>
        </div>
        <a href="#" title="Done" class="nf-button primary nf-close-drawer" tabindex="-1">Done</a>
    </header>
</script>

<script id="nf-tmpl-drawer-header-new-form" type="text/template">
    <header class="nf-drawer-header">
        <h3>Almost there...</h3>
    </header>
</script>

<script id="nf-tmpl-drawer-content-new-form" type="text/template">
    <span class="new-form-name"></span>
    <div class="new-form-submit"></div>
    <div>
        <a href="#" title="Not Yet" class="nf-button secondary nf-close-drawer" style="float:left;" tabindex="-1">Not Yet</a>
    </div>
    <a href="#" title="Publish" class="nf-button primary nf-close-drawer publish" tabindex="-1">Publish</a>
</script>

<script id="nf-tmpl-app-menu-item" type="text/template">
    <li><a href="<%= renderUrl() %>" title="<%= nicename %>" class="<%= renderClasses() %>" target="<%= renderTarget() %>" <%= renderDisabled() %>><span class="app-menu-text"><%= nicename %></span><%= renderDashicons() %></a></li>
</script>

<script id="nf-tmpl-staged-fields-drag" type="text/template">
    <div class="nf-staged-fields-drag">
        <div id="drag-item-1" class="nf-staged-fields-drag-wrap"><%= num %> Fields</div>
        <div id="drag-item-2" class="nf-staged-fields-drag-wrap">&nbsp;</div>
        <div id="drag-item-3" class="nf-staged-fields-drag-wrap">&nbsp;</div>
    </div>
</script>

<script id="nf-tmpl-drawer-staged-fields-empty" type="text/template">
    <span></span>
</script>

<script id="nf-tmpl-empty" type="text/template">

</script>

<script id="nf-tmpl-merge-tags-section" type="text/template">
    <h4><%= label %></h4>
    <ul class="merge-tags"></ul>
</script>

<script id="nf-tmpl-merge-tags-item" type="text/template">
    <a href="#" title="<%= label %>" tabindex="1" class="<%= renderClasses() %>"><%= label %></a>
</script>

<!-- Field Settings Templates -->

<script id="nf-tmpl-edit-setting-wrap" type="text/template">
    <div class="<%= renderClasses() %>" <%= renderVisible() %>>
        <%= renderSetting() %>
        <span class="nf-setting-error"></span>
    </div>
</script>

<script id="nf-tmpl-edit-setting-error" type="text/template">
    <div><%= error %></div>
</script>

<script id="nf-tmpl-edit-setting-textbox" type="text/template">
    <label for="<%= name %>" class="<%= renderLabelClasses() %>"><%= label %> <%= renderTooltip() %>
        <input type="text" class="setting" id="<%= name %>" value="<%= value %>" <%= renderPlaceholder() %> />
        <%= renderMergeTags() %>
    </label>
</script>

<script id="nf-tmpl-edit-setting-datepicker" type="text/template">
    <label for="<%= name %>" class="<%= renderLabelClasses() %>"><%= label %> <%= renderTooltip() %>
        <input type="text" class="setting" id="<%= name %>" value="<%= value %>" <%= renderPlaceholder() %> />
    </label>
</script>

<script id="nf-tmpl-edit-setting-number" type="text/template">
    <label for="<%= name %>"><%= label %> <%= renderTooltip() %>
        <input type="number" class="setting" id="<%= name %>" value="<%= value %>" placeholder="<%= ( 'undefined' != typeof placeholder ) ? placeholder : '' %>" />
    </label>
</script>

<script id="nf-tmpl-edit-setting-textarea" type="text/template">
    <label for="<%= name %>" class="<%= renderLabelClasses() %>"><%= label %> <%= renderTooltip() %>
        <textarea id="<%= name %>" class="setting"><%= value %></textarea>
        <%= renderMergeTags() %>
    </label>
</script>

<script id="nf-tmpl-edit-setting-rte" type="text/template">
    <label class="<%= renderLabelClasses() %>"><%= label %> <%= renderTooltip() %></label>
        <div id="<%= name %>" class="setting"><%= value %></div>
        <%= renderMergeTags() %>

</script>

<script id="nf-tmpl-edit-setting-select" type="text/template">
    <label for="<%= name %>" class="nf-select"><%= label %> <%= renderTooltip() %>
        <select id="<%= name %>" class="setting">
            <%
            _.each( options, function( option ) {
                %>
                <option value="<%= option.value %>" <%= ( value == option.value ) ? 'selected="selected"' : '' %>><%= option.label %></option>
                <%
            } );
            %>
        </select>
        <div></div>
    </label>
</script>

<script id="nf-tmpl-edit-setting-field-select" type="text/template">
    <label for="<%= name %>" class="nf-select"><%= label %> <%= renderTooltip() %>
        <select id="<%= name %>" class="setting">
            <%
            _.each( options, function( option ) {
            %>
            <option value="<%= option.value %>" <%= ( value == option.value ) ? 'selected="selected"' : '' %>><%= option.label %></option>
            <%
            } );
            %>
        </select>
        <div></div>
    </label>
</script>

<script id="nf-tmpl-edit-setting-checkbox" type="text/template">

    <span class="nf-setting-label"><%= label %></span> <%= renderTooltip() %>
    <input type="checkbox" id="<%= name %>" class="nf-checkbox setting" <%= ( 1 == value ) ? 'checked' : '' %> />
    <label for="<%= name %>"><%= label %></label>

</script>

<script id="nf-tmpl-edit-setting-toggle" type="text/template">

    <span class="nf-setting-label"><%= label %><%= renderTooltip() %></span>
    <input type="checkbox" id="<%= name %>" class="nf-toggle setting" <%= ( 1 == value ) ? 'checked' : '' %> />
    <label for="<%= name %>"><%= label %></label>

</script>

<script id="nf-tmpl-edit-setting-color" type="text/template">

    <label for="<%= name %>" class="<%= renderLabelClasses() %>"><%= label %> <%= renderTooltip() %></label>

    <input type="text" id="<%= name %>" value="<%= value %>" class="setting" data-default-color="#F9F9F9" />

    <div class="nf-colorpicker">

    </div>

</script>

<script id="nf-tmpl-edit-setting-fieldset" type="text/template">
    <fieldset>
        <legend><%= label %></legend>
        <span class="nf-field-sub-settings"></span>
    </fieldset>
</script>

<script id="nf-tmpl-edit-setting-option-repeater" type="text/template">

    <fieldset class="nf-list-options <%= renderFieldsetClasses() %>" <%= renderVisible() %>>
        <legend><%= label %></legend>
        <div class="nf-div-table">
            <div class="nf-table-row nf-table-header">
                <%= renderHeaders() %>
            </div>

            <div class="nf-list-options-tbody">
            </div>
        </div>
    </fieldset>
</script>

<script id="nf-tmpl-edit-setting-option-repeater-empty" type="text/template">

</script>

<script id="nf-tmpl-edit-setting-option-repeater-error" type="text/template">
    <%= errors[ Object.keys( errors )[0] ] %>
</script>

<script id="nf-tmpl-edit-setting-option-repeater-default-row" type="text/template">
    <div>
        <span class="dashicons dashicons-menu handle"></span>
    </div>
    <%
        var columns = getColumns();

        if ( 'undefined' != typeof columns.label ) {
            %>
             <div>
                <input type="text" class="setting" value="<%= label %>" data-id="label">
            </div>
            <%
        }
    %>
    <%
        if ( 'undefined' != typeof columns.value ) {
            %>
             <div>
                <input type="text" class="setting" value="<%= value %>" data-id="value">
            </div>
            <%
        }
    %>
    <%
        if ( 'undefined' != typeof columns.calc ) {
            %>
             <div>
                <input type="text" class="setting" value="<%= calc %>" data-id="calc">
            </div>
            <%
        }
    %>
    <%
        if ( 'undefined' != typeof columns.selected ) {
            %>
            <div>
                <input type="checkbox" class="setting" class="nf-checkbox" <%= ( 1 == selected ) ? 'checked="checked"' : '' %> value="1" data-id="selected">
            </div>
            <%
        }
    %>

    <div>
        <span class="dashicons dashicons-dismiss nf-delete"></span>
    </div>
</script>

<script id="nf-tmpl-edit-setting-html" type="text/template">
    <div class="nf-note">
        <%= value %>
    </div>
</script>

<!-- Calculation Row Template -->

<script id="nf-tmpl-edit-setting-calculation-repeater-row" type="text/template">
    <div>
        <span class="dashicons dashicons-menu handle"></span>
    </div>
    <div>
        <input type="text" class="setting" value="<%= name %>" data-id="name">
        <span class="nf-option-error"></span>
    </div>
    <div>
        <textarea class="setting" data-id="eq"><%= eq %></textarea>
        <span class="dashicons dashicons-list-view merge-tags"></span>
    </div>
    <div>
        <span class="dashicons dashicons-dismiss nf-delete"></span>
    </div>
</script>

<!-- Rich Text Editor Templates -->

<script id="nf-tmpl-rte-media-button" type="text/template">
    <span class="dashicons dashicons-admin-media"></span>
</script>

<script id="nf-tmpl-rte-merge-tags-button" type="text/template">
    <span class="dashicons dashicons-list-view merge-tags"></span>
</script>

<script id="nf-tmpl-rte-link-button" type="text/template">
    <span class="dashicons dashicons-admin-links"></span>
</script>

<script id="nf-tmpl-rte-unlink-button" type="text/template">
    <span class="dashicons dashicons-editor-unlink"></span>
</script>

<script id="nf-tmpl-rte-link-dropdown" type="text/template">
    <div class="summernote-link">
        URL
        <input type="url" class="widefat code link-url"> <br />
        Text
        <input type="url" class="widefat code link-text"> <br />
        <label>
            <input type="checkbox" class="link-new-window"> Open in new window
        </label>
        <input type="button" class="cancel-link extra" value="Cancel">
        <input type="button" class="insert-link extra" value="Insert">
    </div>
</script>

<?php do_action( 'ninja_forms_builder_templates' ); ?>
