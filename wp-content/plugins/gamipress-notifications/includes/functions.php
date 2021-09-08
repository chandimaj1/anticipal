<?php
/**
 * Functions
 *
 * @package     GamiPress\Notifications\Functions
 * @since       1.1.3
 */
// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Check a specific user notifications
 *
 * @since 1.1.3
 *
 * @param int       $user_id        The given user's ID
 * @param bool      $user_points    If true, will return the current user points balances (used on ajax function)
 *
 * @return array                    Format: array( 'notices' => array(), 'last_check' => 0 )
 */
function gamipress_notifications_get_user_notifications( $user_id = null, $user_points = false ) {

    global $post;

    // If user ID not passed set the current logged in user
    if( $user_id === null ) {
        $user_id = get_current_user_id();
    }

    $response = array(
        'notices' => array(),
        'last_check' => 0
    );

    // Just continue if user ID is set
    if( $user_id === 0 ) {
        return $response;
    }

    // Get last time has been check for notifications
    $last_check = gamipress_notifications_get_user_last_check( $user_id );

    // Get life time configured
    $life = absint( gamipress_notifications_get_option( 'life', 1 ) );

    if( $life === 0 ) {
        $life = 1;
    }

    $life = strtotime( "-{$life} day" );

    // If not already checked or last check is more than that configured, then use the time from config
    if( $last_check === 0 || $last_check < $life ) {
        $since = $life;
    } else {
        $since = $last_check + 1;
    }

    /**
     * Limit the number of notifications
     * This prevents large amount of notifications if the site already has a great number of notifications that hasn't been noticed yet
     *
     * @since 1.2.8
     *
     * @param int $notifications_limit
     *
     * @return int
     */
    $notifications_limit = apply_filters( 'gamipress_notifications_notifications_limit', 10 );

    // Ensure int
    $notifications_limit = absint( $notifications_limit );

    // Get user achievements earned
    $earnings = gamipress_get_user_achievements( array(
        'user_id' => $user_id,
        'since' => $since,
        'display' => true, // Set display arg to let the function hide achievements
    ) );

    if( count( $earnings ) ) {

        foreach( $earnings as $earning ) {

            // Skip all upcoming earnings is limit has been reached
            if( count( $response['notices'] ) >= $notifications_limit ) {
                continue;
            }

            // On network wide active installs, we need to switch to main blog mostly for posts permalinks and thumbnails
            if( gamipress_is_network_wide_active() && ! is_main_site() ) {
                $blog_id = get_current_blog_id();
                switch_to_blog( get_main_site_id() );
            }

            // Setup the post object
            $post = gamipress_get_post( $earning->ID );

            setup_postdata( $post );

            $content = '';

            /**
             * Hook to process the notification content
             *
             * @since 1.0.2
             *
             * @param string $content
             * @param object $earning
             * @param WP_Post $post
             */
            $content = apply_filters( 'gamipress_notification_process_notification_content', $content, $earning, $post );

            if( ! empty( $content ) ) {

                // Show notification sound effect
                $show_sound = gamipress_notifications_get_option( 'show_sound', '' );

                /**
                 * Hook to setup a custom show notification sound effect
                 *
                 * @since 1.1.9
                 *
                 * @param string $show_sound Audio file URL to set as sound effect
                 * @param object $earning
                 * @param WP_Post $post
                 */
                $show_sound = apply_filters( 'gamipress_notification_show_notification_sound', $show_sound, $earning, $post );

                if( ! empty( $show_sound ) ) {
                    $content .= '<div id="gamipress-notification-show-sound" data-src="' . $show_sound . '"></div>';
                }

                // Close sound effect
                $hide_sound = gamipress_notifications_get_option( 'hide_sound', '' );

                /**
                 * Hook to setup a custom hide notification sound effect
                 *
                 * @since 1.1.9
                 *
                 * @param string $hide_sound Audio file URL to set as sound effect
                 * @param object $earning
                 * @param WP_Post $post
                 */
                $hide_sound = apply_filters( 'gamipress_notification_hide_notification_sound', $hide_sound, $earning, $post );

                if( ! empty( $hide_sound ) ) {
                    $content .= '<div id="gamipress-notification-hide-sound" data-src="' . $hide_sound . '"></div>';
                }

                $response['notices'][] = $content;

            }

            wp_reset_postdata();

            // If switched to blog, return back to que current blog
            if( isset( $blog_id ) ) {
                switch_to_blog( $blog_id );
            }

            // Update last check time
            if( $earning->date_earned > $last_check ) {
                $last_check = $earning->date_earned;
            }
        }

    }

    // Pass the last time notifications has been checked
    $response['last_check'] = $last_check;

    // Pass the updated information of the current user points if is requested
    if( $user_points ) {

        // Setup an array with all the user points
        $response['user_points'] = array();

        foreach( gamipress_get_points_types_slugs() as $points_type ) {
            $response['user_points'][] = array(
                'points_type' => $points_type,
                'points' => gamipress_get_user_points( $user_id, $points_type )
            );
        }

    }

    /**
     * Filter user notifications
     *
     * @since 1.2.0
     *
     * @param array     $response       Array with information about user notifications
     * @param int       $user_id        The given user's ID
     * @param bool      $user_points    If true, will return the current user points balances (used on ajax function)
     *
     * @return array                    Format: array( 'notices' => array(), 'last_check' => 0, 'user_points' => array() )
     */
    return apply_filters( 'gamipress_notifications_get_user_notifications', $response, $user_id, $user_points );

}

