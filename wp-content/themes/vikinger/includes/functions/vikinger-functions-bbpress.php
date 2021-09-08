<?php
/**
 * Vikinger BBPRESS functions
 * 
 * @since 1.3.0
 */

/**
 * Returns last topic or reply data of a given forum.
 * 
 * @param int           $forum_id           Forum ID.
 * @return array|bool   $active_data        Last topic or reply data, or false if no topic or reply found.
 */
function vikinger_bbpress_forum_last_activity_get($forum_id) {
  $active_data = [];

  $active_id = bbp_get_forum_last_active_id($forum_id);

  if (empty($active_id)) {
    $active_id = bbp_get_forum_last_reply_id($forum_id);
  }

  if (empty($active_id)) {
    $active_id = bbp_get_forum_last_topic_id($forum_id);
  }

  if (bbp_is_topic($active_id)) {
    $active_data['title'] = bbp_get_forum_last_topic_title($forum_id);
    $active_data['link'] = bbp_get_forum_last_topic_permalink($forum_id);
    $author_id = bbp_get_forum_last_topic_author_id($forum_id);

    // add BuddyPress member data if plugin is active
    if (vikinger_plugin_buddypress_is_active()) {
      $active_data['author'] = vikinger_members_get_fallback($author_id);
    } else {
      $active_data['author'] = vikinger_user_get_data($author_id);
    }
  } else if (bbp_is_reply($active_id)) {
    $active_data['title'] = bbp_get_forum_last_reply_title($forum_id);
    $active_data['link'] = bbp_get_forum_last_reply_url($forum_id);
    $author_id = bbp_get_forum_last_reply_author_id($forum_id);

    // add BuddyPress member data if plugin is active
    if (vikinger_plugin_buddypress_is_active()) {
      $active_data['author'] = vikinger_members_get_fallback($author_id);
    } else {
      $active_data['author'] = vikinger_user_get_data($author_id);
    }
  }

  $active_data['time_since'] = bbp_get_forum_last_active_time($forum_id);

  if (empty($active_data['link']) || empty($active_data['time_since'])) {
    return false;
  }

  return $active_data;
}

/**
 * Returns last activity description data of a given forum
 * 
 * @param int     $forum_id           Forum ID.
 * @return array  $description_data   Last activity description data.
 */
function vikinger_bbpress_forum_last_activity_description_get($forum_id) {
  $description_data = [];

  $active_id = bbp_get_forum_last_active_id($forum_id);

  $tc_int = bbp_get_forum_topic_count($forum_id, true, true);
  $topic_count = bbp_get_forum_topic_count($forum_id);

  $rc_int = bbp_get_forum_reply_count($forum_id, true, true);
  $reply_count = bbp_get_forum_reply_count($forum_id);

  // forum has replies
  if (!empty($reply_count)) {
    $reply_text = sprintf(_n('%s reply', '%s replies', $rc_int, 'vikinger'), $reply_count);
  }

  // forum has active data
  if (!empty($active_id)) {
    $topic_text = bbp_get_forum_topics_link($forum_id);
    $time_since = bbp_get_forum_freshness_link($forum_id);
    $author_id = get_post_field('post_author', $active_id);

    // add BuddyPress member data if plugin is active
    if (vikinger_plugin_buddypress_is_active()) {
      $description_data['author'] = vikinger_members_get_fallback($author_id);
    } else {
      $description_data['author'] = vikinger_user_get_data($author_id);
    }
  } else {
    // forum has no last active data
    $topic_text = sprintf(_n('%s topic', '%s topics', $tc_int, 'vikinger'), $topic_count);
  }

  // forum has active data
  if (!empty($active_id)) {
    // forum has replies
    if (!empty($reply_count)) {
      $retstr = bbp_is_forum_category($forum_id)
        ? sprintf( esc_html__('This category has %1$s, %2$s, and was last updated %3$s by', 'vikinger'), $topic_text, $reply_text, $time_since)
        : sprintf( esc_html__('This forum has %1$s, %2$s, and was last updated %3$s by', 'vikinger'), $topic_text, $reply_text, $time_since);

    // only has topics
    } else {
      $retstr = bbp_is_forum_category($forum_id)
        ? sprintf( esc_html__('This category has %1$s, and was last updated %2$s by', 'vikinger'), $topic_text, $time_since)
        : sprintf( esc_html__('This forum has %1$s, and was last updated %2$s by', 'vikinger'), $topic_text, $time_since);
    }

  // forum has no last active data (but does have topics & replies)
  } else if (!empty($reply_count)) {
    $retstr = bbp_is_forum_category($forum_id)
      ? sprintf( esc_html__('This category has %1$s and %2$s.', 'vikinger'), $topic_text, $reply_text)
      : sprintf( esc_html__('This forum has %1$s and %2$s.', 'vikinger'), $topic_text, $reply_text);

  // forum has no last active data or replies (but does have topics)
  } else if (!empty($topic_count)) {
    $retstr = bbp_is_forum_category($forum_id)
      ? sprintf( esc_html__('This category has %1$s.', 'vikinger'), $topic_text)
      : sprintf( esc_html__('This forum has %1$s.', 'vikinger'), $topic_text);

  // forum is empty
  } else {
    $retstr = esc_html__('This forum is empty.', 'vikinger');
  }

  $description_data['text'] = $retstr;

  return $description_data;
}

