<?php

function ninja_forms_display_form( $form_id = '' ){
    echo do_shortcode( "[ninja_form id='$form_id']" );
}