/**
 * Get previous time user has check for new notifications
 *
 * @since 1.3.3
 *
 * @param int       $user_id    The given user's ID
 *
 * @return int
 */
function gamipress_notifications_get_user_previous_check( $user_id = null ) {

    // If user ID not passed set the current logged in user
    if( $user_id === null )
        $user_id = get_current_user_id();

    $previous_check = absint( get_user_meta( $user_id, '_gamipress_notifications_previous_check', true ) );

    /**
     * Filter previous time user has check for new notifications
     *
     * @since 1.2.1
     *
     * @param int       $previous_check  The given user's previous check time
     * @param int       $user_id        The given user's ID
     *
     * @return int
     */
    return apply_filters( 'gamipress_notifications_get_user_previous_check', $previous_check, $user_id );

}

/**
 * Set previous time user has check for new notifications
 *
 * @since 1.3.3
 *
 * @param int       $user_id    The given user's ID
 * @param int       $previous_check Last check timestamp
 */
function gamipress_notifications_set_user_previous_check( $user_id = null, $previous_check = 0 ) {

    // If user ID not passed set the previous logged in user
    if( $user_id === null )
        $user_id = get_current_user_id();

    update_user_meta( $user_id, '_gamipress_notifications_previous_check', $previous_check );

    /**
     * Action to meet when previous time user has being set
     *
     * @since 1.2.1
     *
     * @param int       $user_id        The given user's ID
     * @param int       $previous_check Previous check timestamp
     */
    do_action( 'gamipress_notifications_set_user_previous_check', $user_id, $previous_check );

}

/**
 * Get last time user has check for new notifications
 *
 * @since 1.1.3
 *
 * @param int       $user_id    The given user's ID
 *
 * @return int
 */
function gamipress_notifications_get_user_last_check( $user_id = null ) {

    // If user ID not passed set the current logged in user
    if( $user_id === null )
        $user_id = get_current_user_id();

    $last_check = absint( get_user_meta( $user_id, '_gamipress_notifications_last_check', true ) );

    /**
     * Filter last time user has check for new notifications
     *
     * @since 1.2.1
     *
     * @param int       $last_check     The given user's last check time
     * @param int       $user_id        The given user's ID
     *
     * @return int
     */
    return apply_filters( 'gamipress_notifications_get_user_last_check', $last_check, $user_id );

}

/**
 * Set last time user has check for new notifications
 *
 * @since 1.1.3
 *
 * @param int       $user_id    The given user's ID
 * @param int       $last_check Last check timestamp
 */
function gamipress_notifications_set_user_last_check( $user_id = null, $last_check = 0 ) {

    // If user ID not passed set the current logged in user
    if( $user_id === null )
        $user_id = get_current_user_id();

    update_user_meta( $user_id, '_gamipress_notifications_last_check', $last_check );

    /**
     * Action to meet when last time user has being set
     *
     * @since 1.2.1
     *
     * @param int       $user_id    The given user's ID
     * @param int       $last_check Last check timestamp
     */
    do_action( 'gamipress_notifications_set_user_last_check', $user_id, $last_check );

}