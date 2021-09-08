<?php
/**
 * Vikinger MEMBER PAGES functions
 * 
 * @since 1.5.0
 */

if (vikinger_plugin_buddypress_is_active()) {
  if (vikinger_settings_members_profile_page_is_enabled('about')) {

    if (!function_exists('vikinger_members_about_page_setup_nav')) {
      /**
       * Creates member about page navigation
       */
      function vikinger_members_about_page_setup_nav() {
        global $bp;

        bp_core_new_nav_item([
          'name'            => esc_html__('About', 'vikinger'),
          'slug'            => 'about',
          'screen_function' => 'vikinger_members_about_page',
          'position'        => 1
        ]);
      }
    }

    add_action('bp_setup_nav', 'vikinger_members_about_page_setup_nav');

    if (!function_exists('vikinger_members_about_page')) {
      /**
       * Members post page setup
       */
      function vikinger_members_about_page() {
        add_action('bp_template_content', 'vikinger_members_about_page_screen_content');
        bp_core_load_template(apply_filters('bp_core_template_plugin', 'members/single/plugins'));
      }
    }

    if (!function_exists('vikinger_members_about_page_screen_content')) {
      /**
       * Members post page HTML content
       */
      function vikinger_members_about_page_screen_content() {
        $member = get_query_var('member');

        ?>
        <!-- GRID -->
        <div class="grid grid-3-6-3">
          <!-- GRID COLUMN -->
          <div class="grid-column">
          <?php

            /**
             * Widget Info About
             */
            get_template_part('template-part/widget/widget-info', 'about', [
              'member' => $member
            ]);

          ?>
          </div>
          <!-- /GRID COLUMN -->

          <!-- GRID COLUMN -->
          <div class="grid-column">
          <?php

            /**
             * Widget Info Block Interests
             */
            get_template_part('template-part/widget/widget-info-block', 'interests', [
              'member' => $member
            ]);

          ?>
          </div>
          <!-- /GRID COLUMN -->

          <!-- GRID COLUMN -->
          <div class="grid-column">
          <?php

            /**
             * Widget Info Personal
             */
            get_template_part('template-part/widget/widget-info', 'personal', [
              'member' => $member
            ]);

          ?>
          </div>
          <!-- /GRID COLUMN -->
        </div>
        <!-- /GRID -->
        <?php
      }
    }
  }

  if (vikinger_settings_members_profile_page_is_enabled('posts')) {
    if (!function_exists('vikinger_members_posts_page_setup_nav')) {
      /**
       * Creates member posts page navigation
       */
      function vikinger_members_posts_page_setup_nav() {
        global $bp;

        bp_core_new_nav_item([
          'name'            => esc_html__('Blog Posts', 'vikinger'),
          'slug'            => 'posts',
          'screen_function' => 'vikinger_members_posts_page',
          'position'        => 5
        ]);
      }
    }

    add_action('bp_setup_nav', 'vikinger_members_posts_page_setup_nav');

    if (!function_exists('vikinger_members_posts_page')) {
      /**
       * Members post page setup
       */
      function vikinger_members_posts_page() {
        add_action('bp_template_content', 'vikinger_members_posts_page_screen_content');
        bp_core_load_template(apply_filters('bp_core_template_plugin', 'members/single/plugins'));
      }
    }

    if (!function_exists('vikinger_members_posts_page_screen_content')) {
      /**
       * Members post page HTML content
       */
      function vikinger_members_posts_page_screen_content() {
        $member = get_query_var('member');
        $post_count = count_user_posts($member['id']);

        /**
         * Section Header
         */
        get_template_part('template-part/section/section', 'header', [
          'section_pretitle'    => sprintf(
            esc_html_x('Browse %s', 'Section Header - Pretitle', 'vikinger'),
            $member['name']
          ),
          'section_title'       => esc_html__('Blog Posts', 'vikinger'),
          'section_text'        => $post_count
        ]);

        ?>
        <div id="post-preview-filterable-list" class="filterable-list" data-userid=<?php echo esc_attr($member['id']); ?>></div>
        <?php
      }
    }
  }

  // add vkmedia photos page if plugin is active
  if (bp_is_active('activity') && vikinger_plugin_vkmedia_is_active()) {
    if (vikinger_settings_media_file_upload_is_enabled('image')) {
      if (!function_exists('vikinger_members_photos_page_setup_nav')) {
        /**
         * Creates member photos page navigation
         */
        function vikinger_members_photos_page_setup_nav() {
          global $bp;

          bp_core_new_nav_item([
            'name'            => esc_html__('Photos', 'vikinger'),
            'slug'            => 'photos',
            'screen_function' => 'vikinger_members_photos_page',
            'position'        => 7
          ]);
        }
      }

      add_action('bp_setup_nav', 'vikinger_members_photos_page_setup_nav');

      if (!function_exists('vikinger_members_photos_page')) {
        /**
         * Members photos page setup
         */
        function vikinger_members_photos_page() {
          add_action('bp_template_content', 'vikinger_members_photos_page_screen_content');
          bp_core_load_template(apply_filters('bp_core_template_plugin', 'members/single/plugins'));
        }
      }

      if (!function_exists('vikinger_members_photos_page_screen_content')) {
        /**
         * Members photos page HTML content
         */
        function vikinger_members_photos_page_screen_content() {
          $member = get_query_var('member');

          ?>
          <div id="activity-photo-list" data-userid=<?php echo esc_attr($member['id']); ?>></div>
          <?php
        }
      }
    }

    if (vikinger_settings_media_file_upload_is_enabled('video')) {
      if (!function_exists('vikinger_members_videos_page_setup_nav')) {
        /**
         * Creates member videos page navigation
         */
        function vikinger_members_videos_page_setup_nav() {
          global $bp;

          bp_core_new_nav_item([
            'name'            => esc_html__('Videos', 'vikinger'),
            'slug'            => 'videos',
            'screen_function' => 'vikinger_members_videos_page',
            'position'        => 8
          ]);
        }
      }

      add_action('bp_setup_nav', 'vikinger_members_videos_page_setup_nav');

      if (!function_exists('vikinger_members_videos_page')) {
        /**
         * Members videos page setup
         */
        function vikinger_members_videos_page() {
          add_action('bp_template_content', 'vikinger_members_videos_page_screen_content');
          bp_core_load_template(apply_filters('bp_core_template_plugin', 'members/single/plugins'));
        }
      }

      if (!function_exists('vikinger_members_videos_page_screen_content')) {
        /**
         * Members videos page HTML content
         */
        function vikinger_members_videos_page_screen_content() {
          $member = get_query_var('member');

          ?>
          <div id="activity-video-list" data-userid=<?php echo esc_attr($member['id']); ?>></div>
          <?php
        }
      }
    }
  }

  // if GamiPress plugin is active, create profile pages for points, badges, quests and ranks
  if (vikinger_plugin_gamipress_is_active()) {
    if (vikinger_settings_members_profile_page_is_enabled('credits')) {
      if (!function_exists('vikinger_members_credits_page_setup_nav')) {
        /**
         * Creates member credits page navigation
         */
        function vikinger_members_credits_page_setup_nav() {
          global $bp;

          bp_core_new_nav_item([
            'name'            => esc_html__('Credits', 'vikinger'),
            'slug'            => 'credits',
            'screen_function' => 'vikinger_members_credits_page',
            'position'        => 9
          ]);
        }
      }

      add_action('bp_setup_nav', 'vikinger_members_credits_page_setup_nav');

      if (!function_exists('vikinger_members_credits_page')) {
        /**
         * Members credits page setup
         */
        function vikinger_members_credits_page() {
          add_action('bp_template_content', 'vikinger_members_credits_page_screen_content');
          bp_core_load_template(apply_filters('bp_core_template_plugin', 'members/single/plugins'));
        }
      }

      if (!function_exists('vikinger_members_credits_page_screen_content')) {
        /**
         * Members credits page HTML content
         */
        function vikinger_members_credits_page_screen_content() {
          $member = get_query_var('member');
          $points = vikinger_gamipress_get_user_points($member['id']);
          $point_count = count($points);

          /**
           * Section Header
           */
          get_template_part('template-part/section/section', 'header', [
            'section_pretitle'  => sprintf(
              esc_html_x('Browse %s', 'Section Header - Pretitle', 'vikinger'),
              $member['name']
            ),
            'section_title'     => esc_html__('Credits Balance', 'vikinger')
          ]);

          if ($point_count > 0) {
          ?>
            <div class="grid grid-3-3-3-3">
            <?php

              foreach ($points as $point) {
                /**
                 * Point Item Box
                 */
                get_template_part('template-part/point/point-item', 'box', [
                  'point' => $point
                ]);
              }
              
            ?>
            </div>
          <?php
          }
        }
      }
    }

    if (vikinger_settings_members_profile_page_is_enabled('badges') && vikinger_gamipress_achievement_type_exists('badge')) {
      if (!function_exists('vikinger_members_badges_page_setup_nav')) {
        /**
         * Creates member badges page navigation
         */
        function vikinger_members_badges_page_setup_nav() {
          global $bp;

          bp_core_new_nav_item([
            'name'            => esc_html__('Badges', 'vikinger'),
            'slug'            => 'badges',
            'screen_function' => 'vikinger_members_badges_page',
            'position'        => 10
          ]);
        }
      }

      add_action('bp_setup_nav', 'vikinger_members_badges_page_setup_nav');

      if (!function_exists('vikinger_members_badges_page')) {
        /**
         * Members badges page setup
         */
        function vikinger_members_badges_page() {
          add_action('bp_template_content', 'vikinger_members_badges_page_screen_content');
          bp_core_load_template(apply_filters('bp_core_template_plugin', 'members/single/plugins'));
        }
      }

      if (!function_exists('vikinger_members_badges_page_screen_content')) {
        /**
         * Members badges page HTML content
         */
        function vikinger_members_badges_page_screen_content() {
          $member = get_query_var('member');
          $badges = vikinger_gamipress_get_user_completed_achievements('badge', $member['id']);
          $badges_count = count($badges);

          /**
           * Section Header
           */
          get_template_part('template-part/section/section', 'header', [
            'section_pretitle'  => sprintf(
              esc_html_x('Browse %s', 'Section Header - Pretitle', 'vikinger'),
              $member['name']
            ),
            'section_title'     => esc_html__('Badges', 'vikinger'),
            'section_text'      => $badges_count
          ]);

          if ($badges_count > 0) {
          ?>
            <div class="grid grid-3-3-3-3">
            <?php
            foreach ($badges as $badge) {
              /**
               * Achievement Item Box
               */
              get_template_part('template-part/achievement/achievement', 'item-box', [
                'achievement' => $badge
              ]);
            }
            ?>
            </div>
          <?php
          }
        }
      }
    }

    if (vikinger_settings_members_profile_page_is_enabled('quests') && vikinger_gamipress_achievement_type_exists('quest')) {
      if (!function_exists('vikinger_members_quests_page_setup_nav')) {
        /**
         * Creates member quests page navigation
         */
        function vikinger_members_quests_page_setup_nav() {
          global $bp;

          bp_core_new_nav_item([
            'name'            => esc_html__('Quests', 'vikinger'),
            'slug'            => 'quests',
            'screen_function' => 'vikinger_members_quests_page',
            'position'        => 11
          ]);
        }
      }

      add_action('bp_setup_nav', 'vikinger_members_quests_page_setup_nav');

      if (!function_exists('vikinger_members_quests_page')) {
        /**
         * Members quests page setup
         */
        function vikinger_members_quests_page() {
          add_action('bp_template_content', 'vikinger_members_quests_page_screen_content');
          bp_core_load_template(apply_filters('bp_core_template_plugin', 'members/single/plugins'));
        }
      }

      if (!function_exists('vikinger_members_quests_page_screen_content')) {
        /**
         * Members quests page HTML content
         */
        function vikinger_members_quests_page_screen_content() {
          $member = get_query_var('member');
          $quests = vikinger_gamipress_get_user_completed_achievements('quest', $member['id']);
          $quests_count = count($quests);

          /**
           * Section Header
           */
          get_template_part('template-part/section/section', 'header', [
            'section_pretitle'  => sprintf(
              esc_html_x('Browse %s', 'Section Header - Pretitle', 'vikinger'),
              $member['name']
            ),
            'section_title'     => esc_html__('Quests', 'vikinger'),
            'section_text'      => $quests_count
          ]);

          if ($quests_count > 0) {
          ?>
            <div class="grid grid-3-3-3-3">
            <?php
            foreach ($quests as $quest) {
              /**
               * Achievement Item Box
               */
              get_template_part('template-part/achievement/achievement', 'item-box', [
                'achievement'             => $quest,
                'achievement_image_wrap'  => true
              ]);
            }
            ?>
            </div>
          <?php
          }
        }
      }
    }

    if (vikinger_settings_members_profile_page_is_enabled('ranks')) {
      if (!function_exists('vikinger_members_ranks_page_setup_nav')) {
        /**
         * Creates member ranks page navigation
         */
        function vikinger_members_ranks_page_setup_nav() {
          global $bp;

          bp_core_new_nav_item([
            'name'            => esc_html__('Ranks', 'vikinger'),
            'slug'            => 'ranks',
            'screen_function' => 'vikinger_members_ranks_page',
            'position'        => 12
          ]);
        }
      }

      add_action('bp_setup_nav', 'vikinger_members_ranks_page_setup_nav');

      if (!function_exists('vikinger_members_ranks_page')) {
        /**
         * Members ranks page setup
         */
        function vikinger_members_ranks_page() {
          add_action('bp_template_content', 'vikinger_members_ranks_page_screen_content');
          bp_core_load_template(apply_filters('bp_core_template_plugin', 'members/single/plugins'));
        }
      }

      if (!function_exists('vikinger_members_ranks_page_screen_content')) {
        /**
         * Members ranks page HTML content
         */
        function vikinger_members_ranks_page_screen_content() {
          $member = get_query_var('member');
          $ranks = vikinger_gamipress_get_user_completed_ranks('rank', $member['id']);
          $ranks_count = count($ranks);

          /**
           * Section Header
           */
          get_template_part('template-part/section/section', 'header', [
            'section_pretitle'  => sprintf(
              esc_html_x('Browse %s', 'Section Header - Pretitle', 'vikinger'),
              $member['name']
            ),
            'section_title'     => esc_html__('Rank', 'vikinger')
          ]);

          if ($ranks_count > 0) {
          ?>
            <div class="grid grid-3-3-3-3">
            <?php
            foreach ($ranks as $rank) {
              /**
               * Achievement Item Box
               */
              get_template_part('template-part/achievement/achievement', 'item-box', [
                'achievement'       => $rank,
                'achievement_type'  => 'rank'
              ]);
            }
            ?>
            </div>
          <?php
          }
        }
      }
    }
  }
}

