<?php
/**
 * BoldGrid Source Code
 *
 * @package Boldgrid_Ninja_Forms_Media_Tab
 * @copyright Boldgrid.com
 * @version $Id$
 * @author BoldGrid.com <wpb@boldgrid.com>
 */

// Prevent direct calls
if ( ! defined( 'WPINC' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

/**
 * BoldGrid Media Tab class
 */
class Boldgrid_Ninja_Forms_Media_Tab {
	/**
	 * A single tabs configuration
	 *
	 * @var array
	 */
	protected $configs;

	/**
	 * Paths needed for including other files
	 *
	 * @var array
	 */
	protected $path_configs;

	/**
	 * The directory were assets belong should be prefixed by this path name
	 *
	 * @var string
	 */
	protected $asset_path_prefix = null;

	/**
	 * Constructor
	 *
	 * @param unknown $configs
	 * @param unknown $path_configs
	 * @param string $asset_path_prefix
	 *
	 * @return void
	 */
	public function __construct( $configs, $path_configs, $asset_path_prefix = '' ) {
		$this->configs = $configs;
		$this->path_configs = $path_configs;
		$this->asset_path_prefix = $asset_path_prefix;
	}

	/**
	 * Accessor $path_configs;
	 *
	 * @return array
	 */
	public function get_path_configs() {
		return $this->path_configs;
	}

	/**
	 * Accessor $configs
	 *
	 * @return array
	 */
	public function get_configs() {
		return $this->configs;
	}

	/**
	 * Set configs
	 *
	 * @param array $configs
	 *
	 * @return bool
	 */
	public function set_configs( $configs ) {
		$this->configs = $configs;

		return true;
	}

	/**
	 * Add actions to create tabs
	 *
	 * @return void
	 */
	public function create() {
		$configs = $this->get_configs();

		add_filter( 'media_upload_tabs', array (
			$this,
			'media_upload_tab_name'
		) );

		add_action( 'media_upload_' . $configs['slug'],
			array (
				$this,
				'media_upload_tab_content'
			) );
	}

	/**
	 * Return the markup for the tab iframe
	 *
	 * @return void
	 */
	public function print_content() {
		$configs = $this->get_configs();
		include $configs['attachments-template'];
		include $configs['sidebar-template'];
	}

	/**
	 * Create a vertical tab
	 *
	 * @param array $tabs
	 *
	 * @return array
	 */
	public function media_upload_tab_name( $tabs ) {
		$configs = $this->get_configs();
		$newtab = array (
			$configs['slug'] => $configs['title']
		);
		return array_merge( $tabs, $newtab );
	}

	/**
	 * Create a tabs content
	 *
	 * @return string
	 */
	public function media_upload_tab_content() {
		add_action( 'admin_enqueue_scripts', array (
			$this,
			'enqueue_header_content'
		) );

		return wp_iframe( array (
			$this,
			'print_content'
		) );
	}
	/**
	 * Register styles/scripts
	 *
	 * @return void
	 */
	public function enqueue_header_content() {
		wp_enqueue_media();

		wp_enqueue_script( 'custom-header' );

		// Styles for MediaTab iFrame
		wp_register_style( 'media-tab-css-imhwpb',
			plugins_url( $this->asset_path_prefix . '/assets/css/media-tab.css',
				$this->path_configs['plugin_filename'] ), array (
				'media-views'
			), BOLDGRID_NINJA_FORM_VERSION );

		wp_enqueue_style( 'media-tab-css-imhwpb' );

		// Media Tab Javascript
		wp_register_script( 'media-imhwpb',
			plugins_url( $this->asset_path_prefix . '/assets/js/media.js',
				$this->path_configs['plugin_filename'] ), array (), BOLDGRID_NINJA_FORM_VERSION );

		$configs = $this->get_configs();

		// Pass Variables into JS
		wp_localize_script( 'media-imhwpb', 'IMHWPB',
			array (
				'Globals' => array (
					'isIframe' => true,
					'tabs' => $configs['route-tabs'],
					'tab-details' => $configs['tab-details'],
					'admin-url' => get_admin_url()
				)
			) );

		wp_enqueue_script( 'media-imhwpb' );
	}
}
