<?php
/**
 * Vikinger BLOG filters
 * 
 * @since 1.0.0
 */

/**
 * Filter excerpt 'more' text
 */
function vikinger_excerpt_more($more) {
  return '...';
}

add_filter('excerpt_more', 'vikinger_excerpt_more');