// if buddypress and the settings component are active, create profile settings pages
if (vikinger_plugin_buddypress_is_active() && bp_is_active('settings')) {
  if (!function_exists('vikinger_members_settings_social_page_setup_nav')) {
    /**
     * Creates member social settings page navigation
     */
    function vikinger_members_settings_social_page_setup_nav() {
      global $bp;

      bp_core_new_subnav_item([
        'name'            => esc_html__('Social Settings', 'vikinger'),
        'slug'            => 'social',
        'parent_slug'     => bp_get_settings_slug(),
        'parent_url'      => trailingslashit(bp_loggedin_user_domain() . bp_get_settings_slug()),
        'screen_function' => 'vikinger_members_settings_social_page',
        'user_has_access' => bp_core_can_edit_settings()
      ], 'members');
    }
  }

  add_action('bp_setup_nav', 'vikinger_members_settings_social_page_setup_nav');

  if (!function_exists('vikinger_members_settings_social_page')) {
    /**
     * Members social page setup
     */
    function vikinger_members_settings_social_page() {
      add_action('bp_template_content', 'vikinger_members_settings_social_page_screen_content');
      bp_core_load_template(apply_filters('bp_core_template_plugin', 'members/single/plugins'));
    }
  }

  if (!function_exists('vikinger_members_settings_social_page_screen_content')) {
    /**
     * Members social page HTML content
     */
    function vikinger_members_settings_social_page_screen_content() {
      ?>
        <div id="social-settings-screen"></div>
      </div>
      <!-- /GRID -->
      <?php
    }
  }

  // if BuddyPress messages component is active, create message related pages
  if (bp_is_active('messages') && bp_is_active('friends')) {
    if (!function_exists('vikinger_members_settings_messages_page_setup_nav')) {
      /**
       * Creates member messages settings page navigation
       */
      function vikinger_members_settings_messages_page_setup_nav() {
        global $bp;

        bp_core_new_subnav_item([
          'name'            => esc_html__('Message Settings', 'vikinger'),
          'slug'            => 'messages',
          'parent_slug'     => bp_get_settings_slug(),
          'parent_url'      => trailingslashit(bp_loggedin_user_domain() . bp_get_settings_slug()),
          'screen_function' => 'vikinger_members_settings_messages_page',
          'user_has_access' => bp_core_can_edit_settings()
        ], 'members');
      }
    }

    add_action('bp_setup_nav', 'vikinger_members_settings_messages_page_setup_nav');

    if (!function_exists('vikinger_members_settings_messages_page')) {
      /**
       * Members messages page setup
       */
      function vikinger_members_settings_messages_page() {
        add_action('bp_template_content', 'vikinger_members_settings_messages_page_screen_content');
        bp_core_load_template(apply_filters('bp_core_template_plugin', 'members/single/plugins'));
      }
    }

    if (!function_exists('vikinger_members_settings_messages_page_screen_content')) {
      /**
       * Members messages page HTML content
       */
      function vikinger_members_settings_messages_page_screen_content() {
        // if BP Better Messages plugin is active, show its messages screen
        if (vikinger_plugin_bpbettermessages_is_active()) {
        ?>
          <!-- ACCOUNT HUB CONTENT -->
          <div class="account-hub-content">
        <?php
          /**
           * Section Header
           */
          get_template_part('template-part/section/section', 'header', [
            'section_pretitle'  => esc_html__('My Profile', 'vikinger'),
            'section_title'     => esc_html__('Messages', 'vikinger')
          ]);
    
          echo BP_Better_Messages()->functions->get_page();
    
        } else {
          $user_id = isset($_GET['user_id']) && is_numeric($_GET['user_id']) ? (int) $_GET['user_id'] : false;
          $message_id = isset($_GET['message_id']) && is_numeric($_GET['message_id']) ? (int) $_GET['message_id'] : false;
    
          if ($user_id) :
    
          ?>
            <div id="messages-settings-screen" data-userid="<?php echo esc_attr($user_id); ?>"></div>
            <?php
          
          elseif ($message_id) :
    
          ?>
            <div id="messages-settings-screen" data-messageid="<?php echo esc_attr($message_id); ?>"></div>
          <?php
          
          else :
    
          ?>
            <div id="messages-settings-screen"></div>
          <?php
    
          endif;
        }
        ?>
          </div>
          <!-- /ACCOUNT HUB CONTENT -->
        </div>
        <!-- /GRID -->
        <?php
      }
    }
  }

  // if BuddyPress friends component is active, create friend related pages
  if (bp_is_active('friends')) {
    if (!function_exists('vikinger_members_settings_friend_requests_page_setup_nav')) {
      /**
       * Creates member friend requests settings page navigation
       */
      function vikinger_members_settings_friend_requests_page_setup_nav() {
        global $bp;

        bp_core_new_subnav_item([
          'name'            => esc_html__('Friend Requests Settings', 'vikinger'),
          'slug'            => 'friend-requests',
          'parent_slug'     => bp_get_settings_slug(),
          'parent_url'      => trailingslashit(bp_loggedin_user_domain() . bp_get_settings_slug()),
          'screen_function' => 'vikinger_members_settings_friend_requests_page',
          'user_has_access' => bp_core_can_edit_settings()
        ], 'members');
      }
    }

    add_action('bp_setup_nav', 'vikinger_members_settings_friend_requests_page_setup_nav');

    if (!function_exists('vikinger_members_settings_friend_requests_page')) {
      /**
       * Members friend requests page setup
       */
      function vikinger_members_settings_friend_requests_page() {
        add_action('bp_template_content', 'vikinger_members_settings_friend_requests_page_screen_content');
        bp_core_load_template(apply_filters('bp_core_template_plugin', 'members/single/plugins'));
      }
    }

    if (!function_exists('vikinger_members_settings_friend_requests_page_screen_content')) {
      /**
       * Members friend requests page HTML content
       */
      function vikinger_members_settings_friend_requests_page_screen_content() {
        ?>
          <div id="friend-requests-settings-screen"></div>
        </div>
        <!-- /GRID -->
        <?php
      }
    }
  }

  if (!function_exists('vikinger_members_settings_account_info_page_setup_nav')) {
    /**
     * Creates member account info settings page navigation
     */
    function vikinger_members_settings_account_info_page_setup_nav() {
      global $bp;

      bp_core_new_subnav_item([
        'name'            => esc_html__('Account Info Settings', 'vikinger'),
        'slug'            => 'account',
        'parent_slug'     => bp_get_settings_slug(),
        'parent_url'      => trailingslashit(bp_loggedin_user_domain() . bp_get_settings_slug()),
        'screen_function' => 'vikinger_members_settings_account_info_page',
        'user_has_access' => bp_core_can_edit_settings()
      ], 'members');
    }
  }

  add_action('bp_setup_nav', 'vikinger_members_settings_account_info_page_setup_nav');

  if (!function_exists('vikinger_members_settings_account_info_page')) {
    /**
     * Members account info page setup
     */
    function vikinger_members_settings_account_info_page() {
      add_action('bp_template_content', 'vikinger_members_settings_account_info_page_screen_content');
      bp_core_load_template(apply_filters('bp_core_template_plugin', 'members/single/plugins'));
    }
  }

  if (!function_exists('vikinger_members_settings_account_info_page_screen_content')) {
    /**
     * Members account info page HTML content
     */
    function vikinger_members_settings_account_info_page_screen_content() {
      ?>
        <div id="account-info-settings-screen"></div>
      </div>
      <!-- /GRID -->
      <?php
    }
  }

  if (!function_exists('vikinger_members_settings_account_settings_page_setup_nav')) {
    /**
     * Creates member account settings settings page navigation
     */
    function vikinger_members_settings_account_settings_page_setup_nav() {
      global $bp;

      bp_core_new_subnav_item([
        'name'            => esc_html__('Account Settings', 'vikinger'),
        'slug'            => 'account-settings',
        'parent_slug'     => bp_get_settings_slug(),
        'parent_url'      => trailingslashit(bp_loggedin_user_domain() . bp_get_settings_slug()),
        'screen_function' => 'vikinger_members_settings_account_settings_page',
        'user_has_access' => bp_core_can_edit_settings()
      ], 'members');
    }
  }

  add_action('bp_setup_nav', 'vikinger_members_settings_account_settings_page_setup_nav');

  if (!function_exists('vikinger_members_settings_account_settings_page')) {
    /**
     * Members account settings page setup
     */
    function vikinger_members_settings_account_settings_page() {
      add_action('bp_template_content', 'vikinger_members_settings_account_settings_page_screen_content');
      bp_core_load_template(apply_filters('bp_core_template_plugin', 'members/single/plugins'));
    }
  }

  if (!function_exists('vikinger_members_settings_account_settings_page_screen_content')) {
    /**
     * Members account settings page HTML content
     */
    function vikinger_members_settings_account_settings_page_screen_content() {
      $member = get_query_var('member');

    ?>
      <!-- ACCOUNT HUB CONTENT -->
      <div class="account-hub-content">
      <?php

        /**
         * Section Header
         */
        get_template_part('template-part/section/section', 'header', [
          'section_pretitle'  => esc_html__('Account', 'vikinger'),
          'section_title'     => esc_html__('Account Settings', 'vikinger')
        ]);

      ?>
        <!-- GRID COLUMN -->
        <div class="grid-column">
          <!-- WIDGET BOX -->
          <div class="widget-box">
            <!-- WIDGET BOX TITLE -->
            <p class="widget-box-title"><?php esc_html_e('Delete Account', 'vikinger'); ?></p>
            <!-- /WIDGET BOX TITLE -->

            <!-- WIDGET BOX CONTENT -->
            <div class="widget-box-content">
            <?php

              if (is_super_admin($member['id'])) {
                /**
                 * Alert Line
                 */
                get_template_part('template-part/alert/alert', 'line', [
                  'type'  =>  'info',
                  'text'  =>  sprintf(
                                esc_html__('%sDelete Account:%s Site admins cannot be deleted.', 'vikinger'),
                                '<span class="bold">',
                                '</span>'
                              )
                ]);
              } else if (bp_disable_account_deletion()) {
                /**
                 * Alert Line
                 */
                get_template_part('template-part/alert/alert', 'line', [
                  'type'  =>  'info',
                  'text'  =>  sprintf(
                                esc_html__('%sDelete Account Disabled:%s Please contact the site administrator to request account deletion.', 'vikinger'),
                                '<span class="bold">',
                                '</span>'
                              )
                ]);
              } else {
                /**
                 * Alert Line
                 */
                get_template_part('template-part/alert/alert', 'line', [
                  'type'  =>  'error',
                  'text'  =>  sprintf(
                                esc_html__('%sWarning:%s deleting your account will delete all of the content you have created. It will be completely irrecoverable.', 'vikinger'),
                                '<span class="bold">',
                                '</span>'
                              )
                ]);

            ?>

              <!-- BUTTON -->
              <div id="vk-user-account-delete" class="button tertiary button-loader">
                <span class="button-text"><?php esc_html_e('Delete My Account', 'vikinger'); ?></span>
                <span class="button-loading-text"><?php esc_html_e('Deleting...', 'vikinger'); ?></span>
                <!-- LOADER SPINNER WRAP -->
                <div class="loader-spinner-wrap small">
                  <!-- LOADER SPINNER -->
                  <div class="loader-spinner"></div>
                  <!-- /LOADER SPINNER -->
                </div>
                <!-- /LOADER SPINNER WRAP -->
              </div>
              <!-- /BUTTON -->
            <?php

              }

            ?>
            </div>
            <!-- /WIDGET BOX CONTENT -->
          </div>
          <!-- /WIDGET BOX -->
        </div>
        <!-- /GRID COLUMN -->
      </div>
      <!-- /ACCOUNT HUB CONTENT -->
    </div>
    <!-- /GRID -->
    <?php
    }
  }

  if (!function_exists('vikinger_members_settings_password_page_setup_nav')) {
    /**
     * Creates member password settings page navigation
     */
    function vikinger_members_settings_password_page_setup_nav() {
      global $bp;

      bp_core_new_subnav_item([
        'name'            => esc_html__('Password Settings', 'vikinger'),
        'slug'            => 'password',
        'parent_slug'     => bp_get_settings_slug(),
        'parent_url'      => trailingslashit(bp_loggedin_user_domain() . bp_get_settings_slug()),
        'screen_function' => 'vikinger_members_settings_password_page',
        'user_has_access' => bp_core_can_edit_settings()
      ], 'members');
    }
  }

  add_action('bp_setup_nav', 'vikinger_members_settings_password_page_setup_nav');

  if (!function_exists('vikinger_members_settings_password_page')) {
    /**
     * Members password page setup
     */
    function vikinger_members_settings_password_page() {
      add_action('bp_template_content', 'vikinger_members_settings_password_page_screen_content');
      bp_core_load_template(apply_filters('bp_core_template_plugin', 'members/single/plugins'));
    }
  }

  if (!function_exists('vikinger_members_settings_password_page_screen_content')) {
    /**
     * Members password page HTML content
     */
    function vikinger_members_settings_password_page_screen_content() {
      ?>
        <div id="password-settings-screen"></div>
      </div>
      <!-- /GRID -->
      <?php
    }
  }

  if (!function_exists('vikinger_members_settings_email_settings_page_setup_nav')) {
    /**
     * Creates member email settings page navigation
     */
    function vikinger_members_settings_email_settings_page_setup_nav() {
      global $bp;

      bp_core_new_subnav_item([
        'name'            => esc_html__('Email Settings', 'vikinger'),
        'slug'            => 'email-settings',
        'parent_slug'     => bp_get_settings_slug(),
        'parent_url'      => trailingslashit(bp_loggedin_user_domain() . bp_get_settings_slug()),
        'screen_function' => 'vikinger_members_settings_email_settings_page',
        'user_has_access' => bp_core_can_edit_settings()
      ], 'members');
    }
  }

  add_action('bp_setup_nav', 'vikinger_members_settings_email_settings_page_setup_nav');

  if (!function_exists('vikinger_members_settings_email_settings_page')) {
    /**
     * Members email settings page setup
     */
    function vikinger_members_settings_email_settings_page() {
      add_action('bp_template_content', 'vikinger_members_settings_email_settings_page_screen_content');
      bp_core_load_template(apply_filters('bp_core_template_plugin', 'members/single/plugins'));
    }
  }

  if (!function_exists('vikinger_members_settings_email_settings_page_screen_content')) {
    /**
     * Members email settings page HTML content
     */
    function vikinger_members_settings_email_settings_page_screen_content() {
      ?>
        <div id="email-settings-screen"></div>
      </div>
      <!-- /GRID -->
      <?php
    }
  }

  // if BuddyPress groups component is active, create group manage related pages
  if (bp_is_active('groups')) {
    if (!function_exists('vikinger_members_settings_manage_groups_page_setup_nav')) {
      /**
       * Creates member manage groups settings page navigation
       */
      function vikinger_members_settings_manage_groups_page_setup_nav() {
        global $bp;

        bp_core_new_subnav_item([
          'name'            => esc_html__('Manage Groups Settings', 'vikinger'),
          'slug'            => 'manage-groups',
          'parent_slug'     => bp_get_settings_slug(),
          'parent_url'      => trailingslashit(bp_loggedin_user_domain() . bp_get_settings_slug()),
          'screen_function' => 'vikinger_members_settings_manage_groups_page',
          'user_has_access' => bp_core_can_edit_settings()
        ], 'members');
      }
    }

    add_action('bp_setup_nav', 'vikinger_members_settings_manage_groups_page_setup_nav');

    if (!function_exists('vikinger_members_settings_manage_groups_page')) {
      /**
       * Members manage groups page setup
       */
      function vikinger_members_settings_manage_groups_page() {
        add_action('bp_template_content', 'vikinger_members_settings_manage_groups_page_screen_content');
        bp_core_load_template(apply_filters('bp_core_template_plugin', 'members/single/plugins'));
      }
    }

    if (!function_exists('vikinger_members_settings_manage_groups_page_screen_content')) {
      /**
       * Members manage groups page HTML content
       */
      function vikinger_members_settings_manage_groups_page_screen_content() {
        ?>
          <div id="manage-groups-settings-screen"></div>
        </div>
        <!-- /GRID -->
        <?php
      }
    }

    if (!function_exists('vikinger_members_settings_send_group_invitations_page_setup_nav')) {
      /**
       * Creates member send group invitations settings page navigation
       */
      function vikinger_members_settings_send_group_invitations_page_setup_nav() {
        global $bp;

        bp_core_new_subnav_item([
          'name'            => esc_html__('Send Group Invitations Settings', 'vikinger'),
          'slug'            => 'send-group-invitations',
          'parent_slug'     => bp_get_settings_slug(),
          'parent_url'      => trailingslashit(bp_loggedin_user_domain() . bp_get_settings_slug()),
          'screen_function' => 'vikinger_members_settings_send_group_invitations_page',
          'user_has_access' => bp_core_can_edit_settings()
        ], 'members');
      }
    }

    add_action('bp_setup_nav', 'vikinger_members_settings_send_group_invitations_page_setup_nav');

    if (!function_exists('vikinger_members_settings_send_group_invitations_page')) {
      /**
       * Members send group invitations page setup
       */
      function vikinger_members_settings_send_group_invitations_page() {
        add_action('bp_template_content', 'vikinger_members_settings_send_group_invitations_page_screen_content');
        bp_core_load_template(apply_filters('bp_core_template_plugin', 'members/single/plugins'));
      }
    }

    if (!function_exists('vikinger_members_settings_send_group_invitations_page_screen_content')) {
      /**
       * Members send group invitations page HTML content
       */
      function vikinger_members_settings_send_group_invitations_page_screen_content() {
        ?>
          <div id="send-group-invitations-settings-screen"></div>
        </div>
        <!-- /GRID -->
        <?php
      }
    }

    if (!function_exists('vikinger_members_settings_received_group_invitations_page_setup_nav')) {
      /**
       * Creates member received group invitations settings page navigation
       */
      function vikinger_members_settings_received_group_invitations_page_setup_nav() {
        global $bp;

        bp_core_new_subnav_item([
          'name'            => esc_html__('Received Group Invitations Settings', 'vikinger'),
          'slug'            => 'received-group-invitations',
          'parent_slug'     => bp_get_settings_slug(),
          'parent_url'      => trailingslashit(bp_loggedin_user_domain() . bp_get_settings_slug()),
          'screen_function' => 'vikinger_members_settings_received_group_invitations_page',
          'user_has_access' => bp_core_can_edit_settings()
        ], 'members');
      }
    }

    add_action('bp_setup_nav', 'vikinger_members_settings_received_group_invitations_page_setup_nav');

    if (!function_exists('vikinger_members_settings_received_group_invitations_page')) {
      /**
       * Members received group invitations page setup
       */
      function vikinger_members_settings_received_group_invitations_page() {
        add_action('bp_template_content', 'vikinger_members_settings_received_group_invitations_page_screen_content');
        bp_core_load_template(apply_filters('bp_core_template_plugin', 'members/single/plugins'));
      }
    }

    if (!function_exists('vikinger_members_settings_received_group_invitations_page_screen_content')) {
      /**
       * Members received group invitations page HTML content
       */
      function vikinger_members_settings_received_group_invitations_page_screen_content() {
        ?>
          <div id="received-group-invitations-settings-screen"></div>
        </div>
        <!-- /GRID -->
        <?php
      }
    }

    if (!function_exists('vikinger_members_settings_group_membership_requests_page_setup_nav')) {
      /**
       * Creates group membership requests settings page navigation
       */
      function vikinger_members_settings_group_membership_requests_page_setup_nav() {
        global $bp;

        bp_core_new_subnav_item([
          'name'            => esc_html__('Membership Requests Settings', 'vikinger'),
          'slug'            => 'membership-requests',
          'parent_slug'     => bp_get_settings_slug(),
          'parent_url'      => trailingslashit(bp_loggedin_user_domain() . bp_get_settings_slug()),
          'screen_function' => 'vikinger_members_settings_group_membership_requests_page',
          'user_has_access' => bp_core_can_edit_settings()
        ], 'members');
      }
    }

    add_action('bp_setup_nav', 'vikinger_members_settings_group_membership_requests_page_setup_nav');

    if (!function_exists('vikinger_members_settings_group_membership_requests_page')) {
      /**
       * Members received group invitations page setup
       */
      function vikinger_members_settings_group_membership_requests_page() {
        add_action('bp_template_content', 'vikinger_members_settings_group_membership_requests_page_screen_content');
        bp_core_load_template(apply_filters('bp_core_template_plugin', 'members/single/plugins'));
      }
    }

    if (!function_exists('vikinger_members_settings_group_membership_requests_page_screen_content')) {
      /**
       * Members received group invitations page HTML content
       */
      function vikinger_members_settings_group_membership_requests_page_screen_content() {
        ?>
          <div id="group-membership-requests-settings-screen"></div>
        </div>
        <!-- /GRID -->
        <?php
      }
    }
  }
}

