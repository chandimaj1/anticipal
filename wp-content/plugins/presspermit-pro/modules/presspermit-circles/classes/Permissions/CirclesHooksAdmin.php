<?php
namespace PublishPress\Permissions;

use \PublishPress\Permissions\UI\SettingsAdmin as SettingsAdmin;

class CirclesHooksAdmin
{
    function __construct() 
    {
        add_action('presspermit_groups_list_table_load', [$this, 'actGroupsListTableLoad']);
        add_action('presspermit_edited_group', [$this, 'actUpdateGroup'], 10, 2);
        add_action('presspermit_edit_group_profile', [$this, 'actCirclesUI'], 10, 2);

        add_action('show_user_profile', [$this, 'actUserUI'], 12);
        add_action('edit_user_profile', [$this, 'actUserUI'], 12);

        add_action('presspermit_delete_group', [$this, 'actDeleteGroup']);
        add_filter('presspermit_cap_descriptions', [$this, 'fltCapDescriptions'], 7);

        add_filter('presspermit_editable_group_types', [$this, 'fltEditableGroupTypes']);
        add_filter('presspermit_metagroup_editable', [$this, 'fltMetagroupEditable'], 10, 3);

        add_filter('presspermit_get_exception_items', [$this, 'fltLimitPageAssociation'], 10, 5);

        add_action('admin_enqueue_scripts', [$this, 'actScripts']);
    }

    function actScripts()
    {
        if ('presspermit-edit-permissions' == presspermitPluginPage()) {
            $suffix = defined('SCRIPT_DEBUG') && SCRIPT_DEBUG ? '.dev' : '';
            wp_enqueue_script(
                'presspermit-circles', 
                plugins_url('', PRESSPERMIT_CIRCLES_FILE) . "/common/js/circles{$suffix}.js", 
                ['jquery', 'jquery-form'], 
                PRESSPERMIT_CIRCLES_VERSION, 
                true
            );
        }
    }

    function fltLimitPageAssociation($eitems, $operation, $mod_type, $post_type, $args)
    {
        // no modification if include exceptions are manually assigned
        if (('associate' == $operation) && ('include' == $mod_type) && empty($eitems[''])) {
            if (defined('PPC_ASSOCIATION_NOFILTER'))
                return $eitems;

            $user_circles = Circles::getCircleMembers('edit');

            if (!empty($user_circles[$post_type])) {
                global $wpdb;

                $author_csv = implode("','", $user_circles[$post_type]);
                if (!$circle_posts = $wpdb->get_col(
                    "SELECT ID FROM $wpdb->posts WHERE post_type = '$post_type'"
                    . " AND post_status != 'auto-draft' AND post_author IN ('" . $author_csv . "')"
                )) {
                    $circle_posts = [-1];
                }

                $eitems[''] = $circle_posts;
            }
        }

        return $eitems;
    }

    function fltEditableGroupTypes($group_types)
    {
        if (defined('PRESSPERMIT_BP_VERSION') || defined('PPBG_VERSION'))
            $group_types[] = 'bp_group';

        return array_unique($group_types);
    }

    function fltMetagroupEditable($editable, $metagroup_type, $agent_id)
    {
        return (in_array($metagroup_type, ['wp_role', 'meta_role'], true)) ? true : $editable;
    }

    function actGroupsListTableLoad()
    {
        require_once(PRESSPERMIT_CIRCLES_CLASSPATH . '/UI/GroupsListing.php');
        new Circles\UI\GroupsListing();
    }

    function actCirclesUI($group_type, $group_id)
    {
        require_once(PRESSPERMIT_CIRCLES_CLASSPATH . '/UI/GroupEdit.php');
        Circles\UI\GroupEdit::circlesUI($group_type, $group_id);
    }

    function actUpdateGroup($group_type, $group_id)
    {
        require_once(PRESSPERMIT_CIRCLES_CLASSPATH . '/UI/Handlers/GroupUpdate.php');
        Circles\UI\Handlers\GroupUpdate::updateGroup($group_type, $group_id);
    }

    function actUserUI($user)
    {
        if (Circles::getCircleTypes()) {
            if ($user->ID != presspermit()->getUser()->ID) {
                $user = new \PublishPress\PermissionsUser($user->ID);
            }

            require_once(PRESSPERMIT_CIRCLES_CLASSPATH . '/UI/Dashboard/Profile.php');
            Circles\UI\Dashboard\Profile::displayUserCirclesUI($user);
        }
    }

    function actDeleteGroup($group_id)
    {
        global $wpdb;
        $wpdb->query("DELETE FROM $wpdb->pp_circles WHERE group_type = 'pp_group' AND group_id = '$group_id'");
    }

    function fltCapDescriptions($pp_caps)
    {
        $pp_caps['pp_exempt_read_circle'] = SettingsAdmin::getStr('cap_pp_exempt_read_circle');
        $pp_caps['pp_exempt_edit_circle'] =  SettingsAdmin::getStr('cap_pp_exempt_edit_circle');
        
        return $pp_caps;
    }
}
