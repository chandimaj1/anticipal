<?php
/**
 * Vikinger GamiPress ACHIEVEMENT functions
 * 
 * @since 1.0.0
 */

/**
 * Get achievement types
 * 
 * @return array
 */
function vikinger_gamipress_get_achievement_types() {
  return gamipress_get_achievement_types();
}

/**
 * Check if an achievement type exists
 * 
 * @param string $type      Achievement type.
 * @return bool  $exists    True if achievement type exists, false otherwise.
 */
function vikinger_gamipress_achievement_type_exists($type = '') {
  $achievement_types = gamipress_get_achievement_types();

  return array_key_exists($type, $achievement_types);
}

/**
 * Check if user completed a step
 * 
 * @param int $step_id    ID of the step
 * @param int $user_id    ID of the user to check if the step is completed
 * @return boolean
 */
function vikinger_gamipress_user_completed_step($step_id, $user_id) {
  $completed_steps_users = gamipress_get_achievement_earners($step_id);

  foreach ($completed_steps_users as $completed_steps_user) {
    if ($completed_steps_user->ID === $user_id) {
      return true;
    }
  }

  return false;
}

/**
 * Check if user completed an achievement
 * 
 * @param int $achievement_id     ID of the achievement
 * @param int $user_id            ID of the user to check if the achivement is completed
 * @return boolean
 */
function vikinger_gamipress_user_completed_achievement($achievement_id, $user_id) {
  $completed_achievements_users = gamipress_get_achievement_earners($achievement_id);

  foreach ($completed_achievements_users as $completed_achievements_user) {
    if ($completed_achievements_user->ID === $user_id) {
      return true;
    }
  }

  return false;
}

/**
 * Get users that completed an achievement
 * 
 * @param int $achievement_id   ID of the achievement to get users that completed it
 * @return array
 */
function vikinger_gamipress_get_achievement_completed_users($achievement_id) {
  $users = [];

  $achievement_users = gamipress_get_achievement_earners($achievement_id);

  foreach ($achievement_users as $achievement_user) {
    $users[] = vikinger_members_get(['include' => [$achievement_user->ID]])[0];
  }

  return $users;
}

/**
 * Get an achievement data
 * 
 * @param int     $achievement_id           ID of the achievement to return data from
 * @param int     $user_id                  ID of the user to return completed achievement stats from
 * @return array
 */
function vikinger_gamipress_get_achievement($achievement_id, $user_id = false) {
  $args = [
    'post__in'  => [$achievement_id]
  ];

  $gp_achievement = gamipress_get_achievements($args);

  if (count($gp_achievement) === 0) {
    return false;
  }

  $gp_achievement = $gp_achievement[0];

  $achievement = [];
  $point_types = vikinger_gamipress_get_point_types();

  $completed_achievement = false;
  $awarded_achievement = false;

  if ($user_id) {
    $completed_achievement = vikinger_gamipress_user_completed_achievement($gp_achievement->ID, $user_id);
    $awarded_achievement = vikinger_gamipress_achievement_was_awarded($gp_achievement->ID, $user_id);
  }

  $points = absint(gamipress_get_post_meta($gp_achievement->ID, '_gamipress_points'));
  $point_type = gamipress_get_post_meta($gp_achievement->ID, '_gamipress_points_type');

  // if a point type is selected by the user for this achievement on the backend gamipress screen
  if (array_key_exists($point_type, $point_types)) {
    $point_type = $point_types[$point_type];
  }

  $achievement = [
    'id'                  => $gp_achievement->ID,
    'name'                => $gp_achievement->post_title,
    'description'         => wp_strip_all_tags($gp_achievement->post_content),
    'slug'                => $gp_achievement->post_name,
    'image_url'           => vikinger_post_get_image($gp_achievement->ID),
    'points'              => $points,
    'points_type'         => $point_type,
    'unlock_with_points'  => vikinger_gamipress_get_unlockable_with_points($gp_achievement->ID),
    'steps'               => [],
    'completed_users'     => vikinger_gamipress_get_achievement_completed_users($gp_achievement->ID),
    'completed'           => $completed_achievement,
    'awarded'             => $awarded_achievement,
    'achievement_type'    => $gp_achievement->post_type,
    'post_content'        => $gp_achievement->post_content,
    
  ];

  // get achievements steps
  $completed_all_steps = true;
  $steps = gamipress_get_achievement_steps($gp_achievement->ID);

  foreach ($steps as $step) {
    $completed_step = false;

    if ($user_id) {
      $completed_step = vikinger_gamipress_user_completed_step($step->ID, $user_id);
    }

    if (!$completed_step) {
      $completed_all_steps = false;
    }

    $achievement['steps'][] = [
      'id'          => $step->ID,
      'description' => $step->post_title,
      'completed'   => $completed_step
    ];
  }

  $achievement['completed_all_steps'] = $completed_all_steps;
  // achievement was unlocked with points if it is completed without having all its steps completed and without beign awarded
  $achievement['unlocked_with_points'] = $achievement['completed'] && !$completed_all_steps && !$achievement['awarded'];

  return $achievement;
}