/**
 * Returns last activity description data of a given topic
 * 
 * @param int     $topic_id           Topic ID.
 * @return array  $description_data   Last activity description data.
 */
function vikinger_bbpress_topic_last_activity_description_get($topic_id) {
  $description_data = [];

  $active_id = bbp_get_topic_last_active_id($topic_id);

  $vc_int = bbp_get_topic_voice_count($topic_id, true);
  $voice_count = bbp_get_topic_voice_count($topic_id, false);

  $reply_count = bbp_get_topic_replies_link($topic_id);

  $time_since = bbp_get_topic_freshness_link($topic_id);

  // singular / plural
  $voice_count = sprintf(_n('%s voice', '%s voices', $vc_int, 'vikinger'), $voice_count);

  // topic has activity (could be from reply or topic author)
  if (!empty($vc_int) && !empty($active_id)) {
    $retstr = sprintf(esc_html__('This topic has %1$s, %2$s, and was last updated %3$s by', 'vikinger'), $reply_count, $voice_count, $time_since);

    $last_reply_id = bbp_get_topic_last_reply_id($topic_id);

    $description_data['author'] = vikinger_bbpress_reply_author_get($last_reply_id);

  // Topic has no replies
  } else if (!empty( $vc_int ) && !empty($reply_count)) {
    $retstr = sprintf(esc_html__('This topic has %1$s and %2$s.', 'vikinger'), $voice_count, $reply_count);

  // Topic has no replies and no voices
  } else if (empty($vc_int) && empty($reply_count)) {
    $retstr = esc_html__('This topic has no replies.', 'vikinger');

  // Topic is pending
  } else if (bbp_get_topic_status($topic_id) === bbp_get_pending_status_id())  {
    $retstr = esc_html__('This topic is pending moderation.', 'vikinger');

  // Fallback
  } else {
    $retstr = esc_html__('This topic is empty.', 'vikinger');
  }

  $description_data['text'] = $retstr;

  return $description_data;
}

/**
 * Return topic author
 * 
 * @param int     $topic_id     ID of the topic to return the author from.
 * @return array  $author       Topic author data.    
 */
function vikinger_bbpress_topic_author_get($topic_id) {
  $author_id = bbp_get_topic_author_id($topic_id);

  // add BuddyPress member data if plugin is active
  if (vikinger_plugin_buddypress_is_active()) {
    $author = vikinger_members_get_fallback($author_id);
  } else {
    $author = vikinger_user_get_data($author_id);
  }

  return $author;
}

/**
 * Return reply author
 * 
 * @param int     $reply_id     ID of the topic to return the author from.
 * @return array  $author       Reply author data.    
 */
