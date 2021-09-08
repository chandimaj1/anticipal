<?php
/**
 * Vikinger Template - BuddyPress Entry Point
 * 
 * @package Vikinger
 * @since 1.0.0
 * @author Odin Design Themes (https://odindesignthemes.com/)
 * 
 */

  get_header();

  if (have_posts()) {
    the_post();
    the_content();
  }

  get_footer();

?>