<?php
/**
 * Vikinger Template - BuddyPress Members Friends
 * 
 * Displays member friends
 * 
 * @package Vikinger
 * @since 1.0.0
 * @author Odin Design Themes (https://odindesignthemes.com/)
 * 
 */

  $member = get_query_var('member');

  /**
   * Section Header
   */
  get_template_part('template-part/section/section', 'header', [
    'section_pretitle'  => sprintf(
      esc_html_x('Browse %s', 'Section Header - Pretitle', 'vikinger'),
      $member['name']
    ),
    'section_title'     => esc_html__('Friends', 'vikinger'),
    'section_text'      => $member['stats']['friend_count']
  ]);

  $members_grid_type = vikinger_logged_user_grid_type_get('member');

?>
<!-- MEMBER FILTERABLE LIST -->
<div id="member-filterable-list" class="filterable-list" data-userid="<?php echo esc_attr($member['id']); ?>" data-grid-type="<?php echo esc_attr($members_grid_type); ?>"></div>
<!-- /MEMBER FILTERABLE LIST -->
