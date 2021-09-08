<?php
/**
 * Vikinger ACTIVITY functions
 * 
 * @since 1.0.0
 */

/**
 * Returns activity data
 * 
 * @param array   $args   Filter activities using args data
 * @return array
 */
function vikinger_get_activities($args = []) {
  $activities_args = [
    'display_comments'  => 'threaded',
    'show_hidden'       => true
  ];

  $pinned_activity = false;

  if (array_key_exists('include_pinned_from', $args) && $args['include_pinned_from']) {
    $user_id = $args['include_pinned_from'];
    $pinned_activity_id = (int) vikinger_get_pinned_activity($user_id);

    if ($pinned_activity_id) {
      unset($args['include_pinned_from']);

      $pinned_activity_args = [
        'in'          => $pinned_activity_id,
        'show_hidden' => true,
        'exclude'     => false
      ];

      $pinned_activity_args = array_merge($args, $pinned_activity_args);
      $pinned_activity = vikinger_get_activities($pinned_activity_args)['activities'];

      if (count($pinned_activity) === 1) {
        $pinned_activity = $pinned_activity[0];
        $pinned_activity['pinned'] = true;
      }
    }
  }

  $activities_args = array_replace_recursive($activities_args, $args);

  $bp_activities = bp_activity_get($activities_args);
  
  $activities = [
    'activities'      => $pinned_activity ? [$pinned_activity] : [],
    'has_more_items'  => $bp_activities['has_more_items']
  ];

  $logged_in_user_id = bp_loggedin_user_id();
  $logged_in_user_favorites = bp_activity_get_user_favorites($logged_in_user_id);

  foreach ($bp_activities['activities'] as $bp_activity) {
    $comments = property_exists($bp_activity, 'children') ? $bp_activity->children : false;
    $my_comments = [];

    if ($comments) {
      vikinger_get_activity_comments_with_children_recursive($comments, $my_comments);
    }

    $activity = [
      'id'                => $bp_activity->id,
      'item_id'           => $bp_activity->item_id,
      'secondary_item_id' => $bp_activity->secondary_item_id,
      'component'         => $bp_activity->component,
      'type'              => $bp_activity->type,
      'action'            => $bp_activity->action,
      'content'           => convert_smilies(stripslashes($bp_activity->content)),
      'date'              => $bp_activity->date_recorded,
      'timestamp'         => sprintf(
        esc_html_x('%s ago', 'Activity Comment Timestamp', 'vikinger'),
        human_time_diff(
          mysql2date('U', get_date_from_gmt($bp_activity->date_recorded)),
          current_time('timestamp')
        )
      ),
      'parent'            => $bp_activity->item_id === $bp_activity->secondary_item_id ? 0 : $bp_activity->secondary_item_id,
      'comments'          => $my_comments,
      'comment_count'     => bp_activity_recurse_comment_count($bp_activity),
      'meta'              => bp_activity_get_meta($bp_activity->id),
      'author'            => vikinger_members_get_fallback($bp_activity->user_id),
      'favorite'          => $logged_in_user_favorites ? in_array($bp_activity->id, $logged_in_user_favorites) : false,
      'reactions'         => [],
      'permalink'         => bp_activity_get_permalink($bp_activity->id),
      'hide_sitewide'     => $bp_activity->hide_sitewide
    ];

    // override bbPress group component activity action
    if (($activity['component'] === 'groups') && (($activity['type'] === 'bbp_topic_create') || ($activity['type'] === 'bbp_reply_create'))) {
      $activity['action'] = vikinger_bbpress_format_activity_action_new_topic($activity['action'], $bp_activity);
    }

    // add vkreact-buddypress reactions data if plugin is active
    if (vikinger_plugin_vkreact_is_active() && vikinger_plugin_vkreact_buddypress_is_active()) {
      $activity['reactions'] = vikinger_reactions_insert_user_data(vkreact_bp_get_activity_reactions($bp_activity->id));
    }

    // add group information
    if ($activity['component'] === 'groups') {
      $activity['group'] = vikinger_groups_get(['include' => [$bp_activity->item_id], 'data_scope' => 'group-activity'])[0];
    }

    // add friend information
    if ($activity['type'] === 'friendship_created') {
      $activity['friend'] = vikinger_members_get_fallback($bp_activity->secondary_item_id, 'user-activity-friend');
    }

    // add share information
    if ($activity['type'] === 'activity_share') {
      $shared_item = vikinger_get_activities(['in' => $bp_activity->secondary_item_id, 'display_comments' => false])['activities'];

      $activity['shared_item'] = count($shared_item) === 1 ? $shared_item[0] : false;
    }

    // add share information
    if ($activity['type'] === 'post_share') {
      $shared_item = vikinger_get_posts(['include' => [$bp_activity->secondary_item_id]]);

      $activity['shared_item'] = count($shared_item) === 1 ? $shared_item[0] : false;
    }

    // add media information
    if (($activity['type'] === 'activity_media') || ($activity['type'] === 'activity_video')) {
      // add vkmedia data if plugin is active
      if (vikinger_plugin_vkmedia_is_active()) {
        $activity['media'] = vkmedia_get_media($bp_activity->secondary_item_id);
      } else {
        $activity['media'] = [];
      }
    }

    // add media information
    if (array_key_exists('uploaded_media_id', $activity['meta'])) {
      $uploaded_media_ids = $activity['meta']['uploaded_media_id'];

      $uploaded_media = [];

      // fetch all media
      foreach ($uploaded_media_ids as $uploaded_media_id) {
        if (($activity['type'] === 'activity_media_update') || ($activity['type'] === 'activity_media_upload')) {
          $activity_media_type = 'activity_media';
        } else if (($activity['type'] === 'activity_video_update') || ($activity['type'] === 'activity_video_upload')) {
          $activity_media_type = 'activity_video';
        }

        $media_activity = vikinger_get_activities(['filter' => ['secondary_id' => $uploaded_media_id, 'action' => $activity_media_type]])['activities'];
        
        if ((count($media_activity) > 0) && !is_null($media_activity[0]['media'])) {
          $uploaded_media[] = $media_activity[0];
        }
      }

      // fetch maximum
      $display_max = 5;
      $uploaded_media_count = count($uploaded_media);
      $uploaded_media_fetch_count = min($display_max, $uploaded_media_count);

      // set more link according to the component where the media was posted on
      if ($bp_activity->component === 'groups') {
        $more_link = $activity['group']['media_link'];
      } else {
        $more_link = bp_core_get_user_domain($bp_activity->user_id) . 'photos';
      }

      $activity['uploaded_media'] = [
        'data'      => array_slice($uploaded_media, 0, $uploaded_media_fetch_count),
        'metadata'  => [
          'more'      => abs($display_max - $uploaded_media_count),
          'more_link' => $more_link
        ]
      ];
    }

    $activities['activities'][] = $activity;
  }

  return $activities;
}

