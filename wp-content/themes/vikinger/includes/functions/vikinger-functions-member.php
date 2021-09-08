<?php
/**
 * Vikinger MEMBER functions
 * 
 * @since 1.0.0
 */

if (!function_exists('vikinger_get_default_member_avatar_url')) {
  /**
   * Returns default member avatar URL
   * 
   * @return string
   */
  function vikinger_get_default_member_avatar_url() {
    $members_default_avatar_id = get_theme_mod('vikinger_members_setting_default_avatar', false);

    if ($members_default_avatar_id) {
      $members_default_avatar_url = wp_get_attachment_image_src($members_default_avatar_id , 'full')[0];
    } else {
      $members_default_avatar_url = VIKINGER_URL . '/img/avatar/default-avatar.jpg';
    }

    return $members_default_avatar_url;
  }
}

if (!function_exists('vikinger_get_default_member_cover_url')) {
  /**
   * Returns default member cover URL
   * 
   * @return string
   */
  function vikinger_get_default_member_cover_url() {
    $members_default_cover_id = get_theme_mod('vikinger_members_setting_default_cover', false);

    if ($members_default_cover_id) {
      $members_default_cover_url = wp_get_attachment_image_src($members_default_cover_id , 'full')[0];
    } else {
      $members_default_cover_url = VIKINGER_URL . '/img/cover/default-cover.png';
    }

    return $members_default_cover_url;
  }
}

if (!function_exists('vikinger_get_logged_user_member_data')) {
  /**
   * Returns logged user member data, or false if no user is logged in
   * 
   * @param string      $data_scope     Scope of the user data.
   * @return array|bool $user           User if logged in, false otherwise.  
   */
  function vikinger_get_logged_user_member_data($data_scope = 'user-status') {
    $user = false;

    if (is_user_logged_in()) {
      $user_id = get_current_user_id();
      $user = vikinger_members_get(['include' => [$user_id], 'data_scope' => $data_scope])[0];
    }

    return $user;
  }
}

if (!function_exists('vikinger_members_get_fallback')) {
  /**
   * Returns member data or member deleted placeholder data if the member doesn't exist
   * 
   * @param int     $member_id        Member ID.
   * @param string  $data_scope       Member scope.
   * @return array  $member_data      Member data.
   */
  function vikinger_members_get_fallback($member_id, $data_scope = 'user-status') {
    $member = vikinger_members_get(['include' => $member_id, 'data_scope' => $data_scope]);

    if (count($member)) {
      $member_data = $member[0];
    } else {
      $member_data = [
        'id'                  => $member_id,
        'name'                => esc_html__('[deleted]', 'vikinger'),
        'mention_name'        => esc_html__('[deleted]', 'vikinger'),
        'link'                => '',
        'media_link'          => '',
        'badges_link'         => '',
        'avatar_url'          => vikinger_get_default_member_avatar_url(),
        'default_avatar_url'  => vikinger_get_default_member_avatar_url(),
        'default_cover_url'   => vikinger_get_default_member_cover_url(),
        'verified'            => false
      ];
    }

    return $member_data;
  }
}

if (!function_exists('vikinger_members_get')) {
  /**
   * Returns filtered members
   * 
   * @param array   $args       Filter for the members query.
   * @return array  $members    Filtered members.
   */
  function vikinger_members_get($args = []) {
    $request = new WP_REST_Request('GET', '/buddypress/v1/members');

    $data_scope = 'user-status';

    if (array_key_exists('data_scope', $args)) {
      $data_scope = $args['data_scope'];
      unset($args['data_scope']);
    }

    $defaults = [
      'type' => 'alphabetical'
    ];

    $args = array_merge($defaults, $args);

    // set parameters
    foreach ($args as $key => $value) {
      $request->set_param($key, $value);
    }

    $bp_members = rest_do_request($request);

    $members = [];

    // if request was succesfull
    if ($bp_members->status === 200) {
      foreach ($bp_members->data as $bp_member) {
        $members[] = vikinger_member_get_data($bp_member, $data_scope);
      }
    }

    return $members;
  }
}

if (!function_exists('vikinger_member_get_user_base_data')) {
  /**
   * Returns base user data
   * 
   * @param array   $bp_member            BP member data.
   * @return array  $user_base_data       user-base scope member data.
   */
  function vikinger_member_get_user_base_data($bp_member) {
    $user_base_data = [
      'id'                  => $bp_member['id'],
      'name'                => $bp_member['name'],
      'link'                => $bp_member['link'],
      'avatar_url'          => $bp_member['avatar_urls']['full'],
      'default_avatar_url'  => vikinger_get_default_member_avatar_url(),
      'default_cover_url'   => vikinger_get_default_member_cover_url(),
      'verified'            => false
    ];

    if (bp_is_active('activity')) {
      $user_base_data['mention_name'] = $bp_member['mention_name'];
    } else {
      $user = get_userdata($bp_member['id']);
      $user_base_data['mention_name'] = $user->user_nicename;
    }

    return $user_base_data;
  }
}

if (!function_exists('vikinger_member_get_user_status_data')) {
  /**
   * Returns user-status scope member data
   * 
   * @param array   $bp_member            BP member data.
   * @return array  $user_status_data     user-status scope member data.
   */
  function vikinger_member_get_user_status_data($bp_member) {
    $user_status_data = [
      'media_link'                      => $bp_member['link'] . 'photos',
      'friend_requests_link'            => $bp_member['link'] . 'settings/friend-requests',
      'messages_link'                   => $bp_member['link'] . 'settings/messages',
      'notifications_link'              => $bp_member['link'] . 'settings/notifications',
      'received_group_invitations_link' => $bp_member['link'] . 'settings/received-group-invitations',
      'membership_requests_link'        => $bp_member['link'] . 'settings/membership-requests'
    ];

    // add user base data
    $user_status_data = array_merge(vikinger_member_get_user_base_data($bp_member), $user_status_data);

    // add GamiPress rank data if plugin is active
    if (vikinger_plugin_gamipress_is_active()) {
      $user_status_data['rank'] = vikinger_gamipress_get_user_rank_priority('rank', $bp_member['id'], 'simple');
    }

    // add Verified Member for BuddyPress data if plugin is active
    if (vikinger_plugin_bpverifiedmember_is_active()) {
      $user_status_data['verified'] = vikinger_bpverifiedmember_user_is_verified($user_status_data['id']);
    }

    return $user_status_data;
  }
}

