<?php
/**
 * Vikinger GamiPress UTILS functions
 * 
 * @since 1.0.0
 */

/**
 * Get GamiPress post types
 */
function vikinger_gamipress_post_types_get() {
  $achievement_types = vikinger_gamipress_achievement_types_get_flat();
  $rank_types = vikinger_gamipress_rank_types_get_flat();

  $post_types = [];

  $post_types = array_merge($post_types, $achievement_types);
  $post_types = array_merge($post_types, $rank_types);

  return $post_types;
}

/**
 * Get flattened GamiPress achievement types
 */
function vikinger_gamipress_achievement_types_get_flat() {
  $gp_achievement_types = vikinger_gamipress_get_achievement_types();

  $achievement_types = [];

  foreach ($gp_achievement_types as $key => $gp_achievement_type) {
    $achievement_types[] = $key;
  }

  return $achievement_types;
}

/**
 * Get flattened GamiPress rank types
 */
function vikinger_gamipress_rank_types_get_flat() {
  $gp_rank_types = vikinger_gamipress_get_rank_types();

  $rank_types = [];

  foreach ($gp_rank_types as $key => $gp_rank_type) {
    $rank_types[] = $key;
  }

  return $rank_types;
}

/**
 * Get GamiPress type by post type
 * 
 * @param string        $post_type    Post type.
 * @return string|bool  $gp_type      GamiPress element type or false if invalid post_type. One of: 'achievement', 'rank'.
 */
function vikinger_gamipress_type_get($post_type) {
  $achievement_types = vikinger_gamipress_achievement_types_get_flat();
  $rank_types = vikinger_gamipress_rank_types_get_flat();

  if (in_array($post_type, $achievement_types)) {
    return 'achievement';
  }

  if (in_array($post_type, $rank_types)) {
    return 'rank';
  }

  return false;
}