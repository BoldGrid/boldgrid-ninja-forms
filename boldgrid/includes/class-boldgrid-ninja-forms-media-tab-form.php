<?php
/**
 * BoldGrid Source Code
 *
 * @package Boldgrid_Ninja_Forms_Media_Tab_Form
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
 * BoldGrid Media Tab Form class
 */
class Boldgrid_Ninja_Forms_Media_Tab_Form extends Boldgrid_Ninja_Forms_Media_Tab {
	/**
	 * Fill out the tab content before printing
	 *
	 * @return void
	 */
	public function print_content() {
		$form_content = $this->create_form_content();

		$this->update_config_content( $form_content );

		$configs = $this->get_configs();

		include $configs['attachments-template'];

		include $configs['sidebar-template'];
	}

	/**
	 * Update the content configs of a tabs with the given argument
	 *
	 * @param array $form_content
	 *
	 * @return void
	 */
	public function update_config_content( $form_content ) {
		$configs = $this->get_configs();

		$configs['route-tabs']['form-list']['content'] = $form_content;

		$this->set_configs( $configs );
	}

	/**
	 * Generate the form content for a page based on available forms
	 *
	 * @return array
	 */
	public function create_form_content() {
		$form_data = $this->format_gf_form_data();

		foreach ( $form_data as $key => $form ) {
			$form_data[$key]['html'] = Boldgrid_Ninja_Forms::get_form_markup( $form['id'] );
		}
		return $form_data;
	}

	/**
	 * Find all the forms for a user then create an array with only the relevant data
	 *
	 * @return array
	 */
	public function format_gf_form_data() {
		$form_data = array ();

		$forms = Boldgrid_Ninja_Forms::get_forms();

		foreach ( $forms as $form ) {
			$form_information['id'] = $form['id'];

			$form_data[] = $form_information;
		}

		return $form_data;
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

		add_action( 'admin_enqueue_scripts',
			array (
				$this,
				'enqueue_form_header_content'
			) );

		return wp_iframe( array (
			$this,
			'print_content'
		) );
	}

	/**
	 * Add Media tab styles
	 *
	 * @return void
	 */
	public function enqueue_form_header_content() {
		wp_register_style( 'media-tab-form-css-imhwpb',
			plugins_url( $this->asset_path_prefix . '/assets/css/media-tab-form.css',
				$this->path_configs['plugin_filename'] ), array (), BOLDGRID_NINJA_FORM_VERSION );

		wp_enqueue_style( 'media-tab-form-css-imhwpb' );
	}
}
