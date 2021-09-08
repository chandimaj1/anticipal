<?php
namespace PublishPress\Permissions;

use PublishPress\Permissions\UI\Settings as Settings;

class AdminLoadPro {
    function __construct() {
        add_filter('presspermit_default_options', [$this, 'defaultOptions']);
        add_filter('presspermit_netwide_options', [$this, 'netwideOptions']);
        add_filter('presspermit_option_captions', [$this, 'optionCaptions'], 20);
        add_filter('presspermit_option_sections', [$this, 'optionSections'], 20);

        add_filter('presspermit_admin_get_string', [$this, 'fltAdminGetStr'], 10, 2);
        add_filter('presspermit_get_constant_descript', [$this, 'fltGetConstantDescription'], 10, 2);

        add_action('presspermit_load_modules', [$this, 'loadModules']);
    }

    public function defaultOptions($options) {
        $options['display_branding'] = 1;
        return $options;
    }

    public function netwideOptions($netwide) {
        $netwide []= 'display_branding';
        return $netwide;
    }
 
    public function optionCaptions($captions)
    {
        $opt = [
            'display_branding' => __('Display PublishPress Branding in Admin', 'presspermit-pro-hints'),
        ];

        return array_merge($captions, $opt);
    }

    public function optionSections($sections)
    {
        $new = [
            'admin' => ['display_branding'],
        ];

        $key = 'core';

        if (isset($sections[$key]['admin'])) {
            $sections[$key]['admin'] = array_merge($sections[$key]['admin'], $new['admin']);
        } else {
            $sections[$key] = (isset($sections[$key])) ? array_merge($sections[$key], $new) : $new;
        }

        return $sections;
    }


    public function loadModules($args)
    {
        $defaults = ['available_modules' => [], 'inactive_modules' => []];
        foreach(array_keys($defaults) as $var) {
            $$var = $args[$var];
        }

        $dir = PRESSPERMIT_PRO_ABSPATH . '/modules/';

        foreach($available_modules as $module) {
            if (empty($inactive_modules[$module]) && file_exists("$dir/$module/$module.php")) {
                include_once("$dir/$module/$module.php");
            }
        }
    }