if (!function_exists('vikinger_member_get_user_sidebar_data')) {
  /**
   * Returns user-sidebar scope member data
   * 
   * @param array   $bp_member            BP member data.
   * @return array  $user_status_data     user-sidebar scope member data.
   */
  function vikinger_member_get_user_sidebar_data($bp_member) {
    $user_sidebar_data = [
      'badges_link'   => $bp_member['link'] . 'badges',
      'cover_url'     => vikinger_member_get_cover_url($bp_member['id']),
      'stats'         => [
        'post_count'    => bp_is_active('activity') ? vikinger_activity_get_member_post_count($bp_member['id']) : 0,
        'friend_count'  => bp_is_active('friends') ? absint(bp_get_total_friend_count($bp_member['id'])) : 0,
        'comment_count' => bp_is_active('activity') ? vikinger_activity_get_member_comment_count($bp_member['id']): 0
      ],
      'badges'        => []
    ];

    // add user base data
    $user_sidebar_data = array_merge(vikinger_member_get_user_base_data($bp_member), $user_sidebar_data);

    // add GamiPress rank data if plugin is active
    if (vikinger_plugin_gamipress_is_active()) {
      $user_sidebar_data['badges'] = vikinger_gamipress_get_user_completed_achievements('badge', $bp_member['id'], 'simple');
      $user_sidebar_data['rank'] = vikinger_gamipress_get_user_rank_priority('rank', $bp_member['id'], 'simple');
    }

    // add Verified Member for BuddyPress data if plugin is active
    if (vikinger_plugin_bpverifiedmember_is_active()) {
      $user_sidebar_data['verified'] = vikinger_bpverifiedmember_user_is_verified($user_sidebar_data['id']);
    }

    return $user_sidebar_data;
  }
}

if (!function_exists('vikinger_member_get_user_preview_data')) {
  /**
   * Returns user-preview scope member data
   * 
   * @param array   $bp_member            BP member data.
   * @return array  $user_preview_data    user-preview scope member data.
   */
  function vikinger_member_get_user_preview_data($bp_member) {
    $user_preview_data = [
      'badges_link'   => $bp_member['link'] . 'badges',
      'cover_url'     => vikinger_member_get_cover_url($bp_member['id']),
      'stats'         => [
        'post_count'    => bp_is_active('activity') ? vikinger_activity_get_member_post_count($bp_member['id']) : 0,
        'friend_count'  => bp_is_active('friends') ? absint(bp_get_total_friend_count($bp_member['id'])) : 0,
        'comment_count' => bp_is_active('activity') ? vikinger_activity_get_member_comment_count($bp_member['id']) : 0
      ],
      'badges'        => [],
      'profile_data'  => vikinger_member_get_xprofile_data($bp_member['id'])
    ];

    // add user base data
    $user_preview_data = array_merge(vikinger_member_get_user_base_data($bp_member), $user_preview_data);

    // add GamiPress rank data if plugin is active
    if (vikinger_plugin_gamipress_is_active()) {
      $user_preview_data['badges'] = vikinger_gamipress_get_user_completed_achievements('badge', $bp_member['id'], 'simple');
      $user_preview_data['rank'] = vikinger_gamipress_get_user_rank_priority('rank', $bp_member['id'], 'simple');
    }

    // add Verified Member for BuddyPress data if plugin is active
    if (vikinger_plugin_bpverifiedmember_is_active()) {
      $user_preview_data['verified'] = vikinger_bpverifiedmember_user_is_verified($user_preview_data['id']);
    }

    return $user_preview_data;
  }
}

if (!function_exists('vikinger_member_get_user_friends_data')) {
  /**
   * Returns user-friends scope member data
   * 
   * @param array   $bp_member            BP member data.
   * @return array  $user_friends_data    user-friends scope member data.
   */
  function vikinger_member_get_user_friends_data($bp_member) {
    $user_friends_data = [
      'friends'                   => [],
      'friend_requests_received'  => [],
      'friend_requests_sent'      => [],
      'friend_requests_link'      => $bp_member['link'] . 'settings/friend-requests',
      'messages_link'             => $bp_member['link'] . 'settings/messages',
      'notifications_link'        => $bp_member['link'] . 'settings/notifications'
    ];

    // add user base data
    $user_friends_data = array_merge(vikinger_member_get_user_base_data($bp_member), $user_friends_data);

    // add GamiPress rank data if plugin is active
    if (vikinger_plugin_gamipress_is_active()) {
      $user_friends_data['rank'] = vikinger_gamipress_get_user_rank_priority('rank', $bp_member['id'], 'simple');
    }

    // add BuddyPress friend data if BuddyPress and the friends component are active
    if (vikinger_plugin_buddypress_is_active() && bp_is_active('friends')) {
      $user_friends_data['friends'] = vikinger_get_friends(['user_id' => $bp_member['id']]);
      $user_friends_data['friend_requests_received'] = vikinger_get_friend_requests_received($bp_member['id']);
      $user_friends_data['friend_requests_sent'] = vikinger_get_friend_requests_sent($bp_member['id']);
    }

    return $user_friends_data;
  }
}

if (!function_exists('vikinger_member_get_user_status_groups_data')) {
  /**
   * Returns user-status-groups scope member data
   * 
   * @param array   $bp_member            BP member data.
   * @return array  $user_status_groups_data     user-groups scope member data.
   */
  function vikinger_member_get_user_status_groups_data($bp_member) {
    $user_status_groups_data = [
      'groups'                              => [],
      'group_membership_requests_sent'      => [],
      'manage_groups_link'                  => $bp_member['link'] . 'settings/manage-groups',
      'default_group_avatar_url'            => vikinger_get_default_group_avatar_url(),
      'default_group_cover_image_url'       => vikinger_get_default_group_cover_url()
    ];

    // add GamiPress rank data if plugin is active
    if (vikinger_plugin_gamipress_is_active()) {
      $user_status_groups_data['rank'] = vikinger_gamipress_get_user_rank_priority('rank', $bp_member['id'], 'simple');
    }

    // add user base data
    $user_status_groups_data = array_merge(vikinger_member_get_user_base_data($bp_member), $user_status_groups_data);

    // add BuddyPress group data if BuddyPress and the groups component are active
    if (vikinger_plugin_buddypress_is_active() && bp_is_active('groups')) {
      $user_status_groups_data['groups'] = vikinger_get_user_groups($bp_member['id']);

      $user_status_groups_data['group_membership_requests_sent'] = vikinger_group_membership_requests_get(['user_id' => $bp_member['id']]);
    }

    return $user_status_groups_data;
  }
}