/**
 * Returns filtered activities count
 * 
 * @param array   $args               Activity filters.
 * @return array  $activities_count   Filtered activities count.
 */
function vikinger_activities_get_count($args = []) {
  $request = new WP_REST_Request('GET', '/buddypress/v1/activity');

  $defaults = [
    'per_page' => 1
  ];

  $args = array_merge($defaults, $args);

  // set parameters
  foreach ($args as $key => $value) {
    $request->set_param($key, $value);
  }

  $bp_activities = rest_do_request($request);

  $activities_count = 0;

  // if request was succesfull
  if ($bp_activities->status === 200) {
    if (array_key_exists('X-WP-Total', $bp_activities->headers)) {
      $activities_count = $bp_activities->headers['X-WP-Total'];
    }
  }

  return $activities_count;
}

/**
 * Get member activity post count
 * 
 * @param int $member_id          ID of the user to get the activity post count from
 * @return int
 */
function vikinger_activity_get_member_post_count($member_id) {
  $args = [
    'filter'  => [
      'user_id' => $member_id,
      'object'  => [
        'activity',
        'groups'
      ],
      'action'  => [
        'activity_update',
        'activity_media_update',
        'activity_media_upload',
        'activity_video_update',
        'activity_video_upload',
        'activity_share',
        'post_share',
        'bbp_topic_create',
        'bbp_reply_create'
      ]
    ]
  ];

  return count(bp_activity_get($args)['activities']);
}

/**
 * Get member activity comment count
 * 
 * @param int $member_id          ID of the user to get the activity comment count from
 * @return int
 */
function vikinger_activity_get_member_comment_count($member_id) {
  $args = [
    'display_comments'  => 'stream',
    'filter'  => [
      'user_id' => $member_id,
      'object'  => [
        'activity',
        'groups'
      ],
      'action'  => [
        'activity_comment'
      ]
    ]
  ];

  return count(bp_activity_get($args)['activities']);
}

/**
 * Recursively re-format comment info
 */
function vikinger_get_activity_comments_with_children_recursive($comments, &$my_comments) {
  foreach ($comments as $comment) {
    // only send required data
    $com = [
      'id'        => $comment->id,
      'parent'    => $comment->item_id === $comment->secondary_item_id ? 0 : $comment->secondary_item_id,
      'author'    => vikinger_members_get_fallback($comment->user_id),
      'date'      => $comment->date_recorded,
      'content'   => convert_smilies(stripslashes($comment->content)),
      'timestamp' => sprintf(
        esc_html_x('%s ago', 'Activity Comment Timestamp', 'vikinger'),
        human_time_diff(
          mysql2date('U', get_date_from_gmt($comment->date_recorded)),
          current_time('timestamp')
        )
      ),
      'reactions' => []
    ];

    // add vkreact-buddypress reactions data if plugin is active
    if (vikinger_plugin_vkreact_is_active() && vikinger_plugin_vkreact_buddypress_is_active()) {
      $com['reactions'] = vikinger_reactions_insert_user_data(vkreact_bp_get_activity_reactions($comment->id));
    }

    if ($comment->children) {
      $com['children'] = [];
      vikinger_get_activity_comments_with_children_recursive($comment->children, $com['children']);
    }

    $my_comments[] = $com;
  }
}

