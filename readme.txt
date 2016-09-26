=== BoldGrid Ninja Forms ===
Contributors: imh_brad, joemoto, rramo012, timph
Tags: inspiration,customization,build,create,design,forms,webforms
Requires at least: 4.3
Tested up to: 4.6.1
Stable tag: 1.2.2
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

BoldGrid Ninja Forms is a webform builder with unparalleled ease of use and features.

== Description ==

BoldGrid Ninja Forms is a webform builder with unparalleled ease of use and features.

== Installation ==

This section describes how to install the plugin and get it working.

1. Upload the entire boldgrid-ninja-forms folder to the /wp-content/plugins/ directory.
2. Activate the plugin through the Plugins menu in WordPress.
3. You will find the Forms menu in your WordPress Dashboard / admin panel.

*Security:*

* Patched a security vulnerability related to shortcodes and logged-in users.
* As with all our security releases, we urge all users to update to prevent any possible issues.

- 1.2.4 In progress =
* Misc:			JIRA WPB-2420	Added EOF line breaks.

= 1.2.3 =
* Misc:			JIRA WPB-2344	Updated readme.txt for Tested up to 4.6.1.
* Bug fix:		JIRA WPB-2336	Load BoldGrid settings from the correct WP option (site/blog).
* Update:		JIRA WPB-2368	Set version constant from plugin file.

= 1.2.2 =
* Bug fix:		JIRA WPB-2263	In multisite, if the site's admin email address is missing, then use the network admin email address.
* Misc:			JIRA WPB-2256	Updated readme.txt for Tested up to: 4.6.
* Rework:		JIRA WPB-1825	Formatting.
* Update:		JIRA WPB-2241	Updated Ninja Forms version to 2.9.55.2.

= 1.2.1 =
* Update:		JIRA WPB-2179	Updated Ninja Forms version to 2.9.55.

= 1.2 =
* New feature:	JIRA WPB-2037	Fixing comatibility issues with WordPress 4.6.

= 1.1.3 =
* New feature:	JIRA WPB-2037	Added capability for auto-updates by BoldGrid API response.
* Testing:		JIRA WPB-2046	Tested on WordPress 4.5.3.
* Update:		JIRA WPB-2025	Updated Ninja Forms version to 2.9.50.

= 1.1.2 =
* Bug fix:		JIRA WPB-1885	Fixed PHP warnings and notices when using BoldGrid Start Over to delete forms and entries.
* Misc:			JIRA WPB-1824	Updated Ninja Forms version to 2.9.45.
* Bug fix:		JIRA WPB-1868	Prevent fatal error when switching to 3.0.x, caused by WPB-1856.

= 1.1.1.1 =
* Bug fix:		JIRA WPB-1858	Fixing 404 in editor styles.
* Bug fix:		JIRA WPB-1859	Fixing issues where cursor resets with contentEditable fields.

= 1.1.1 =
* Misc:			JIRA WPB-1824	Updated Ninja Forms version to 2.9.42.
* Update:		JIRA WPB-1856	Disable 'Freemius opt-in' message.

= 1.1.0.1 =
* Bug fix:		JIRA WPB-1816	Fixed update class interference with the Add Plugins page.

= 1.1 =
* Bug fix:		JIRA WPB-1809	Fixed undefined index "action" for some scenarios.  Optimized update class and addressed CodeSniffer items.
* Misc:			JIRA WPB-1361	Added license file.

= 1.0.7.1 =
* Bug fix:		JIRA WPB-1705	Fixed notification import actions.

= 1.0.7 =
* Bug fix:		JIRA WPB-1598	'Mine' count on 'all pages' is incorrect.
* Bug fix:						Changed the method used to open media frame tabs.
* Misc:         JIRA WPB-1659   Updated Ninja Forms version to 2.9.33

= 1.0.6 =
* Rework:		JIRA WPB-1618	Updated require and include statements for standards.

= 1.0.5 =
* Rework:		JIRA WPB-1517	Added import of notifications after import of forms.

= 1.0.4.1 =
* Bug fix:		JIRA WPB-1517	Disabled imported notification.  Sent to rework.

= 1.0.4 =
* Bug fix:		JIRA WPB-1553	Changed __DIR__ to dirname( __FILE__ ) for PHP <=5.2.
* New Feature:	JIRA WPB-1522  	Standardize Drag Menu order
* New feature	JIRA WPB-1517	Added default email notifications to prebuilt forms.
* Misc			JIRA WPB-1468	Updated readme.txt for Tested up to: 4.4.1
* Bug fix:		JIRA WPB-1559	Remove Ninja Forms preview page from count.
* Bug fix:		JIRA WPB-1443	Extra page listed under 'Mine'.

= 1.0.3 =
* Bug Fix:				Preventing notice on list all pages

= 1.0.2 =
* Bug Fix:		JIRA WPB-1277	Removed ninja_forms_preview_page from being displayed.
* Bug Fix:		JIRA WPB-1423	When starting over in Inspirations, error log complains about ninja forms table.
* Bug fix:		JIRA WPB-1406	Attribution page still showing in 'All Pages'.

= 1.0.1 =
* New feature:	JIRA WPB-1363	Updated readme.txt for WordPress standards.

= 1.0 =
* Initial public release.

== Upgrade Notice ==
= 1.2.1 =
Shortcodes have been re-implemented. They are used like so: [ninja_form id=3] where 3 is the ID number of the form you want to display.

= 1.1.1 =
Users should update to boldgrid-ninja-forms version 1.1.1 for support in WordPress 4.5.