    public function fltAdminGetStr($display_string, $string_id) {
        switch ($string_id) {

            case 'module_settings_tagline' :
            return __('Additional settings provided by the %s module.', 'presspermit-pro-hints');
        
            // Install
            case 'key-deactivation' :
            return __('note: If you deactive, re-entry of the license key will be required for re-activation.', 'presspermit-pro-hints');
            

            // Compat
            case 'netwide_groups' :
            return __('If enabled, custom group membership is applied network-wide (though role assignments are still site-specific).', 'presspermit-pro-hints');

            case 'cap_pp_create_network_groups' :
            return __('Can create network-wide permission groups', 'presspermit-pro-hints');

            case 'cap_pp_manage_network_members' : 
            return __('If group editing is allowed, can also modify network group membership', 'presspermit-pro-hints');


            // File Filtering
            case 'file_filtering' :
            return __('Block direct URL access to images and other uploaded files in the WordPress uploads folder which are attached to posts that the user cannot read.  For each protected file, a separate RewriteRule will be added to the .htaccess file in this site&apos;s uploads folder.  Non-protected files are returned with no script execution whatsoever.', 'presspermit-pro-hints');
        
            case 'ms_blogs_file_filtering_config' :
            return __('File Filtering on multisite installations will require the following rules to be inserted above the stock ms-files.php rules in the %1$smain .htaccess file%2$s:', 'presspermit-pro-hints');
        
            case 'ms_blogs_htaccess_missing' :
            return __('But your .htaccess is missing or not writeable!', 'presspermit-pro-hints');
        
            case 'ms_blogs_htaccess_needs_update' :
            return __('.htaccess needs to be updated to include these rules.', 'presspermit-pro-hints');
        
            case 'ms_blogs_htaccess_ok' :
            return __('.htaccess file has all required rules.', 'presspermit-pro-hints');
            
            case 'ms_blogs_rule_maint' :
            return __('These rules will not be inserted automatically.  You are responsible for editing .htaccess and later removing the rules if the functionality is no longer desired.', 'presspermit-pro-hints');

            case 'ms_blogs_rule_maint_note' :
            return __('Note that an additional rule will need to be added with each new site. %1$sTo eliminate this requirement, research "WordPress remove ms-files".%2$s', 'presspermit-pro-hints');
    
            case 'ms_blogs_network_activated_warning' :
            return __("You will need to manually restore the .htacces file to default contents if anything goes wrong. Proceed?", 'presspermit-pro-hints');
        
            case 'ms_blogs_network_update_htaccess' :
            return __('Update .htaccess now', 'presspermit-pro-hints');
        
            case 'ms_blogs_network_update_htaccess_if_files' :
            return __('only for sites with protected files', 'presspermit-pro-hints');

            case 'ms_blogs_network_update_htaccess_all_site' :
            return __('for all sites', 'presspermit-pro-hints');

            case 'ms_blogs_network_update_htaccess_remove_rules' :
            return __('NONE: remove Permissions rules', 'presspermit-pro-hints');
        
            case 'ms_blogs_not_network_activated' :
            return __('Since the plugin is not network-activated, you will need to modify the .htaccess file manually, inserting a RewriteRule as shown above for each site which needs file filtering.', 'presspermit-pro-hints');

            case 'unattached_files_private' :
            return __('Make unattached files unreadable to users who do not have the edit_private_files or pp_list_all_files capability.', 'presspermit-pro-hints');
    
            case 'attached_files_private' :
            return  __('Make attached files unreadable to users who do not have the edit_private_files or pp_list_all_files capability.', 'presspermit-pro-hints');
        
            case 'small_thumbnails_unfiltered' :
            return __('If Media Library performance and disclosure would be acceptable, you can disable file filtering for thumbnails (size specified in Settings > Media).', 'presspermit-pro-hints');
        
            case 'file_filtering_regen_multisite' :
            return __('To trigger regeneration of %1$suploads/.htaccess%2$s with new file URL keys (at next site access), execute the following URL:', 'presspermit-pro-hints');

            case 'file_filtering_regen' :
            return __('To trigger regeneration of %1$suploads/.htaccess%2$s with new file URL keys, execute the following URL:', 'presspermit-pro-hints');
        
            case 'file_filtering_regen_best_practice' :
            return __('Best practice is to access the above url periodically (using your own cron service) to prevent long-term bookmarking of protected files.', 'presspermit-pro-hints'); 

            case 'file_filtering_regen_key_prompt' :
            return __('Supply a custom key which will enable a support url to regenerate file access keys.  Then execute the url regularly (using your own cron service) to prevent long-term bookmarking of protected files.', 'presspermit-pro-hints');
    
            case 'file_filtering_regen_attachment_util' :
            return __('%1$sNote:%2$s FTP-uploaded files will not be filtered correctly until you run the %3$sAttachments Utility%4$s.', 'presspermit-pro-hints');
        
            case 'file_filtering_regen_nginx' :
            return __('For Nginx integration, see readme.txt in your plugins/file-access folder.', 'presspermit-pro-hints');
        

            // File Attachments Utility
            case 'attachments_util_invalid_regen_key' :
            return __('Invalid file filtering key argument.', 'presspermit-pro-hints');

            case 'attachments_util_no_regen_key' :
            return __('Please configure File Filtering options!', 'presspermit-pro-hints');

            case 'attachments_util_disclaimer' :
            return __("PublishPress Permissions can limit direct URL access to files linked from your posts and pages, <strong>but only if</strong> the following requirements are met:", 'presspermit-pro-hints');

            case 'attachments_util_wp_tree' :
            return __('Your WP content directory must be a branch of the WordPress directory tree (i.e. wp-config.php must not be customized to separate WP_CONTENT_DIR and WP_CONTENT_URL from the main WordPress folder).', 'presspermit-pro-hints');

            case 'attachments_util_www' :
            return __('Note that to be detected as attachments, your file references must <strong>include www.</strong>');
        
            case 'attachments_util_no_www' :
            return __('Note that to be detected as attachments, your file references must <strong>NOT include www.</strong>');

            case 'attachments_util_search_replace' :
            return __('Files linked from WP Posts and Pages must be in %1$s (or a subdirectory of it) to be filtered. After moving files, you may use %2$s a search and replace plugin%3$s to conveniently update the URLs stored in your Post / Page content. %4$s', 'presspermit-pro-hints');
    
            case 'attachments_util_postmeta_link' :
            return __('Files which are <strong>already appropriately located and linked</strong> must also have their post-file attachment relationship stored to the WP database.  This is normally accomplished by clicking the "Insert into Post" button in the WP file uploader / Media Library.  Files which were instead uploaded manually via FTP or CPanel <strong>can receive their attachment record via this utility</strong>.', 'presspermit-pro-hints');
        
            case 'attachments_util_cron_task' :
            return __('To execute this utility by cron task or other direct request, execute the following URL:', 'presspermit-pro-hints');
        
            case 'attachments_util_cron_task_need_regen_key' :
            return sprintf(
                __('To execute this utility by direct URL, set a file filtering regen key on %1$sPermissions Settings%2$s', 'presspermit-pro-hints'), 
                "<a href='admin.php?page=presspermit-settings&pp_tab=file_access' target='_blank'>", 
                '</a>'
            );

            case 'attachments_util_external_content_dir' :
            return __('<strong>Note</strong>: Direct access to uploaded file attachments cannot be filtered because your WP_CONTENT_DIR is not in the WordPress branch.', 'presspermit-pro-hints');

            case 'attachments_util_terminated' :
            return __('The operation was terminated due to an invalid configuration.', 'presspermit-pro-hints');

            case 'attachments_util_checking_posts_pages' :
            return __("<strong>checking %s posts / pages...</strong>", 'presspermit-pro-hints');
        
            case 'attachments_util_skipping_unfilterable' :
            return __('%1$s skipping unfilterable file in %2$s "%3$s":%4$s %5$s', 'presspermit-pro-hints');

            case 'attachments_util_skipping_missing' :
            return __('%1$s skipping missing file in %2$s "%3$s":%4$s %5$s', 'presspermit-pro-hints');
    
            case 'attachments_util_new_attachment' :
            return __('%1$s<strong>new attachment</strong> in %2$s "%3$s":%4$s %5$s', 'presspermit-pro-hints');
        
            case 'attachments_util_attachment_ok' :
            return __('%1$s<strong>new attachment</strong> in %2$s "%3$s":%4$s %5$s', 'presspermit-pro-hints');
            
            case 'attachments_util_linked_uploads_found' :
            return __("Operation complete: %s linked uploads were found in your post / page content.", 'presspermit-pro-hints');

            case 'attachments_util_files_added' :
            return __('<strong>%s attachment records were added to the database.</strong>', 'presspermit-pro-hints');

            case 'attachments_util_already_registered' :
            return __('All linked uploads are already registered as attachments.', 'presspermit-pro-hints');


            // Statuses Admin Page
            case 'define_privacy_statuses' :
            return __("Statuses enabled here are available as Visibility options for post publishing. Affected posts become inaccessable without a corresponding status-specific role assignment.", 'presspermit-pro-hints');
            
            case 'define_moderation_statuses' :
            return __("Statuses enabled here are available in the editor as additional steps between Draft and Published.", 'presspermit-pro-hints');

            case 'statuses_alter_accessibility' :
            return __("Statuses alter your content's accessibility by imposing additional capability requirements.", 'presspermit-pro-hints');

            case 'statuses_enable_custom_capabilities' :
            return __('Enable Custom Capabilities by toggling the link below status name. If enabled, non-Editors will need a corresponding %ssupplemental role%s to edit posts of that status.', 'presspermit-pro-hints');

            case 'statuses_moderation_default_by_sequence' :
            return __('For post edit by a user who cannot publish, %sworkflow is configured%s to make the Publish button increment the post to the next workflow status permitted.', 'presspermit-pro-hints');

            case 'statuses_moderation_workflow_gutenberg' :
            return __('For post edit by a user who cannot publish, %sworkflow is configured%s to make the Publish button escalate the post to the highest-ordered workflow status permitted.', 'presspermit-pro-hints');

            case 'statuses_moderation_workflow_classic' :
            return __('For post edit by a user who cannot publish, the Publish button will escalate the post to the highest-order status permitted to the user.', 'presspermit-pro-hints');

            case 'need_publishpress_statuses_enabled' :
            return __('Please enable the PublishPress %sStatuses feature%s.', 'presspermit-pro-hints');

            case 'statuses_permissions_post_type_enable_note' :
            return __('Note that the Post Type itself will also need to have %sPermissions%s enabled.', 'presspermit-pro-hints');

            case 'statuses_need_collab_module' :
            return __('To define moderation statuses, %1$sactivate the Collaborative Publishing module%2$s.', 'presspermit');


            // Statuses
            case 'posts_using_custom_privacy' :
            return __('To disable privacy statuses, first re-assign posts to a different status.', 'presspermit-pro-hints');

            case 'custom_privacy_edit_caps' :
            $caption = __('Should pages with privacy status "premium" require set_pages_premium and edit_premium_pages capabilities? If so, you can %1$sassign a status-specific Page Editor role%2$s or %3$sadd the capabilities directly to a role%4$s.', 'presspermit-pro-hints');

            if (defined('PUBLISHPRESS_CAPS_VERSION')) {
                $url = admin_url('admin.php?page=capsman');

                return sprintf(
                    $caption,
                    "<a href='" . admin_url('?page=presspermit-groups') . "'>",
                    '</a>',
                    '<a href="' . $url . '">',
                    '</a>'
                );
            } else {
                $url = Settings::pluginInfoURL('capability-manager-enhanced');

                return sprintf(
                    $caption,
                    "<a href='" . admin_url('?page=presspermit-groups') . "'>",
                    '</a>',
                    '<span class="plugins update-message"><a href="' . $url . '" class="thickbox" title=" PublishPress Capabilities">',
                    '</a></span>'
                );
            }
            
            case 'supplemental_cap_moderate_any' :
            return __('Note, this only applies if the role definition includes the pp_moderate_any capability', 'presspermit-pro-hints');

            case 'moderation_statuses_default_by_sequence' :
            return  sprintf(__('Note: Workflow sequence and branching for pre-publication is configured %son a separate screen%s', 'presspermit-pro-hints'), '<a href="' . admin_url('admin.php?page=presspermit-statuses&attrib_type=moderation') . '">', '</a>');

            case 'cap_pp_define_post_status' :
            return __('Create or edit custom Privacy or Workflow statuses', 'presspermit-pro-hints');

            case 'cap_pp_define_moderation' :
            return __('Create or edit Publication Workflow statuses', 'presspermit-pro-hints');
    
            case 'cap_pp_define_privacy' :
            return __('Create or edit custom Privacy statuses', 'presspermit-pro-hints');

            case 'cap_set_posts_status' :
            return __('Pertains to assignment of a custom privacy or moderation status. This capability in a WP role enables PP to assign a type-specific supplemental role with custom capabilities such as "set_pages_approved"', 'presspermit-pro-hints');

            case 'cap_pp_moderate_any' :
            return __('Editors can edit posts having a moderation status (i.e. Approved) without a supplemental status-specific role', 'presspermit-pro-hints');


            // Sync

            case 'sync_title_sync_posts_to_users_post_field' :
            return esc_attr(__('Post property or meta field to match with user field', 'presspermit-pro-hints'));

            case 'sync_title_sync_posts_to_users_user_field' :
            return esc_attr(__('User property or meta field to match with post field', 'presspermit-pro-hints'));
    
            case 'sync_title_sync_posts_to_users_user_field_text' :
            return esc_attr(__('User meta field to match with post field', 'presspermit-pro-hints'));

            case 'sync_title_sync_posts_to_users_role' :
            return esc_attr(__('User role to include in synchronization', 'presspermit-pro-hints'));

            case 'sync_title_sync_posts_to_users_post_parent' :
            return esc_attr(__('Parent id for created posts', 'presspermit-pro-hints'));
    
            case 'sync_title_suggestions' :
            return esc_attr(__('Choose post field from suggested meta key names', 'presspermit-pro-hints'));

            case 'sync_title_main_checkbox' :
            return esc_attr(__('When a new user of specified role is added, create or designate a post for them.', 'presspermit-pro-hints'));

            case 'sync_existing_title' :
            return  esc_attr(__('Create or designate a post for existing users.', 'presspermit-pro-hints'));

            case 'sync_not_hierarchical' :
            return  esc_attr(__('This post type is not hierarchical', 'presspermit-pro-hints'));

            case 'sync_posts_to_users' :
            return __('Establish a dedicated post for each qualified user.', 'presspermit-pro-hints');

            case 'create_post_for_meta_detection' :
            return __( 'Hint: If %s have custom fields (like email address), create one to assist field name discovery.', 'presspermit-pro-hints' );

            case 'sync_posts_to_users_apply_permissions' :
            return __('Enable users to edit their own synchronized post.', 'presspermit-pro-hints');

            case 'sync_explanation' :
            return sprintf(__('Note: This generates a post (of selected type) for each current or future %suser%s in the selected role.', 'presspermit-pro-hints'), '<a href="' . admin_url('users.php') . '" target="_blank">', '</a>');

            case 'sync_team_staff_plugins' :
            return __('It is designed to bring setup convenience and delegated editing permissions to Team / Staff plugins, but has broad usage potential.', 'presspermit-pro-hints'); 

            case 'sync_post_user_match_fields' :
            return __('Post / User match fields allow existing Users to be designated as the Author (owner) of an exiting post.', 'presspermit-pro-hints'); 

            case 'sync_new_post_creation' :
            return __('If a user cannot be matched to an existing post, a new post is created for them.', 'presspermit-pro-hints'); 
    
            case 'sync_grant_author_permissions' :
            return _e('These users will be enabled to edit their synchronized post if "Grant Author Permissions" is enabled.  This works by automating the following configuration:', 'presspermit-pro-hints'); 

            case 'sync_permissions_filtering_enable' :
            return sprintf(
                __('Permissions filtering is turned on for the post type: %1$sPermissions > Core > Filtered Post Types%2$s', 'presspermit-pro-hints'), 
                '<a class="pp-options-core-tab" href="javascript:void(0)">', 
                '</a>'
            ); 

            case 'sync_role_supplemented_author_caps' :
            return sprintf(
                __('The synchronized role is supplemented with Author capabilities for the post type: %1$sPermissions > Groups%2$s > [Role Name]', 'presspermit-pro-hints'), 
                '<a href="' . admin_url("admin.php?page=presspermit-groups") . '" target="_blank">', 
                '</a>'
            ); 

            case 'sync_developer_note_api' :
            return __('Developer note: User matches and Post data may be customized using filters and actions.', 'presspermit-pro-hints'); 

            case 'sync_plugin_compat_disclaimer' :
            return __('This feature works with most Team / Staff plugins. However, the following are NOT fully compatible. With these plugins, PublishPress Permissions can sync and set editing permissions for teams, but not individual team members:', 'presspermit-pro-hints'); 

            case 'sync_not_fully_compatible' :
            return __('This plugin is NOT fully compatible.', 'presspermit-pro-hints');


            // Teaser
            case 'teaser_tab' :
            return sprintf(__('Settings for replacing unreadable content with teaser text, provided by the %s module.', 'presspermit-pro-hints'), __('Teaser', 'ppe'));

            case 'teaser_block_all_rss' :
            return __('Since some browsers will cache feeds without regard to user login, block RSS content even for qualified users.', 'presspermit-pro-hints');

            case 'display_teaser' :
            return __('If content is unreadable, display replacement text instead of hiding it completely.', 'presspermit-pro-hints');

            case 'teaser_prefix_suffix_note' :
            return __('<strong>Note:</strong> the prefix and suffix settings below will always be applied unless the teaser mode is "no teaser".', 'presspermit-pro-hints');
    
            case 'tease_direct_access_only' :
            return __('Keep unreadable content hidden in the blogroll and link lists, but show the teaser on direct access attempts.', 'presspermit-pro-hints');

            case 'hide_unreadable_private_posts' :
            return  __('Hide unreadable private posts, but show a teaser for posts which are unreadable due to regular Privacy or Role Restrictions.', 'presspermit-pro-hints');

            case 'teaser_redirect_page' :
            return  __('Optionally, specify page slug or "[login]" for redirect when teased content is accessed.', 'presspermit-pro-hints');

            case 'teaser_hide_nav_menu_types' :
            return  __('Unreadable items of these comma-separated types will have nav menu item hidden.', 'presspermit-pro-hints');

            case 'teaser_hide_nav_menu_terms' :
            return  __('Unreadable items associated with these comma-separated terms will have nav menu item hidden.', 'presspermit-pro-hints');


            // Circles 
            case 'cap_pp_exempt_read_circle' :
            return __('Visibility Circle membership does not limit viewing access', 'presspermit-pro-hints');

            case 'cap_pp_exempt_edit_circle' :
            return __('Editorial Circle membership does not limit editing access', 'presspermit-pro-hints');
        }

        return $display_string;
    }

