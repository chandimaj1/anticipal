<?php
namespace PublishPress\Permissions\Compat;

// Methods copied from plugin Public Post Preview 2.6.0 due to privacy of is_public_preview_available()
//
// If that method is public in Public Post Preview, this class is not loaded. 
//
class PublicPostPreview
{
    /**
     * Checks if a public preview is available and allowed.
     * Verifies the nonce and if the post id is registered for a public preview.
     *
     * @param int $post_id The post id.
     * @return bool True if a public preview is allowed, false on a failure.
     * @since 2.0.0
     *
     */
    static function is_public_preview_available($post_id)
    {
        if (empty($post_id)) {
            return false;
        }

        $nonce = (isset($_REQUEST['_ppp'])) ? $_REQUEST['_ppp'] : get_query_var('_ppp');

        if (!self::verify_nonce($nonce, 'public_post_preview_' . $post_id)) {
            wp_die(__('The link has been expired!', 'public-post-preview'));
        }

        if (!in_array($post_id, self::get_preview_post_ids())) {
            wp_die(__('No Public Preview available!', 'public-post-preview'));
        }

        return true;
    }

    /**
     * Verifies that correct nonce was used with time limit. Without an UID.
     *
     * @param string $nonce Nonce that was used in the form to verify.
     * @param string|int $action Should give context to what is taking place and be the same when nonce was created.
     * @return bool               Whether the nonce check passed or failed.
     * @since 1.0.0
     *
     * @see wp_verify_nonce()
     *
     */
    private static function verify_nonce($nonce, $action = -1)
    {
        $i = self::nonce_tick();

        // Nonce generated 0-12 hours ago.
        if (substr(wp_hash($i . $action, 'nonce'), -12, 10) == $nonce) {
            return 1;
        }

        // Nonce generated 12-24 hours ago.
        if (substr(wp_hash(($i - 1) . $action, 'nonce'), -12, 10) == $nonce) {
            return 2;
        }

        // Invalid nonce.
        return false;
    }

    /**
     * Get the time-dependent variable for nonce creation.
     *
     * @return int The time-dependent variable.
     * @since 2.1.0
     *
     * @see wp_nonce_tick()
     *
     */
    private static function nonce_tick()
    {
        $nonce_life = apply_filters('nonce_life', 60 * 60 * 48); // 48 hours

        return ceil(time() / ($nonce_life / 2));
    }

    /**
     * Returns the post ids which are registered for a public preview.
     *
     * @return array The post ids. (Empty array if no ids are registered.)
     * @since 2.0.0
     *
     */
    private static function get_preview_post_ids()
    {
        $post_ids = get_option('public_post_preview', []);
        return array_map( 'intval', $post_ids );
    }
}
