<?php

final class NF_VersionSwitcher
{
    public function __construct()
    {
        $this->ajax_check();

        add_action( 'init', array( $this, 'version_bypass_check' ) );

        add_action( 'admin_init', array( $this, 'listener' )  );

        if( defined( 'NF_DEV' ) && NF_DEV ) {
            add_action('admin_bar_menu', array( $this, 'admin_bar_menu'), 999);
        }
    }

    public function ajax_check()
    {
        $nf2to3 = isset( $_POST[ 'nf2to3' ] );
        $doing_ajax = ( defined( 'DOING_AJAX' ) && DOING_AJAX );
        if( $nf2to3 && ! $doing_ajax ){
            wp_die(
                __( 'You do not have permission.', 'ninja-forms' ),
                __( 'Permission Denied', 'ninja-forms' )
            );
        }
    }

    public function version_bypass_check()
    {
        if( ! isset( $_POST[ 'nf2to3' ] ) ) return TRUE;

        $capability = apply_filters( 'ninja_forms_admin_version_bypass_capabilities', 'manage_options' );
        $current_user_can = current_user_can( $capability );

        if( $current_user_can ) return TRUE;

        wp_die(
            __( 'You do not have permission.', 'ninja-forms' ),
            __( 'Permission Denied', 'ninja-forms' )
        );
    }

    public function listener()
    {
        if( ! current_user_can( apply_filters( 'ninja_forms_admin_version_switcher_capabilities', 'manage_options' ) ) ) return;

        if( isset( $_GET[ 'nf-switcher' ] ) ){

            switch( $_GET[ 'nf-switcher' ] ){
                case 'upgrade':
                    update_option( 'ninja_forms_load_deprecated', FALSE );
                    do_action( 'ninja_forms_upgrade' );
                    break;
                case 'rollback':
                    update_option( 'ninja_forms_load_deprecated', TRUE );
                    do_action( 'ninja_forms_rollback' );
                    break;
            }

            header( 'Location: ' . admin_url( 'admin.php?page=ninja-forms' ) );
        }
    }

    public function admin_bar_menu( $wp_admin_bar )
    {
        $args = array(
            'id'    => 'nf',
            'title' => 'Ninja Forms Dev',
            'href'  => '#',
        );
        $wp_admin_bar->add_node( $args );
        $args = array(
            'id' => 'nf_switcher',
            'href' => admin_url(),
            'parent' => 'nf'
        );
        if( ! get_option( 'ninja_forms_load_deprecated' ) ) {
            $args[ 'title' ] = 'DEBUG: Switch to 2.9.x';
            $args[ 'href' ] .= '?nf-switcher=rollback';
        } else {
            $args[ 'title' ] = 'DEBUG: Switch to 3.0.x';
            $args[ 'href' ] .= '?nf-switcher=upgrade';
        }
        $wp_admin_bar->add_node($args);
    }

}

new NF_VersionSwitcher();
