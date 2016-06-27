<?php

/**
 * BoldGrid Source Code
 *
 * @package Boldgrid_Ninja_Forms_Config
 * @copyright BoldGrid.com
 * @version $Id$
 * @author BoldGrid.com <wpb@boldgrod.com>
 */

/**
 * BoldGrid Form configuration class.
 */
class Boldgrid_Ninja_Forms_Config {
	/**
	 * Configs.
	 *
	 * @var array
	 */
	protected $configs;

	/**
	 * Get configs.
	 *
	 * @return array
	 */
	public function get_configs() {
		return $this->configs;
	}

	/**
	 * Set configs.
	 *
	 * @param array $configs Configuration array.
	 * @return bool
	 */
	protected function set_configs( $configs ) {
		$this->configs = $configs;

		return true;
	}

	/**
	 * Constructor.
	 */
	public function __construct() {
		// Define Editor configuration directory, if not defined.
		if ( false === defined( 'BOLDGRID_NINJA_FORMS_CONFIGDIR' ) ) {
			define( 'BOLDGRID_NINJA_FORMS_CONFIGDIR', BOLDGRID_NINJA_FORMS_PATH . '/boldgrid/includes/config' );
		}

		$global_configs = require BOLDGRID_NINJA_FORMS_CONFIGDIR . '/config.plugin.php';

		$local_configs = array ();

		if ( file_exists( $local_config_filename = BOLDGRID_NINJA_FORMS_CONFIGDIR . '/config.local.php' ) ) {
			$local_configs = include $local_config_filename;
		}

		$configs = array_merge( $global_configs, $local_configs );

		$this->set_configs( $configs );
	}
}
