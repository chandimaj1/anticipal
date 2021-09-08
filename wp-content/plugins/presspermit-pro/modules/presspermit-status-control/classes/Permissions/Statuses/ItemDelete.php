<?php
namespace PublishPress\Permissions\Statuses;

class ItemDelete
{
    public static function actDeletePost($object_id, $args = [])
    {
        if (!$object_id)
            return;

        // could defer role maint to speed potential bulk deletion, but script may be interrupted before admin_footer
        self::item_deletion_aftermath('object', 'post', $object_id);
    }

    public static function item_deletion_aftermath($scope, $source_name, $item_id)
    {
        global $wpdb;

        require_once(PRESSPERMIT_STATUSES_CLASSPATH . '/DB/AttributesUpdate.php');

        if ($ass_ids = $wpdb->get_col(
            $wpdb->prepare(
                "SELECT assignment_id FROM $wpdb->pp_conditions WHERE scope = %s AND item_source = %s AND item_id = %d", 
                $scope, 
                $source_name, 
                $item_id
            )
        )) {
            DB\AttributesUpdate::remove_conditions_by_id($ass_ids);

            // Propagated requirements will be converted to direct-assigned roles if the original progenetor goes away.  
            // Removal of a "link" in the parent/child propagation chain has no effect.
            $id_in = "'" . implode("', '", $ass_ids) . "'";
            $wpdb->query("UPDATE $wpdb->pp_conditions SET inherited_from = '0' WHERE inherited_from IN ($id_in)");
        }
    }
}