if (!function_exists('vikinger_member_get_user_groups_data')) {
  /**
   * Returns user-groups scope member data
   * 
   * @param array   $bp_member            BP member data.
   * @return array  $user_groups_data     user-groups scope member data.
   */
  function vikinger_member_get_user_groups_data($bp_member) {
    $user_groups_data = [
      'groups'                              => [],
      'group_membership_requests_sent'      => [],
      'manage_groups_link'                  => $bp_member['link'] . 'settings/manage-groups',
      'default_group_avatar_url'            => vikinger_get_default_group_avatar_url(),
      'default_group_cover_image_url'       => vikinger_get_default_group_cover_url()
    ];

    // add user base data
    $user_groups_data = array_merge(vikinger_member_get_user_base_data($bp_member), $user_groups_data);

    // add BuddyPress group data if BuddyPress and the groups component are active
    if (vikinger_plugin_buddypress_is_active() && bp_is_active('groups')) {
      $user_groups_data['groups'] = vikinger_get_user_groups($bp_member['id']);

      $user_groups_data['group_membership_requests_sent'] = vikinger_group_membership_requests_get(['user_id' => $bp_member['id']]);
    }

    return $user_groups_data;
  }
}

if (!function_exists('vikinger_member_get_user_groups_preview_data')) {
  /**
   * Returns user-groups-preview scope member data
   * 
   * @param array   $bp_member                    BP member data.
   * @return array  $user_groups_preview_data     user-groups-preview scope member data.
   */
  function vikinger_member_get_user_groups_preview_data($bp_member) {
    $user_groups_preview_data = [
      'groups'                              => [],
      'default_group_avatar_url'            => vikinger_get_default_group_avatar_url(),
      'default_group_cover_image_url'       => vikinger_get_default_group_cover_url()
    ];

    // add user base data
    $user_groups_preview_data = array_merge(vikinger_member_get_user_base_data($bp_member), $user_groups_preview_data);

    // add BuddyPress group data if BuddyPress and the groups component are active
    if (vikinger_plugin_buddypress_is_active() && bp_is_active('groups')) {
      $user_groups_preview_data['groups'] = vikinger_get_user_groups($bp_member['id'], 'user-groups-preview');
    }

    return $user_groups_preview_data;
  }
}

if (!function_exists('vikinger_member_get_user_activity_data')) {
  /**
   * Returns user-activity scope member data
   * 
   * @param array   $bp_member            BP member data.
   * @return array  $user_activity_data   user-activity scope member data.
   */
  function vikinger_member_get_user_activity_data($bp_member) {
    $user_activity_data = [
      'friends'       => [],
      'groups'        => [],
      'messages_link' => $bp_member['link'] . 'settings/messages'
    ];

    // add user base data
    $user_activity_data = array_merge(vikinger_member_get_user_base_data($bp_member), $user_activity_data);

    // add GamiPress rank data if plugin is active
    if (vikinger_plugin_gamipress_is_active()) {
      $user_activity_data['rank'] = vikinger_gamipress_get_user_rank_priority('rank', $bp_member['id'], 'simple');
    }

    // add BuddyPress friend data if BuddyPress and the friends component are active
    if (vikinger_plugin_buddypress_is_active() && bp_is_active('friends')) {
      $user_activity_data['friends'] = vikinger_get_friends(['user_id' => $bp_member['id']]);
    }

    // add BuddyPress group data if BuddyPress and the groups component are active
    if (vikinger_plugin_buddypress_is_active() && bp_is_active('groups')) {
      $user_activity_data['groups'] = vikinger_get_user_groups($bp_member['id']);
    }

    // add Verified Member for BuddyPress data if plugin is active
    if (vikinger_plugin_bpverifiedmember_is_active()) {
      $user_activity_data['verified'] = vikinger_bpverifiedmember_user_is_verified($user_activity_data['id']);
    }

    return $user_activity_data;
  }
}

if (!function_exists('vikinger_member_get_user_groups_invitations_data')) {
  /**
   * Returns user-groups-invitations scope member data
   * 
   * @param array   $bp_member                      BP member data.
   * @return array  $user_groups_invitations_data   user-groups-invitations scope member data.
   */
  function vikinger_member_get_user_groups_invitations_data($bp_member) {
    $user_groups_invitations_data = [
      'friends'                     => [],
      'groups'                      => [],
      'group_invitations_sent'      => []
    ];

    // add user base data
    $user_groups_invitations_data = array_merge(vikinger_member_get_user_base_data($bp_member), $user_groups_invitations_data);

    // add BuddyPress friend data if BuddyPress and the friends component are active
    if (vikinger_plugin_buddypress_is_active() && bp_is_active('friends')) {
      $user_groups_invitations_data['friends'] = vikinger_get_friends(['user_id' => $bp_member['id']]);
    }

    // add BuddyPress group data if BuddyPress and the groups component are active
    if (vikinger_plugin_buddypress_is_active() && bp_is_active('groups')) {
      $user_groups_invitations_data['groups'] = vikinger_get_user_groups($bp_member['id'], 'user-groups-members');

      $group_invitations_sent_args = [
        'inviter_id'  => $bp_member['id']
      ];

      $user_groups_invitations_data['group_invitations_sent'] = vikinger_group_get_invitations($group_invitations_sent_args);
    }

    return $user_groups_invitations_data;
  }
}

