<?php if ( ! defined( 'ABSPATH' ) ) exit;

class NF_AJAX_Controllers_Submission extends NF_Abstracts_Controller
{
    protected $_form_data = array();

    protected $_preview_data = array();

    protected $_form_id = '';

    public function __construct()
    {
        if( isset( $_POST[ 'nf_resume' ] ) && isset( $_COOKIE[ 'nf_wp_session' ] ) ){
            add_action( 'ninja_forms_loaded', array( $this, 'resume' ) );
            return;
        }

        if( isset( $_POST['formData'] ) ) {
            $this->_form_data = json_decode( $_POST['formData'], TRUE  );

            // php5.2 fallback
            if( ! $this->_form_data ) $this->_form_data = json_decode( stripslashes( $_POST['formData'] ), TRUE  );
        }


        add_action( 'wp_ajax_nf_ajax_submit',   array( $this, 'submit' )  );
        add_action( 'wp_ajax_nopriv_nf_ajax_submit',   array( $this, 'submit' )  );

        add_action( 'wp_ajax_nf_ajax_resume',   array( $this, 'resume' )  );
        add_action( 'wp_ajax_nopriv_nf_ajax_resume',   array( $this, 'resume' )  );
    }

    public function submit()
    {
        check_ajax_referer( 'ninja_forms_display_nonce', 'security' );

        if( ! $this->_form_data ) {

            if( function_exists( 'json_last_error' ) // Function not supported in php5.2
                && function_exists( 'json_last_error_msg' )// Function not supported in php5.2
                && json_last_error() ){
                $this->_errors[] = json_last_error_msg();
            } else {
                $this->_errors[] = __( 'An unexpected error occurred.', 'ninja-forms' );
            }

            $this->_respond();
        }

        $this->_form_id = $this->_data[ 'form_id' ] = $this->_form_data['id'];

        if( isset( $this->_form_data[ 'settings' ][ 'is_preview' ] ) && $this->_form_data[ 'settings' ][ 'is_preview' ] ){
            $this->_preview_data = get_user_option( 'nf_form_preview_' . $this->_form_id );

            if( ! $this->_preview_data ){
                $this->_errors[ 'preview' ] = __( 'Preview does not exist.', 'ninja-forms' );
                $this->_respond();
            }
        }

        $this->_data['settings'] = $this->_form_data['settings'];

        $this->_data['fields'] = $this->_form_data['fields'];

        $this->validate_fields();

        $this->process_fields();

        $this->process();
    }

    public function resume()
    {
        $this->_data = Ninja_Forms()->session()->get( 'nf_processing_data' );
        $this->_data[ 'resume' ] = $_POST[ 'nf_resume' ];

        $this->_form_id = $this->_data[ 'form_id' ];

        unset( $this->_data[ 'halt' ] );
        unset( $this->_data[ 'actions' ][ 'redirect' ] );

        $this->process();
    }

    protected function process()
    {
        foreach( $this->_data[ 'fields' ] as $field_id => $field ){
            if( $this->_preview_data ) {
                if( ! isset( $this->_preview_data[ 'fields' ][ $field[ 'id' ] ][ 'settings' ] ) ) return;
                $settings = $this->_preview_data[ 'fields' ][ $field[ 'id' ] ][ 'settings' ];
            } else {
                $field_model = Ninja_Forms()->form()->field($field['id'])->get();
                $settings = $field_model->get_settings();
            }
            $this->_data[ 'fields' ][ $field_id ] = array_merge( $this->_data[ 'fields' ][ $field_id ], $settings );
        }
        $field_merge_tags = Ninja_Forms()->merge_tags[ 'fields' ];
        $this->populate_field_merge_tags( $this->_data['fields'], $field_merge_tags );

        if( isset( $this->_data[ 'settings' ][ 'calculations' ] ) ) {
            $calcs_merge_tags = Ninja_Forms()->merge_tags[ 'calcs' ];
            $this->populate_calcs_merge_tags( $this->_data[ 'settings' ][ 'calculations' ], $calcs_merge_tags );
        }

        if( isset( $this->_data[ 'settings' ][ 'is_preview' ] ) && $this->_data[ 'settings' ][ 'is_preview' ] ) {
            $this->run_actions_preview();
        } else {
            $this->run_actions();
        }

        do_action( 'ninja_forms_after_submission', $this->_data );

        $this->_respond();
    }

    protected function populate_field_merge_tags( $fields, $field_merge_tags )
    {
        foreach( $fields as $field ){

            $field_merge_tags->add_field( $field );
        }
    }

    protected function populate_calcs_merge_tags( $calcs, $calcs_merge_tags )
    {
        foreach( $calcs as $calc ){

            $calcs_merge_tags->set_merge_tags( $calc[ 'name' ], apply_filters( 'ninja_forms_calc_setting', $calc[ 'eq' ] ) );
        }
    }

    protected function validate_fields()
    {
        foreach( $this->_data['fields'] as $field ){

            $errors = $this->validate_field( $field, $this->_data );

            if( ! empty( $errors ) ){
                $this->_errors[ $field['id'] ] = $errors;
            }
        }
    }

