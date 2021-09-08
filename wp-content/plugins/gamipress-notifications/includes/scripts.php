<?php
/**
 * Scripts
 *
 * @package     GamiPress\Notifications\Scripts
 * @since       1.0.0
 */
// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Register frontend scripts
 *
 * @since       1.0.0
 * @return      void
 */
function gamipress_notifications_register_scripts() {

    // Use minified libraries if SCRIPT_DEBUG is turned off
    $suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

    // Libraries
    wp_register_script( 'gamipress-notifications-notify-js', GAMIPRESS_NOTIFICATIONS_URL . 'assets/libs/notify/notify' . $suffix . '.js', array( 'jquery' ), GAMIPRESS_NOTIFICATIONS_VER, true );

    // Stylesheets
    wp_register_style( 'gamipress-notifications-css', GAMIPRESS_NOTIFICATIONS_URL . 'assets/css/gamipress-notifications' . $suffix . '.css', array( ), GAMIPRESS_NOTIFICATIONS_VER, 'all' );

    // Scripts
    wp_register_script( 'gamipress-notifications-js', GAMIPRESS_NOTIFICATIONS_URL . 'assets/js/gamipress-notifications' . $suffix . '.js', array( 'jquery', 'gamipress-notifications-notify-js' ), GAMIPRESS_NOTIFICATIONS_VER, true );

}
add_action( 'init', 'gamipress_notifications_register_scripts' );

/**
 * Enqueue frontend scripts
 *
 * @since       1.0.0
 * @return      void
 */
function gamipress_notifications_enqueue_scripts( $hook = null ) {

    $current_user = get_current_user_id();

    // Notifications for guests are not supported
    if( $current_user !== 0 ) {

        $delay = absint( gamipress_notifications_get_option( 'delay', 10000 ) );
        $last_check_delay = 5000;

        if( $delay > 0 ) {
            $last_check_delay = $delay/2;
        }

        // Localize scripts
        wp_localize_script( 'gamipress-notifications-js', 'gamipress_notifications', array(
            'ajaxurl'               => esc_url( admin_url( 'admin-ajax.php', 'relative' ) ),
            'nonce'                 => wp_create_nonce( 'gamipress_notifications' ),
            'position'              => gamipress_notifications_get_option( 'position', 'bottom right' ),
            'disable_live_checks'   => (bool) gamipress_notifications_get_option( 'disable_live_checks', false ),
            'delay'                 => $delay,
            'attempts_to_cancel'    => gamipress_notifications_get_option( 'attempts_to_cancel', 5 ),
            'last_check_delay'      => $last_check_delay,
            'click_to_hide'         => (bool) gamipress_notifications_get_option( 'click_to_hide', false ),
            'auto_hide'             => (bool) gamipress_notifications_get_option( 'auto_hide', false ),
            'auto_hide_delay'       => gamipress_notifications_get_option( 'auto_hide_delay', 5000 ),
        ) );

        // Enqueue assets
        wp_enqueue_style( 'gamipress-notifications-css' );
        wp_enqueue_script( 'gamipress-notifications-js' );

        // Setup dynamic CSS rules
        $css = '';

        $width              = gamipress_notifications_get_option( 'width', '' );
        $background_color   = gamipress_notifications_get_option( 'background_color', '' );
        $title_color        = gamipress_notifications_get_option( 'title_color', '' );
        $text_color         = gamipress_notifications_get_option( 'text_color', '' );
        $link_color         = gamipress_notifications_get_option( 'link_color', '' );

        if( ! empty( $width ) )
            $css .= ".gamipress-notification { width: {$width}px; }";

        if( ! empty( $background_color ) )
            $css .= ".gamipress-notification { background-color: {$background_color}; }";

        if( ! empty( $text_color ) )
            $css .= ".gamipress-notification { color: {$text_color}; }";

        if( ! empty( $title_color ) )
            $css .= ".gamipress-notification .gamipress-notification-title { color: {$title_color}; }";

        if( ! empty( $link_color ) )
            $css .= ".gamipress-notification a { color: {$link_color}; }";

        /**
         * Filters notifications dynamic CSS generated from settings
         *
         * @since 1.0.4
         *
         * @param string $css
         *
         * @return string
         */
        $css = apply_filters( 'gamipress_notifications_dynamic_css', $css );

        if( ! empty( $css ) )
            wp_add_inline_style( 'gamipress-notifications-css', esc_html( $css ) );

    }

}
add_action( 'wp_enqueue_scripts', 'gamipress_notifications_enqueue_scripts', 100 );

/**
 * Register admin scripts
 *
 * @since       1.0.0
 * @return      void
 */
function gamipress_notifications_admin_register_scripts() {

    // Use minified libraries if SCRIPT_DEBUG is turned off
    $suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

    // Stylesheets
    wp_register_style( 'gamipress-notifications-admin-css', GAMIPRESS_NOTIFICATIONS_URL . 'assets/css/gamipress-notifications-admin' . $suffix . '.css', array( ), GAMIPRESS_NOTIFICATIONS_VER, 'all' );

    // Scripts
    wp_register_script( 'gamipress-notifications-admin-js', GAMIPRESS_NOTIFICATIONS_URL . 'assets/js/gamipress-notifications-admin' . $suffix . '.js', array( 'jquery' ), GAMIPRESS_NOTIFICATIONS_VER, true );

}
add_action( 'admin_init', 'gamipress_notifications_admin_register_scripts' );

/**
 * Enqueue admin scripts
 *
 * @since       1.0.0
 * @return      void
 */
function gamipress_notifications_admin_enqueue_scripts( $hook ) {

    //Stylesheets
    wp_enqueue_style( 'gamipress-notifications-admin-css' );

    //Scripts
    wp_enqueue_script( 'gamipress-notifications-admin-js' );

}
add_action( 'admin_enqueue_scripts', 'gamipress_notifications_admin_enqueue_scripts', 100 );