if (!function_exists('vikinger_member_get_user_groups_received_invitations_data')) {
  /**
   * Returns user-groups-received-invitations scope member data
   * 
   * @param array   $bp_member                                BP member data.
   * @return array  $user_groups_received_invitations_data    user-groups-received-invitations scope member data.
   */
  function vikinger_member_get_user_groups_received_invitations_data($bp_member) {
    $user_groups_received_invitations_data = [
      'group_invitations_received'  => []
    ];

    // add user base data
    $user_groups_received_invitations_data = array_merge(vikinger_member_get_user_base_data($bp_member), $user_groups_received_invitations_data);

    // add BuddyPress group data if BuddyPress and the groups component are active
    if (vikinger_plugin_buddypress_is_active() && bp_is_active('groups')) {
      $group_invitations_received_args = [
        'user_id'   => $bp_member['id']
      ];

      $user_groups_received_invitations_data['group_invitations_received'] = vikinger_group_get_invitations($group_invitations_received_args);
    }

    return $user_groups_received_invitations_data;
  }
}

if (!function_exists('vikinger_member_get_user_groups_memberships_data')) {
  /**
   * Returns user-groups-memberships scope member data
   * 
   * @param array   $bp_member                        BP member data.
   * @return array  $user_groups_memberships_data     user-groups-memberships scope member data.
   */
  function vikinger_member_get_user_groups_memberships_data($bp_member) {
    $user_groups_memberships_data = [
      'groups'                              => [],
      'group_membership_requests_received'  => [],
      'group_membership_requests_sent'      => []
    ];

    // add user base data
    $user_groups_memberships_data = array_merge(vikinger_member_get_user_base_data($bp_member), $user_groups_memberships_data);

    // add BuddyPress group data if BuddyPress and the groups component are active
    if (vikinger_plugin_buddypress_is_active() && bp_is_active('groups')) {
      $user_groups_memberships_data['groups'] = vikinger_get_user_groups($bp_member['id']);

      $user_groups_memberships_data['group_membership_requests_sent'] = vikinger_group_membership_requests_get(['user_id' => $bp_member['id']]);
      
      foreach ($user_groups_memberships_data['groups'] as $user_group) {
        $user_groups_memberships_data['group_membership_requests_received'] = array_merge(vikinger_group_membership_requests_get(['group_id' => $user_group['id']]), $user_groups_memberships_data['group_membership_requests_received']);
      }
    }

    return $user_groups_memberships_data;
  }
}

if (!function_exists('vikinger_member_get_user_activity_friend_data')) {
  /**
   * Returns user-activity-friend scope member data
   * 
   * @param array   $bp_member                    BP member data.
   * @return array  $user_activity_friend_data    user-activity-friend scope member data.
   */
  function vikinger_member_get_user_activity_friend_data($bp_member) {
    $user_activity_friend_data = [
      'messages_link' => $bp_member['link'] . 'messages',
      'cover_url'     => vikinger_member_get_cover_url($bp_member['id'])
    ];

    // add user base data
    $user_activity_friend_data = array_merge(vikinger_member_get_user_base_data($bp_member), $user_activity_friend_data);

    // add GamiPress rank data if plugin is active
    if (vikinger_plugin_gamipress_is_active()) {
      $user_activity_friend_data['rank'] = vikinger_gamipress_get_user_rank_priority('rank', $bp_member['id'], 'simple');
    }

    // add Verified Member for BuddyPress data if plugin is active
    if (vikinger_plugin_bpverifiedmember_is_active()) {
      $user_activity_friend_data['verified'] = vikinger_bpverifiedmember_user_is_verified($user_activity_friend_data['id']);
    }

    return $user_activity_friend_data;
  }
}

if (!function_exists('vikinger_member_get_user_settings_data')) {
  /**
   * Returns user-settings scope member data
   * 
   * @param array   $bp_member            BP member data.
   * @return array  $user_settings_data   user-settings scope member data.
   */
  function vikinger_member_get_user_settings_data($bp_member) {
    $user_settings_data = [
      'profile_data'  => vikinger_member_get_xprofile_data($bp_member['id'])
    ];

    // add user base data
    $user_settings_data = array_merge(vikinger_member_get_user_base_data($bp_member), $user_settings_data);

    return $user_settings_data;
  }
}

if (!function_exists('vikinger_member_get_user_settings_profile_data')) {
  /**
   * Returns user-settings-profile scope member data
   * 
   * @param array   $bp_member                    BP member data.
   * @return array  $user_settings_profile_data   user-settings-profile scope member data.
   */
  function vikinger_member_get_user_settings_profile_data($bp_member) {
    $user_settings_profile_data = [
      'cover_url'     => vikinger_member_get_cover_url($bp_member['id']),
      'profile_data'  => vikinger_member_get_xprofile_data($bp_member['id'])
    ];

    // add user base data
    $user_settings_profile_data = array_merge(vikinger_member_get_user_base_data($bp_member), $user_settings_profile_data);

    // add GamiPress rank data if plugin is active
    if (vikinger_plugin_gamipress_is_active()) {
      $user_settings_profile_data['rank'] = vikinger_gamipress_get_user_rank_priority('rank', $bp_member['id'], 'simple');
    }

    return $user_settings_profile_data;
  }
}

if (!function_exists('vikinger_member_get_user_settings_password_data')) {
  /**
   * Returns user-settings-password scope member data
   * 
   * @param array   $bp_member                    BP member data.
   * @return array  $user_settings_password_data  user-settings-password scope member data.
   */
  function vikinger_member_get_user_settings_password_data($bp_member) {
    $user = get_userdata($bp_member['id']);

    $user_settings_password_data = [
      'password'      => $user->user_pass
    ];

    // add user base data
    $user_settings_password_data = array_merge(vikinger_member_get_user_base_data($bp_member), $user_settings_password_data);

    return $user_settings_password_data;
  }
}

if (!function_exists('vikinger_member_get_user_settings_notification_data')) {
  /**
   * Returns user-settings-notification scope member data
   * 
   * @param array   $bp_member                        BP member data.
   * @return array  $user_settings_notification_data  user-settings-notification scope member data.
   */
  function vikinger_member_get_user_settings_notification_data($bp_member) {
    $user_settings_notification_data = [
      'email_settings'  => vikinger_notification_get_settings($bp_member['id'])
    ];

    // add user base data
    $user_settings_notification_data = array_merge(vikinger_member_get_user_base_data($bp_member), $user_settings_notification_data);

    return $user_settings_notification_data;
  }
}

