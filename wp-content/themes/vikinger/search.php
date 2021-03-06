<?php
/**
 * Vikinger Template - Search
 * 
 * @package Vikinger
 * @since 1.0.0
 * @author Odin Design Themes (https://odindesignthemes.com/)
 * 
 */

  get_header();

  $search_query = get_search_query();

?>

<!-- CONTENT GRID -->
<div class="content-grid">
<?php

  $page_header_status = get_theme_mod('vikinger_pageheader_setting_display', 'display');

  if ($page_header_status === 'display') {
    $search_header_icon_id      = get_theme_mod('vikinger_pageheader_search_setting_image', false);
    $search_header_description  = get_theme_mod('vikinger_pageheader_search_setting_description', esc_html_x('Browse your search results', 'Search Page - Description', 'vikinger'));

    if ($search_header_icon_id) {
      $search_header_icon_url = wp_get_attachment_image_src($search_header_icon_id , 'full')[0];
    } else {
      $search_header_icon_url = vikinger_customizer_search_page_image_get_default();
    }

    /**
     * Section Banner
     */
    get_template_part('template-part/section/section', 'banner', [
      'section_icon_url'    => $search_header_icon_url,
      'section_title'       => esc_html_x('Search Results', 'Search Page - Title', 'vikinger') . ': "' . $search_query . '"',
      'section_description' => $search_header_description
    ]);
  }

  global $vikinger_settings;

  // add BuddyPress member search data if BuddyPress is active
  if (vikinger_plugin_buddypress_is_active() && $vikinger_settings['search_members_enabled']) :
    /**
     * Section Header
     */
    get_template_part('template-part/section/section', 'header', [
      'section_pretitle'  => esc_html__('Browse', 'vikinger'),
      'section_title'     => esc_html__('Members', 'vikinger')
    ]);

    $members_grid_type = vikinger_logged_user_grid_type_get('member');

?>
  <!-- MEMBER FILTERABLE LIST -->
  <div id="member-filterable-list" class="filterable-list" data-searchterm="<?php echo esc_attr($search_query); ?>" data-grid-type="<?php echo esc_attr($members_grid_type); ?>"></div>
  <!-- /MEMBER FILTERABLE LIST -->
<?php

  endif;

  // add BuddyPress group search data if BuddyPress and the groups component are active
  if (vikinger_plugin_buddypress_is_active() && bp_is_active('groups')  && $vikinger_settings['search_groups_enabled']) :
    /**
     * Section Header
     */
    get_template_part('template-part/section/section', 'header', [
      'section_pretitle'  => esc_html__('Browse', 'vikinger'),
      'section_title'     => esc_html__('Groups', 'vikinger')
    ]);

    $groups_grid_type = vikinger_logged_user_grid_type_get('group');

?>
  <!-- GROUP FILTERABLE LIST -->
  <div id="group-filterable-list" class="filterable-list" data-searchterm="<?php echo esc_attr($search_query); ?>" data-grid-type="<?php echo esc_attr($groups_grid_type); ?>"></div>
  <!-- /GROUP FILTERABLE LIST -->
<?php

  endif;

  if ($vikinger_settings['search_blog_enabled']) :

    /**
     * Section Header
     */
    get_template_part('template-part/section/section', 'header', [
      'section_pretitle'  => esc_html__('Browse', 'vikinger'),
      'section_title'     => esc_html__('Posts', 'vikinger')
    ]);

    $posts_grid_type = vikinger_logged_user_grid_type_get('post');

?>
  <!-- POST PREVIEW FILTERABLE LIST -->
  <div id="post-preview-filterable-list" class="filterable-list" data-searchterm="<?php echo esc_attr($search_query); ?>" data-grid-type="<?php echo esc_attr($posts_grid_type); ?>"></div>
  <!-- /POST PREVIEW FILTERABLE LIST -->
<?php

  endif;
  
?>
</div>
<!-- /CONTENT GRID -->

<?php get_footer(); ?>