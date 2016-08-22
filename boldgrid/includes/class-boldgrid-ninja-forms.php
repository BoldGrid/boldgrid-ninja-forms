<?php
/**
 * BoldGrid Source Code
 *
 * @package Boldgrid_Ninja_Forms
 * @copyright Boldgrid.com
 * @version $Id$
 * @author BoldGrid.com <wpb@boldgrid.com>
 */

/**
 * BoldGrid Forms class
 */
class Boldgrid_Ninja_Forms {
	/**
	 * Class property to hold the Boldgrid_Ninja_Form_Config class:
	 *
	 * @var Boldgrid_Ninja_Forms_Config
	 */
	private $boldgrid_ninja_form_config;

	/**
	 * A full array of tab configurations
	 *
	 * @var array
	 */
	protected $tab_configs;

	/**
	 * Path configurations used for the plugin
	 */
	protected $path_configs;

	/**
	 * Accessor for tab configs
	 *
	 * @return array
	 */
	public function get_tab_configs() {
		return $this->tab_configs;
	}

	/**
	 * Accessor for path configs
	 *
	 * @return array
	 */
	public function get_path_configs() {
		return $this->path_configs;
	}

	/**
	 * Initialize tab configs.
	 */
	public function __construct() {
		$plugin_dir = self::derive_plugin_dir();

		$plugin_filename = $plugin_dir . '/ninja-forms.php';

		$this->tab_configs = include $plugin_dir . '/boldgrid/includes/config/layouts.php';

		$this->path_configs = array (
			'plugin_dir' => $plugin_dir,
			'plugin_filename' => $plugin_filename
		);

		// Load and instantiate WPB_Form_Config.
		require_once $plugin_dir . '/boldgrid/includes/class-boldgrid-ninja-forms-config.php';

		// Instantiate the Boldgrid_Ninja_Forms_Config class and save it into a class property.
		$this->boldgrid_ninja_form_config = new Boldgrid_Ninja_Forms_Config();

		// Add an action to load this plugin on init, only in the dashboard.
		if ( is_admin() ) {
			add_action( 'init', array (
				$this,
				'load_boldgrid_ninja_form_update'
			) );
		}
	}

	/**
	 * Load the BoldGrid Ninja Forms update class.
	 */
	public function load_boldgrid_ninja_form_update() {
		// Load and check for plugin updates.
		require_once BOLDGRID_NINJA_FORMS_PATH .
			 '/boldgrid/includes/class-boldgrid-ninja-forms-update.php';

		$plugin_update = new Boldgrid_Ninja_Forms_Update( $this );
	}

	/**
	 * Get $boldgrid_ninja_form_config class property
	 *
	 * @return Boldgrid_Ninja_Form_Config
	 */
	public function get_boldgrid_ninja_form_config() {
		return $this->boldgrid_ninja_form_config;
	}

	/**
	 * Get plugin directory
	 *
	 * @static
	 *
	 * @return string
	 */
	public static function derive_plugin_dir() {
		return realpath( dirname( dirname( dirname( __FILE__ ) ) ) );
	}

	/**
	 * Javascript needed for editor
	 *
	 * @return void
	 */
	public function enqueue_header_content() {
		global $pagenow;

		if ( false == in_array( $pagenow, array (
			'post.php',
			'post-new.php'
		) ) ) {
			return;
		}

		wp_enqueue_script( 'media-imhwpb',
			plugins_url( '/boldgrid/assets/js/media.js', $this->path_configs['plugin_filename'] ),
			array (), BOLDGRID_NINJA_FORM_VERSION, true );

		wp_enqueue_script( 'boldgrid-form-shortcode',
			plugins_url( '/boldgrid/assets/js/shortcode.js',
				$this->path_configs['plugin_filename'] ), array (), BOLDGRID_NINJA_FORM_VERSION, true );
	}

	/**
	 * Initialization hook for BoldGrid Ninja forms
	 *
	 * @return void
	 */
	public function init() {
		global $pagenow;

		add_action( 'admin_init', array (
			$this,
			'admin_init'
		) );

		add_filter( 'ninja_forms_starter_form_contents',
			array (
				$this,
				'modify_starter_forms'
			) );

		if ( 'edit.php' == $pagenow ) {
			add_action( 'pre_get_posts', array (
				$this,
				'remove_ninja_preview_page'
			) );

			add_filter( 'wp_count_posts',
				array (
					$this,
					'remove_preview_page_from_page_count'
				), 10, 2 );
		}
	}