function vikinger_bbpress_reply_author_get($reply_id) {
  $author_id = bbp_get_reply_author_id($reply_id);

  // add BuddyPress member data if plugin is active
  if (vikinger_plugin_buddypress_is_active()) {
    $author = vikinger_members_get_fallback($author_id);
  } else {
    $author = vikinger_user_get_data($author_id);
  }

  return $author;
}

/**
 * Return author role
 * 
 * @param   int     $author_id      ID of the author to return role of.
 * @return  string  $role           Role of the author.
 */
function vikinger_bbpress_author_role_get($author_id) {
  $role = bbp_get_user_display_role($author_id);

  return $role;
}

/**
 * Filter topic revision log
 * 
 * @param string  $content      Topic revision log HTML content.
 * @param int     $topic_id     Topic ID.
 */
function vikinger_bbpress_filter_topic_revision_log($content, $topic_id) {
  $revision_log = bbp_get_topic_raw_revision_log( $topic_id );

  if ( empty( $topic_id ) || empty( $revision_log ) || ! is_array( $revision_log ) ) {
    return false;
  }

  $revisions = bbp_get_topic_revisions( $topic_id );
  if ( empty( $revisions ) ) {
    return false;
  }

  $retval = "\n\n" . '<ul id="bbp-topic-revision-log-' . esc_attr( $topic_id ) . '" class="bbp-topic-revision-log">' . "\n\n";

  // Loop through revisions
  foreach ( (array) $revisions as $revision ) {

    if ( empty( $revision_log[ $revision->ID ] ) ) {
      $author_id = $revision->post_author;
      $reason    = '';
    } else {
      $author_id = $revision_log[ $revision->ID ]['author'];
      $reason    = $revision_log[ $revision->ID ]['reason'];
    }

    $since  = bbp_get_time_since( bbp_convert_date( $revision->post_modified ) );

    $author = vikinger_bbpress_topic_author_get($revision->ID);

    ob_start();

    /**
     * Avatar Micro
     */
    get_template_part('template-part/avatar/avatar', 'micro', [
      'user'      => $author,
      'linked'    => true,
      'no_border' => true,
      'modifiers' => 'vikinger-forum-reply-revision-author-avatar'
    ]);

    ?>
      <!-- VIKINGER FORUM REPLY REVISION AUTHOR TITLE -->
      <a href="<?php echo esc_url($author['link']); ?>" class="vikinger-forum-reply-revision-author-title"><?php echo esc_html($author['name']); ?></a>
      <!-- /VIKINGER FORUM REPLY REVISION AUTHOR TITLE -->
    <?php

    $author_html = ob_get_clean();

    $retval .= "\t" . '<li id="bbp-topic-revision-log-' . esc_attr( $topic_id ) . '-item-' . esc_attr( $revision->ID ) . '" class="bbp-topic-revision-log-item">' . "\n";
    if ( ! empty( $reason ) ) {
      $retval .= "\t\t" . sprintf( esc_html__( 'This topic was modified %1$s by %2$s. Reason: %3$s', 'vikinger'), esc_html( $since ), $author_html, esc_html( $reason ) ) . "\n";
    } else {
      $retval .= "\t\t" . sprintf( esc_html__( 'This topic was modified %1$s by %2$s.', 'vikinger'), esc_html( $since ), $author_html ) . "\n";
    }
    $retval .= "\t" . '</li>' . "\n";
  }

  $retval .= "\n" . '</ul>' . "\n\n";

  return $retval;
}

add_filter('bbp_get_topic_revision_log', 'vikinger_bbpress_filter_topic_revision_log', 1, 2);

/**
 * Filter reply revision log
 * 
 * @param string  $content      Reply revision log HTML content.
 * @param int     $reply_id     Reply ID.
 */
