<?php
/**
 * Vikinger BP BETTER MESSAGES functions
 * 
 * @since 1.3.1
 */

// only declare functions if the BP Better Messages plugin is active
if (vikinger_plugin_bpbettermessages_is_active()) {
  /**
   * Replace plugin URL with Vikinger URL
   */
  function vikinger_bp_better_messages_location_overwrite($url, $user_id) {
    return bp_core_get_user_domain($user_id) . 'settings/messages/';
  }

  add_filter('bp_better_messages_page', 'vikinger_bp_better_messages_location_overwrite', 10, 2);

  /**
   * Catching Vikinger New Message
   */
  function vikinger_bp_better_messages_catch_new_thread() {
    if (vikinger_plugin_bpbettermessages_is_active()){
      if (!isset($_GET['user_id'])) {
        return false;
      } else {
        $user_id = intval($_GET['user_id']);
        $user = get_userdata($user_id);
        if (!$user) return false;

        /**
         * Reproducing logic if fast thread mode is enabled
         */
        $is_fast_thread_enabled = BP_Better_Messages()->settings['fastStart'] == '1';

        if( $is_fast_thread_enabled ) {
          if (BP_Better_Messages()->settings['singleThreadMode'] == '1') {
            $threads = BP_Better_Messages()->functions->find_existing_threads(get_current_user_id(), $user->ID);

            if (count($threads) > 0) {
              $_GET['thread_id'] = $threads[0];
              return null;
            }
          }

          $thread_id = BP_Better_Messages()->functions->get_pm_thread_id($user->ID);
          $_GET['thread_id'] = $thread_id;

          return null;
        }

        $_GET['new-message'] = 1;
        $_GET['to'] = $user->user_nicename;
      }
    }

    return null;
  }

  add_action('bp_better_messages_before_generation', 'vikinger_bp_better_messages_catch_new_thread');

  /**
   * Catching Vikinger Thread
   */
  function vikinger_bp_better_messages_catch_thread_id(){
    if (vikinger_plugin_bpbettermessages_is_active()){
      if (!isset($_GET['message_id'])) {
        return false;
      } else {
        $thread_id = intval($_GET['message_id']);
        $_GET['thread_id'] = $thread_id;
      }
    }

    return null;
  }

  add_action('bp_better_messages_before_generation', 'vikinger_bp_better_messages_catch_thread_id');
}

?>