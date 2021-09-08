<?php
/**
 * Vikinger Customizer - Members
 * 
 * @since 1.0.0
 */

function vikinger_customizer_members($wp_customize) {
  /**
   * Members section
   */
  $wp_customize->add_section('vikinger_members', [
    'title'       => esc_html_x('Members', '(Customizer) Members Options - Title', 'vikinger'),
    'description' => esc_html_x('From here, you can customize the members options.', '(Customizer) Members Options - Description', 'vikinger'),
    'priority'    => 290,
    'panel'       => 'vikinger_customizer'
  ]);

  /**
   * Members Default Avatar
   */
  $wp_customize->add_setting('vikinger_members_setting_default_avatar', [
    'sanitize_callback' => 'absint'
  ]);

  $wp_customize->add_control(new WP_Customize_Media_Control( $wp_customize, 'vikinger_members_control_default_avatar', [
    'label'       => esc_html_x('Members Default Avatar', '(Customizer) Members Default Avatar - Title', 'vikinger'),
    'description' => esc_html_x('Default avatar assigned to members.', '(Customizer) Members Default Avatar - Description', 'vikinger'),
    'section'     => 'vikinger_members',
    'settings'    => 'vikinger_members_setting_default_avatar',
    'mime_type'   => 'image'
  ]));

  /**
   * Members Default Cover
   */
  $wp_customize->add_setting('vikinger_members_setting_default_cover', [
    'sanitize_callback' => 'absint'
  ]);

  $wp_customize->add_control(new WP_Customize_Media_Control( $wp_customize, 'vikinger_members_control_default_cover', [
    'label'       => esc_html_x('Members Default Cover', '(Customizer) Members Default Cover - Title', 'vikinger'),
    'description' => esc_html_x('Default cover assigned to members.', '(Customizer) Members Default Cover - Description', 'vikinger'),
    'section'     => 'vikinger_members',
    'settings'    => 'vikinger_members_setting_default_cover',
    'mime_type'   => 'image'
  ]));

  /**
   * Members Profile About Page Status
   */
  $wp_customize->add_setting('vikinger_members_setting_profile_about_page_status', [
    'sanitize_callback' => 'sanitize_text_field',
    'default'           => 'enabled'
  ]);

  $wp_customize->add_control('vikinger_members_control_profile_about_page_status', [
    'label'       => esc_html_x('Profile About Page - Status', '(Customizer) Profile About Page Option - Status - Title', 'vikinger'),
    'description' => esc_html_x('By disabling this option, you can remove the members profile about page and associated navigation item.', '(Customizer) Profile About Page Option - Status - Description', 'vikinger'),
    'type'        => 'radio',
    'choices'     => [
      'enabled'   => esc_html__('Enabled', 'vikinger'),
      'disabled'  => esc_html__('Disabled', 'vikinger')
    ],
    'section'     => 'vikinger_members',
    'settings'    => 'vikinger_members_setting_profile_about_page_status'
  ]);

  /**
   * Members Profile Posts Page Status
   */
  $wp_customize->add_setting('vikinger_members_setting_profile_posts_page_status', [
    'sanitize_callback' => 'sanitize_text_field',
    'default'           => 'enabled'
  ]);

  $wp_customize->add_control('vikinger_members_control_profile_posts_page_status', [
    'label'       => esc_html_x('Profile Posts Page - Status', '(Customizer) Profile Posts Page Option - Status - Title', 'vikinger'),
    'description' => esc_html_x('By disabling this option, you can remove the members profile posts page and associated navigation item.', '(Customizer) Profile Posts Page Option - Status - Description', 'vikinger'),
    'type'        => 'radio',
    'choices'     => [
      'enabled'   => esc_html__('Enabled', 'vikinger'),
      'disabled'  => esc_html__('Disabled', 'vikinger')
    ],
    'section'     => 'vikinger_members',
    'settings'    => 'vikinger_members_setting_profile_posts_page_status'
  ]);

  /**
   * Members Profile Credits Page Status
   */
  $wp_customize->add_setting('vikinger_members_setting_profile_credits_page_status', [
    'sanitize_callback' => 'sanitize_text_field',
    'default'           => 'enabled'
  ]);

  $wp_customize->add_control('vikinger_members_control_profile_credits_page_status', [
    'label'       => esc_html_x('Profile Credits Page - Status', '(Customizer) Profile Credits Page Option - Status - Title', 'vikinger'),
    'description' => esc_html_x('By disabling this option, you can remove the members profile credits page and associated navigation item.', '(Customizer) Profile Credits Page Option - Status - Description', 'vikinger'),
    'type'        => 'radio',
    'choices'     => [
      'enabled'   => esc_html__('Enabled', 'vikinger'),
      'disabled'  => esc_html__('Disabled', 'vikinger')
    ],
    'section'     => 'vikinger_members',
    'settings'    => 'vikinger_members_setting_profile_credits_page_status'
  ]);

  /**
   * Members Profile Badges Page Status
   */
  $wp_customize->add_setting('vikinger_members_setting_profile_badges_page_status', [
    'sanitize_callback' => 'sanitize_text_field',
    'default'           => 'enabled'
  ]);

  $wp_customize->add_control('vikinger_members_control_profile_badges_page_status', [
    'label'       => esc_html_x('Profile Badges Page - Status', '(Customizer) Profile Badges Page Option - Status - Title', 'vikinger'),
    'description' => esc_html_x('By disabling this option, you can remove the members profile badges page and associated navigation item.', '(Customizer) Profile Badges Page Option - Status - Description', 'vikinger'),
    'type'        => 'radio',
    'choices'     => [
      'enabled'   => esc_html__('Enabled', 'vikinger'),
      'disabled'  => esc_html__('Disabled', 'vikinger')
    ],
    'section'     => 'vikinger_members',
    'settings'    => 'vikinger_members_setting_profile_badges_page_status'
  ]);

  /**
   * Members Profile Quests Page Status
   */
  $wp_customize->add_setting('vikinger_members_setting_profile_quests_page_status', [
    'sanitize_callback' => 'sanitize_text_field',
    'default'           => 'enabled'
  ]);

  $wp_customize->add_control('vikinger_members_control_profile_quests_page_status', [
    'label'       => esc_html_x('Profile Quests Page - Status', '(Customizer) Profile Quests Page Option - Status - Title', 'vikinger'),
    'description' => esc_html_x('By disabling this option, you can remove the members profile quests page and associated navigation item.', '(Customizer) Profile Quests Page Option - Status - Description', 'vikinger'),
    'type'        => 'radio',
    'choices'     => [
      'enabled'   => esc_html__('Enabled', 'vikinger'),
      'disabled'  => esc_html__('Disabled', 'vikinger')
    ],
    'section'     => 'vikinger_members',
    'settings'    => 'vikinger_members_setting_profile_quests_page_status'
  ]);

  /**
   * Members Profile Ranks Page Status
   */
  $wp_customize->add_setting('vikinger_members_setting_profile_ranks_page_status', [
    'sanitize_callback' => 'sanitize_text_field',
    'default'           => 'enabled'
  ]);

  $wp_customize->add_control('vikinger_members_control_profile_ranks_page_status', [
    'label'       => esc_html_x('Profile Ranks Page - Status', '(Customizer) Profile Ranks Page Option - Status - Title', 'vikinger'),
    'description' => esc_html_x('By disabling this option, you can remove the members profile ranks page and associated navigation item.', '(Customizer) Profile Ranks Page Option - Status - Description', 'vikinger'),
    'type'        => 'radio',
    'choices'     => [
      'enabled'   => esc_html__('Enabled', 'vikinger'),
      'disabled'  => esc_html__('Disabled', 'vikinger')
    ],
    'section'     => 'vikinger_members',
    'settings'    => 'vikinger_members_setting_profile_ranks_page_status'
  ]);

  /**
   * Members Profile About Page Order
   */
  $wp_customize->add_setting('vikinger_members_setting_profile_about_page_order', [
    'sanitize_callback' => 'absint',
    'default'           => 1
  ]);

  $wp_customize->add_control('vikinger_members_control_profile_about_page_order', [
    'label'       => esc_html_x('Profile About Page - Order', '(Customizer) Profile About Page Option - Order - Title', 'vikinger'),
    'description' => esc_html_x('Choose the order in which the about page is displayed in the profile navigation bar (lower numbered pages will display before higher numbered ones)', '(Customizer) Profile About Page Option - Order - Description', 'vikinger'),
    'type'        => 'number',
    'section'     => 'vikinger_members',
    'settings'    => 'vikinger_members_setting_profile_about_page_order'
  ]);

  /**
   * Members Profile Timeline Page Order
   */
  $wp_customize->add_setting('vikinger_members_setting_profile_timeline_page_order', [
    'sanitize_callback' => 'absint',
    'default'           => 2
  ]);

  $wp_customize->add_control('vikinger_members_control_profile_timeline_page_order', [
    'label'       => esc_html_x('Profile Timeline Page - Order', '(Customizer) Profile Timeline Page Option - Order - Title', 'vikinger'),
    'description' => esc_html_x('Choose the order in which the timeline page is displayed in the profile navigation bar (lower numbered pages will display before higher numbered ones)', '(Customizer) Profile Timeline Page Option - Order - Description', 'vikinger'),
    'type'        => 'number',
    'section'     => 'vikinger_members',
    'settings'    => 'vikinger_members_setting_profile_timeline_page_order'
  ]);

  /**
   * Members Profile Friends Page Order
   */
  $wp_customize->add_setting('vikinger_members_setting_profile_friends_page_order', [
    'sanitize_callback' => 'absint',
    'default'           => 3
  ]);

  $wp_customize->add_control('vikinger_members_control_profile_friends_page_order', [
    'label'       => esc_html_x('Profile Friends Page - Order', '(Customizer) Profile Friends Page Option - Order - Title', 'vikinger'),
    'description' => esc_html_x('Choose the order in which the friends page is displayed in the profile navigation bar (lower numbered pages will display before higher numbered ones)', '(Customizer) Profile Friends Page Option - Order - Description', 'vikinger'),
    'type'        => 'number',
    'section'     => 'vikinger_members',
    'settings'    => 'vikinger_members_setting_profile_friends_page_order'
  ]);

  /**
   * Members Profile Groups Page Order
   */
  $wp_customize->add_setting('vikinger_members_setting_profile_groups_page_order', [
    'sanitize_callback' => 'absint',
    'default'           => 4
  ]);

  $wp_customize->add_control('vikinger_members_control_profile_groups_page_order', [
    'label'       => esc_html_x('Profile Groups Page - Order', '(Customizer) Profile Groups Page Option - Order - Title', 'vikinger'),
    'description' => esc_html_x('Choose the order in which the groups page is displayed in the profile navigation bar (lower numbered pages will display before higher numbered ones)', '(Customizer) Profile Groups Page Option - Order - Description', 'vikinger'),
    'type'        => 'number',
    'section'     => 'vikinger_members',
    'settings'    => 'vikinger_members_setting_profile_groups_page_order'
  ]);

  /**
   * Members Profile Posts Page Order
   */
  $wp_customize->add_setting('vikinger_members_setting_profile_posts_page_order', [
    'sanitize_callback' => 'absint',
    'default'           => 5
  ]);

  $wp_customize->add_control('vikinger_members_control_profile_posts_page_order', [
    'label'       => esc_html_x('Profile Posts Page - Order', '(Customizer) Profile Posts Page Option - Order - Title', 'vikinger'),
    'description' => esc_html_x('Choose the order in which the posts page is displayed in the profile navigation bar (lower numbered pages will display before higher numbered ones)', '(Customizer) Profile Posts Page Option - Order - Description', 'vikinger'),
    'type'        => 'number',
    'section'     => 'vikinger_members',
    'settings'    => 'vikinger_members_setting_profile_posts_page_order'
  ]);

  /**
   * Members Profile Forum Page Order
   */
  $wp_customize->add_setting('vikinger_members_setting_profile_forums_page_order', [
    'sanitize_callback' => 'absint',
    'default'           => 6
  ]);

  $wp_customize->add_control('vikinger_members_control_profile_forum_page_order', [
    'label'       => esc_html_x('Profile Forums Page - Order', '(Customizer) Profile Forums Page Option - Order - Title', 'vikinger'),
    'description' => esc_html_x('Choose the order in which the forum page is displayed in the profile navigation bar (lower numbered pages will display before higher numbered ones)', '(Customizer) Profile Forums Page Option - Order - Description', 'vikinger'),
    'type'        => 'number',
    'section'     => 'vikinger_members',
    'settings'    => 'vikinger_members_setting_profile_forums_page_order'
  ]);

  /**
   * Members Profile Photos Page Order
   */
  $wp_customize->add_setting('vikinger_members_setting_profile_photos_page_order', [
    'sanitize_callback' => 'absint',
    'default'           => 7
  ]);

  $wp_customize->add_control('vikinger_members_control_profile_photos_page_order', [
    'label'       => esc_html_x('Profile Photos Page - Order', '(Customizer) Profile Photos Page Option - Order - Title', 'vikinger'),
    'description' => esc_html_x('Choose the order in which the photos page is displayed in the profile navigation bar (lower numbered pages will display before higher numbered ones)', '(Customizer) Profile Photos Page Option - Order - Description', 'vikinger'),
    'type'        => 'number',
    'section'     => 'vikinger_members',
    'settings'    => 'vikinger_members_setting_profile_photos_page_order'
  ]);

  /**
   * Members Profile Videos Page Order
   */
  $wp_customize->add_setting('vikinger_members_setting_profile_videos_page_order', [
    'sanitize_callback' => 'absint',
    'default'           => 8
  ]);

  $wp_customize->add_control('vikinger_members_control_profile_videos_page_order', [
    'label'       => esc_html_x('Profile Videos Page - Order', '(Customizer) Profile Videos Page Option - Order - Title', 'vikinger'),
    'description' => esc_html_x('Choose the order in which the videos page is displayed in the profile navigation bar (lower numbered pages will display before higher numbered ones)', '(Customizer) Profile Videos Page Option - Order - Description', 'vikinger'),
    'type'        => 'number',
    'section'     => 'vikinger_members',
    'settings'    => 'vikinger_members_setting_profile_videos_page_order'
  ]);

  /**
   * Members Profile Credits Page Order
   */
  $wp_customize->add_setting('vikinger_members_setting_profile_credits_page_order', [
    'sanitize_callback' => 'absint',
    'default'           => 9
  ]);

  $wp_customize->add_control('vikinger_members_control_profile_credits_page_order', [
    'label'       => esc_html_x('Profile Credits Page - Order', '(Customizer) Profile Credits Page Option - Order - Title', 'vikinger'),
    'description' => esc_html_x('Choose the order in which the credits page is displayed in the profile navigation bar (lower numbered pages will display before higher numbered ones)', '(Customizer) Profile Credits Page Option - Order - Description', 'vikinger'),
    'type'        => 'number',
    'section'     => 'vikinger_members',
    'settings'    => 'vikinger_members_setting_profile_credits_page_order'
  ]);

  /**
   * Members Profile Badges Page Order
   */
  $wp_customize->add_setting('vikinger_members_setting_profile_badges_page_order', [
    'sanitize_callback' => 'absint',
    'default'           => 10
  ]);

  $wp_customize->add_control('vikinger_members_control_profile_badges_page_order', [
    'label'       => esc_html_x('Profile Badges Page - Order', '(Customizer) Profile Badges Page Option - Order - Title', 'vikinger'),
    'description' => esc_html_x('Choose the order in which the badges page is displayed in the profile navigation bar (lower numbered pages will display before higher numbered ones)', '(Customizer) Profile Badges Page Option - Order - Description', 'vikinger'),
    'type'        => 'number',
    'section'     => 'vikinger_members',
    'settings'    => 'vikinger_members_setting_profile_badges_page_order'
  ]);

  /**
   * Members Profile Quests Page Order
   */
  $wp_customize->add_setting('vikinger_members_setting_profile_quests_page_order', [
    'sanitize_callback' => 'absint',
    'default'           => 11
  ]);

  $wp_customize->add_control('vikinger_members_control_profile_quests_page_order', [
    'label'       => esc_html_x('Profile Quests Page - Order', '(Customizer) Profile Quests Page Option - Order - Title', 'vikinger'),
    'description' => esc_html_x('Choose the order in which the quests page is displayed in the profile navigation bar (lower numbered pages will display before higher numbered ones)', '(Customizer) Profile Quests Page Option - Order - Description', 'vikinger'),
    'type'        => 'number',
    'section'     => 'vikinger_members',
    'settings'    => 'vikinger_members_setting_profile_quests_page_order'
  ]);

  /**
   * Members Profile Ranks Page Order
   */
  $wp_customize->add_setting('vikinger_members_setting_profile_ranks_page_order', [
    'sanitize_callback' => 'absint',
    'default'           => 12
  ]);

  $wp_customize->add_control('vikinger_members_control_profile_ranks_page_order', [
    'label'       => esc_html_x('Profile Ranks Page - Order', '(Customizer) Profile Ranks Page Option - Order - Title', 'vikinger'),
    'description' => esc_html_x('Choose the order in which the ranks page is displayed in the profile navigation bar (lower numbered pages will display before higher numbered ones)', '(Customizer) Profile Ranks Page Option - Order - Description', 'vikinger'),
    'type'        => 'number',
    'section'     => 'vikinger_members',
    'settings'    => 'vikinger_members_setting_profile_ranks_page_order'
  ]);
}

add_action('customize_register', 'vikinger_customizer_members');