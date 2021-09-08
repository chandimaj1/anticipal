<?php
/**
 * Vikinger Child - Functions
 * 
 * @package Vikinger Child
 * @since 1.0.0
 * @author Odin Design Themes (https://odindesignthemes.com/)
 * 
 */
global $post; 

/**
 * Load child theme styles
 */
function vikingerchild_enqueue_styles() {
  wp_enqueue_style('vikingerchild-styles', get_stylesheet_uri(), ['vikinger-styles'], '1.0.0');
}

add_action('wp_enqueue_scripts', 'vikingerchild_enqueue_styles' );

/**
 * Load translations
 */
function vikingerchild_translations_load() {
  load_child_theme_textdomain('vikinger', get_stylesheet_directory() . '/languages');
}

add_action('after_setup_theme', 'vikingerchild_translations_load');


// Send emails as HTML

/**
 * 
 * Enqueue Template specific styles and scripts
 * |CJ|
 */
function cj_template_specific_enqueue(){
    $template_assets = get_stylesheet_directory_uri().'/template_specific_assets';
    $post_type = get_post_type();


    //Single Quest
    if ( is_singular( 'quest' ) ) {
        wp_enqueue_style( 'single-quest-details-styles-min', $template_assets.'/single_quest_details/css/styles.min.css' );
        wp_enqueue_style( 'single-quest-details-styles', $template_assets.'/single_quest_details/css/styles.css' );
        wp_enqueue_style( 'single-quest-details-forminator-styles', $template_assets.'/single_quest_details/css/forminator.css' );
        wp_enqueue_script( 'single-quest-details-scripts',  $template_assets.'/single_quest_details/js/scripts.js', array('jquery'), '1.0.0', true );

    // Page quests    
    }else if ( is_page_template('page_quests.php') ) {
        wp_enqueue_style( 'page-quests-styles', $template_assets.'/page_quests/css/styles.css' );
    }
}
add_action( 'wp_enqueue_scripts', 'cj_template_specific_enqueue' );
/**
 *  End: template_specific_enqueue()
 */

function custom_rewrite_basic() {
  add_rewrite_rule('^mission/(.*)/?', '/mission?achievement=$matches[1]', 'top');
}
add_action('init', 'custom_rewrite_basic');

function custom_rewrite_tag() {
  add_rewrite_tag('%achievement%', '([^&]+)');
}
add_action('init', 'custom_rewrite_tag', 10, 0);

?>