/**
 * Get all achievements of an achievement type
 * 
 * @param string  $achievement_type_slug    Slug of the achievement type to return data from
 * @param int     $user_id                  ID of the user to return completed achievement stats from
 * @param string  $data_scope               Scope of the achievement data to return.
 * @param boolean $completed                True to return only completed achievements, false to return uncompleted achievements
 * @return array
 */
function vikinger_gamipress_get_achievements($achievement_type_slug, $user_id = false, $data_scope = 'full', $completed = null) {
  $args = [
    'post_type' => $achievement_type_slug,
    'order'     => 'ASC'
  ];

  $gp_achievements = gamipress_get_achievements($args);

  $achievements = [];

  if ($data_scope === 'full') {
    $point_types = vikinger_gamipress_get_point_types();

    foreach ($gp_achievements as $gp_achievement) {
      $completed_achievement = false;
      $awarded_achievement = false;

      if ($user_id) {
        $completed_achievement = vikinger_gamipress_user_completed_achievement($gp_achievement->ID, $user_id);
        $awarded_achievement = vikinger_gamipress_achievement_was_awarded($gp_achievement->ID, $user_id);

        // if completed arg supplied, use it to skip achievements accordingly
        if (!is_null($completed) && ($completed !== $completed_achievement)) {
          continue;
        }
      }

      $points = absint(gamipress_get_post_meta($gp_achievement->ID, '_gamipress_points'));
      $point_type = gamipress_get_post_meta($gp_achievement->ID, '_gamipress_points_type');

      // if a point type is selected by the user for this achievement on the backend gamipress screen
      if (array_key_exists($point_type, $point_types)) {
        $point_type = $point_types[$point_type];
      }

      $achievement = [
        'id'                  => $gp_achievement->ID,
        'name'                => $gp_achievement->post_title,
        'description'         => wp_strip_all_tags($gp_achievement->post_content),
        'slug'                => $gp_achievement->post_name,
        'image_url'           => vikinger_post_get_image($gp_achievement->ID),
        'points'              => $points,
        'points_type'         => $point_type,
        'unlock_with_points'  => vikinger_gamipress_get_unlockable_with_points($gp_achievement->ID),
        'steps'               => [],
        'completed_users'     => vikinger_gamipress_get_achievement_completed_users($gp_achievement->ID),
        'completed'           => $completed_achievement,
        'awarded'             => $awarded_achievement,
        'achievement_type'    => $achievement_type_slug,
        'post_excerpt'        => $gp_achievement->post_excerpt
      ];

      // get achievements steps
      $completed_all_steps = true;
      $steps = gamipress_get_achievement_steps($gp_achievement->ID);

      foreach ($steps as $step) {
        $completed_step = false;

        if ($user_id) {
          $completed_step = vikinger_gamipress_user_completed_step($step->ID, $user_id);
        }

        if (!$completed_step) {
          $completed_all_steps = false;
        }

        $achievement['steps'][] = [
          'id'          => $step->ID,
          'description' => $step->post_title,
          'completed'   => $completed_step
        ];
      }

      $achievement['completed_all_steps'] = $completed_all_steps;
      // achievement was unlocked with points if it is completed without having all its steps completed and without beign awarded
      $achievement['unlocked_with_points'] = $achievement['completed'] && (!$completed_all_steps || count($steps) === 0) && !$achievement['awarded'];

      $achievements[] = $achievement;
    }
  } else if ($data_scope === 'simple') {
    foreach ($gp_achievements as $gp_achievement) {
      $completed_achievement = false;

      if ($user_id) {
        $completed_achievement = vikinger_gamipress_user_completed_achievement($gp_achievement->ID, $user_id);

        // if completed arg supplied, use it to skip achievements accordingly
        if (!is_null($completed) && ($completed !== $completed_achievement)) {
          continue;
        }
      }

      $achievement = [
        'id'        => $gp_achievement->ID,
        'name'      => $gp_achievement->post_title,
        'slug'      => $gp_achievement->post_name,
        'image_url' => vikinger_post_get_image($gp_achievement->ID)
      ];

      $achievements[] = $achievement;
    }
  }

  return $achievements;
}

/**
 * Get logged user achievement data
 * 
 * @param string  $achievement_type_slug    Slug of the achievement type to return data from
 * @return array
 */
function vikinger_gamipress_get_logged_user_achievements($achievement_type_slug) {
  $user_id = false;

  if (is_user_logged_in()) {
    $user_id = get_current_user_id();
  }

  $achievements = vikinger_gamipress_get_achievements($achievement_type_slug, $user_id);

  return $achievements;
}

