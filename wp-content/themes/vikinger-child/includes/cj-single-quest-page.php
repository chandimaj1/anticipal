<?php
 //Assets uri
 $common_assets = get_stylesheet_directory_uri()."/template_common_assets"; //Template common assets
 $assets = get_stylesheet_directory_uri()."/template_specific_assets/single_quest_details/";

  get_header();

  $achievement_type = 'quest';

?>
  <?php
    global $wpdb;
    $user_id = get_current_user_id();
    $user_points = vikinger_gamipress_get_logged_user_points();
    $achievement = vikinger_gamipress_get_achievement($achievement_id, $user_id);
	$args = array("achievement"=>$achievement, "user_points"=>$user_points);
    //404 if no results found
    //....

    $is_submission_enabled = get_post_meta( $achievement_id, '_gamipress_submissions_enable', true );
    $isLocked = true;
    if ( $achievement["unlocked_with_points"] || $achievement["completed"] ){
         $isLocked = false;
    }
    ?>
     <?php
                
            ?>
        <script>
        	
            var achievement = `<?php echo json_encode($achievement) ?>`;
            var template_folder = `<?php echo get_template_directory() ?>`;
            var user_points = `<?php echo json_encode($user_points) ?>`;
			var achievement_id = `<?php echo ($achievement_id) ?>`;
            
            console.log('Achievement:');
            console.log(achievement);
            console.log(`<?php print_r($achievement["completed_users"]) ?>`);
            console.log('user points:');
            console.log(JSON.parse(user_points));
            console.log('Achieve ment Id:');
            console.log(`<?= $is_submission_enabled ?>`);
        </script>
  <?php

  
  ?>

  <section>
    <div class="content-grid">
        <!-- PROFILE HEADER -->
        <div class="profile-header">
        <!-- PROFILE HEADER COVER -->
        <figure class="profile-header-cover liquid">
            <img src="<?= $achievement['image_url'] ?>" alt="Quest cover image">
        </figure>
        <!-- /PROFILE HEADER COVER -->

        <!-- PROFILE HEADER INFO -->
        <div class="profile-header-info">
            <!-- USER SHORT DESCRIPTION -->
            <div class="user-short-description big">
            <!-- USER SHORT DESCRIPTION AVATAR -->
            <a class="user-short-description-avatar user-avatar big" href="#">
                <!-- USER AVATAR BORDER -->
                <div class="user-avatar-border">
                <!-- HEXAGON -->
                <div class="hexagon-148-164"></div>
                <!-- /HEXAGON -->
                </div>
                <!-- /USER AVATAR BORDER -->

                <!-- USER AVATAR CONTENT -->
                <div class="user-avatar-content">
                <!-- HEXAGON -->
                
                <?php
                
                    if($isLocked):
                ?>
                    <div class="hexagon-image-100-110" data-src="<?= $common_assets ?>/img/quest_is_locked.png"></div>
                <?php
                    else:
                ?>
                    <div class="hexagon-image-100-110" data-src="<?= $common_assets ?>/img/quest_is_unlocked.png"></div>
                <?php
                    endif;
                ?>
                <!-- /HEXAGON -->
                </div>
                <!-- /USER AVATAR CONTENT -->



                <!-- USER AVATAR PROGRESS BORDER -->
                <div class="user-avatar-progress-border">
                <!-- HEXAGON -->
                <div class="hexagon-border-124-136"></div>
                <!-- /HEXAGON -->
                </div>
                <!-- /USER AVATAR PROGRESS BORDER -->


            </a>
            <!-- /USER SHORT DESCRIPTION AVATAR -->

            <!-- USER SHORT DESCRIPTION AVATAR -->
            <a class="user-short-description-avatar user-short-description-avatar-mobile user-avatar medium" href="#">
                <!-- USER AVATAR BORDER -->
                <div class="user-avatar-border">
                <!-- HEXAGON -->
                <div class="hexagon-120-132"></div>
                <!-- /HEXAGON -->
                </div>
                <!-- /USER AVATAR BORDER -->

                <!-- USER AVATAR CONTENT -->
                <div class="user-avatar-content">
                <!-- HEXAGON -->
                <?php
                
                    if($isLocked):
                ?>
                    <div class="hexagon-image-100-110" data-src="<?= $common_assets ?>/img/quest_is_locked.png"></div>
                <?php
                    else:
                ?>
                    <div class="hexagon-image-100-110" data-src="<?= $common_assets ?>/img/quest_is_unlocked.png"></div>
                <?php
                    endif;
                ?>
                <!-- /HEXAGON -->
                </div>
                <!-- /USER AVATAR CONTENT -->

                <!-- USER AVATAR PROGRESS -->
                <div class="user-avatar-progress">
                <!-- HEXAGON -->
                <div class="hexagon-progress-100-110"></div>
                <!-- /HEXAGON -->
                </div>
                <!-- /USER AVATAR PROGRESS -->

                <!-- USER AVATAR PROGRESS BORDER -->
                <div class="user-avatar-progress-border">
                <!-- HEXAGON -->
                <div class="hexagon-border-100-110"></div>
                <!-- /HEXAGON -->
                </div>
                <!-- /USER AVATAR PROGRESS BORDER -->

                <!-- USER AVATAR BADGE -->
                <div class="user-avatar-badge">
                <!-- USER AVATAR BADGE BORDER -->
                <div class="user-avatar-badge-border">
                    <!-- HEXAGON -->
                    <div class="hexagon-32-36"></div>
                    <!-- /HEXAGON -->
                </div>
                <!-- /USER AVATAR BADGE BORDER -->

                <!-- USER AVATAR BADGE CONTENT -->
                <div class="user-avatar-badge-content">
                    <!-- HEXAGON -->
                    <div class="hexagon-dark-26-28"></div>
                    <!-- /HEXAGON -->
                </div>
                <!-- /USER AVATAR BADGE CONTENT -->

                <!-- USER AVATAR BADGE TEXT -->
                <p class="user-avatar-badge-text">24</p>
                <!-- /USER AVATAR BADGE TEXT -->
                </div>
                <!-- /USER AVATAR BADGE -->
            </a>
            <!-- /USER SHORT DESCRIPTION AVATAR -->

            <!-- USER SHORT DESCRIPTION TITLE -->
            <p class="user-short-description-title"><a href="profile-timeline.html"><?= $achievement['name'] ?></a></p>
            <!-- /USER SHORT DESCRIPTION TITLE -->

            <!-- USER SHORT DESCRIPTION TEXT -->
            <?php
            if($isLocked):
            ?>
                <p class="user-short-description-text">Locked</p>
            <?php
            else:
            ?>
                <p class="user-short-description-text">Unlocked</p>
            <?php
            endif;
            ?>
            
            <!-- /USER SHORT DESCRIPTION TEXT -->
            </div>
            <!-- /USER SHORT DESCRIPTION -->
        </div>
        <!-- /PROFILE HEADER INFO -->
        </div>
        <!-- /PROFILE HEADER -->

        <!-- GRID -->
        <div class="grid grid-3-6-3 mobile-prefer-content">
        <!-- GRID COLUMN -->
        <div class="grid-column">

            <!-- WIDGET BOX -->
            <div class="widget-box">
            <!-- WIDGET BOX SETTINGS -->

            <!-- /WIDGET BOX SETTINGS -->

            <!-- WIDGET BOX TITLE -->
            <p class="widget-box-title">Completato di recente</span></p>
            <!-- /WIDGET BOX TITLE -->

            <?php
                if (count($achievement["completed_users"]) > 0):
            ?>
            <!-- WIDGET BOX CONTENT -->
            <div class="widget-box-content">
                <!-- USER STATUS LIST -->
                <div class="user-status-list">
            <?php
                    foreach($achievement["completed_users"] as $completed_user):
            ?>

                <!-- USER STATUS -->
                <div class="user-status request-small">
                    <!-- USER STATUS AVATAR -->
                    <a class="user-status-avatar" href="<?= $completed_user["link"] ?>">
                    <!-- USER AVATAR -->
                    <div class="user-avatar small no-outline">
                        <!-- USER AVATAR CONTENT -->
                        <div class="user-avatar-content">
                        <!-- HEXAGON -->
                        <div class="hexagon-image-30-32" data-src="<?= $completed_user["avatar_url"] ?>"></div>
                        <!-- /HEXAGON -->
                        </div>
                        <!-- /USER AVATAR CONTENT -->

                        <!-- USER AVATAR PROGRESS -->
                        <div class="user-avatar-progress">
                        <!-- HEXAGON -->
                        <div class="hexagon-progress-40-44"></div>
                        <!-- /HEXAGON -->
                        </div>
                        <!-- /USER AVATAR PROGRESS -->

                        <!-- USER AVATAR PROGRESS BORDER -->
                        <div class="user-avatar-progress-border">
                        <!-- HEXAGON -->
                        <div class="hexagon-border-40-44"></div>
                        <!-- /HEXAGON -->
                        </div>
                        <!-- /USER AVATAR PROGRESS BORDER -->

                        <!-- USER AVATAR BADGE -->
                        <div class="user-avatar-badge">
                        <!-- USER AVATAR BADGE BORDER -->
                        <div class="user-avatar-badge-border">
                            <!-- HEXAGON -->
                            <div class="hexagon-22-24"></div>
                            <!-- /HEXAGON -->
                        </div>
                        <!-- /USER AVATAR BADGE BORDER -->

                        <!-- USER AVATAR BADGE CONTENT -->
                        <div class="user-avatar-badge-content">
                            <!-- HEXAGON -->
                            <div class="hexagon-dark-16-18"></div>
                            <!-- /HEXAGON -->
                        </div>
                        <!-- /USER AVATAR BADGE CONTENT -->

                        <!-- USER AVATAR BADGE TEXT -->
                        <p class="user-avatar-badge-text"><?= $completed_user["rank"]["current"] ?></p>
                        <!-- /USER AVATAR BADGE TEXT -->
                        </div>
                        <!-- /USER AVATAR BADGE -->
                    </div>
                    <!-- /USER AVATAR -->
                    </a>
                    <!-- /USER STATUS AVATAR -->

                    <!-- USER STATUS TITLE -->
                    <p class="user-status-title"><a class="bold" href="<?= $completed_user["link"] ?>"><?= $completed_user["name"] ?></a></p>
                    <!-- /USER STATUS TITLE -->

                    <!-- USER STATUS TEXT -->
                    <p class="user-status-text small"></p>
                    <!-- /USER STATUS TEXT -->
                </div>
                <!-- /USER STATUS -->
        <?php
                endforeach;
        ?>


                </div>
                <!-- /USER STATUS LIST -->
            </div>
            <!-- WIDGET BOX CONTENT -->
        <?php
            else:
        ?>
                <div class="widget-box-content">
                    <!-- WIDGET BOX STATUS TEXT -->
                    <div class="hexagon-image-100-110" data-src="<?= $common_assets ?>/img/no_results_found.png"></div>
                    <!-- /WIDGET BOX STATUS TEXT -->
                </div>
        <?php   
            endif;
        ?>
        
            </div>
            <!-- /WIDGET BOX -->


        </div>
        <!-- /GRID COLUMN -->

        <!-- GRID COLUMN -->
        <div class="grid-column">

            <!-- WIDGET BOX -->
            <div class="widget-box">
            <!-- WIDGET BOX SETTINGS -->

            <!-- /WIDGET BOX SETTINGS -->

            <!-- WIDGET BOX TITLE -->
            <p class="widget-box-title">Dettagli</span></p>
            <!-- /WIDGET BOX TITLE -->

            <!-- WIDGET BOX CONTENT -->
            <div class="widget-box-content single-quest-content">
                <!-- WIDGET BOX STATUS TEXT -->
            <?php
                $content = apply_filters('the_content', $achievement["post_content"]);
            ?>
                <p class="widget-box-status-text"><?= $content ?></p>
                <!-- /WIDGET BOX STATUS TEXT -->
            </div>
            <!-- WIDGET BOX CONTENT -->
            </div>
            <!-- /WIDGET BOX -->


        <?php
            $completed_steps = 0;
            $steps_count = count($args['achievement']['steps']);
            
            if ($steps_count > 0  && $is_submission_enabled!="on") :
        ?>
            <!-- WIDGET BOX -->
            <div class="widget-box">
            <!-- WIDGET BOX SETTINGS -->

            <!-- /WIDGET BOX SETTINGS -->

            <!-- WIDGET BOX TITLE -->
            <p class="widget-box-title">Requisiti</span></p>
            <!-- /WIDGET BOX TITLE -->

            <!-- WIDGET BOX CONTENT -->
            <div class="widget-box-content">
                

            <!-- ACHIEVEMENT ITEM BOX REQUIREMENTS -->
            <div class="achievement-item-box-requirements">

                <!-- CHECKLIST ITEMS -->
                <div class="checklist-items quest-details-check-list-items" data-simplebar>
                <?php
                foreach ($args['achievement']['steps'] as $step) :
                    if ($step['completed']) {
                    $completed_steps++;
                    }

                    $checklist_item_box_classes = $step['completed'] ? 'active' : '';
                ?>
                <!-- CHECKLIST ITEM -->
                <div class="checklist-item">
                    <!-- CHECKLIST ITEM BOX -->
                    <div class="checklist-item-box <?php echo esc_attr($checklist_item_box_classes); ?>">
                    <?php

                    /**
                     * Icon SVG
                     */
                    get_template_part('template-part/icon/icon', 'svg', [
                        'icon'      => 'check-small',
                        'modifiers' => 'checklist-item-box-icon'
                    ]);

                    ?>
                    </div>
                    <!-- /CHECKLIST ITEM BOX -->

                    <!-- CHECKLIST ITEM TEXT -->
                    <p class="checklist-item-text"><?php echo esc_html($step['description']); ?></p>
                    <!-- /CHECKLIST ITEM TEXT -->
                </div>
                <!-- /CHECKLIST ITEM -->
                <?php
                endforeach;
                ?>
                </div>
                <!-- /CHECKLIST ITEMS -->
            </div>
            <!-- /ACHIEVEMENT ITEM BOX REQUIREMENTS -->

            </div>
            <!-- WIDGET BOX CONTENT -->

            </div>
            <!-- /WIDGET BOX -->


        <?php
            // end steps count if
            endif;
        ?>


         <?php 
         if ($is_submission_enabled=="on")
         {
        ?>   
            <!-- WIDGET BOX -->
            <div class="widget-box">
            <!-- WIDGET BOX TITLE -->
            <p class="widget-box-title">Hai completato la Missione?</p>
            <!-- /WIDGET BOX TITLE -->

             
            <!-- WIDGET BOX CONTENT -->
            <div class="widget-box-content">
            <?php
                $post_id = $achievement_id;
                $a = array();
                $a['button_text'] = get_post_meta( $post_id, '_gamipress_submissions_button_text', true );
                $a['notes_label'] = get_post_meta( $post_id, '_gamipress_submissions_notes_label', true );

                $user_id = get_current_user_id();
                $submission = gamipress_submissions_get_user_pending_submission( $user_id, $post_id ); ?>

                <?php if( $submission ) : ?>

                    <div class="gamipress-submissions-form">
                        <p class="gamipress-submissions-pending-message gamipress-notice gamipress-notice-success"><?php echo __( 'Your submission has been sent successfully and is waiting for approval.', 'gamipress-submissions' ); ?></p>
                        <?php if( ! empty( $submission->notes ) ) : ?>
                        <label><?php echo $a['notes_label']; ?></label>
                        <div class="gamipress-submissions-pending-notes"><?php echo $submission->notes; ?></div>
                        <?php endif; ?>
                    </div>

                <?php else : ?>

                    <?php
                        //Show submission form if applicable for current quest
                        $shortcode = get_post_meta( $achievement_id, '_gamipress_submissions_cj_form_shortcode', true );
                        if (!empty($shortcode)){
                            echo "<div id='gamipress-submission-form-submission-form'> ";
                                echo do_shortcode($shortcode);
                            echo "</div>";
                        }
                    ?>
                    <div id="gamipress-submissions-form-<?php echo $post_id; ?>" class="gamipress-submissions-form" data-id="<?php echo $post_id; ?>">

                        <?php
                        /**
                         * Before render submission form
                         *
                         * @since 1.0.0
                         *
                         * @param int   $post_id        The achievement or rank ID
                         * @param int   $user_id        The user ID
                         * @param array $template_args  Template received arguments
                         */
                        do_action( 'gamipress_before_render_submission_form', $post_id, $user_id, $a ); 
                        ?>

                        <?php if( $a['notes'] ) : ?>
                            <p class="gamipress-submissions-notes-wrap" style="display:none;">
                                <label for="gamipress-submissions-notes-<?php echo $post_id; ?>"><?php echo $a['notes_label']; ?></label>
                                <textarea id="gamipress-submissions-notes-<?php echo $post_id; ?>" class="gamipress-submissions-notes" rows="5"></textarea>
                            </p>
                        <?php endif; ?>

                        <button type="button" id="gamipress-submission-button" class="gamipress-submissions-button"><?php echo $a['button_text']; ?></button>

                        <!-- FORM ITEM -->
                        <div class="form-item">
                            <!-- BUTTON -->
                            <button type="button" id="quest-details-submission-button" class="button full secondary"><?php echo $a['button_text']; ?></button>
                            <div class="gamipress-spinner" style="display: none;"></div>
                            <!-- /BUTTON -->
                        </div>

                        

                        <?php
                        /**
                         * After render submission form
                         *
                         * @since 1.0.0
                         *
                         * @param int   $post_id        The achievement or rank ID
                         * @param int   $user_id        The user ID
                         * @param array $template_args  Template received arguments
                         */
                        do_action( 'gamipress_after_render_submission_form', $post_id, $user_id, $a ); ?>

                    </div>

                <?php endif; ?>
            </div>


        <?php
            /*
            <!-- WIDGET BOX CONTENT -->
            <div class="widget-box-content">

                <!-- FORM -->
                <form class="form">
                <!-- FORM ROW -->
                <div class="form-row split">
                    <!-- FORM ITEM -->
                    <div class="form-item">
                    <!-- FORM INPUT -->
                    <div class="form-input small active">
                        <label for="account-full-name">Full Name</label>
                        <input type="text" id="account-full-name" name="account_full_name" value="Marina Valentine">
                    </div>
                    <!-- /FORM INPUT -->
                    </div>
                    <!-- /FORM ITEM -->

                    <!-- FORM ITEM -->
                    <div class="form-item">
                    <!-- FORM INPUT -->
                    <div class="form-input small active">
                        <label for="account-email">Account Email</label>
                        <input type="text" id="account-email" name="account_email" value="ghuntress@yourmail.com">
                    </div>
                    <!-- /FORM INPUT -->
                    </div>
                    <!-- /FORM ITEM -->
                </div>
                <!-- /FORM ROW -->

                <!-- FORM ROW -->
                <div class="form-row split">
                    <!-- FORM ITEM -->
                    <div class="form-item">
                    <!-- FORM INPUT -->
                    <div class="form-input small active">
                        <label for="account-url-username">URL Username: www.vikinger.com/</label>
                        <input type="text" id="account-url-username" name="account_url_username" value="marinavalentine">
                    </div>
                    <!-- /FORM INPUT -->
                    </div>
                    <!-- /FORM ITEM -->

                    <!-- FORM ITEM -->
                    <div class="form-item">
                    <!-- FORM INPUT -->
                    <div class="form-input small">
                        <label for="account-phone">Phone Number</label>
                        <input type="text" id="account-phone" name="account_phone">
                    </div>
                    <!-- /FORM INPUT -->
                    </div>
                    <!-- /FORM ITEM -->
                </div>
                <!-- /FORM ROW -->

                <!-- FORM ROW -->
                <div class="form-row split">
                    <!-- FORM ITEM -->
                    <div class="form-item">
                    <!-- FORM SELECT -->
                    <div class="form-select">
                        <label for="account-country">Country</label>
                        <select id="account-country" name="account_country">
                        <option value="0">Select your Country</option>
                        <option value="1" selected>United States</option>
                        </select>
                        <!-- FORM SELECT ICON -->
                        <svg class="form-select-icon icon-small-arrow">
                        <use xlink:href="#svg-small-arrow"></use>
                        </svg>
                        <!-- /FORM SELECT ICON -->
                    </div>
                    <!-- /FORM SELECT -->
                    </div>
                    <!-- /FORM ITEM -->

                    <!-- FORM ITEM -->
                    <div class="form-item">
                    <!-- FORM SELECT -->
                    <div class="form-select">
                        <label for="account-language">Language</label>
                        <select id="account-language" name="account_language">
                        <option value="1" selected>English (United States)</option>
                        <option value="2">Spanish (Latin America)</option>
                        </select>
                        <!-- FORM SELECT ICON -->
                        <svg class="form-select-icon icon-small-arrow">
                        <use xlink:href="#svg-small-arrow"></use>
                        </svg>
                        <!-- /FORM SELECT ICON -->
                    </div>
                    <!-- /FORM SELECT -->
                    </div>
                    <!-- /FORM ITEM -->
                </div>
                <!-- /FORM ROW -->

                <!-- FORM ROW -->
                <div class="form-row split">
                    <!-- FORM ITEM -->
                    <div class="form-item">
                    <!-- BUTTON -->

                    <!-- /BUTTON -->
                    </div>
                    <!-- /FORM ITEM -->

                    <!-- FORM ITEM -->
                    <div class="form-item">
                    <!-- BUTTON -->
                    <p class="button full secondary">Invia Missione</p>
                    <!-- /BUTTON -->
                    </div>
                    <!-- /FORM ITEM -->
                </div>
                <!-- /FORM ROW -->
                </form>
                <!-- /FORM -->
            </div>
            <!-- WIDGET BOX CONTENT -->
        */
        ?>
            </div>
            <!-- /WIDGET BOX -->

        <?php
         }
        ?>

        </div>
        <!-- /GRID COLUMN -->

        <!-- GRID COLUMN -->
        <div class="grid-column">
            <!-- FEATURED STAT BOX -->
            <div class="featured-stat-box commenter">
            <!-- FEATURED STAT BOX COVER -->
            <div class="featured-stat-box-cover">
                <!-- FEATURED STAT BOX COVER TITLE -->
                <p class="featured-stat-box-cover-title">Ricompensa</p>
                <!-- /FEATURED STAT BOX COVER TITLE -->

                <!-- FEATURED STAT BOX COVER TEXT -->
                <p class="featured-stat-box-cover-text">per la missione</p>
                <!-- /FEATURED STAT BOX COVER TEXT -->
            </div>
            <!-- /FEATURED STAT BOX COVER -->

            <!-- FEATURED STAT BOX INFO -->
            <div class="featured-stat-box-info">
                <!-- USER AVATAR -->
                <div class="user-avatar small">
                <!-- USER AVATAR BORDER -->
                <div class="user-avatar-border">
                    <!-- HEXAGON -->
                    <div class="hexagon-50-56"></div>
                    <!-- /HEXAGON -->
                </div>
                <!-- /USER AVATAR BORDER -->

                <!-- USER AVATAR CONTENT -->
                <div class="user-avatar-content">
                    <!-- HEXAGON -->
                    <?php
                        $points_image_url = $assets."img/quest/coin-type-1.png";
                        if ( $achievement['points_type']['image_url'] ){
                            $points_image_url = $achievement['points_type']['image_url'];
                        }
                    ?>
                    <div class="hexagon-image-30-32" data-src="<?=  $points_image_url ?>"></div>
                    <!-- /HEXAGON -->
                </div>
                <!-- /USER AVATAR CONTENT -->

                <!-- USER AVATAR PROGRESS BORDER -->
                <div class="user-avatar-progress-border">
                    <!-- HEXAGON -->
                    <div class="hexagon-border-40-44"></div>
                    <!-- /HEXAGON -->
                </div>
                <!-- /USER AVATAR PROGRESS BORDER -->


                </div>
                <!-- /USER AVATAR -->

                <!-- FEATURED STAT BOX TITLE -->
                <p class="featured-stat-box-title"><?= $achievement['points'] ?></p>
                <!-- /FEATURED STAT BOX TITLE -->

                <!-- FEATURED STAT BOX SUBTITLE -->
                <?php
                    $points_name = $achievement["points_type"]["plural_name"];
                    if ( (int)$achievement['points'] === 1 ){
                        $points_name = $achievement["points_type"]["singular_name"];
                    }
                ?>
                <p class="featured-stat-box-subtitle"><?= $points_name ?></p>
                <!-- /FEATURED STAT BOX SUBTITLE -->

            </div>
            <!-- /FEATURED STAT BOX INFO -->
            </div>
            <!-- /FEATURED STAT BOX -->
        </div>
        <!-- /GRID COLUMN -->
        </div>
        <!-- /GRID -->
    </div>
</section>

<?php get_footer(); ?>