/**
 * Create activity
 * 
 * @param array   $args   Filter activities using args data
 * @return int|boolean
 */
function vikinger_create_activity($args) {
  $result = bp_activity_add($args);

  // if activity was created successfully, trigger buddypress actions
  // (required for some gamipress triggers to work as they depend on buddypress actions)
  if ($result) {
    // if created a comment
    if (array_key_exists('action', $args) && ($args['action'] === 'activity_comment')) {
      do_action('bp_activity_comment_posted', $result, $args);
    } else {
      do_action('bp_activity_posted_update', $args['content'], get_current_user_id(), $result);
    }
    
  }

  // activity ID on success, false on error
  return $result;
}

/**
 * Delete activity
 * 
 * @param int   $activity_id  ID of the activity to delete
 * @return boolean
 */
function vikinger_delete_activity($activity_id) {
  vikinger_activity_associated_media_delete($activity_id);

  $result = bp_activity_delete_by_activity_id($activity_id);

  // true on success, false on error
  return $result;
}

/**
 * Get media activities associated to an activity
 * 
 * @param int $activity_id    ID of the activity to get associated media activities of.
 * @return bool|array         Associated media activities, false if there aren't any.
 */
function vikinger_activity_associated_media_activities_get($activity_id) {
  $activity_meta = bp_activity_get_meta($activity_id);

  if (!array_key_exists('uploaded_media_id', $activity_meta)) {
    return false;
  }

  $media_activities = [];

  foreach ($activity_meta['uploaded_media_id'] as $uploaded_media_id) {
    $media_activities[] = vikinger_get_activities([
      'filter'  => [
        'action'        => [
          'activity_media',
          'activity_video'
        ],
        'secondary_id'  => $uploaded_media_id
      ]
    ]);
  }

  return $media_activities;
}

/**
 * Delete media associated to an activity
 * 
 * @param int $activity_id    ID of the activity to delete associated media of.
 * @return bool
 */
function vikinger_activity_associated_media_delete($activity_id) {
  $activity_meta = bp_activity_get_meta($activity_id);

  if (!array_key_exists('uploaded_media_id', $activity_meta)) {
    return true;
  }

  foreach ($activity_meta['uploaded_media_id'] as $uploaded_media_id) {
    $bp_media_activities = bp_activity_get([
      'filter'  => [
        'action'        => [
          'activity_media',
          'activity_video'
        ],
        'secondary_id'  => $uploaded_media_id
      ]
    ])['activities'];

    if (count($bp_media_activities) > 0) {
      $bp_media_activity = $bp_media_activities[0];

      $media_activity = [
        'id'        => $bp_media_activity->id,
        'component' => [
          'id'    => $bp_media_activity->item_id,
          'type'  => $bp_media_activity->component === 'activity' ? 'member' : 'group'
        ],
        'media'     => (array) vkmedia_get_media($uploaded_media_id)
      ];
  
      // remove activity media
      $activity_delete_result = bp_activity_delete_by_activity_id($media_activity['id']);
  
      if ($activity_delete_result) {
        // remove media file entry from vkmedia table
        $vkmedia_entry_delete_result = vkmedia_delete_media((int) $media_activity['media']['id']);
  
        // remove media file from server
        $file_path = vikinger_get_component_upload_path($media_activity['component']) . '/' . $media_activity['media']['name'] . '.' . $media_activity['media']['type'];
        $file_delete_result = vikinger_delete_file($file_path);
      }
    }
  }

  return true;
}

/**
 * Delete activity comment
 * 
 * @param int   $activity_id      ID of the activity the comment belongs to.
 * @param int   $comment_id       ID of the activity comment to delete.
 * @return bool $result           True if successful delete, false otherwise.
 */
function vikinger_activity_comment_delete($activity_id, $comment_id) {
  $result = bp_activity_delete_comment($activity_id, $comment_id);

  return $result;
}

/**
 * Update activity meta
 * 
 * @param array   $args   Filter activities using args data
 * @return int|boolean
 */
function vikinger_update_activity_meta($args) {
  $result = bp_activity_update_meta($args['activity_id'], $args['meta_key'], $args['meta_value']);

  // metadata ID on new meta created, true on meta update, false on error
  return $result;
}

/**
 * Add activity meta
 * 
 * @param array   $args   Filter activities using args data
 * @return int|boolean
 */
