<?php
/**
 * Vikinger Template Part - WooCommerce Page
 * 
 * @package Vikinger
 * @since 1.6.0
 * @author Odin Design Themes (https://odindesignthemes.com/)
 * 
 */

?>

<!-- CONTENT GRID -->
<div class="content-grid">
<?php

  $page_header_status = get_theme_mod('vikinger_pageheader_setting_display', 'display');

  if ($page_header_status === 'display') {
    $woocommerce_header_icon_id      = get_theme_mod('vikinger_pageheader_woocommerce_setting_image', false);
    $woocommerce_header_title        = get_theme_mod('vikinger_pageheader_woocommerce_setting_title', esc_html_x('Vikinger Shop', 'WooCommerce Page - Title', 'vikinger'));
    $woocommerce_header_description  = get_theme_mod('vikinger_pageheader_woocommerce_setting_description', esc_html_x('Merchandise, clothing, coffee mugs and more!', 'WooCommerce Page - Description', 'vikinger'));

    if ($woocommerce_header_icon_id) {
      $woocommerce_header_icon_url = wp_get_attachment_image_src($woocommerce_header_icon_id , 'full')[0];
    } else {
      $woocommerce_header_icon_url = vikinger_customizer_woocommerce_page_image_get_default();
    }

    /**
     * Section Banner
     */
    get_template_part('template-part/section/section', 'banner', [
      'section_icon_url'    => $woocommerce_header_icon_url,
      'section_title'       => $woocommerce_header_title,
      'section_description' => $woocommerce_header_description
    ]);
  }

?>

  <h2 class="vikinger-woocommerce-page-title"><?php the_title(); ?></h2>

  <?php the_content(); ?>
</div>
<!-- /CONTENT GRID -->