	/**
	 * Initialization process for administration section if Boldgrid Ninja Forms
	 *
	 * @return void
	 */
	public function admin_init() {
		$valid_pages = array (
			'post.php',
			'post-new.php',
			'media-upload.php'
		);

		$edit_post_page = in_array( basename( $_SERVER['SCRIPT_NAME'] ), $valid_pages );
		if ( is_admin() && $edit_post_page ) {

			// Create Media Modal Tabs
			$this->create_tabs();

			// Print all forms as media templates
			add_action( 'print_media_templates',
				array (
					$this,
					'print_media_templates'
				) );

			// load up any css / js we need
			add_action( 'admin_enqueue_scripts',
				array (
					$this,
					'enqueue_header_content'
				), 15 );

			// Add Css to hide and show title/description
			$this->editor_styles();
		}
	}

	/**
	 * Add Css to hide and show title/description
	 *
	 * @return void
	 */
	public function editor_styles() {
		add_editor_style(
			plugins_url( '/boldgrid/assets/css/editor.css', $this->path_configs['plugin_filename'] ) );

		add_editor_style(
			plugins_url( '/deprecated/css/ninja-forms-display.css', $this->path_configs['plugin_filename'] ) );
	}

	/**
	 * Static method that will add all forms that have been defined in the
	 * boldgrid/includes/prebuilt-forms folder
	 *
	 * @static
	 *
	 * @return void
	 */
	public static function add_prebuilt_forms() {
		// Locate the prebuilt-forms directory:
		$prebuilt_forms_directory = self::derive_plugin_dir() . '/boldgrid/includes/prebuilt-forms';

		// If there is no directory found, then return:
		if ( false === is_dir( $prebuilt_forms_directory ) ) {
			return;
		}

		// Get a directory listing:
		$prebuilt_form_directory_listing = scandir( $prebuilt_forms_directory );

		// Natural sort order
		natsort( $prebuilt_form_directory_listing );

		// If there are no listings, then return:
		if ( empty( $prebuilt_form_directory_listing ) ) {
			return;
		}

		// Determinte the prebuilt form files:
		$prebuilt_form_files = array_diff( $prebuilt_form_directory_listing,
			array (
				'..',
				'.',
				'index.php'
			) );

		// If there are no listings after filtering, then return:
		if ( empty( $prebuilt_form_files ) ) {
			return;
		}

		// Get the site's title:
		$site_title = get_bloginfo( 'name' );

		// Get the site's email address:
		$email_address = get_bloginfo( 'admin_email' );

		// If the current blog's admin email address is missing, then try the network.
		if ( empty( $email_address ) ) {
			$email_address = get_site_option( 'admin_email' );
		}

		// Initialize $notifications_array:
		$notifications_array = array ();

		// Iterate through each form file and import:
		foreach ( $prebuilt_form_files as $prebuilt_form_file ) {
			// Read the form file:
			$prebuilt_form = file_get_contents(
				$prebuilt_forms_directory . '/' . $prebuilt_form_file );

			// Unserialize the form data:
			$prebuilt_form_unserialized = unserialize( $prebuilt_form );

			// If the form data is invalid, then skip:
			if ( false === $prebuilt_form_unserialized ) {
				continue;
			}

			// Initialize $updated_notification:
			$updated_notification = false;

			// Update the array:
			if ( false === empty( $prebuilt_form_unserialized['notifications'] ) ) {
				// Update existing email notifications:
				foreach ( $prebuilt_form_unserialized['notifications'] as $n_index => $notification ) {
					if ( 'email' == $notification['type'] ) {
						$prebuilt_form_unserialized['notifications'][$n_index]['date_updated'] = date(
							'Y-m-d' );
						$prebuilt_form_unserialized['notifications'][$n_index]['from_name'] = $site_title;
						$prebuilt_form_unserialized['notifications'][$n_index]['from_address'] = $email_address;
						$prebuilt_form_unserialized['notifications'][$n_index]['to'] = $email_address;

						if ( empty(
							$prebuilt_form_unserialized['notifications'][$n_index]['email_subject'] ) ) {
							$prebuilt_form_unserialized['notifications'][$n_index]['email_subject'] = 'Form submission';
						}

						$updated_notification = true;
					}
				}

				// Move notifications from the import data to $notifications_array.
				$notification_array_temp = $prebuilt_form_unserialized['notifications'];

				unset( $prebuilt_form_unserialized['notifications'] );
			}

			// Serialize the form data:
			$prebuilt_form = serialize( $prebuilt_form_unserialized );

			// Import the form:
			$last_form_id = ninja_forms_import_form( $prebuilt_form );

			// Move $notification_array_temp to $notifications_array[$last_form_id].
			if ( false === empty( $notification_array_temp ) ) {
				$notifications_array[$last_form_id] = $notification_array_temp;

				unset( $notifications_array_temp );
			}

			// If an email notification does not exist, then add one to $notifications_array:
			// Array index has no meaning; the import process does not use the key value.
			if ( false === $updated_notification ) {
				$notifications_array[$last_form_id][] = array (
					'date_updated' => date( 'Y-m-d' ),
					'active' => '1',
					'name' => 'email',
					'type' => 'email',
					'from_name' => $site_title,
					'from_address' => $email_address,
					'to' => $email_address,
					'email_subject' => 'Form submission',
					'email_message' => '[ninja_forms_all_fields]',
					'attach_csv' => '0',
					'email_format' => 'html',
					'reply_to' => '',
					'cc' => '',
					'bcc' => '',
					'redirect_url' => '',
					'success_msg' => ''
				);
			}
		}
		// Forms have been imported.

		// Insert notifications:
		foreach ( $notifications_array as $form_id => $notification_array ) {
			foreach ( $notification_array as $x => $n ) {
				$n_id = nf_insert_notification( $form_id );
				$form['notifications'] = $n;
				$n = apply_filters( 'nf_import_notification_meta', $n, $n_id, $form );
				foreach ( $n as $meta_key => $meta_value ) {
					nf_update_object_meta( $n_id, $meta_key, $meta_value );
				}
			}
		}
		// All notifications have been imported.
	}

