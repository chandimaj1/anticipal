<?php
/**
 * Vikinger VERIFIED MEMBER FOR BUDDYPRESS functions
 * 
 * @since 1.3.1
 */

/**
 * Get verified member for buddypress settings
 * 
 * @param string  $scope          Scope to narrow the options that are fetched. One of: 'all', 'activity', 'members', 'topics', 'replies', 'comments', 'posts'.
 *                                Optional. Default: 'all'.
 * @return array  $settings       Settings.
 */
function vikinger_bpverifiedmember_settings_get($scope = 'all') {
  $settings = [];

  // only get settings if the plugin is active
  if (vikinger_plugin_bpverifiedmember_is_active()) {
    $settings = [
      'bp_verified_member_display_badge_in_profile_username'  => get_option('bp_verified_member_display_badge_in_profile_username', 1) == 1,
      'bp_verified_member_display_badge_in_profile_fullname'  => get_option('bp_verified_member_display_badge_in_profile_fullname', 0) == 1
    ];

    if ($scope === 'all' || $scope === 'activity') {
      $settings['bp_verified_member_display_badge_in_activity_stream'] = get_option('bp_verified_member_display_badge_in_activity_stream', 1) == 1;
    }

    if ($scope === 'all' || $scope === 'members') {
      $settings['bp_verified_member_display_badge_in_members_lists'] = get_option('bp_verified_member_display_badge_in_members_lists', 1) == 1;
    }

    if ($scope === 'all' || $scope === 'topics') {
      $settings['bp_verified_member_display_badge_in_bbp_topics'] = get_option('bp_verified_member_display_badge_in_bbp_topics', 1) == 1;
    }

    if ($scope === 'all' || $scope === 'replies') {
      $settings['bp_verified_member_display_badge_in_bbp_replies'] = get_option('bp_verified_member_display_badge_in_bbp_replies', 1) == 1;
    }

    if ($scope === 'all' || $scope === 'comments') {
      $settings['bp_verified_member_display_badge_in_wp_comments'] = get_option('bp_verified_member_display_badge_in_wp_comments', 1) == 1;
    }

    if ($scope === 'all' || $scope === 'posts') {
      $settings['bp_verified_member_display_badge_in_wp_posts'] = get_option('bp_verified_member_display_badge_in_wp_posts', 1) == 1;
    }
  }

  return $settings;
}

/**
 * Check if a user is verified
 */
function vikinger_bpverifiedmember_user_is_verified($user_id) {
  global $bp_verified_member;

  return $bp_verified_member->is_user_verified($user_id);
}

/**
 * Get verified member for buddypress badge HTML content
 * 
 * @return string $badge        Verified badge HTML content.
 */
function vikinger_bpverifiedmember_badge_get() {
  $badge = '';

  // only get settings if the plugin is active
  if (vikinger_plugin_bpverifiedmember_is_active()) {
    global $bp_verified_member;

    $badge = $bp_verified_member->get_verified_badge();
  }

  return $badge;
}

if (!function_exists('vikinger_comment_author_filter')) {
  /**
   * Undo HTML entities encoding so that verified badge span is not escaped
   */
  function vikinger_comment_author_filter($author, $comment_id) {
    return wp_specialchars_decode($author, ENT_QUOTES);
  }
}

add_filter('comment_author', 'vikinger_comment_author_filter', 10, 2);

?>