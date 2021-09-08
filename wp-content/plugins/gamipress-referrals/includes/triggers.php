<?php
/**
 * Triggers
 *
 * @package GamiPress\Referrals\Triggers
 * @since 1.0.0
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Register activity triggers
 *
 * @since  1.0.0
 *
 * @param array $triggers
 * @return mixed
 */
function gamipress_referrals_activity_triggers( $triggers ) {

    $triggers[__( 'Referrals', 'gamipress-referrals' )] = array(
        'gamipress_referrals_referral_visit'            => __( 'Referral visit', 'gamipress-referrals' ),
        'gamipress_referrals_specific_referral_visit'   => __( 'Specific referral visit', 'gamipress-referrals' ),
        'gamipress_referrals_referral_signup'           => __( 'Referral sign up', 'gamipress-referrals' ),
        'gamipress_referrals_register'                  => __( 'Register to website through a referral', 'gamipress-referrals' ),
    );

    return $triggers;

}
add_filter( 'gamipress_activity_triggers', 'gamipress_referrals_activity_triggers' );

/**
 * Register specific activity triggers
 *
 * @since  1.0.2
 *
 * @param  array $specific_activity_triggers
 * @return array
 */
function gamipress_referrals_specific_activity_triggers( $specific_activity_triggers ) {

    // Get all public post types which means they are visitable
    $public_post_types = get_post_types( array( 'public' => true ) );

    // Remove attachment from public post types
    if( isset( $public_post_types['attachment'] ) ) {
        unset( $public_post_types['attachment'] );
    }

    /**
     * Filter specific referral visit post types
     *
     * @since 1.0.2
     *
     * @param array $public_post_types
     * @return array
     */
    $public_post_types = apply_filters( 'gamipress_referrals_specific_referral_visit_post_types', $public_post_types );

    // Remove keys
    $public_post_types = array_values( $public_post_types );

    $specific_activity_triggers['gamipress_referrals_specific_referral_visit'] = $public_post_types;

    return $specific_activity_triggers;
}
add_filter( 'gamipress_specific_activity_triggers', 'gamipress_referrals_specific_activity_triggers' );

/**
 * Register specific activity triggers labels
 *
 * @since  1.0.2
 *
 * @param  array $specific_activity_trigger_labels
 * @return array
 */
function gamipress_referrals_specific_activity_trigger_label( $specific_activity_trigger_labels ) {

    $specific_activity_trigger_labels['gamipress_referrals_specific_referral_visit'] = __( 'Referral visit on %s', 'gamipress-referrals' );

    return $specific_activity_trigger_labels;
}
add_filter( 'gamipress_specific_activity_trigger_label', 'gamipress_referrals_specific_activity_trigger_label' );

/**
 * Get user for a given trigger action.
 *
 * @since  1.0.0
 *
 * @param  integer $user_id user ID to override.
 * @param  string  $trigger Trigger name.
 * @param  array   $args    Passed trigger args.
 * @return integer          User ID.
 */
function gamipress_referrals_trigger_get_user_id( $user_id, $trigger, $args ) {

    switch ( $trigger ) {
        case 'gamipress_referrals_referral_visit':
        case 'gamipress_referrals_specific_referral_visit':
        case 'gamipress_referrals_referral_signup':
            $user_id = $args[0];
            break;
        case 'gamipress_referrals_register':
            $user_id = $args[1];
            break;
    }

    return $user_id;

}
add_filter( 'gamipress_trigger_get_user_id', 'gamipress_referrals_trigger_get_user_id', 10, 3 );

/**
 * Get the id for a given specific trigger action.
 *
 * @since  1.0.0
 *
 * @param  integer $specific_id     Specific ID.
 * @param  string  $trigger         Trigger name.
 * @param  array   $args            Passed trigger args.
 *
 * @return integer                  Specific ID.
 */
function gamipress_referrals_specific_trigger_get_id( $specific_id, $trigger = '', $args = array() ) {

    switch ( $trigger ) {
        case 'gamipress_referrals_specific_referral_visit':
            $specific_id = $args[3];
            break;
    }

    return $specific_id;
}
add_filter( 'gamipress_specific_trigger_get_id', 'gamipress_referrals_specific_trigger_get_id', 10, 3 );

/**
 * Extended meta data for event trigger logging
 *
 * @since 1.0.0
 *
 * @param array 	$log_meta
 * @param integer 	$user_id
 * @param string 	$trigger
 * @param integer 	$site_id
 * @param array 	$args
 *
 * @return array
 */
function gamipress_referrals_log_event_trigger_meta_data( $log_meta, $user_id, $trigger, $site_id, $args ) {

    switch ( $trigger ) {
        case 'gamipress_referrals_referral_visit':
        case 'gamipress_referrals_specific_referral_visit':
            // Add the affiliate ID, referral ID and IP
            $log_meta['affiliate_id'] = $args[0];
            $log_meta['referral_id'] = $args[1];
            $log_meta['referral_ip'] = $args[2];
            $log_meta['post_id'] = $args[3];
            $log_meta['post_url'] = $args[4];
            $log_meta['referrer'] = $args[5];
            break;
        case 'gamipress_referrals_referral_signup':
        case 'gamipress_referrals_register':
            // Add the affiliate ID, referral ID and IP
            $log_meta['affiliate_id'] = $args[0];
            $log_meta['referral_id'] = $args[1];
            $log_meta['referral_ip'] = $args[2];
            break;

    }

    return $log_meta;
}
add_filter( 'gamipress_log_event_trigger_meta_data', 'gamipress_referrals_log_event_trigger_meta_data', 10, 5 );