    public static function fltGetConstantDescription($description, $constant) {
        if (is_multisite()) {
            switch ($constant) {
            //$type = 'user-selection';
            case 'PP_NETWORK_GROUPS_SITE_USERS_ONLY' : 
            return __("When searching for users via Permissions ajax, return return only users registered to current site", 'presspermit-pro-hints');

            case 'PP_NETWORK_GROUPS_MAIN_SITE_ALL_USERS' : 
            return __("If user is a super admin or has 'pp_manage_network_members' capability, user searches via Permissions ajax return users from all sites", 'presspermit-pro-hints');
            }
        }

        if (class_exists('BuddyPress', false)) {
            switch ($constant) {
            //$type = 'buddypress';
            case 'PPBP_GROUP_MODERATORS_ONLY' : 
            return __("Count users as a member of a BuddyPress Permissions Group only if they are a moderator of the BP group", 'presspermit-pro-hints');

            case 'PPBP_GROUP_ADMINS_ONLY' : 
            return __("Count users as a member of a BuddyPress Permissions Group only if they are an administrator of the BP group", 'presspermit-pro-hints');
            }
        }

        if (defined('CMS_TPV_VERSION')) {
            switch ($constant) {
            //$type = 'cms-tree-page-view';
            case 'PP_CMS_TREE_NO_ADD' : 
            return __("CMS Page Tree View plugin: hide 'add' links (for all hierarchical post types) based on user's association permissions", 'presspermit-pro-hints');
            
            case 'PP_CMS_TREE_NO_ADD_PAGE' : 
            return __("CMS Page Tree View plugin: hide 'add' links (for pages) based on user's page association permissions", 'presspermit-pro-hints');
            
            case 'PP_CMS_TREE_NO_ADD_CUSTOM_POST_TYPE_NAME_HERE' : 
            return __("CMS Page Tree View plugin: hide 'add' links (for specified hierarchical post type) based on user's association permissions", 'presspermit-pro-hints');
            }
        }

        return $description;
    }
}
