<?php
if ( ! defined( 'WPINC' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

/* @formatter:off */
return array(
	'tabs' => array(
		'Forms' => array(
			'tab-details' => array(
				'type' => 'shortcode-form',
				'selection-type' => 'single-item',
			),
			'title' => 'Forms',
			'slug' => 'boldgrid_form',
			'attachments-template' => $plugin_dir . '/boldgrid/pages/form-attachments.php',
			'sidebar-template' 	   => $plugin_dir . '/boldgrid/pages/form-sidebar.php',
			'route-tabs' => array (
				'form-list' => array (
					'name' => 'Available Forms',
					'content' => array (
						//The key is the form id
						array (
						),
					),
				),
			),
		),
	)
);
/* @formatter:on */