function vikinger_add_activity_meta($args) {
  $result = bp_activity_add_meta($args['activity_id'], $args['meta_key'], $args['meta_value']);

  // metadata ID on new meta created, false on error
  return $result;
}

/**
 * Add activity to user favorites
 * 
 * @param int   $activityID   ID of the activity to add to user favorites
 * @param int   $userID       ID of the user to add the activity to favorites
 * @return boolean
 */
function vikinger_add_favorite_activity($activityID, $userID) {
  $result = bp_activity_add_user_favorite($activityID, $userID);

  // true on success, false on error
  return $result;
}

/**
 * Remove activity from user favorites
 * 
 * @param int   $activityID   ID of the activity to remove from user favorites
 * @param int   $userID       ID of the user to remove the activity from favorites
 * @return boolean
 */
function vikinger_remove_favorite_activity($activityID, $userID) {
  $result = bp_activity_remove_user_favorite($activityID, $userID);

  // true on success, false on error
  return $result;
}

/**
 * Pin activity by user
 * 
 * @param int   $activityID   ID of the activity to pin
 * @param int   $userID       ID of the user that pins the activity
 * @return int|boolean
 */
function vikinger_pin_activity($activityID, $userID) {
  $result = bp_update_user_meta($userID, 'vikinger_pinned_activity', $activityID);

  // metaID if it didn't exist, true on success, false on error
  return $result;
}

/**
 * Unpin activity by user
 * 
 * @param int   $userID       ID of the user that unpins the activity
 * @return int|boolean
 */
function vikinger_unpin_activity($userID) {
  $result = bp_update_user_meta($userID, 'vikinger_pinned_activity', '');

  // metaID if it didn't exist, true on success, false on error
  return $result;
}

/**
 * Get user pinned activity
 * 
 * @param int   $userID       ID of the user
 * @return string|value
 */
function vikinger_get_pinned_activity($userID) {
  $result = bp_get_user_meta($userID, 'vikinger_pinned_activity', true);

  // meta value if key exists, empty string if not
  return $result;
}

/**
 * Get id of the activity that corresponds to the meta value provided
 */
function vikinger_activity_meta_activity_id_get($meta_value) {
  global $wpdb;

  $prefix = $wpdb->base_prefix;
  $table_name = "bp_activity_meta";
  $table = $prefix . $table_name;

  $sql = "SELECT activity_id FROM $table
          WHERE meta_value = %d";

  $result = $wpdb->get_row($wpdb->prepare($sql, [$meta_value]));

  if (!is_null($result)) {
    return (int) $result->activity_id;
  }

  return false;
}

/**
 * Get count of media associated to the provided activity id
 */
function vikinger_activity_meta_media_count_get($activity_id) {
  global $wpdb;

  $prefix = $wpdb->base_prefix;
  $table_name = "bp_activity_meta";
  $table = $prefix . $table_name;

  $sql = "SELECT count(id) AS activity_media_count FROM $table
          WHERE activity_id = %d";

  $result = $wpdb->get_row($wpdb->prepare($sql, [$activity_id]));

  if (!is_null($result)) {
    return (int) $result->activity_media_count;
  }

  return false;
}

/**
 * Get activity media creation task
 * 
 * @param array   $args       Parameters to give to the task
 * @return Vikinger_Task
 */
function vikinger_activity_media_create_task($args) {
  $task_execute = function ($args, $media_id) {
    $activity_media_args = [
      'item_id'           => $args['item_id'],
      'secondary_item_id' => $media_id,
      'component'         => $args['component'],
      'type'              => $args['type'],
      'hide_sitewide'     => $args['hide_sitewide']
    ];

    if (array_key_exists('content', $args)) {
      $activity_media_args['content'] = $args['content'];
    }

    $result = vikinger_create_activity($activity_media_args);

    return $result;
  };

  $task_rewind = function ($args, $activity_id) {
    
  };

  $task = new Vikinger_Task($task_execute, $task_rewind, $args);

  return $task;
}

/**
 * Get activity attached media type meta creation task
 * 
 * @param array   $args       Parameters to give to the task
 * @return Vikinger_Task
 */
function vikinger_activity_create_meta_attachedmedia_type_task($args) {
  $task_execute = function ($args) {
    $meta_args = [
      'activity_id' => $args['activity_id'],
      'meta_key'    => 'attached_media_type',
      'meta_value'  => $args['type']
    ];

    $result = vikinger_update_activity_meta($meta_args);

    return $result;
  };

  $task_rewind = function ($args, $activity_id) {

  };

  $task = new Vikinger_Task($task_execute, $task_rewind, $args);

  return $task;
}

/**
 * Get activity attached media id meta creation task
 * 
 * @param array   $args       Parameters to give to the task
 * @return Vikinger_Task
 */
