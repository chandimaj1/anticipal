<?php
/**
 * Vikinger COMMENT functions
 * 
 * @since 1.0.0
 */

if (!function_exists('vikinger_create_comment')) {
  /**
   * Creates a new comment
   * 
   * @param array   $comment_data   Data of comment to create
   * @return int
   */
  function vikinger_create_comment($comment_data = []) {
    // comment ID on success, false on error
    $result = wp_new_comment($comment_data);
    
    return $result;
  }
}

if (!function_exists('vikinger_get_comments')) {
  /**
   * Get filtered comments
   * 
   * @param array   $args   Filters for the comments
   * @return array
   */
  function vikinger_get_comments($args = [], $include_children = true) {
    $comments = get_comments($args);

    if ($include_children) {
      $comments_with_children = [];

      vikinger_get_comments_with_children_recursive($comments, $comments_with_children);

      return $comments_with_children;
    }

    return $comments;
  }
}

if (!function_exists('vikinger_get_comments_with_children_recursive')) {
  /**
   * Recursively add children comments
   * 
   * @param array $comments                 Comments returned from get_comments with 'hierarchical'  => 'threaded' arg
   * @param array $comments_with_children   Comments array to fill with comments with recursive children comments as properties
   */
  function vikinger_get_comments_with_children_recursive($comments, &$comments_with_children) {
    foreach ($comments as $comment) {
      // only send required data
      $com = [
        'id'          => $comment->comment_ID,
        'content'     => convert_smilies($comment->comment_content),
        'parent'      => $comment->comment_parent,
        'approved'    => $comment->comment_approved,
        'timestamp'   => sprintf(
          esc_html_x('%s ago', 'Comment Timestamp', 'vikinger'),
          human_time_diff(
            get_comment_date('U', $comment->comment_ID),
            current_time('timestamp')
          )
        ),
        'type'        => $comment->comment_type,
        'reactions'   => []
      ];

      // add vkreact reactions data if plugin is active
      if (vikinger_plugin_vkreact_is_active()) {
        $com['reactions'] = vikinger_reactions_insert_user_data(vkreact_get_postcomment_reactions($comment->comment_ID));
      }

      // not guest
      if (((int)$comment->user_id) !== 0) {
        // add BuddyPress member data if plugin is active
        if (vikinger_plugin_buddypress_is_active()) {
          $com['author'] = vikinger_members_get_fallback($comment->user_id);
        } else {
          $com['author'] = vikinger_user_get_data($comment->user_id);
        }
      } else {
      // guest
        $com['author'] = [
          'id'            => $comment->user_id,
          'name'          => $comment->comment_author,
          'mention_name'  => $comment->comment_author,
          'link'          => $comment->comment_author_url,
          'media_link'    => '',
          'avatar_url'    => get_avatar_url($comment->comment_author_email)
        ];
      }

      $children_comments = $comment->get_children();

      if (count($children_comments)) {
        $com['children'] = [];
        vikinger_get_comments_with_children_recursive($children_comments, $com['children']);
      }

      $comments_with_children[] = $com;
    }
  }
}

if (!function_exists('vikinger_get_post_top_level_comment_count')) {
  /**
   * Returns post total top level comment count
   * 
   * @param int   $post_ID   Post ID to get total top level comment count from
   * @return int
   */
  function vikinger_get_post_top_level_comment_count($post_ID) {
    global $wpdb;

    $table = $wpdb->prefix . 'comments';

    $comment_count = $wpdb->get_var($wpdb->prepare(
      "SELECT COUNT(comment_ID) FROM $table WHERE comment_post_ID=%d AND comment_approved=1 AND comment_parent=0",
      $post_ID
    ));

    return $comment_count;
  }
}

if (!function_exists('vikinger_get_user_total_comment_count')) {
  /**
   * Returns user total comment count
   * 
   * @param int   $user_ID   User ID to get total comment count from
   * @return int
   */
  function vikinger_get_user_total_comment_count($user_ID) {
    global $wpdb;

    $table = $wpdb->prefix . 'comments';

    $comment_count = $wpdb->get_var($wpdb->prepare(
      "SELECT COUNT(user_id) FROM $table WHERE user_id=%d AND comment_approved=1",
      $user_ID
    ));

    return $comment_count;
  }
}

?>