    protected function validate_field( $field, $data )
    {
        if( $this->_preview_data ) {
            if( ! isset( $this->_preview_data[ 'fields' ][ $field[ 'id' ] ][ 'settings' ] ) ) return;
            $settings = $this->_preview_data[ 'fields' ][ $field[ 'id' ] ][ 'settings' ];
        } else {
            $field_model = Ninja_Forms()->form()->field($field['id'])->get();
            $settings = $field_model->get_settings();
        }

        $field = array_merge($field, $settings );

        $field_class = Ninja_Forms()->fields[ $field['type'] ];

        return $errors = $field_class->validate( $field, $data );
    }

    protected function process_fields()
    {
        foreach( $this->_data['fields'] as $field ){

            $data = $this->process_field( $field, $this->_data );

            if( ! empty( $data ) ){
                $this->_data = $data;
            }
        }
    }

    protected function process_field( $field, $data )
    {
        if( $this->_preview_data ) {
            if( ! isset( $this->_preview_data[ 'fields' ][ $field[ 'id' ] ][ 'settings' ] ) ) return;
            $settings = $this->_preview_data[ 'fields' ][ $field[ 'id' ] ][ 'settings' ];
        } else {
            $field_model = Ninja_Forms()->form()->field($field['id'])->get();
            $settings = $field_model->get_settings();
        }

        $field = array_merge($field, $settings );

        $field_class = Ninja_Forms()->fields[ $field['type'] ];


        return $field_class->process( $field, $data );
    }

    protected function run_actions()
    {
        $actions = Ninja_Forms()->form( $this->_form_id )->get_actions();

        usort($actions, array($this, 'sort_form_actions'));

        if( ! isset( $this->_data[ 'processed_actions' ] ) ) $this->_data[ 'processed_actions' ] = array();
        foreach( $actions as $action ){

            if( in_array( $action->get_id(), $this->_data[ 'processed_actions' ] ) ) continue;

            $action_settings = apply_filters( 'ninja_forms_run_action_settings', $action->get_settings(), $this->_form_id, $action->get_id(), $this->_data['settings'] );

            if( ! $action_settings['active'] ) continue;

            $type = $action_settings['type'];

            if( ! apply_filters( 'ninja_forms_run_action_type_' . $type, TRUE ) ) continue;

            $action_settings[ 'id' ] = $action->get_id();

            if( ! isset( Ninja_Forms()->actions[ $type ] ) ) continue;

            $data = Ninja_Forms()->actions[$type]->process($action_settings, $this->_form_id, $this->_data);

            $this->_data = ( $data ) ? $data : $this->_data;

            $this->maybe_halt( $action->get_id() );
        }
    }

    protected function run_actions_preview()
    {
        $form = get_user_option( 'nf_form_preview_' . $this->_form_id );

        if( ! isset( $form[ 'actions' ] ) || empty( $form[ 'actions' ] ) ) return;

        usort( $form[ 'actions' ], array( $this, 'sort_form_actions' ) );

        if( ! isset( $this->_data[ 'processed_actions' ] ) ) $this->_data[ 'processed_actions' ] = array();
        foreach( $form[ 'actions' ] as $action_id => $action ){

            if( in_array( $action_id, $this->_data[ 'processed_actions' ] ) ) continue;

            $action_settings = apply_filters( 'ninja_forms_run_action_settings_preview', $action[ 'settings' ], $this->_form_id, '', $this->_data['settings'] );

            if( ! $action_settings['active'] ) continue;

            $type = $action_settings['type'];

            $data = Ninja_Forms()->actions[ $type ]->process( $action_settings, $this->_form_id, $this->_data );

            $this->_data = ( $data ) ? $data : $this->_data;

            $this->maybe_halt( $action_id );
        }
    }

    protected function maybe_halt( $action_id )
    {
        if( isset( $this->_data[ 'halt' ] ) && $this->_data[ 'halt' ] ){

            Ninja_Forms()->session()->set( 'nf_processing_data', $this->_data );

            $this->_respond();
        }

        array_push( $this->_data[ 'processed_actions' ], $action_id );
    }

    protected function sort_form_actions( $a, $b )
    {
        if( is_object( $a ) ) {
            $a = Ninja_Forms()->actions[ $a->get_setting( 'type' ) ];
        } else {
            $a = Ninja_Forms()->actions[ $a[ 'settings' ][ 'type' ] ];
        }

        if( is_object( $b ) ) {
            $b = Ninja_Forms()->actions[ $b->get_setting( 'type' ) ];
        } else {
            $b = Ninja_Forms()->actions[ $b[ 'settings' ][ 'type' ] ];
        }

        if ( $a->get_timing() == $b->get_timing() ) {
            if ( $a->get_priority() == $b->get_priority() ) {
                return 0;
            }
            return ( $a->get_priority() < $b->get_priority() ) ? -1 : 1;
        }

        return ( $a->get_timing() < $b->get_timing() ) ? -1 : 1;
    }
}