	/**
	 * Get form markup
	 *
	 * @static
	 *
	 * @param int $form_id
	 *
	 * @return string
	 */
	public static function get_form_markup( $form_id ) {
		if ( function_exists( 'ninja_forms_display_form' ) ) {
			return ninja_forms_return_echo( 'ninja_forms_display_form', $form_id );
		}
	}

	/**
	 * Add prebuilt forms
	 *
	 * @return string
	 */
	public function modify_starter_forms() {
		self::add_prebuilt_forms();

		return '';
	}

	/**
	 * Get forms
	 *
	 * @static
	 *
	 * @return array
	 */
	public static function get_forms() {
		// Todo:
		// ninja_forms_get_all_forms());

		// Connect to the WordPress database:
		global $wpdb;

		// Query the database:
		$results = $wpdb->get_results(
			"SELECT distinct form_id FROM {$wpdb->prefix}ninja_forms_fields", OBJECT );

		// Initialize $form_ids array:
		$form_ids = array ();

		// Populate the $form_ids array:
		foreach ( $results as $result ) {
			if ( ! empty( $result->form_id ) ) {
				$form_ids[] = array (
					'id' => $result->form_id
				);
			}
		}

		// Return the resulting array:
		return $form_ids;
	}

	/**
	 * Create Tabs based on configurations
	 *
	 * @return void
	 */
	public function create_tabs() {
		if ( ! class_exists( 'Boldgrid_Ninja_Forms_Media_Tab' ) ) {
			require_once $this->path_configs['plugin_dir'] .
				 '/boldgrid/includes/class-boldgrid-ninja-forms-media-tab.php';
		}

		require_once $this->path_configs['plugin_dir'] .
			 '/boldgrid/includes/class-boldgrid-ninja-forms-media-tab-form.php';

		$boldgrid_configs = $this->get_tab_configs();

		$configs = $boldgrid_configs['tabs'];

		/**
		 * Create each tab specified from the configuration.
		 */
		foreach ( $configs as $tab ) {
			$media_tab = new Boldgrid_Ninja_Forms_Media_Tab_Form( $tab, $this->get_path_configs(),
				'/boldgrid' );

			$media_tab->create();
		}
	}