if (!function_exists('vikinger_member_get_data')) {
  /**
   * Returns scoped member data
   * 
   * @param array   $bp_member    BP member data.
   * @param string  $data_scope   Scope of the member data to return.        
   * @return array
   */
  function vikinger_member_get_data($bp_member, $data_scope = 'user-status') {
    if ($data_scope === 'user-status') {
      return vikinger_member_get_user_status_data($bp_member);
    }

    if ($data_scope === 'user-preview') {
      return vikinger_member_get_user_preview_data($bp_member);
    }

    if ($data_scope === 'user-sidebar') {
      return vikinger_member_get_user_sidebar_data($bp_member);
    }

    if ($data_scope === 'user-friends') {
      return vikinger_member_get_user_friends_data($bp_member);
    }

    if ($data_scope === 'user-status-groups') {
      return vikinger_member_get_user_status_groups_data($bp_member);
    }

    if ($data_scope === 'user-groups') {
      return vikinger_member_get_user_groups_data($bp_member);
    }

    if ($data_scope === 'user-groups-preview') {
      return vikinger_member_get_user_groups_preview_data($bp_member);
    }

    if ($data_scope === 'user-groups-invitations') {
      return vikinger_member_get_user_groups_invitations_data($bp_member);
    }

    if ($data_scope === 'user-groups-received-invitations') {
      return vikinger_member_get_user_groups_received_invitations_data($bp_member);
    }

    if ($data_scope === 'user-groups-memberships') {
      return vikinger_member_get_user_groups_memberships_data($bp_member);
    }

    if ($data_scope === 'user-activity') {
      return vikinger_member_get_user_activity_data($bp_member);
    }

    if ($data_scope === 'user-activity-friend') {
      return vikinger_member_get_user_activity_friend_data($bp_member);
    }

    if ($data_scope === 'user-settings') {
      return vikinger_member_get_user_settings_data($bp_member);
    }

    if ($data_scope === 'user-settings-profile') {
      return vikinger_member_get_user_settings_profile_data($bp_member);
    }

    if ($data_scope === 'user-settings-password') {
      return vikinger_member_get_user_settings_password_data($bp_member);
    }

    if ($data_scope === 'user-settings-notification') {
      return vikinger_member_get_user_settings_notification_data($bp_member);
    }

    return [];
  }
}

if (!function_exists('vikinger_member_get_cover_url')) {
  /**
   * Returns member cover url
   * 
   * @param int     $member_id      Member id.
   * @return string $cover_url      Member cover url.
   */
  function vikinger_member_get_cover_url($member_id) {
    $cover_url = bp_attachments_get_attachment('url', [
      'object_dir'  => 'members',
      'item_id'     => $member_id
    ]);

    // get default cover url if user hasn't uploaded one yet
    if (!$cover_url) {
      $cover_url = vikinger_get_default_member_cover_url();
    }

    return $cover_url;
  }
}

if (!function_exists('vikinger_member_get_xprofile_data')) {
  /**
   * Returns member xprofile data
   * 
   * @param int     $member_id              Member id.
   * @return array  $member_xprofile_data   Structured member xprofile data.
   */
  function vikinger_member_get_xprofile_data($member_id) {
    $request = new WP_REST_Request('GET', '/buddypress/v1/xprofile/groups');

    // set parameters
    $request->set_param('user_id', $member_id);
    $request->set_param('fetch_fields', true);
    $request->set_param('fetch_field_data', true);

    $bp_xprofile_groups = rest_do_request($request);

    $member_xprofile_data = [
      'group'  =>  [],
      'field'  =>  []
    ];

    // if request was succesfull
    if ($bp_xprofile_groups->status === 200) {
      foreach ($bp_xprofile_groups->data as $bp_xprofile_group) {
        $member_xprofile_data['group'][$bp_xprofile_group['name']] = [];
      
        foreach ($bp_xprofile_group['fields'] as $field) { 
          $member_xprofile_field_data = [
            'group_id'      => $bp_xprofile_group['id'],
            'id'            => $field['id'],
            'name'          => $field['name'],
            'type'          => $field['type'],
            'value'         => stripslashes($field['data']['value']['raw']),
            'field_order'   => $field['field_order'],
            'option_order'  => $field['option_order'],
            'options'       => $field['options'],
            'is_required'   => $field['is_required'],
            'meta'          => bp_xprofile_get_meta($field['id'], 'field'),
            'values'  => $field['data']
          ];

          // pass checkbox unserialized value as a comma separated string
          if ($field['type'] === 'checkbox') {
            $member_xprofile_field_data['value'] = implode(', ', $field['data']['value']['unserialized']);
          }

          $default_value_option_field_types = ['selectbox', 'radio'];

          // field type with defaultable option values
          // set default option as value if value is not yet set by user
          if ($field['data']['value']['raw'] === '') {
            if (in_array($field['type'], $default_value_option_field_types)) {
              foreach ($field['options'] as $option) {
                if ($option['is_default_option']) {
                  $member_xprofile_field_data['value'] = $option['name'];
                  break;
                }
              }
            }

            if ($field['type'] === 'checkbox') {
              $values = [];

              foreach ($field['options'] as $option) {
                if ($option['is_default_option']) {
                  $values[] = $option['name'];
                }
              }

              $member_xprofile_field_data['value'] = implode(', ', $values);
            }
          }

          $member_xprofile_data['group'][$bp_xprofile_group['name']][] = $member_xprofile_field_data;
          $member_xprofile_data['field'][$bp_xprofile_group['name'] . '_' . $field['name']] = $member_xprofile_field_data;
        }
      }
    }

    return $member_xprofile_data;
  }
}

if (!function_exists('vikinger_member_update_xprofile_data')) {
  /**
   * Update member xprofile data
   * 
   * @param array $fields       Fields to update (field_id => field_value)
   * @param int   $member_id    ID of the member to update the field data of
   */
  function vikinger_member_update_xprofile_data($fields, $member_id) {
    foreach ($fields as $field_id => $field_value) {
      $result = xprofile_set_field_data($field_id, $member_id, $field_value);
    }

    return $result;
  }
}

