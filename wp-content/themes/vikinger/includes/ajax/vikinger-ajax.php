<?php
/**
 * Vikinger AJAX
 * 
 * @since 1.0.0
 */

/**
 * USER AJAX
 */
require_once VIKINGER_PATH . '/includes/ajax/vikinger-ajax-user.php';

/**
 * BLOG AJAX
 */
require_once VIKINGER_PATH . '/includes/ajax/vikinger-ajax-blog.php';

/**
 * COMMENT AJAX
 */
require_once VIKINGER_PATH . '/includes/ajax/vikinger-ajax-comment.php';

/**
 * Load BuddyPress related AJAX endpoints only
 * when the plugin is installed and active
 */
if (vikinger_plugin_buddypress_is_active()) {
  /**
   * MEMBER AJAX
   */
  require_once VIKINGER_PATH . '/includes/ajax/vikinger-ajax-member.php';

  /**
   * ACTIVITY AJAX
   */
  require_once VIKINGER_PATH . '/includes/ajax/vikinger-ajax-activity.php';

  /**
   * GROUP AJAX
   */
  require_once VIKINGER_PATH . '/includes/ajax/vikinger-ajax-group.php';

  /**
   * FRIEND AJAX
   */
  require_once VIKINGER_PATH . '/includes/ajax/vikinger-ajax-friend.php';

  /**
   * NOTIFICATION AJAX
   */
  require_once VIKINGER_PATH . '/includes/ajax/vikinger-ajax-notification.php';

  /**
   * MESSAGE AJAX
   */
  require_once VIKINGER_PATH . '/includes/ajax/vikinger-ajax-message.php';
}

/**
 * Load bbPress related AJAX endpoints only
 * when the plugin is installed and active
 */
if (vikinger_plugin_bbpress_is_active()) {
  /**
   * BBPRESS AJAX
   */
  require_once VIKINGER_PATH . '/includes/ajax/vikinger-ajax-bbpress.php';
}

/**
 * Load backend related AJAX endpoints only
 * when on the WordPress backend
 */
if (is_admin()) {
  /**
   * PLUGIN AJAX
   */
  require_once VIKINGER_PATH . '/includes/ajax/vikinger-ajax-plugin.php';

  /**
   * DEMO AJAX
   */
  require_once VIKINGER_PATH . '/includes/ajax/vikinger-ajax-demo.php';
}

?>