function vikinger_bbpress_filter_reply_revision_log($content, $reply_id) {
  // Show the topic reply log if this is a topic in a reply loop
  if (bbp_is_topic($reply_id)) {
    return bbp_get_topic_revision_log($reply_id);
  }

  // Get the reply revision log (out of post meta
  $revision_log = bbp_get_reply_raw_revision_log($reply_id);

  // Check reply and revision log exist
  if (empty($reply_id) || empty($revision_log) || !is_array($revision_log)) {
    return false;
  }

  // Get the actual revisions
  $revisions = bbp_get_reply_revisions($reply_id);

  if (empty($revisions)) {
    return false;
  }

  $r = "\n\n" . '<ul id="bbp-reply-revision-log-' . esc_attr( $reply_id ) . '" class="bbp-reply-revision-log">' . "\n\n";

  // Loop through revisions
  foreach ( (array) $revisions as $revision ) {

    if ( empty( $revision_log[ $revision->ID ] ) ) {
      $author_id = $revision->post_author;
      $reason    = '';
    } else {
      $author_id = $revision_log[ $revision->ID ]['author'];
      $reason    = $revision_log[ $revision->ID ]['reason'];
    }

    $author = vikinger_bbpress_reply_author_get($revision->ID);

    ob_start();

    /**
     * Avatar Micro
     */
    get_template_part('template-part/avatar/avatar', 'micro', [
      'user'      => $author,
      'linked'    => true,
      'no_border' => true,
      'modifiers' => 'vikinger-forum-reply-revision-author-avatar'
    ]);

    ?>
      <!-- VIKINGER FORUM REPLY REVISION AUTHOR TITLE -->
      <a href="<?php echo esc_url($author['link']); ?>" class="vikinger-forum-reply-revision-author-title"><?php echo esc_html($author['name']); ?></a>
      <!-- /VIKINGER FORUM REPLY REVISION AUTHOR TITLE -->
    <?php

    $author_html = ob_get_clean();

    $since  = bbp_get_time_since( bbp_convert_date( $revision->post_modified ) );

    $r .= "\t" . '<li id="bbp-reply-revision-log-' . esc_attr( $reply_id ) . '-item-' . esc_attr( $revision->ID ) . '" class="bbp-reply-revision-log-item">' . "\n";
    if ( ! empty( $reason ) ) {
      $r .= "\t\t" . sprintf( esc_html__( 'This reply was modified %1$s by %2$s. Reason: %3$s', 'vikinger' ), esc_html( $since ), $author_html, esc_html( $reason ) ) . "\n";
    } else {
      $r .= "\t\t" . sprintf( esc_html__( 'This reply was modified %1$s by %2$s.', 'vikinger' ), esc_html( $since ), $author_html ) . "\n";
    }
    $r .= "\t" . '</li>' . "\n";

  }

  $r .= "\n" . '</ul>' . "\n\n";

  return $r;
}

add_filter('bbp_get_reply_revision_log', 'vikinger_bbpress_filter_reply_revision_log', 1, 2);

/**
 * Hides the '|' character that wrongly appears before the subscription link
 * after doing the AJAX call to subscribe/unsubscribe
 * 
 * @param array $args     Args.
 */
function vikinger_bbpress_subscribe_link_before_hide($args = []) {
  $args['before'] = '';
  
  return $args;
}

add_filter('bbp_before_get_user_subscribe_link_parse_args', 'vikinger_bbpress_subscribe_link_before_hide');

/**
 * Removes home link from forum breadcrumbs
 */
function vikinger_bbpress_custom_breadcrumbs() {
	$args['include_home'] = false;

	return $args;
}

add_filter('bbp_before_get_breadcrumb_parse_args', 'vikinger_bbpress_custom_breadcrumbs');

/**
 * Deletes a forum.
 * 
 * @param int $forum_id         ID (post ID) of the forum to delete.
 * @return WP_Post|bool|null    Post data on success, false or null on failure.
 */
function vikinger_bbpress_forum_delete($forum_id) {
  $result = wp_delete_post($forum_id, true);

  return $result;
}

/**
 * Returns filtered bbPress forums as id, name options
 * 
 * @param array   $args             Forum filters.
 * @return array  $forum_options    Forum options.
 */