if (!function_exists('vikinger_members_get_count')) {
  /**
   * Returns filtered members count.
   * 
   * @param array $args             Filters for the members query.
   * @return int  $members_count    Filtered members count.
   */
  function vikinger_members_get_count($args = []) {
    $request = new WP_REST_Request('GET', '/buddypress/v1/members');

    $defaults = [
      'per_page' => 1
    ];

    $args = array_merge($defaults, $args);

    // set parameters
    foreach ($args as $key => $value) {
      $request->set_param($key, $value);
    }

    $bp_members = rest_do_request($request);

    $members_count = 0;

    // if request was succesfull
    if ($bp_members->status === 200) {
      if (array_key_exists('X-WP-Total', $bp_members->headers)) {
        $members_count = $bp_members->headers['X-WP-Total'];
      }
    }

    return $members_count;
  }
}

if (!function_exists('vikinger_members_get_navigation_items')) {
  /**
   * Returns member navigation items
   * 
   * @param array   $member           Member data
   * @param boolean $activity_single  True if activity single, false if not
   * @return array
   */
  function vikinger_members_get_navigation_items($member, $activity_single = false) {
    $nav_items = [];

    $member_profile_page_navigation_items = [
      [
        'name'    => esc_html__('Timeline', 'vikinger'),
        'icon'    => 'timeline',
        'slug'    => 'activity',
        'active'  => bp_is_user_activity() && !$activity_single,
        'enabled' => bp_is_active('activity'),
        'order'   => get_theme_mod('vikinger_members_setting_profile_timeline_page_order', 2)
      ],
      [
        'name'    => esc_html__('Friends', 'vikinger'),
        'icon'    => 'friend',
        'slug'    => 'friends',
        'active'  => bp_is_user_friends(),
        'enabled' => bp_is_active('friends'),
        'order'   => get_theme_mod('vikinger_members_setting_profile_friends_page_order', 3)
      ],
      [
        'name'    => esc_html__('Groups', 'vikinger'),
        'icon'    => 'group',
        'slug'    => 'groups',
        'active'  => bp_is_user_groups(),
        'enabled' => bp_is_active('groups'),
        'order'   => get_theme_mod('vikinger_members_setting_profile_groups_page_order', 4)
      ]
    ];

    // only add enabled profile navigation items to the menu items array
    foreach ($member_profile_page_navigation_items as $member_profile_page_navigation_item) {
      if ($member_profile_page_navigation_item['enabled']) {
        $menu_items[] = $member_profile_page_navigation_item;
      }
    }

    foreach ($menu_items as $menu_item) {
      $nav_items[] = [
        'name'    => $menu_item['name'],
        'link'    => $member['link'] . $menu_item['slug'],
        'icon'    => $menu_item['icon'],
        'active'  => $menu_item['active'],
        'order'   => $menu_item['order']
      ];
    }

    $nav_items = array_merge($nav_items, vikinger_member_bp_navigation_items_get($member));

    // sort nav items by order
    usort($nav_items, function ($a, $b) {
      if ($a['order'] > $b['order']) {
        return 1;
      }

      if ($a['order'] < $b['order']) {
        return -1;
      }

      return 0;
    });

    return $nav_items;
  }
}

if (!function_exists('vikinger_member_bp_navigation_items_get')) {
  /**
   * Get member profile navigation items.
   * 
   * @param array   $member                     Member from which to get navigation items for. 
   * @return array  $member_navigation_items    Member navigation items.
   */
  function vikinger_member_bp_navigation_items_get($member) {
    $bp = buddypress();

    $bp_nav_items = $bp->members->nav->get_primary();
  
    $member_navigation_items = [];
  
    $bp_nav_item_blacklist = [
      'activity',
      'friends',
      'groups',
      'settings'
    ];

    $member_nav_item_icons = [
      'about'       => 'profile',
      'posts'       => 'blog-posts',
      'forums'      => 'forums',
      'photos'      => 'photos',
      'videos'      => 'videos',
      'credits'     => 'credits',
      'badges'      => 'badges',
      'quests'      => 'quests',
      'ranks'       => 'ranks',
      'bp-messages' => 'messages'
    ];
  
    foreach ($bp_nav_items as $i => $bp_nav_item) {
      // only add navigation item if not on blacklist and it should be shown for the currently displayed user
      if (!in_array($bp_nav_item->component_id, $bp_nav_item_blacklist, true) && $bp_nav_item->show_for_displayed_user) {
        $nav_item = (array) $bp_nav_item;
        $nav_item_link = $member['link'] . $bp_nav_item->slug;

        $nav_item_default_order = $nav_item['slug'] === 'forums' ? 6 : $i;

        $member_nav_item = [
          'name'      => $nav_item['name'],
          'link'      => $nav_item_link,
          'icon'      => array_key_exists($nav_item['slug'], $member_nav_item_icons) ? $member_nav_item_icons[$nav_item['slug']] : false,
          'active'    => bp_is_current_component($nav_item['slug']),
          'order'     => get_theme_mod('vikinger_members_setting_profile_' . $nav_item['component_id'] . '_page_order', $nav_item_default_order)
        ];

        $member_navigation_items[] = $member_nav_item;
      }
    }
  
    return $member_navigation_items;
  }
}

