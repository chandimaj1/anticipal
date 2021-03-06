<?php
/**
 * Vikinger Template - Singular
 * 
 * @package Vikinger
 * @since 1.0.0
 * @author Odin Design Themes (https://odindesignthemes.com/)
 * 
 */

$post_type = get_post_type();
if ($post_type=="quest"){
    $achievement_id = get_the_ID();
    require_once( get_stylesheet_directory() . '/includes/cj-single-quest-page.php');
}else{
  get_header();

  if (have_posts()) {
    the_post();

    $post_type = get_post_type();

    $gp_post_types = vikinger_gamipress_post_types_get();

    // if a GamiPress post type, show different template
    if (in_array($post_type, $gp_post_types)) {
      $post = get_post();
      $gp_type = vikinger_gamipress_type_get($post_type);
?>
    <!-- CONTENT GRID-->
    <div class="content-grid">
        <!-- GRID -->
        <div class="grid grid-6-6 centered">
<?php

            $user_points = vikinger_gamipress_get_logged_user_points();

            if ($gp_type === 'achievement') {
                $post_data = vikinger_gamipress_get_achievement($post->ID, get_current_user_id());
            } else if ($gp_type === 'rank') {
                $post_data = vikinger_gamipress_get_rank($post->ID, get_current_user_id());
            }

            $achievement_args = [
                'achievement'               => $post_data,
                'user_points'               => $user_points,
                'achievement_complete_info' => true,
                'achievement_type'          => $post_type,
                'achievement_image_wrap'    => $post_type === 'quest'
            ];

            /**
             * Achievement Item Box
             */
            get_template_part('template-part/achievement/achievement', 'item-box', $achievement_args);

?>
        </div>
        <!-- /GRID -->
    </div>
    <!-- /CONTENT GRID -->
<?php

    } else {

      $post_data = vikinger_post_get_loop_data();

      /**
       * Post Open V1, V2 or V3
       */
      get_template_part('template-part/post/post-open', $post_data['type'], [
        'post' =>  $post_data
      ]);
    }
  }
  get_footer();
}
?>