function vikinger_bbress_forum_options_get($args = []) {
  $defaults = [
    'post_type' => bbp_get_forum_post_type()
  ];

  $args = array_merge($defaults, $args);

  $forums = get_posts($args);

  $forum_options = [];

  foreach ($forums as $forum) {
    $forum_options[] = [
      'id'    => $forum->ID,
      'name'  => $forum->post_title
    ];
  }

  return $forum_options;
}

/**
 * Creates a bbPress forum for a group
 * 
 * @param array     $args       Forum data.
 * @param int       $group_id   ID of the group to create this forum for.
 * @return int|bool $result     Created forum ID on success, false otherwise.
 */
function vikinger_bbpress_group_forum_create($args, $group_id) {
  $group_forums_root_id = bbp_get_group_forums_root_id();

  $defaults = [
    'post_parent' => $group_forums_root_id
  ];

  $args = array_merge($defaults, $args);

  $created_forum_id = bbp_insert_forum($args);

  // associate created forum to group_id
  if ($created_forum_id) {
    bbp_update_group_forum_ids($group_id, (array) $created_forum_id);
    bbp_update_forum_group_ids($created_forum_id, (array) $group_id);
    
    bbp_repair_forum_visibility();
  }

  return $result;
}

/**
 * Deletes a group forum.
 * 
 * @param int $forum_id         ID (post ID) of the forum to delete.
 * @param int $group_id         ID of the group associated to this forum.
 * @return WP_Post|bool|null    Post data on success, false or null on failure.
 */
function vikinger_bbpress_group_forum_delete($forum_id, $group_id) {
  $result = vikinger_bbpress_forum_delete($forum_id);

  if ($result) {
    bbp_remove_forum_id_from_group($group_id, $forum_id);
  }

  return $result;
}

/**
 * Associate a group with a forum
 * @param int $group_id       Group ID.
 * @param int $forum_id       Forum ID.
 */
function vikinger_bbpress_group_forum_associate_update($group_id, $forum_id) {
  bbp_update_group_forum_ids($group_id, (array) $forum_id);
  bbp_update_forum_group_ids($forum_id, (array) $group_id);
  
  bbp_repair_forum_visibility();
}

/**
 * Returns forum associated to the group_id
 * @param int       $group_id       Group ID.
 * @return array|bool $forum_id     Associated forum, or false if no forum associated.
 */
function vikinger_bbpress_group_forum_associate_get($group_id) {
  $forum_ids = bbp_get_group_forum_ids($group_id);

  $forum_id = count($forum_ids) === 0 ? false : $forum_ids[0];

  $forum = false;

  if ($forum_id) {
    $forum_args = [
      'include'   => [$forum_id],
      'post_type' => bbp_get_forum_post_type()
    ];

    $forum = (array) get_posts($forum_args);
  }

  return $forum;
}

/**
 * Action string format for the bbp_topic_create action
 * 
 * @param string $action    Action string
 * @param Object $activity  Activity item object
 * @return string
 */
function vikinger_bbpress_format_activity_action_new_topic($action, $activity) {
  $pattern = '/<\s*a[^>]*>[^<]*<\s*\/a\s*>\s*/';

  // remove first anchor, which contains user fullname
  return preg_replace($pattern, '', $action, 1);
}

add_filter('bbp_format_activity_action_new_topic', 'vikinger_bbpress_format_activity_action_new_topic', 10, 2);

/**
 * Action string format for the bbp_reply_create action
 * 
 * @param string $action    Action string
 * @param Object $activity  Activity item object
 * @return string
 */
function vikinger_bbpress_format_activity_action_new_reply($action, $activity) {
  $pattern = '/<\s*a[^>]*>[^<]*<\s*\/a\s*>\s*/';

  // remove first anchor, which contains user fullname
  return preg_replace($pattern, '', $action, 1);
}

add_filter('bbp_format_activity_action_new_reply', 'vikinger_bbpress_format_activity_action_new_reply', 10, 2);

?>