function vikinger_activity_create_meta_attachedmedia_id_task($args) {
  $task_execute = function ($args) {
    $meta_args = [
      'activity_id' => $args['activity_id'],
      'meta_key'    => 'attached_media_id',
      'meta_value'  => $args['id']
    ];

    $result = vikinger_update_activity_meta($meta_args);

    return $result;
  };

  $task_rewind = function ($args, $activity_id) {

  };

  $task = new Vikinger_Task($task_execute, $task_rewind, $args);

  return $task;
}

/**
 * Get activity uploaded media id meta creation task
 * 
 * @param array   $args       Parameters to give to the task
 * @return Vikinger_Task
 */
function vikinger_activity_create_meta_uploadedmedia_id_task($activity_id) {
  $task_execute = function ($activity_id, $media_id) {
    $meta_args = [
      'activity_id' => $activity_id,
      'meta_key'    => 'uploaded_media_id',
      'meta_value'  => $media_id
    ];

    $result = vikinger_add_activity_meta($meta_args);

    if ($result) {
      return $media_id;
    }

    return false;
  };

  $task_rewind = function ($activity_id, $meta_id) {
    
  };

  $task = new Vikinger_Task($task_execute, $task_rewind, $activity_id);

  return $task;
}

/**
 * Get activity share count meta creation task
 * 
 * @param array   $args       Parameters to give to the task
 * @return Vikinger_Task
 */
function vikinger_activity_create_meta_share_count_task($args) {
  $task_execute = function ($args) {
    $meta_args = [
      'activity_id' => $args['id'],
      'meta_key'    => 'share_count',
      'meta_value'  => $args['count']
    ];

    $result = vikinger_update_activity_meta($meta_args);

    if ($result) {
      return $args['id'];
    }

    return false;
  };

  $task_rewind = function ($args, $activity_id) {

  };

  $task = new Vikinger_Task($task_execute, $task_rewind, $args);

  return $task;
}

/**
 * Register activity_media_upload custom action
 */
function vikinger_register_activity_media_upload_action() {
  bp_activity_set_action(
    'activity',
    'activity_media_upload',
    esc_html_x('Posted a photo upload', '(Backend) Activity Media Upload Action - Description', 'vikinger'),
    'vikinger_format_action_activity_media_upload',
    esc_html_x('Media upload post', '(Backend) Activity Media Upload Action - Label', 'vikinger')
  );
}

add_action('bp_register_activity_actions', 'vikinger_register_activity_media_upload_action');

/**
 * Register activity_media_upload custom group action
 */
function vikinger_register_activity_media_upload_group_action() {
  bp_activity_set_action(
    'groups',
    'activity_media_upload',
    esc_html_x('Posted a photo upload', '(Backend) Activity Media Upload Group Action - Description', 'vikinger'),
    'vikinger_format_action_activity_media_upload_group',
    esc_html_x('Media upload post', '(Backend) Activity Media Upload Group Action - Label', 'vikinger')
  );
}

add_action('bp_register_activity_actions', 'vikinger_register_activity_media_upload_group_action');

/**
 * Action string format for the activity_media_upload action
 * 
 * @param string $action    Action string
 * @param Object $activity  Activity item object
 * @return string
 */
function vikinger_format_action_activity_media_upload($action, $activity) {
  $action = esc_html_x('uploaded photos', 'Activity Media Upload Action - Text', 'vikinger');

  return $action;
}

/**
 * Action string format for the activity_media_upload action
 * 
 * @param string $action    Action string
 * @param Object $activity  Activity item object
 * @return string
 */
function vikinger_format_action_activity_media_upload_group($action, $activity) {
  $action = esc_html_x('uploaded photos in the group', 'Activity Media Upload Action Group - Text', 'vikinger');

  return $action;
}

/**
 * Register activity_media_update custom action
 */
function vikinger_register_activity_media_update_action() {
  bp_activity_set_action(
    'activity',
    'activity_media_update',
    esc_html_x('Posted a photo update', '(Backend) Activity Media Update Action - Description', 'vikinger'),
    'vikinger_format_action_activity_media_update',
    esc_html_x('Media update', '(Backend) Activity Media Update Action - Label', 'vikinger')
  );
}

add_action('bp_register_activity_actions', 'vikinger_register_activity_media_update_action');

/**
 * Register activity_media_update custom group action
 */
function vikinger_register_activity_media_update_group_action() {
  bp_activity_set_action(
    'groups',
    'activity_media_update',
    esc_html_x('Posted a photo update', '(Backend) Activity Media Update Group Action - Description', 'vikinger'),
    'vikinger_format_action_activity_media_update_group',
    esc_html_x('Media update', '(Backend) Activity Media Update Group Action - Label', 'vikinger')
  );
}

add_action('bp_register_activity_actions', 'vikinger_register_activity_media_update_group_action');

