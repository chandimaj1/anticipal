<?php
/**
 * Vikinger Template - Tag
 * 
 * @package Vikinger
 * @since 1.0.0
 * @author Odin Design Themes (https://odindesignthemes.com/)
 * 
 */

  get_header();

  $tag = get_queried_object();

?>

  <!-- CONTENT GRID -->
  <div class="content-grid">
  <?php

    $page_header_status = get_theme_mod('vikinger_pageheader_setting_display', 'display');

    if ($page_header_status === 'display') {
      $blog_header_icon_id      = get_theme_mod('vikinger_pageheader_blog_setting_image', false);
      $blog_header_title        = get_theme_mod('vikinger_pageheader_blog_setting_title', esc_html_x('Blog Posts', 'Blog Page - Title', 'vikinger'));
      $blog_header_description  = get_theme_mod('vikinger_pageheader_blog_setting_description', esc_html_x('Read about news, announcements and more!', 'Blog Page - Description', 'vikinger'));

      if ($blog_header_icon_id) {
        $blog_header_icon_url = wp_get_attachment_image_src($blog_header_icon_id , 'full')[0];
      } else {
        $blog_header_icon_url = vikinger_customizer_blog_page_image_get_default();
      }

      /**
       * Section Banner
       */
      get_template_part('template-part/section/section', 'banner', [
        'section_icon_url'    => $blog_header_icon_url,
        'section_title'       => $blog_header_title,
        'section_description' => $blog_header_description
      ]);
    }

    /**
     * Section Header
     */
    get_template_part('template-part/section/section', 'header', [
      'section_pretitle'  => esc_html__('Search Results', 'vikinger'),
      'section_title'     => esc_html(_n('Tag:', 'Tags:', 1, 'vikinger')),
      'section_text'      => $tag->name
    ]);

    $posts_grid_type = vikinger_logged_user_grid_type_get('post');

  ?>

    <!-- POST PREVIEW FILTERABLE LIST -->
    <div id="post-preview-filterable-list" class="filterable-list" data-tag="<?php echo esc_attr($tag->term_id); ?>" data-grid-type="<?php echo esc_attr($posts_grid_type); ?>"></div>
    <!-- /POST PREVIEW FILTERABLE LIST -->
  </div>
  <!-- /CONTENT GRID -->

<?php get_footer(); ?>