if (!function_exists('vikinger_member_bp_subnavigation_items_get')) {
  /**
   * Get member profile navigation subitems.
   * 
   * @param array   $member                         Member from which to get subnavigation items for. 
   * @param string  $slug                           Slug of the navigation item from which to get subnavigation items for.
   * @return array  $member_navigation_subitems     Member navigation subitems.
   */
  function vikinger_member_bp_subnavigation_items_get($member, $slug) {
    $bp_nav_item_blacklist = [
      'activity',
      'friends',
      'groups',
      'settings'
    ];

    if (in_array($slug, $bp_nav_item_blacklist, true)) {
      return false;
    }

    $bp = buddypress();

    $bp_nav_items = $bp->members->nav->get_primary(['slug' => $slug]);
    $bp_nav_sub_items = $bp->members->nav->get_secondary(['parent_slug' => $slug]);

    if (!$bp_nav_items || !$bp_nav_sub_items) {
      return false;
    }

    $member_navigation_subitems = [];

    foreach ($bp_nav_items as $bp_nav_item) {
      $nav_item_link = $member['link'] . $bp_nav_item->slug;
    
      foreach ($bp_nav_sub_items as $bp_nav_sub_item) {
        $nav_sub_item = (array) $bp_nav_sub_item;
    
        $member_nav_sub_item = [
          'name'      => $nav_sub_item['name'],
          'link'      => $nav_item_link . '/' . $nav_sub_item['slug'],
          'active'    => bp_is_current_action($nav_sub_item['slug'])
        ];
    
        $member_navigation_subitems[] = $member_nav_sub_item;
      }
    }

    return $member_navigation_subitems;
  }
}

if (!function_exists('vikinger_members_get_settings_navigation_sections')) {
  /**
   * Returns member settings navigation items
   * 
   * @param array   $member           Member data
   * @return array
   */
  function vikinger_members_get_settings_navigation_sections($member) {
    $menu_sections = [];

    // profile sections
    $profile_sections = [
      'title'       => esc_html_x('My Profile', 'Profile Settings Menu - Title', 'vikinger'),
      'description' => esc_html_x('Change your avatar &amp; cover, accept friends, read messages and more!', 'Profile Settings Menu - Description', 'vikinger'),
      'icon'        => 'profile',
      'menu_items'  => [
        [
          'name'    => esc_html_x('Profile Info', 'Profile Settings Menu - Profile Info Link', 'vikinger'),
          'slug'    => 'general',
          'link'    => $member['link'] . 'settings/general',
          'active'  => bp_is_current_action('general')
        ],
        [
          'name'    => esc_html_x('Social', 'Profile Settings Menu - Social Link', 'vikinger'),
          'slug'    => 'social',
          'link'    => $member['link'] . 'settings/social',
          'active'  => bp_is_current_action('social')
        ],
        [
          'name'    => esc_html_x('Notifications', 'Profile Settings Menu - Notifications Link', 'vikinger'),
          'slug'    => 'notifications',
          'link'    => $member['link'] . 'settings/notifications',
          'active'  => bp_is_current_action('notifications')
        ]
      ]
    ];

    // if BuddyPress messages component is active, add message related pages
    if (bp_is_active('messages') && bp_is_active('friends')) {
      $profile_sections['menu_items'][] = [
        'name'    => esc_html_x('Messages', 'Profile Settings Menu - Messages Link', 'vikinger'),
        'slug'    => 'messages',
        'link'    => $member['link'] . 'settings/messages',
        'active'  => bp_is_current_action('messages')
      ];
    }

    // if BuddyPress friends component is active, add friend related pages
    if (bp_is_active('friends')) {
      $profile_sections['menu_items'][] = [
        'name'    => esc_html_x('Friend Requests', 'Profile Settings Menu - Friend Requests Link', 'vikinger'),
        'slug'    => 'friend-requests',
        'link'    => $member['link'] . 'settings/friend-requests',
        'active'  => bp_is_current_action('friend-requests')
      ];
    }

    $account_sections = [
      'title'       => esc_html_x('Account', 'Account Settings Menu - Title', 'vikinger'),
      'description' => esc_html_x('Change your account information, password and settings!', 'Account Settings Menu - Description', 'vikinger'),
      'icon'        => 'settings',
      'menu_items'  => [
        [
          'name'    => esc_html_x('Account Info', 'Account Settings Menu - Account Info Link', 'vikinger'),
          'slug'    => 'account',
          'link'    => $member['link'] . 'settings/account',
          'active'  => bp_is_current_action('account')
        ],
        [
          'name'    => esc_html_x('Account Settings', 'Account Settings Menu - Account Settings Link', 'vikinger'),
          'slug'    => 'account-settings',
          'link'    => $member['link'] . 'settings/account-settings',
          'active'  => bp_is_current_action('account-settings')
        ],
        [
          'name'    => esc_html_x('Change Password', 'Account Settings Menu - Change Password Link', 'vikinger'),
          'slug'    => 'password',
          'link'    => $member['link'] . 'settings/password',
          'active'  => bp_is_current_action('password')
        ],
        [
          'name'    => esc_html_x('Email Settings', 'Account Settings Menu - Email Settings Link', 'vikinger'),
          'slug'    => 'email-settings',
          'link'    => $member['link'] . 'settings/email-settings',
          'active'  => bp_is_current_action('email-settings')
        ]
      ]
    ];

    $menu_sections[] = $profile_sections;
    $menu_sections[] = $account_sections;

    // if BuddyPress groups component is active, add group manage related pages
    if (bp_is_active('groups')) {
      $manage_groups_sections = [
        'title'       => esc_html_x('Groups', 'Group Settings Menu - Title', 'vikinger'),
        'description' => esc_html_x('Create new groups, manage the ones you created or accept invites!', 'Group Settings Menu - Description', 'vikinger'),
        'icon'        => 'group',
        'menu_items'  => [
          [
            'name'    => esc_html_x('Manage Groups', 'Group Settings Menu - Manage Groups Link', 'vikinger'),
            'slug'    => 'manage-groups',
            'link'    => $member['link'] . 'settings/manage-groups',
            'active'  => bp_is_current_action('manage-groups')
          ],
          [
            'name'    => esc_html_x('Send Invitations', 'Group Settings Menu - Send Invitations Link', 'vikinger'),
            'slug'    => 'send-group-invitations',
            'link'    => $member['link'] . 'settings/send-group-invitations',
            'active'  => bp_is_current_action('send-group-invitations')
          ],
          [
            'name'    => esc_html_x('Received Invitations', 'Group Settings Menu - Received Invitations Link', 'vikinger'),
            'slug'    => 'received-group-invitations',
            'link'    => $member['link'] . 'settings/received-group-invitations',
            'active'  => bp_is_current_action('received-group-invitations')
          ],
          [
            'name'    => esc_html_x('Membership Requests', 'Group Settings Menu - Membership Requests Link', 'vikinger'),
            'slug'    => 'membership-requests',
            'link'    => $member['link'] . 'settings/membership-requests',
            'active'  => bp_is_current_action('membership-requests')
          ]
        ]
      ];
          
      $menu_sections[] = $manage_groups_sections;
    }

    if (vikinger_plugin_woocommerce_is_active()) {
      $wc_myaccount_menu_items = [];
      
      $wc_account_menu_items = wc_get_account_menu_items();

      global $wp;

      $current_page_url = trailingslashit(home_url($wp->request));

      foreach ($wc_account_menu_items as $endpoint => $label) {
        $wc_account_menu_item_url = wc_get_account_endpoint_url($endpoint);

        $wc_myaccount_menu_items[] = [
          'name'    => $label,
          'slug'    => $label,
          'link'    => $wc_account_menu_item_url,
          'active'  => $current_page_url === trailingslashit($wc_account_menu_item_url)
        ];
      }

      $wc_myaccount_sections = [
        'title'       => esc_html_x('Shop', 'Shop Settings Menu - Title', 'vikinger'),
        'description' => esc_html_x('Review your account, manage orders and more!', 'Shop Settings Menu - Description', 'vikinger'),
        'icon'        => 'marketplace',
        'menu_items'  => $wc_myaccount_menu_items
      ];
          
      $menu_sections[] = $wc_myaccount_sections;
    }

    return $menu_sections;
  }
}

