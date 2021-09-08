<?php
/**
 * Vikinger WPLOGIN functions
 * 
 * @since 1.6.0
 */

/**
 * WordPress Login and Register
 */
function vikinger_wplogin_logo_styles() {
  $login_page_default_logo_id = get_theme_mod('vikinger_loginregister_setting_login_logo', false);

  if ($login_page_default_logo_id) {
    $login_page_default_logo_url = wp_get_attachment_image_src($login_page_default_logo_id , 'full')[0];
  } else {
    $login_page_default_logo_url = VIKINGER_URL . '/img/login/logo.png';
  }

?>
  <style type="text/css">
    #login h1 a, .login h1 a {
      background-image: url("<?php echo esc_url($login_page_default_logo_url); ?>");
      width: 100%;
      height: auto;
      background-size: auto;
      background-repeat: no-repeat;
      padding-bottom: 0;
      padding-top: 140px;
      margin-bottom: 0;
    }
  <?php
    $force_login = get_theme_mod('vikinger_loginregister_setting_forcelogin', 'disabled');

    if ($force_login === 'enabled') {
  ?>
      #backtoblog {
        display: none;
      }
  <?php
    }
  ?>
  </style>
<?php

  // get fonts
  $fonts = vikinger_customizer_theme_fonts_get_for_enqueue();

  // load fonts
  wp_enqueue_style('vikinger-wplogin-fonts', 'https://fonts.googleapis.com/css?family=' . $fonts['primary'] . ':400,500,600,700|' . $fonts['secondary'] . ':400,900&display=swap');

  // add custom stylesheets
  wp_enqueue_style('vikinger-wplogin-styles', get_template_directory_uri() . '/css/vklogin-style.css', [], '1.0.1');

  // get user custom theme fonts
  $custom_fonts = vikinger_customizer_theme_fonts_get_style();

  // add user custom theme fonts
  wp_add_inline_style('vikinger-wplogin-styles', $custom_fonts);

  // get user custom theme colors
  $custom_colors = vikinger_customizer_theme_colors_get();

  // add user custom theme colors
  wp_add_inline_style('vikinger-wplogin-styles', $custom_colors);

  // add custom scripts
  wp_enqueue_script('vikinger-vklogin-scripts', VIKINGER_URL . '/js/vklogin.bundle.min.js', [], '1.0.1', true);
}

add_action('login_enqueue_scripts', 'vikinger_wplogin_logo_styles');

/**
 * Set content on login page after the body tag
 */
function vikinger_wplogin_header() {
  $login_page_default_background_id = get_theme_mod('vikinger_loginregister_setting_login_background', false);

  if ($login_page_default_background_id) {
    $login_page_default_background_url = wp_get_attachment_image_src($login_page_default_background_id , 'full')[0];
  } else {
    $login_page_default_background_url = VIKINGER_URL . '/img/login/background.jpg';
  }

  $login_page_pretitle  = get_theme_mod('vikinger_loginregister_setting_login_pretitle', esc_html_x('Welcome to', 'Login Page - Pre Title', 'vikinger'));
  $login_page_title     = get_theme_mod('vikinger_loginregister_setting_login_title', esc_html_x('Vikinger', 'Login Page - Title', 'vikinger'));
  $login_page_text      = get_theme_mod('vikinger_loginregister_setting_login_text', sprintf(esc_html__('%sThe next generation WordPress+Buddypress social community!%s Connect with your friends with full profiles, reactions, groups, badges, quests, ranks, credits and %smuch more to come!%s', 'vikinger'), '<span class="bold">', '</span>', '<span class="bold">', '</span>'));

?>
  <div class="vklogin-header" style="background: url('<?php echo esc_url($login_page_default_background_url); ?>') center center / cover no-repeat">
  <?php if ($login_page_pretitle) : ?>
    <p class="vklogin-header-pretitle"><?php echo esc_html($login_page_pretitle); ?></p>
  <?php endif; ?>

  <?php if ($login_page_title) : ?>
    <p class="vklogin-header-title"><?php echo esc_html($login_page_title); ?></p>
  <?php endif; ?>

  <?php if ($login_page_text) : ?>
    <p class="vklogin-header-text"><?php echo wp_kses($login_page_text, ['span' => ['class' => []]]); ?></p>
  <?php endif; ?>
  </div>
<?php
}

add_filter('login_header', 'vikinger_wplogin_header');

/**
 * Set login page logo url
 */
function vikinger_wplogin_logo_url() {
  return '';
}

add_filter('login_headerurl', 'vikinger_wplogin_logo_url');

/**
 * Set login page logo title
 */
function vikinger_wplogin_logo_title() {
  return esc_html__('Account Login', 'vikinger');
}

add_filter('login_headertext', 'vikinger_wplogin_logo_title');

/**
 * Redirect users to homepage on login
 */
function vikinger_wplogin_redirect_login() {
  return vikinger_wplogin_redirect_page_url_get();
}

add_filter('login_redirect', 'vikinger_wplogin_redirect_login');

/**
 * Returns login redirect page url
 */
function vikinger_wplogin_redirect_page_url_get() {
  $redirect_page = get_theme_mod('vikinger_loginregister_setting_redirect', '');
  
  $redirect_page_url = ($redirect_page !== '') ? get_permalink((int) $redirect_page) : home_url('/');

  return $redirect_page_url;
}

/**
 * Checks if current page is redirect page
 */
function vikinger_wplogin_is_redirect_page() {
  $exception_pages = get_theme_mod('vikinger_loginregister_setting_exceptions', []);

  global $pagenow;
  
  $in_wp_login = $pagenow === 'wp-login.php';

  $do_redirect = !$in_wp_login && !is_page($exception_pages);

  return $do_redirect;
}

/**
 * Force users to login if they are not
 */
function vikinger_wplogin_force_login() {
  if (!is_user_logged_in()) {
    $do_redirect = vikinger_wplogin_is_redirect_page();

    if ($do_redirect) {
      wp_safe_redirect(wp_login_url());
      exit;
    }
  }
}

$force_login = get_theme_mod('vikinger_loginregister_setting_forcelogin', 'disabled');

if ($force_login === 'enabled') {
  add_action('wp', 'vikinger_wplogin_force_login');
}

?>