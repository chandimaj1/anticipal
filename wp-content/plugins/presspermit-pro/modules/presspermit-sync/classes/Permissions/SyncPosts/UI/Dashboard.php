<?php

namespace PublishPress\Permissions\SyncPosts\UI;

class Dashboard
{
    function __construct() {
        add_action('admin_init', [$this, 'revealAuthorCol']);
        add_action('admin_init', [$this, 'actHandleUpdatePPOptions']);
        add_action('admin_notices', [$this, 'actNotices']);

        add_action('presspermit_permissions_menu', [$this, 'permissions_menu'], 12, 2);
        add_action('admin_print_scripts', [$this, 'markActiveSubmenu'], 20);

        if (!empty($_REQUEST['page'])) {
            if ('presspermit-sync' == $_REQUEST['page']) {
                $url = admin_url('admin.php?page=presspermit-settings&pp_tab=sync_posts');
                wp_redirect($url);
            }
        }
    }

    function markActiveSubmenu() {
        if (('presspermit-settings' == presspermitPluginPage()) && !empty($_REQUEST['pp_tab']) && ('sync_posts' == $_REQUEST['pp_tab'])) :
        ?>
            <script type="text/javascript">
                /* <![CDATA[ */
                jQuery(document).ready(function ($) {
                    $('#adminmenu li.toplevel_page_presspermit-groups ul.wp-submenu li').removeClass('current');
                    $('#adminmenu li.toplevel_page_presspermit-groups ul.wp-submenu li a[href="admin.php?page=presspermit-sync"]').parent().addClass('current');
                });
                /* ]]> */
            </script>
        <?php endif;
    }

    function permissions_menu($pp_options_menu, $handler)
    {
        add_submenu_page(
            $pp_options_menu, 
            __('Sync Posts', 'press-permit-core'), 
            __('Sync Posts', 'press-permit-core'), 
            'read', 
            'presspermit-sync', 
            $handler
        );
    }

    function actHandleUpdatePPOptions()
    {
        if (did_action('presspermit_update_options') && !empty($_POST['sync_posts_to_users_existing'])) {
            SyncPosts::handlePrivateTypes();
            SyncPosts::userSync()->syncPostsToUsers(['post_types' => array_keys($_POST['sync_posts_to_users_existing'])]);
        }
    }
    
    function actNotices()
    {
        global $pagenow, $typenow;

        if ((in_array($pagenow, ['plugins.php', 'index.php', 'users.php'])
            || ('edit.php' == $pagenow && (false !== strpos($typenow, 'team') || false !== strpos($typenow, 'staff')))
            || 'presspermit-settings' == presspermitPluginPage()) && presspermit()->isUserAdministrator()) {

            if (presspermit()->getOption('sync_posts_to_users')) {
                require_once(PRESSPERMIT_SYNC_CLASSPATH . '/UI/Helper.php');
                Helper::teamPluginNotices();
            }
        }
    }

    function revealAuthorCol()
    {
        if (!presspermit()->getOption('sync_posts_to_users')) {
            return;
        }

        SyncPosts::handlePrivateTypes();

        if ($enabled_types = SyncPosts::getEnabledTypes()) {
            //if ( presspermit()->getOption( 'reveal_author_col' ) ) {
            if (!defined('presspermit_sync_posts_REVEAL_AUTHOR_COL')) {

                $support_types = (array)apply_filters(
                    'presspermit_sync_posts_reveal_author_col_types', 
                    ['jv_team_members', 'tmm']
                );

                $support_types = array_intersect($enabled_types, $support_types);
            }
            foreach ($support_types as $post_type) {
                add_post_type_support($post_type, 'author');
            }
            //}
        }
    }
}
