<?php
/**
 * Vikinger UTILS functions
 * 
 * @since 1.6.0
 */

/**
 * Remove WooCommerce default wrappers
 */
remove_action('woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10);
remove_action('woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10);

if (!function_exists('vikinger_woocommerce_wrapper_start')) {
  /**
   * Adds custom wrapper start for WooCommerce pages
   */
  function vikinger_woocommerce_wrapper_start() {
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
    
    $shop_sidebar_is_active = is_active_sidebar('shop');
    $shop_sidebar_active_class = $shop_sidebar_is_active ? 'vikinger-wc-content-with-sidebar' : '';

  ?>

    <!-- VIKINGER WC CONTENT -->
    <div class="vikinger-wc-content <?php echo esc_attr($shop_sidebar_active_class); ?>">
      <!-- VIKINGER WC BODY -->
      <div class="vikinger-wc-body">
  <?php
  }
}

add_action('woocommerce_before_main_content', 'vikinger_woocommerce_wrapper_start', 10);

if (!function_exists('vikinger_woocommerce_after_main_content')) {
  /**
   * Adds custom wrapper end for WooCommerce pages
   */
  function vikinger_woocommerce_after_main_content() {
  ?>
      </div>
      <!-- /VIKINGER WC BODY -->

      <!-- VIKINGER WC SIDEBAR -->
      <div class="vikinger-wc-sidebar">
  <?php
  }
}

add_action('woocommerce_after_main_content', 'vikinger_woocommerce_after_main_content', 10);

if (!function_exists('vikinger_woocommerce_wrapper_end')) {
  /**
   * Adds custom wrapper end for WooCommerce pages
   */
  function vikinger_woocommerce_wrapper_end() {
  ?>
      </div>
      <!-- VIKINGER WC SIDEBAR -->
    </div>
    <!-- VIKINGER WC CONTENT -->
  </div>
  <!-- /CONTENT GRID -->
  <?php
  }
}

add_action('woocommerce_sidebar', 'vikinger_woocommerce_wrapper_end', 10);

if (!function_exists('vikinger_woocommerce_before_shop_loop_item_title')) {
  /**
   * Adds custom loop product item wrapper before title
   */
  function vikinger_woocommerce_before_shop_loop_item_title() {
  ?>
  <!-- VIKINGER WC PRODUCT INFO -->
  <div class="vikinger-wc-product-info">
  <?php
  }
}

add_action('woocommerce_before_shop_loop_item_title', 'vikinger_woocommerce_before_shop_loop_item_title', 20);

if (!function_exists('vikinger_woocommerce_after_shop_loop_item_title_categories')) {
  /**
   * Adds custom loop product item categories
   */
  function vikinger_woocommerce_after_shop_loop_item_title_categories() {
    global $product;

    $product_categories_text = '';

		if ($product) {
      $category_ids = $product->get_category_ids();

      if (count($category_ids) > 0) {
        $product_categories_text = wc_get_product_category_list($product->get_id());
      }
    }

    if ($product_categories_text) :
  ?>
  <!-- VIKINGER WP CATEGORIES -->
  <p class="vikinger-wc-categories"><?php echo $product_categories_text; ?></p>
  <!-- /VIKINGER WP CATEGORIES -->
  <?php
    endif;
  }
}

add_action('woocommerce_after_shop_loop_item_title', 'vikinger_woocommerce_after_shop_loop_item_title_categories', 2);

if (!function_exists('vikinger_woocommerce_after_shop_loop_item_title')) {
  /**
   * Adds custom loop product item wrapper after title
   */
  function vikinger_woocommerce_after_shop_loop_item_title() {
  ?>
  </div>
  <!-- /VIKINGER WC PRODUCT INFO -->
  <?php
  }
}

add_action('woocommerce_after_shop_loop_item_title', 'vikinger_woocommerce_after_shop_loop_item_title', 20);

if (!function_exists('vikinger_woocommerce_breadcrumb_defaults_filter')) {
  /**
   * Adds custom breadcrumb default options
   */
  function vikinger_woocommerce_breadcrumb_defaults_filter($args) {
    $args['delimiter'] = '<span class="woocommerce-breadcrumb-separator">&#124;</span>';
  
    return $args;
  }
}

add_filter('woocommerce_breadcrumb_defaults', 'vikinger_woocommerce_breadcrumb_defaults_filter');

if (!function_exists('vikinger_woocommerce_product_loop_item_before_buttons')) {
  function vikinger_woocommerce_product_loop_item_before_buttons() {
  ?>
  <!-- VIKINGER WOOCOMMERCE PRODUCT ACTIONS -->
  <div class="vikinger-woocommerce-product-actions">
  <?php
  }
}

add_action('woocommerce_after_shop_loop_item', 'vikinger_woocommerce_product_loop_item_before_buttons', 9);

if (!function_exists('vikinger_woocommerce_product_loop_item_after_buttons')) {
  function vikinger_woocommerce_product_loop_item_after_buttons() {
  ?>
  </div>
  <!-- /VIKINGER WOOCOMMERCE PRODUCT ACTIONS -->
  <?php
  }
}

add_action('woocommerce_after_shop_loop_item', 'vikinger_woocommerce_product_loop_item_after_buttons', 11);

if (!function_exists('vikinger_woocommerce_single_product_summary_categories')) {
  function vikinger_woocommerce_single_product_summary_categories() {
    global $product;

    $product_categories_text = '';

		if ($product) {
      $category_ids = $product->get_category_ids();

      if (count($category_ids) > 0) {
        $product_categories_text = wc_get_product_category_list($product->get_id());
      }
    }

    if ($product_categories_text) :
    ?>
    <!-- VIKINGER WP CATEGORIES -->
    <p class="vikinger-wc-categories"><?php echo $product_categories_text; ?></p>
    <!-- /VIKINGER WP CATEGORIES -->
    <?php
    endif;
  }
}

add_action('woocommerce_single_product_summary', 'vikinger_woocommerce_single_product_summary_categories', 9);

if (!function_exists('vikinger_woocommerce_dropdown_variation_attribute_options_html')) {
  /**
   * Adds SVG icon and wrapper to single product variation dropdowns
   */
  function vikinger_woocommerce_dropdown_variation_attribute_options_html($html, $args) {
    ob_start();

    /**
     * Icon SVG
     */
    get_template_part('template-part/icon/icon', 'svg', [
      'icon'      => 'small-arrow',
      'modifiers' => 'form-select-icon'
    ]);

    $dropdownSVGIcon = ob_get_clean();

    $html = '<div class="form-select">' . $html . $dropdownSVGIcon . '</div>';

    return $html;
  }
}

add_filter('woocommerce_dropdown_variation_attribute_options_html', 'vikinger_woocommerce_dropdown_variation_attribute_options_html', 10, 2);

if (!function_exists('vikinger_woocommerce_quantity_input_classes')) {
  /**
   * Adds form counter input classes to quantity inputs
   */
  function vikinger_woocommerce_quantity_input_classes($classes, $product) {
    $classes[] = 'vk-form-counter-input';

    return $classes;
  }
}

add_filter('woocommerce_quantity_input_classes', 'vikinger_woocommerce_quantity_input_classes', 10, 2);

// remove default gravatar from review comment
remove_action('woocommerce_review_before', 'woocommerce_review_display_gravatar');

if (!function_exists('vikinger_woocommerce_review_before_avatar')) {
  /**
   * Adds custom avatar to review comments
   */
  function vikinger_woocommerce_review_before_avatar($comment) {
    $review_author = vikinger_members_get_fallback((int) $comment->user_id);

    /**
     * Avatar Small
     */
    get_template_part('template-part/avatar/avatar', 'small', [
      'user'      => $review_author,
      'modifiers' => 'comment-review-avatar',
      'linked'    => true,
      'no_border' => true
    ]);
  }
}

add_action('woocommerce_review_before', 'vikinger_woocommerce_review_before_avatar', 10, 1);

if (!function_exists('vikinger_woocommerce_account_menu_items_filter')) {
  /**
   * Removes Dashboard and Logout options if BuddyPress plugin is active
   */
  function vikinger_woocommerce_account_menu_items_filter($items, $endpoints) {
    if (vikinger_plugin_buddypress_is_active()) {
      unset($items['customer-logout']);
    }
  
    return $items;
  }
}

add_filter('woocommerce_account_menu_items', 'vikinger_woocommerce_account_menu_items_filter', 10, 2);

if (!function_exists('vikinger_woocommerce_account_content_before')) {
  /**
   * Adds section header before the content in the account pages
   */
  function vikinger_woocommerce_account_content_before() {

    $section_pretitle = get_the_title();

    global $wp;

    foreach ( $wp->query_vars as $key => $value ) {
      // Ignore pagename param.
      if ( 'pagename' === $key ) {
        continue;
      }

      $wc_endpoint = $key;

      // root myaccount page
      if ($key === 'page') {
        $wc_endpoint = 'dashboard';
      }
    }

    $section_title = false;

    $wc_myaccount_menu_items = wc_get_account_menu_items();

    if (array_key_exists($wc_endpoint, $wc_myaccount_menu_items)) {
      $section_title = $wc_myaccount_menu_items[$wc_endpoint];
    }

    if ($section_title) {
      /**
       * Section Header
       */
      get_template_part('template-part/section/section', 'header', [
        'section_pretitle'  => $section_pretitle,
        'section_title'     => $section_title
      ]);
    }
  }
}

add_action('woocommerce_account_content', 'vikinger_woocommerce_account_content_before', 5);

// remove mini cart "view cart" button
remove_action('woocommerce_widget_shopping_cart_buttons', 'woocommerce_widget_shopping_cart_button_view_cart');

// remove mini cart "checkout" button
remove_action('woocommerce_widget_shopping_cart_buttons', 'woocommerce_widget_shopping_cart_proceed_to_checkout', 20);

// remove mini cart sub total
remove_action('woocommerce_widget_shopping_cart_total', 'woocommerce_widget_shopping_cart_subtotal');

if (!function_exists('vikinger_woocommerce_minicart_fragments')) {
  /**
   * Handle mini cart AJAX updates
   */
  function vikinger_woocommerce_minicart_fragments($fragments) {
    global $woocommerce;

    $cart_item_count = $woocommerce->cart->get_cart_contents_count();
    $cart_item_count_classes = $cart_item_count > 0 ? 'unread' : '';

    ob_start();

    ?>
    <div class="action-list-item-icon-wrap vikinger-wc-cart-icon-wrap <?php echo esc_attr($cart_item_count_classes); ?>">
    <?php

      /**
       * Icon SVG
       */
      get_template_part('template-part/icon/icon', 'svg', [
        'icon'      => 'shopping-bag',
        'modifiers' => 'action-list-item-icon'
      ]);

    ?>
    </div>
    <?php

    $fragments['div.vikinger-wc-cart-icon-wrap'] = ob_get_clean();

    ob_start();

    ?>
    <div class="dropdown-box-header vikinger-wc-cart-header-title">
      <p class="dropdown-box-header-title"><?php esc_html_e('Shopping Cart', 'vikinger'); ?> <span class="highlighted"><?php echo esc_html($cart_item_count); ?></span></p>
    </div>
    <?php

    $fragments['div.vikinger-wc-cart-header-title'] = ob_get_clean();

    ob_start();

    ?>
    <div class="dropdown-box-list scroll-small vikinger-wc-minicart" data-simplebar>
    <?php woocommerce_mini_cart(); ?>
    </div>
    <?php

    $fragments['div.vikinger-wc-minicart'] = ob_get_clean();

    ob_start();

    ?>
    <div class="cart-preview-total vikinger-wc-cart-preview-total">
      <p class="cart-preview-total-title"><?php esc_html_e('Total:', 'vikinger'); ?></p>
      <p class="cart-preview-total-text"><?php echo $woocommerce->cart->get_cart_total(); ?></p>
    </div>
    <?php

    $fragments['div.vikinger-wc-cart-preview-total'] = ob_get_clean();
      
    return $fragments;
  }
}

add_filter('woocommerce_add_to_cart_fragments', 'vikinger_woocommerce_minicart_fragments');