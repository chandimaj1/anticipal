<?php
/**
 * Vikinger Template - BuddyPress Members Loop
 * 
 * Displays the members loop
 * 
 * @package Vikinger
 * @since 1.0.0
 * @author Odin Design Themes (https://odindesignthemes.com/)
 * 
 */

  $members_grid_type = vikinger_logged_user_grid_type_get('member');

?>

<!-- MEMBER FILTERABLE LIST -->
<div id="member-filterable-list" class="filterable-list" data-grid-type="<?php echo esc_attr($members_grid_type); ?>"></div>
<!-- /MEMBER FILTERABLE LIST -->