/**
 * Action string format for the activity_media_update action
 * 
 * @param string $action    Action string
 * @param Object $activity  Activity item object
 * @return string
 */
function vikinger_format_action_activity_media_update($action, $activity) {
  $action = esc_html_x('posted a photo update', 'Activity Media Update Action - Text', 'vikinger');

  return $action;
}

/**
 * Action string format for the activity_media_update action
 * 
 * @param string $action    Action string
 * @param Object $activity  Activity item object
 * @return string
 */
function vikinger_format_action_activity_media_update_group($action, $activity) {
  $action = esc_html_x('posted a photo update in the group', 'Activity Media Update Action Group - Text', 'vikinger');

  return $action;
}

/**
 * Register activity_media custom action
 */
function vikinger_register_activity_media_action() {
  bp_activity_set_action(
    'activity',
    'activity_media',
    esc_html_x('Uploaded a photo', '(Backend) Activity Media Action - Description', 'vikinger'),
    'vikinger_format_action_activity_media',
    esc_html_x('Media upload', '(Backend) Activity Media Action - Label', 'vikinger')
  );
}

add_action('bp_register_activity_actions', 'vikinger_register_activity_media_action');

/**
 * Register activity_media custom group action
 */
function vikinger_register_activity_media_group_action() {
  bp_activity_set_action(
    'groups',
    'activity_media',
    esc_html_x('Uploaded a photo', '(Backend) Activity Media Group Action - Description', 'vikinger'),
    'vikinger_format_action_activity_media_group',
    esc_html_x('Media upload', '(Backend) Activity Media Group Action - Label', 'vikinger')
  );
}

add_action('bp_register_activity_actions', 'vikinger_register_activity_media_group_action');

/**
 * Action string format for the activity_media action
 * 
 * @param string $action    Action string
 * @param Object $activity  Activity item object
 * @return string
 */
function vikinger_format_action_activity_media($action, $activity) {
  $action = esc_html_x('uploaded a photo', 'Activity Media Action - Text', 'vikinger');

  return $action;
}

/**
 * Action string format for the activity_media action
 * 
 * @param string $action    Action string
 * @param Object $activity  Activity item object
 * @return string
 */
function vikinger_format_action_activity_media_group($action, $activity) {
  $action = esc_html_x('uploaded a photo in the group', 'Activity Media Action Group - Text', 'vikinger');

  return $action;
}

/**
 * Register activity_video_upload custom action
 */
function vikinger_register_activity_video_upload_action() {
  bp_activity_set_action(
    'activity',
    'activity_video_upload',
    esc_html_x('Posted a video upload', '(Backend) Activity Video Upload Action - Description', 'vikinger'),
    'vikinger_format_action_activity_video_upload',
    esc_html_x('Video upload post', '(Backend) Activity Video Upload Action - Label', 'vikinger')
  );
}

add_action('bp_register_activity_actions', 'vikinger_register_activity_video_upload_action');

/**
 * Register activity_video_upload custom group action
 */
function vikinger_register_activity_video_upload_group_action() {
  bp_activity_set_action(
    'groups',
    'activity_video_upload',
    esc_html_x('Posted a video upload', '(Backend) Activity Video Upload Group Action - Description', 'vikinger'),
    'vikinger_format_action_activity_video_upload_group',
    esc_html_x('Video upload post', '(Backend) Activity Video Upload Group Action - Label', 'vikinger')
  );
}

add_action('bp_register_activity_actions', 'vikinger_register_activity_video_upload_group_action');

/**
 * Action string format for the activity_video_upload action
 * 
 * @param string $action    Action string
 * @param Object $activity  Activity item object
 * @return string
 */
function vikinger_format_action_activity_video_upload($action, $activity) {
  $action = esc_html_x('uploaded a video', 'Activity Video Upload Action - Text', 'vikinger');

  return $action;
}

/**
 * Action string format for the activity_video_upload action
 * 
 * @param string $action    Action string
 * @param Object $activity  Activity item object
 * @return string
 */
function vikinger_format_action_activity_video_upload_group($action, $activity) {
  $action = esc_html_x('uploaded a video in the group', 'Activity Video Upload Action Group - Text', 'vikinger');

  return $action;
}

/**
 * Register activity_video_update custom action
 */
function vikinger_register_activity_video_update_action() {
  bp_activity_set_action(
    'activity',
    'activity_video_update',
    esc_html_x('Posted a video update', '(Backend) Activity Video Update Action - Description', 'vikinger'),
    'vikinger_format_action_activity_video_update',
    esc_html_x('Video update', '(Backend) Activity Video Update Action - Label', 'vikinger')
  );
}

add_action('bp_register_activity_actions', 'vikinger_register_activity_video_update_action');

/**
 * Register activity_video_update custom group action
 */
