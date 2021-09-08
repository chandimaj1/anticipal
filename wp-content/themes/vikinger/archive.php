<?php
/**
 * Vikinger Template - Archive
 * 
 * @package Vikinger
 * @since 1.0.0
 * @author Odin Design Themes (https://odindesignthemes.com/)
 * 
 */

  get_header();

  $year   = get_query_var('year');
  $month  = get_query_var('monthnum');
  $day    = get_query_var('day');

?>

<!-- CONTENT GRID -->
<div class="content-grid">
<?php

  $page_header_status = get_theme_mod('vikinger_pageheader_setting_display', 'display');

  if ($page_header_status === 'display') {
    $archive_header_icon_id      = get_theme_mod('vikinger_pageheader_archive_setting_image', false);
    $archive_header_title        = get_theme_mod('vikinger_pageheader_archive_setting_title', esc_html_x('Archive', 'Archive Page - Title', 'vikinger'));
    $archive_header_description  = get_theme_mod('vikinger_pageheader_archive_setting_description', esc_html_x('Check what was happening in the past!', 'Archive Page - Description', 'vikinger'));

    if ($archive_header_icon_id) {
      $archive_header_icon_url = wp_get_attachment_image_src($archive_header_icon_id , 'full')[0];
    } else {
      $archive_header_icon_url = vikinger_customizer_archive_page_image_get_default();
    }

    /**
     * Section Banner
     */
    get_template_part('template-part/section/section', 'banner', [
      'section_icon_url'    => $archive_header_icon_url,
      'section_title'       => $archive_header_title,
      'section_description' => $archive_header_description
    ]);
  }

?>

  <!-- POST PREVIEW FILTERABLE LIST -->
  <div  id="post-preview-filterable-list"
        class="filterable-list"
        data-year="<?php echo esc_attr($year); ?>"
        data-month="<?php echo esc_attr($month); ?>"
        data-day="<?php echo esc_attr($day); ?>"
  >
  </div>
  <!-- /POST PREVIEW FILTERABLE LIST -->
</div>
<!-- /CONTENT GRID -->

<?php get_footer(); ?>