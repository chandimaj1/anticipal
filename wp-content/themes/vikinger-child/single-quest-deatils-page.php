<?php
/**
 * Template Name: Single Quest Details Page
 * 
 * @package Vikinger
 * @since 1.0.0
 * @author Odin Design Themes (https://odindesignthemes.com/)
 * 
 */
    $achievement_slug = $wp_query->query_vars['achievement'];
    var_dump($achievement_slug);
    $achievement_id = url_to_postid( site_url('super-impact') );
    var_dump($achievement_id);

    //$achievement_id = url_to_postid( site_url('the_slug') );
    require_once( get_stylesheet_directory() . '/includes/cj-single-quest-page.php');
?>