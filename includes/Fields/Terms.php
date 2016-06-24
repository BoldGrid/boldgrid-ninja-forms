<?php if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Class NF_Fields_Terms
 */
class NF_Fields_Terms extends NF_Fields_ListCheckbox
{
    protected $_name = 'terms';
    protected $_type = 'terms';

    protected $_nicename = 'Terms List';

    protected $_section = '';

    protected $_icon = 'tags';

    protected $_settings = array( 'taxonomy' );

    protected $_settings_exclude = array( 'required' );

    public function __construct()
    {
        parent::__construct();

        $this->_nicename = __( 'Terms List', 'ninja-forms' );

        add_filter( 'ninja_forms_localize_field_' . $this->_type, array( $this, 'add_term_options' ) );
        add_filter( 'ninja_forms_localize_field_' . $this->_type . '_preview', array( $this, 'add_term_options' ) );

        $term_settings = array();
        $taxonomies = get_taxonomies( '', 'objects' );
        foreach( $taxonomies as $name => $taxonomy ){
            $this->_settings[ 'taxonomy' ][ 'options' ][] = array(
                'label' => $taxonomy->labels->name,
                'value' => $name
            );

            $terms = get_terms( $name );
            foreach( $terms as $term ){
                $term_settings[] =  array(
                    'name' => 'taxonomy_term_' . $term->term_id,
                    'type' => 'toggle',
                    'label' => $term->name,
                    'width' => 'one-third',
                    'deps' => array(
                        'taxonomy' => $name
                    )
                );
            }
        }

        $this->_settings[ 'taxonomy_terms' ] = array(
            'name' => 'taxonomy_terms',
            'type' => 'fieldset',
            'label' => __( 'Available Terms' ),
            'width' => 'full',
            'group' => 'primary',
            'settings' => $term_settings,
        );

        $this->_settings[ 'options' ][ 'group' ] = '';
    }

    public function add_term_options( $field )
    {
        if( ! isset( $field[ 'settings' ][ 'taxonomy' ] ) ) return $field;

        $terms = get_terms( $field[ 'settings' ][ 'taxonomy' ] );

        $field['settings']['options'] = array();
        foreach( $terms as $term ) {

            if( ! isset( $field[ 'settings' ][ 'taxonomy_term_' . $term->term_id ] ) ) continue;
            if( ! $field[ 'settings' ][ 'taxonomy_term_' . $term->term_id ] ) continue;

            $field['settings']['options'][] = array(
                'label' => $term->name,
                'value' => $term->term_id,
                'calc' => '',
                'selected' => 0,
                'order' => 0
            );
        }

        return $field;
    }
}