	/**
	 * Get Templates for all forms and print them to the page
	 *
	 * @return void
	 */
	public function print_media_templates() {
		$form_markup = array ();

		$forms = self::get_forms();

		foreach ( $forms as $form ) {
			$form_markup[$form['id']] = self::get_form_markup( $form['id'] );
		}

		include BOLDGRID_NINJA_FORMS_PATH . '/boldgrid/includes/partial-page/form-not-found-tmpl.php';

		foreach ( $form_markup as $form_id => $markup ) {
			$markup = str_replace( '<script', '<# print("<sc" + "ript"); #>', $markup );
			$markup = str_replace( '</script>', '<# print("</scr" + "ipt>"); #>', $markup );

			?>
<script type="text/html"
	id="tmpl-editor-boldgrid-form-<?php echo $form_id; ?>">
			<?php echo '<div>' . $markup . '</div>';  ?>
			</script>
<?php
		}
	}

	/**
	 * Hide the Ninja Forms Preview Page from the list of pages.
	 *
	 * @since 1.0.2
	 * @global $pagenow
	 * @param $query The
	 *        	prepared statement query to run.
	 * @return $query A prepared statement object, already executed.
	 */
	public function remove_ninja_preview_page( $query ) {
		global $pagenow;

		// Check that we are on admin page edit.php editing pages
		if ( ( 'edit.php' == $pagenow && isset( $_GET['post_type'] ) && 'page' == $_GET['post_type'] ) ) {

			// Do not display post with ninja_forms_preview_page $page->ID
			$page = get_page_by_title( 'ninja_forms_preview_page' );

			if ( is_object( $page ) ) {
				// Other plugins may set 'post__not_in' as well, and override our setting below.
				// We'll use array_merge and $query->get so to play nice with other plugins.
				$query->set( 'post__not_in',
					array_merge( array (
						$page->ID
					), $query->get( 'post__not_in' ) ) );
			}

			return $query;
		}
	}

	/**
	 * Remove Ninja Form preview page from page counts.
	 *
	 * On "All Pages", there is a count at the top of the page, similar to:
	 * All(4) | Mine(4) | Active(3) | Draft(1)
	 *
	 * Above, in the remove_ninja_preview_page method, we removed the page from the list of pages.
	 * We still need to remove it from the page counts (mentioned immediately above).
	 *
	 * @since 1.0.4
	 *
	 * @param object $counts
	 *        	An object of post_types and the count of each. Example $counts:
	 *        	http://pastebin.com/WrurLkXW
	 * @param string $type
	 *        	The type of post we're looking at. Example $type: 'page'.
	 * @return object An updated $counts.
	 */
	public function remove_preview_page_from_page_count( $counts, $type ) {
		// This change is only for pages. Abort if we're not looking at pages.
		if ( 'page' != $type ) {
			return $counts;
		}

		// Get the Ninja Forms Preview page. We need it to find the post's status.
		$preview_page = get_page_by_title( 'ninja_forms_preview_page' );

		// If no page is found, abort.
		if ( is_null( $preview_page ) ) {
			return $counts;
		}

		$post_status = $preview_page->post_status;

		// Generally the preview page is a 'draft', but we'll make no assumptions. No matter what
		// the status is, remove it from that status' count.
		if ( isset( $counts->$post_status ) ) {
			$counts->$post_status --;

			global $pagenow;

			$current_user_is_author = ( $preview_page->post_author == get_current_user_id() );
			$preview_page_is_trashed = ( 'trash' == $preview_page->post_status );

			// One count type not listed in $counts is 'Mine', the number of pages authored by the
			// current user. To update this number, we'll include the below javascript file. We'll
			// only include this file if the preview page is not trashed, because trashed pages
			// don't show in the 'Mine' count. Including this js file when we shouldn't will cause
			// the 'Mine' count to be innacurate.
			if ( 'edit.php' == $pagenow && $current_user_is_author && ! $preview_page_is_trashed ) {
				wp_enqueue_script( 'bgnf-all-pages',
					plugins_url( '/boldgrid/assets/js/all-pages.js',
						$this->path_configs['plugin_filename'] ), array (), BOLDGRID_NINJA_FORM_VERSION );
			}
		}

		return $counts;
	}
}
