<?php
/**
 * Vikinger REGISTER functions
 * 
 * @since 1.0.0
 */

if (!function_exists('vikinger_register_user')) {
  /**
   * Registers a new user.
   * 
   * @param array $args {
   *   @type string $username     Username to assign to the new user.
   *   @type string $password     Password to assign to the new user.
   *   @type string $email        Email to assign to the new user.
   * }
   * @return int|WP_Error User ID on successfull creation, WP_Error on error
   */
  function vikinger_register_user($args) {
    if (!is_email($args['email'])) {
      return new WP_Error('invalid_email');
    }

    return wp_create_user($args['username'], $args['password'], $args['email']);
  }
}

?>