if (!function_exists('vikinger_members_get_xprofile_social_links')) {
  /**
   * Returns member xprofile social links data
   * 
   * @param array $member     Member with xprofile data
   * @return array
   */
  function vikinger_members_get_xprofile_social_links($member) {
    $social_links = [];
    $valid_social_networks = [
      'facebook',
      'twitter',
      'instagram',
      'twitch',
      'discord',
      'youtube',
      'patreon',
      'artstation',
      'behance',
      'deviantart',
      'dribbble',
      'spotify',
      'snapchat',
      'reddit',
      'pinterest',
      'linkedin',
      'github',
      'vk',
      'tumblr',
      'tiktok'
    ];

    $social_links_group_name = vikinger_settings_xprofile_group_social_links_name_get();

    if (!array_key_exists($social_links_group_name, $member['profile_data']['group'])) {
      return $social_links;
    }

    foreach ($member['profile_data']['group'][$social_links_group_name] as $xprofile_social_link) {
      if (!empty($xprofile_social_link['value'])) {
        $social_links[] = [
          'name'  => in_array(strtolower($xprofile_social_link['name']), $valid_social_networks) ? strtolower($xprofile_social_link['name']) : 'link',
          'link'  => $xprofile_social_link['value']
        ];
      }
    }

    return $social_links;
  }
}

if (!function_exists('vikinger_members_xprofile_get_field_value')) {
  /**
   * Returns xprofile field value
   * 
   * @param array   $member         Member data, contains xprofile data in 'profile_data' -> 'field'
   * @param string  $field_name     Name of the field to retrieve value from
   * @return string
   */
  function vikinger_members_xprofile_get_field_value($member, $field_name) {
    if (!array_key_exists($field_name, $member['profile_data']['field'])) {
      return '';
    }

    $field = $member['profile_data']['field'][$field_name];
    
    return vikinger_members_xprofile_parse_field_value($field);
  }
}

if (!function_exists('vikinger_members_xprofile_parse_field_value')) {
  /**
   * Parse xprofile field data and return formatted value
   * 
   * @param array $field      xprofile field data
   * @return string
   */
  function vikinger_members_xprofile_parse_field_value($field) {
    // if field has a value and its type is datebox, format date using user configuration
    if ($field['value'] !== '' && $field['type'] === 'datebox') {
      $date_format = $field['meta']['date_format'][0];

      if ($date_format === 'custom') {
        $date_format = $field['meta']['date_format_custom'][0];
      }

      $field_value = (new DateTime($field['value']))->format($date_format);

      return $field_value;
    }

    return wp_strip_all_tags($field['value']);
  }
}

if (!function_exists('vikinger_members_xprofile_get_group_fields')) {
  /**
   * Returns xprofile group fields
   * 
   * @param array   $member           Member data, contains xprofile data in 'profile_data' -> 'field'
   * @param string  $group_name       Name of the group to retrieve fields from
   * @param array   $exclude_fields   Array of field names to exclude from results
   * @return array
   */
  function vikinger_members_xprofile_get_group_fields($member, $group_name, $exclude_fields = []) {
    $group_fields = [];

    // if group name provided doesn't exist, return
    if (!array_key_exists($group_name, $member['profile_data']['group'])) {
      return $group_fields;
    }

    // loop group name fields to get formatted field data
    foreach ($member['profile_data']['group'][$group_name] as $field) {
      // ignore field if it exists in the exclude fields array
      if (in_array($field['name'], $exclude_fields)) {
        continue;
      }

      $group_fields[] = [
        'id'    => $field['id'],
        'title' => $field['name'],
        'type'  => $field['type'],
        'value' => vikinger_members_xprofile_parse_field_value($field)
      ];
    }

    return $group_fields;
  }
}

if (!function_exists('vikinger_member_avatar_delete')) {
  /**
   * Delete member avatar
   * 
   * @param int $member_id      ID of the member to delete avatar from.
   * @return bool|array         Delete data on success, false on error.
   */
  function vikinger_member_avatar_delete($member_id) {
    $request = new WP_REST_Request('DELETE', '/buddypress/v1/members/' . $member_id . '/avatar');

    $result = rest_do_request($request);

    // if request was succesfull
    if ($result->status === 200) {
      return $result->data;
    }

    return false;
  }
}

if (!function_exists('vikinger_member_cover_delete')) {
  /**
   * Delete member cover
   * 
   * @param int $member_id      ID of the member to delete cover from.
   * @return bool|array         Delete data on success, false on error.
   */
  function vikinger_member_cover_delete($member_id) {
    $request = new WP_REST_Request('DELETE', '/buddypress/v1/members/' . $member_id . '/cover');

    $result = rest_do_request($request);

    // if request was succesfull
    if ($result->status === 200) {
      return $result->data;
    }

    return false;
  }
}

?>