/**
 * Get user completed achievement data
 * 
 * @param string  $achievement_type_slug    Slug of the achievement type to return data from
 * @param int     $user_id                  ID of the user to return completed achievements from
 * @param string  $data_scope               Scope of the achievement data to return.
 * @return array
 */
function vikinger_gamipress_get_user_completed_achievements($achievement_type_slug, $user_id, $data_scope = 'full') {
  $achievements = vikinger_gamipress_get_achievements($achievement_type_slug, $user_id, $data_scope, true);

  return $achievements;
}

/**
 * Get all achievements types achievements completed by the user
 * 
 * @param int     $user_id      ID of the user to retrieve completed achievements from
 * @param string  $data_scope   Scope of the achievement data to return.
 * @return array
 */
function vikinger_gamipress_get_all_user_completed_achievements($user_id, $data_scope = 'full') {
  $achievements = vikinger_gamipress_get_achievement_types();

  $completed_achievements = [];

  foreach ($achievements as $key => $achievement) {
    $completed_achievements[$key] = vikinger_gamipress_get_user_completed_achievements($key, $user_id, $data_scope);
  }

  return $completed_achievements;
}

/**
 * Unlock user achievement with points
 * 
 * @param int $achievement_id     ID of the achievement to unlock with points
 * @param int $user_id            ID of the user to unlock the achievement to
 * @return boolean
 */
function vikinger_gamipress_unlock_user_achievement_with_points($achievement_id, $user_id) {
  // check if user has enough points to unlock achievement
  $achievement = vikinger_gamipress_get_achievement($achievement_id, $user_id);

  // if achievement can be unlocked with points and it hasn't been unlocked yet
  if ($achievement['unlock_with_points'] && !$achievement['completed']) {
    $point_type_to_deduct = $achievement['unlock_with_points']['slug'];
    $points_to_deduct = $achievement['unlock_with_points']['points'];

    $user_points = vikinger_gamipress_get_user_points($user_id);

    // if user has enough points to unlock achievement
    if ($user_points[$point_type_to_deduct]['points'] >= $points_to_deduct) {
      // deduct points from user
      gamipress_deduct_points_to_user($user_id, $points_to_deduct, $point_type_to_deduct);

      // award achievement to the user
      gamipress_award_achievement_to_user($achievement_id, $user_id);

      return true;
    }
  }

  return false;
}

/**
 * Unlock logged user achievement with points
 * 
 * @param int $achievement_id     ID of the achievement to unlock with points
 * @return boolean
 */
function vikinger_gamipress_unlock_logged_user_achievement_with_points($achievement_id) {
  $user_id = false;

  if (is_user_logged_in()) {
    $user_id = get_current_user_id();
  }

  if ($user_id) {
    return vikinger_gamipress_unlock_user_achievement_with_points($achievement_id, $user_id);
  }

  return false;
}

/**
 * Get points an achievement or rank is unlockable with, or false if its not unlockable with points
 * 
 * @param int $entity_id       ID of the achievement or rank
 * @return array|boolean
 */
function vikinger_gamipress_get_unlockable_with_points($entity_id) {
  $unlockable_with_points = (bool) gamipress_get_post_meta($entity_id, '_gamipress_unlock_with_points');

  if ($unlockable_with_points) {
    $points_to_unlock_type = gamipress_get_post_meta($entity_id, '_gamipress_points_type_to_unlock');
    $points_to_unlock = absint(gamipress_get_post_meta( $entity_id, '_gamipress_points_to_unlock'));
    $point_types = vikinger_gamipress_get_point_types();

    $unlockable_with_points = $point_types[$points_to_unlock_type];
    $unlockable_with_points['points'] = $points_to_unlock;
  }

  return $unlockable_with_points;
}

/**
 * Returns true if given achievement was awarded to the user (given to the user via the admin panel)
 * 
 * @param int $achievement_id       ID of the achievement
 * @param int $user_id              ID of the user to check if the achievement was awarded to
 * @return boolean
 */
function vikinger_gamipress_achievement_was_awarded($achievement_id, $user_id) {
  global $wpdb;

  $gamipress_logs_table_name = 'gamipress_logs';
  $gamipress_logs_table = $wpdb->prefix . $gamipress_logs_table_name;

  $gamipress_logs_meta_table_name = 'gamipress_logs_meta';
  $gamipress_logs_meta_table = $wpdb->prefix . $gamipress_logs_meta_table_name;

  // get if achievement was awarded by using the logs
  $sql = "SELECT $gamipress_logs_table.user_id FROM $gamipress_logs_meta_table
          INNER JOIN $gamipress_logs_table ON $gamipress_logs_table.log_id=$gamipress_logs_meta_table.log_id
          WHERE meta_key='_gamipress_achievement_id' and meta_value=%d and user_id=%d and type='achievement_award'";

  $result = $wpdb->get_row($wpdb->prepare($sql, [$achievement_id, $user_id]));

  return !is_null($result);
}

?>