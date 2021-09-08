<?php
/**
 * Functions
 *
 * @package GamiPress\Referrals\Functions
 * @since 1.0.0
 */
// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Return the WP_User object of the given affiliate ID
 *
 * @since 1.0.0
 *
 * @param WP_User|string|int    $affiliate_id
 *
 * @return WP_User|false
 */
function gamipress_referrals_get_affiliate( $affiliate_id ) {

    $affiliate = false;

    if( $affiliate_id instanceof WP_User )
        return $affiliate_id;

    if( ! empty( $affiliate_id ) ) {

        if( is_numeric( $affiliate_id ) ) {
            // Get user by ID
            $affiliate = get_userdata( absint( $affiliate_id ) );
        } else {
            // Get user by login field
            $affiliate = get_user_by( 'login', sanitize_text_field( urldecode( $affiliate_id ) ) );
        }

    }


    /**
     * Available filter to override this
     *
     * @param WP_User|false         $affiliate
     * @param WP_User|string|int    $affiliate_id
     *
     * @return WP_User|false
     */
    return apply_filters( 'gamipress_referrals_get_affiliate', $affiliate, $affiliate_id );

}

/**
 * Return the referral ID of the given affiliate ID
 *
 * @since 1.0.0
 *
 * @param WP_User|string|int    $affiliate_id
 *
 * @return mixed
 */
function gamipress_referrals_get_affiliate_referral_id( $affiliate_id ) {

    $referral_id = '';
    $affiliate = gamipress_referrals_get_affiliate( $affiliate_id );

    if( $affiliate ) {

        // If affiliate id given is not the affiliate ID, set it now for next filters
        $affiliate_id = $affiliate->ID;

        // Get the affiliate links setting
        $affiliate_links = gamipress_referrals_get_option( 'affiliate_links', 'user_id' );

        if( $affiliate_links === 'user_id' )
            $referral_id = $affiliate->ID;
        else if( $affiliate_links === 'user_login' )
            $referral_id = $affiliate->user_login;

    }

    return apply_filters( 'gamipress_referrals_get_affiliate_referral_id', $referral_id, $affiliate_id, $affiliate );

}

/**
 * Return the IP address of the current visitor
 *
 * @since 1.0.0
 *
 * @return string $ip User's IP address
 */
function gamipress_referrals_get_ip() {

    $ip = '127.0.0.1';

    if ( ! empty( $_SERVER['HTTP_CLIENT_IP'] ) ) {
        //Check ip from share internet
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif ( ! empty( $_SERVER['HTTP_X_FORWARDED_FOR'] ) ) {
        // Check ip is pass from proxy, can include more than 1 ip, first is the public one
        $ip = explode(',',$_SERVER['HTTP_X_FORWARDED_FOR']);
        $ip = trim($ip[0]);
    } elseif( ! empty( $_SERVER['REMOTE_ADDR'] ) ) {
        $ip = $_SERVER['REMOTE_ADDR'];
    }

    // Fix potential CSV returned from $_SERVER variables
    $ip_array = explode( ',', $ip );
    $ip_array = array_map( 'trim', $ip_array );

    return apply_filters( 'gamipress_referrals_get_ip', $ip_array[0] );

}

/**
 * Get the current page URL
 *
 * @since  1.0.0
 *
 * @global $post
 *
 * @return string $page_url Current page URL
 */
function gamipress_referrals_get_current_page_url() {

    if ( is_front_page() ) {
        $page_url = home_url();
    } else {
        $protocol =  ( isset( $_SERVER['HTTPS'] ) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http' );

        $page_url = set_url_scheme( $protocol . '://' . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'] );
    }

    return apply_filters( 'gamipress_referrals_get_current_page_url', $page_url );

}