<?php
/**
 * Listeners
 *
 * @package GamiPress\Referrals\Listeners
 * @since 1.0.0
 */
// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Referral visit listener
 *
 * @since 1.0.0
 */
function gamipress_referrals_visit_listener() {

    $url_parameter = gamipress_referrals_get_option( 'url_parameter', 'ref' );

    // Return if referral parameter not given or empty
    if( ! isset( $_GET[ $url_parameter ] ) ) return;
    if( empty( $_GET[ $url_parameter ] ) ) return;

    // Return if already tracked
    if( isset( $_COOKIE[ 'gamipress_referrals_ref' ] ) ) return;

    $affiliate = gamipress_referrals_get_affiliate( $_GET[ $url_parameter ] );

    // Return if affiliate not found
    if( ! $affiliate ) return;

    // Return if affiliate is trying to refer himself
    if( is_user_logged_in() && get_current_user_id() === $affiliate->ID ) return;

    // Setup vars
    $affiliate_id   = $affiliate->ID;
    $referral_id    = get_current_user_id();
    $referral_ip    = gamipress_referrals_get_ip();
    $post_id        = get_the_ID();
    $post_url       = gamipress_referrals_get_current_page_url();
    $referrer       = ! empty( $_SERVER['HTTP_REFERER'] ) ? sanitize_text_field( $_SERVER['HTTP_REFERER'] ) : '';

    /**
     * Filter to skip a referral visit
     *
     * @since 1.0.0
     *
     * @param bool      $skip           Whatever if visit has been skipped or not
     * @param int       $affiliate_id   Affiliate ID
     * @param int       $referral_id    Referral ID
     * @param string    $referral_ip    Referral IP address
     * @param int       $post_id        Post ID
     * @param string    $post_url       Post URL
     * @param string    $referrer       Referrer
     * @param WP_User   $affiliate      Affiliate object
     *
     * @return bool
     */
    if ( true === apply_filters( 'gamipress_referrals_skip_visit', false, $affiliate_id, $referral_id, $referral_ip, $post_id, $post_url, $referrer, $affiliate ) ) {
        // Return if visit skipped
        return;
    }

    // Log the referral visit
    gamipress_referrals_log_visit( $affiliate_id, $referral_id, $referral_ip, $post_id, $post_url, $referrer );

    // Trigger referral visit
    do_action( 'gamipress_referrals_referral_visit', $affiliate_id, $referral_id, $referral_ip, $post_id, $post_url, $referrer, $affiliate );

    // Trigger specific referral visit
    do_action( 'gamipress_referrals_specific_referral_visit', $affiliate_id, $referral_id, $referral_ip, $post_id, $post_url, $referrer, $affiliate );

    // Set cookie to avoid duplications
    if ( ! headers_sent() ) {

        /**
         * Filter to cookie life time
         *
         * @since 1.0.0
         *
         * @param int       $lifetime       Lifetime timestamp, by default 1 day
         * @param int       $affiliate_id   Affiliate ID
         * @param int       $referral_id    Referral ID
         * @param WP_User   $affiliate      Affiliate object
         *
         * @return int
         */
        $cookie_lifetime = apply_filters( 'gamipress_referrals_cookie_lifetime', ( time() + 3600 * 24 ), $affiliate_id, $referral_id, $affiliate );

        setcookie( 'gamipress_referrals_ref', $_GET[ $url_parameter ], $cookie_lifetime, COOKIEPATH, COOKIE_DOMAIN );

    }

    // Redirect removing the query parameter
    wp_redirect( remove_query_arg( $url_parameter ), 301 );
    exit;

}
add_action( 'template_redirect', 'gamipress_referrals_visit_listener', -9999 );

/**
 * Referral sign up listener
 *
 * @since 1.0.0
 *
 * @param int $user_id New registered user ID.
 */
function gamipress_referrals_signup_listener( $user_id ) {

    // Check referral cookies
    $referral = false;

    if ( isset( $_COOKIE['gamipress_referrals_ref'] ) ) {
        $referral = $_COOKIE['gamipress_referrals_ref'];
    }

    // Return if user hasn't been referred
    if ( $referral === false ) return;

    $affiliate = gamipress_referrals_get_affiliate( $referral );

    // Return if affiliate not found
    if( ! $affiliate ) return;

    // Delete the cookie by setting an expired lifetime time
    if ( ! headers_sent() ) {
        setcookie( 'gamipress_referrals_ref', $referral, time() - 3600, COOKIEPATH, COOKIE_DOMAIN );
    }

    // Setup vars
    $affiliate_id   = $affiliate->ID;
    $referral_id    = $user_id;
    $referral_ip    = gamipress_referrals_get_ip();

    /**
     * Filter to skip a referral sign up
     *
     * @since 1.0.0
     *
     * @param bool      $skip           Whatever if sign up has been skipped or not
     * @param int       $affiliate_id   Affiliate ID
     * @param int       $referral_id    Referral ID
     * @param string    $referral_ip    Referral IP address
     * @param WP_User   $affiliate      Affiliate object
     *
     * @return bool
     */
    if ( true === apply_filters( 'gamipress_referrals_skip_signup', false, $affiliate_id, $referral_id, $referral_ip, $affiliate ) ) {
        // Return if visit skipped
        return;
    }

    // Log the referral sign up
    gamipress_referrals_log_signup( $affiliate_id, $referral_id, $referral_ip );

    // Trigger referral sign up
    do_action( 'gamipress_referrals_referral_signup', $affiliate_id, $referral_id, $referral_ip, $affiliate );

    // Trigger register to website through a referral
    do_action( 'gamipress_referrals_register', $affiliate_id, $referral_id, $referral_ip, $affiliate );


}
add_action( 'user_register', 'gamipress_referrals_signup_listener' );