function vikinger_register_activity_video_update_group_action() {
  bp_activity_set_action(
    'groups',
    'activity_video_update',
    esc_html_x('Posted a video update', '(Backend) Activity Video Update Group Action - Description', 'vikinger'),
    'vikinger_format_action_activity_video_update_group',
    esc_html_x('Video update', '(Backend) Activity Video Update Group Action - Label', 'vikinger')
  );
}

add_action('bp_register_activity_actions', 'vikinger_register_activity_video_update_group_action');

/**
 * Action string format for the activity_video_update action
 * 
 * @param string $action    Action string
 * @param Object $activity  Activity item object
 * @return string
 */
function vikinger_format_action_activity_video_update($action, $activity) {
  $action = esc_html_x('posted a video update', 'Activity Video Update Action - Text', 'vikinger');

  return $action;
}

/**
 * Action string format for the activity_video_update action
 * 
 * @param string $action    Action string
 * @param Object $activity  Activity item object
 * @return string
 */
function vikinger_format_action_activity_video_update_group($action, $activity) {
  $action = esc_html_x('posted a video update in the group', 'Activity Video Update Action Group - Text', 'vikinger');

  return $action;
}

/**
 * Register activity_video custom action
 */
function vikinger_register_activity_video_action() {
  bp_activity_set_action(
    'activity',
    'activity_video',
    esc_html_x('Uploaded a video', '(Backend) Activity Video Action - Description', 'vikinger'),
    'vikinger_format_action_activity_video',
    esc_html_x('Video upload', '(Backend) Activity Video Action - Label', 'vikinger')
  );
}

add_action('bp_register_activity_actions', 'vikinger_register_activity_video_action');

/**
 * Register activity_video custom group action
 */
function vikinger_register_activity_video_group_action() {
  bp_activity_set_action(
    'groups',
    'activity_video',
    esc_html_x('Uploaded a video', '(Backend) Activity Video Group Action - Description', 'vikinger'),
    'vikinger_format_action_activity_video_group',
    esc_html_x('Video upload', '(Backend) Activity Video Group Action - Label', 'vikinger')
  );
}

add_action('bp_register_activity_actions', 'vikinger_register_activity_video_group_action');

/**
 * Action string format for the activity_video action
 * 
 * @param string $action    Action string
 * @param Object $activity  Activity item object
 * @return string
 */
function vikinger_format_action_activity_video($action, $activity) {
  $action = esc_html_x('uploaded a video', 'Activity Video Action - Text', 'vikinger');

  return $action;
}

/**
 * Action string format for the activity_video action
 * 
 * @param string $action    Action string
 * @param Object $activity  Activity item object
 * @return string
 */
function vikinger_format_action_activity_video_group($action, $activity) {
  $action = esc_html_x('uploaded a video in the group', 'Activity Video Action Group - Text', 'vikinger');

  return $action;
}

/**
 * Register activity_share custom action
 */
function vikinger_register_activity_share_action() {
  bp_activity_set_action(
    'activity',
    'activity_share',
    esc_html_x('Shared an activity', '(Backend) Activity Share Action - Description', 'vikinger'),
    'vikinger_format_action_activity_share',
    esc_html_x('Activity Share', '(Backend) Activity Share Action - Label', 'vikinger')
  );
}

add_action('bp_register_activity_actions', 'vikinger_register_activity_share_action');

/**
 * Register activity_share custom group action
 */
function vikinger_register_activity_share_group_action() {
  bp_activity_set_action(
    'groups',
    'activity_share',
    esc_html_x('Shared an activity', '(Backend) Activity Share Group Action - Description', 'vikinger'),
    'vikinger_format_action_activity_share_group',
    esc_html_x('Activity Share', '(Backend) Activity Share Group Action - Label', 'vikinger')
  );
}

add_action('bp_register_activity_actions', 'vikinger_register_activity_share_group_action');

/**
 * Action string format for the activity_share action
 * 
 * @param string $action    Action string
 * @param Object $activity  Activity item object
 * @return string
 */
function vikinger_format_action_activity_share($action, $activity) {
  $action = esc_html_x('shared a post', 'Activity Share - Text', 'vikinger');

  return $action;
}

/**
 * Action string format for the activity_share group action
 * 
 * @param string $action    Action string
 * @param Object $activity  Activity item object
 * @return string
 */
function vikinger_format_action_activity_share_group($action, $activity) {
  $action = esc_html_x('shared a post in the group', 'Activity Share Group - Text', 'vikinger');

  return $action;
}

/**
 * Register post_share custom action
 */
function vikinger_register_post_share_action() {
  bp_activity_set_action(
    'activity',
    'post_share',
    esc_html_x('Shared a blog post', '(Backend) Post Share Action - Description', 'vikinger'),
    'vikinger_format_action_post_share',
    esc_html_x('Post Share', '(Backend) Post Share Action - Label', 'vikinger')
  );
}

add_action('bp_register_activity_actions', 'vikinger_register_post_share_action');

