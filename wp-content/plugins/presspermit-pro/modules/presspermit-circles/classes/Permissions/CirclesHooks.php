<?php
namespace PublishPress\Permissions;

class CirclesHooks
{
    function __construct() 
    {
        require_once(PRESSPERMIT_CIRCLES_ABSPATH . '/db-config.php');

        add_filter('presspermit_append_query_clause', [$this, 'fltAppendQueryClause'], 10, 4);
        add_filter('presspermit_get_groups_for_user_join', [$this, 'fltGetGroupsForUserJoin'], 10, 3);
        add_filter('presspermit_get_pp_groups_for_user', [$this, 'fltGetGroupsForUser'], 10, 4);
        add_action('presspermit_pre_init', [$this, 'actVersionCheck']);

        add_filter('presspermit_exclude_arbitrary_caps', [$this, 'fltExcludeArbitraryCaps']);
        add_filter('presspermit_group_circles', [$this, 'fltGroupCircles'], 10, 4);
    }

    function fltExcludeArbitraryCaps($caps)
    {
        return array_merge($caps, ['pp_exempt_read_circle', 'pp_exempt_edit_circle']);
    }

    function fltAppendQueryClause($append, $object_type, $required_operation, $args)
    {
        $circle_type = ('read' == $required_operation) ? 'read' : 'edit';

        if (!presspermit()->isContentAdministrator() && !current_user_can("pp_exempt_{$circle_type}_circle")) {
            $circle_members = Circles::getCircleMembers($circle_type);

            if (!empty($circle_members[$object_type])) {
                global $wpdb;
                $src_table = (!empty($args['src_table'])) ? $args['src_table'] : $wpdb->posts;

				$revisions_clause = (defined('REVISIONARY_VERSION')) 
                ? "OR $src_table.post_status IN ('" . implode("','", apply_filters('rvy_revision_statuses', ['pending-revision', 'future-revision'])) . "')" 
                : '';

                if (defined('PUBLISHPRESS_MULTIPLE_AUTHORS_VERSION')) {	// (or use an alternate join without user_id in ON clause?)
                    $circle_members_login = [];
                    
                    foreach($circle_members[$object_type] as $user_id) {
                    	if ($user = new \WP_User($user_id)) {
                    		$circle_members_login []= $user->user_login;	
                    	}
                	}
                
                	$circle_members_login_csv = implode("','", $circle_members_login);
                    
                    $subquery = "SELECT object_id FROM $wpdb->term_relationships AS tr "
                    		  . " INNER JOIN $wpdb->term_taxonomy AS tt ON tt.term_taxonomy_id = tr.term_taxonomy_id"
                    		  . " INNER JOIN $wpdb->terms AS t ON t.term_id = tt.term_id"
                    		  . " WHERE t.name IN ('$circle_members_login_csv')";

                    $append .= " AND ( $src_table.post_author IN ('" . implode("','", $circle_members[$object_type]) . "') $revisions_clause";
                    $append .= " OR ( $src_table.ID IN ($subquery) ) )";
                } else {
                	$append .= " AND $src_table.post_author IN ('" . implode("','", $circle_members[$object_type]) . "') $revisions_clause";
                }
            }
        }

        return $append;
    }

    function fltGetGroupsForUserJoin($join, $user_id, $args)
    {
        if (!empty($args['circle_type'])) {
            global $wpdb;

            if (!strpos($join, "$wpdb->pp_groups AS g"))
                $join .= "INNER JOIN $wpdb->pp_groups AS g ON $wpdb->pp_group_members.group_id = g.ID";

            $join .= " INNER JOIN $wpdb->pp_circles AS c ON c.group_id = g.ID"
            . " AND c.group_type = 'pp_group' AND c.circle_type = '{$args['circle_type']}'";
        }

        return $join;
    }

    // join clause for circles was appended to query.  Now reprocess results, creating a circles property for each group.
    function fltGetGroupsForUser($user_groups, $results, $user_id, $args = [])
    {
        if (!empty($args['circle_type'])) {
            foreach ($results as $row) {
                if (!isset($user_groups[$row->group_id]->circles)) {
                    $user_groups[$row->group_id]->circles = [];
                }

                $user_groups[$row->group_id]->circles[$row->circle_type][$row->post_type] = true;

                // since we are aggregating circle data from multiple rows, avoid confusion in calling function
                unset($user_groups[$row->group_id]->circle_type);
                unset($user_groups[$row->group_id]->post_type);
            }
        }

        return $user_groups;
    }

    function actVersionCheck()
    {
        $ver = get_option('ppcc_version');
        $pp_ver = get_option('presspermit_version');

        /*
        if (get_option('ppperm_added_cc_role_caps_10beta') && !get_option('ppperm_added_ppcc_role_caps_10beta')) {
            // clean up from dual use of ppperm_added_cc_role_caps_10beta flag by both PP Circles and PP Custom Post Statuses
            require_once(PRESSPERMIT_CIRCLES_CLASSPATH . '/Updated.php');
            Circles\Updated::flag_cleanup();
        }
        */

        if (!is_array($ver) || empty($ver['db_version']) || version_compare(PRESSPERMIT_CIRCLES_DB_VERSION, $ver['db_version'], '!=') 
        || ($pp_ver && version_compare($pp_ver['version'], '3.2.7', '<'))
        ) {
            require_once(PRESSPERMIT_CIRCLES_CLASSPATH . '/DB/DatabaseSetup.php');
            $db_ver = (is_array($ver) && isset($ver['db_version'])) ? $ver['db_version'] : '';
            new Circles\DB\DatabaseSetup($db_ver);
            update_option('ppcc_version', ['version' => PRESSPERMIT_CIRCLES_VERSION, 'db_version' => PRESSPERMIT_CIRCLES_DB_VERSION]);
        }

        if (!empty($ver['version'])) {
            // These maintenance operations only apply when a previous version of PPCC was installed 
            if (version_compare(PRESSPERMIT_CIRCLES_VERSION, $ver['version'], '!=')) {
                require_once(PRESSPERMIT_CIRCLES_CLASSPATH . '/Updated.php');
                new Circles\Updated($ver['version']);
                update_option('ppcc_version', ['version' => PRESSPERMIT_CIRCLES_VERSION, 'db_version' => PRESSPERMIT_CIRCLES_DB_VERSION]);
            }
        } else {
            // first execution after install
            if (!get_option('ppperm_added_ppcc_role_caps_10beta')) {
                require_once(PRESSPERMIT_CIRCLES_CLASSPATH . '/Updated.php');
                Circles\Updated::populateRoles(true);
            }
        }
    }

    function fltGroupCircles($circles, $group_type, $group_id, $circle_type) {
        return array_merge((array)$circles, Circles::getGroupCircles($group_type, $group_id, $circle_type));
    }
}