if (!function_exists('vikinger_members_remove_unused_subnav_items')) {
  /**
   * Remove unused member subnav pages
   */
  function vikinger_members_remove_unused_subnav_items() {
    bp_core_remove_nav_item('profile', 'members');
    bp_core_remove_nav_item('notifications', 'members');
    bp_core_remove_nav_item('messages', 'members');

    bp_core_remove_subnav_item('activity', 'mentions', 'members');
    bp_core_remove_subnav_item('activity', 'favorites', 'members');
    bp_core_remove_subnav_item('activity', 'friends', 'members');
    bp_core_remove_subnav_item('activity', 'groups', 'members');

    bp_core_remove_subnav_item('friends', 'requests', 'members');

    bp_core_remove_subnav_item('groups', 'invites', 'members');

    bp_core_remove_subnav_item('settings', 'data', 'members');
    bp_core_remove_subnav_item('settings', 'profile', 'members');
  }
}

add_action('bp_setup_nav', 'vikinger_members_remove_unused_subnav_items');

if (!function_exists('vikinger_groups_remove_unused_subnav_items')) {
  /**
   * Remove unused group subnav pages
   */
  function vikinger_groups_remove_unused_subnav_items() {
    if (!bp_is_group()) {
      return;
    }

    $slug = bp_get_current_group_slug();

    bp_core_remove_subnav_item($slug, 'admin', 'groups');
    bp_core_remove_subnav_item($slug, 'send-invites', 'groups');

    $parent_slug = $slug . '_manage';

    $hide_tabs = array(
      'edit-details'      => 1,
      'group-settings'    => 1,
      'group-avatar'      => 1,
      'group-cover-image' => 1,
      'manage-members'    => 1,
      'delete-group'      => 1
    );
    
    foreach (array_keys($hide_tabs) as $tab) {
      bp_core_remove_subnav_item($parent_slug, $tab, 'groups');
    }

    // redirect to groups page
    if (!empty($hide_tabs[bp_action_variable(0)])) {
      bp_core_redirect(bp_get_group_permalink(groups_get_current_group()));
    }
  }
}

add_action('bp_actions', 'vikinger_groups_remove_unused_subnav_items');

?>