/**
 * Register post_share custom group action
 */
function vikinger_register_post_share_group_action() {
  bp_activity_set_action(
    'groups',
    'post_share',
    esc_html_x('Shared a blog post', '(Backend) Post Share Group Action - Description', 'vikinger'),
    'vikinger_format_action_post_share_group',
    esc_html_x('Post Share', '(Backend) Post Share Group Action - Label', 'vikinger')
  );
}

add_action('bp_register_activity_actions', 'vikinger_register_post_share_group_action');

/**
 * Action string format for the post_share action
 * 
 * @param string $action    Action string
 * @param Object $activity  Activity item object
 * @return string
 */
function vikinger_format_action_post_share($action, $activity) {
  $action = esc_html_x('shared a post', 'Post Share Action - Text', 'vikinger');

  return $action;
}

/**
 * Action string format for the post_share action
 * 
 * @param string $action    Action string
 * @param Object $activity  Activity item object
 * @return string
 */
function vikinger_format_action_post_share_group($action, $activity) {
  $action = esc_html_x('shared a post in the group', 'Post Share Action Group - Text', 'vikinger');

  return $action;
}

/**
 * Custom filter for activity activity_update action
 * 
 * @param string $action    Action string
 * @param Object $activity  Activity item object
 * @return string
 */
function vikinger_filter_activity_activity_update_action($action, $activity) {
  $action = esc_html_x('posted an update', 'Activity Update Action - Text', 'vikinger');
  
  return $action;
}

add_filter('bp_activity_new_update_action', 'vikinger_filter_activity_activity_update_action', 10, 2);

/**
 * Custom filter for group activity_update action
 * 
 * @param string $action    Action string
 * @param Object $activity  Activity item object
 * @return string
 */
function vikinger_filter_activity_update_action_group($action, $activity) {
  $action = esc_html_x('posted an update in the group', 'Activity Update Group Action - Text', 'vikinger');
  
  return $action;
}

add_filter('bp_groups_format_activity_action_group_activity_update', 'vikinger_filter_activity_update_action_group', 10, 2);

/**
 * Custom filter for group friendship_created / friendship_accepted action
 * 
 * @param string $action    Action string
 * @param Object $activity  Activity item object
 * @return string
 */
function vikinger_filter_activity_action_friendship_created($action, $activity) {
  $action = esc_html_x('are now friends', 'Activity Friendship Created Action - Text', 'vikinger');

  return $action;
}

add_filter('bp_friends_format_activity_action_friendship_created', 'vikinger_filter_activity_action_friendship_created', 10, 2);
add_filter('bp_friends_format_activity_action_friendship_accepted', 'vikinger_filter_activity_action_friendship_created', 10, 2);

/**
 * Action string format for the joined_group action
 * 
 * @param string $action    Action string
 * @param Object $activity  Activity item object
 * @return string
 */
function vikinger_filter_activity_action_joined_group($action, $activity) {
  $pattern = '/<\s*a[^>]*>[^<]*<\s*\/a\s*>\s*/';

  // remove first anchor, which contains user fullname
  return preg_replace($pattern, '', $action, 1);
}

add_filter('bp_groups_format_activity_action_joined_group', 'vikinger_filter_activity_action_joined_group', 10, 2);

/**
 * Action string format for the created_group action
 * 
 * @param string $action    Action string
 * @param Object $activity  Activity item object
 * @return string
 */
function vikinger_filter_activity_action_created_group($action, $activity) {
  $pattern = '/<\s*a[^>]*>[^<]*<\s*\/a\s*>\s*/';

  // remove first anchor, which contains user fullname
  return preg_replace($pattern, '', $action, 1);
}

add_filter('groups_activity_created_group_action', 'vikinger_filter_activity_action_created_group', 10, 2);

/**
 * Action string format for GamiPress activity_update activities
 */
function vikinger_gamipress_filter_activity_action_earned_achievement($activity, $user_id, $post_id, $trigger_type, $site_id, $args) {
  $pattern = '/<\s*a[^>]*>[^<]*<\s*\/a\s*>\s*/';

  // remove first anchor, which contains user fullname
  $activity['action'] = preg_replace($pattern, '', $activity['action'], 1);

  return $activity;
}

add_filter('gamipress_bp_activity_details', 'vikinger_gamipress_filter_activity_action_earned_achievement', 15, 6);

/**
 * Action string format for new_avatar type
 */
function vikinger_filter_activity_action_new_avatar($action, $activity) {
  $pattern = '/<\s*a[^>]*>[^<]*<\s*\/a\s*>\s*/';

  // remove first anchor, which contains user fullname
  return preg_replace($pattern, '', $action, 1);
}

add_filter('bp_xprofile_format_activity_action_new_avatar', 'vikinger_filter_activity_action_new_avatar', 10, 2);

?>