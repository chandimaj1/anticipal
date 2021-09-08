<?php
namespace PublishPress\Permissions\Membership\UI;

class GroupEdit
{
    function __construct() 
    {
        add_action( 'presspermit_admin_ui', [$this, 'actAdminUI'] );
        add_filter( 'presspermit_override_agent_select_js', [$this, 'fltOverrideAgentSelectScript']);

        add_filter( 'presspermit_agents_selection_ui_args', [$this, 'fltAgentsSelectionArgs'], 10, 3 );
        add_filter( 'presspermit_agents_selection_ui_attribs', [$this, 'fltAgentsSelectionAttribs'], 10, 4 );
        add_filter( 'presspermit_agents_selection_ui_csv', [$this, 'fltAgentsSelectionCSV'], 10, 3 );
        add_action( '_presspermit_agents_selection_ui_select_pre', [$this, 'actAgentsSelectionPreTable'] );
        add_action( 'presspermit_agents_selection_ui_select_pre', [$this, 'actAgentsSelectionPreDateFields'] );

        add_filter( 'presspermit_group_members_orderby', [$this, 'fltGroupMembersOrderby']);

        // work around conflict with bundled js on some sites
        if ( defined( 'PPM_DATEPICKER_WORKAROUND' ) ) {
            add_action( 'admin_print_scripts', [$this, 'actScripts'], 20 );
        }
    }

    function actScripts() {
        ?>
        <script type="text/javascript" src="<?php echo site_url('') . '/wp-includes/js/jquery/ui/datepicker.min.js';?>"></script>
        <?php
    }

    function actAdminUI() {
        if ( in_array( presspermitPluginPage(), ['presspermit-edit-permissions', 'presspermit-group-new'], true ) ) {
            $path = plugins_url( '', PRESSPERMIT_MEMBERSHIP_FILE );
            wp_enqueue_style( 'presspermit-membership', $path . '/common/css/membership.css', [], PRESSPERMIT_MEMBERSHIP_VERSION );
            wp_enqueue_style( 'pp-datepicker', $path . '/common/css/jquery/datepicker.css', [], PRESSPERMIT_MEMBERSHIP_VERSION );
            
            if ( ! defined( 'PPM_DATEPICKER_WORKAROUND' ) ) {
                wp_enqueue_script( 'jquery-ui-datepicker', '', ['jquery-ui-core'], false, true );
            }
        }
    }

    function fltOverrideAgentSelectScript() {
        $path = plugins_url( '', PRESSPERMIT_MEMBERSHIP_FILE );
        $suffix = defined('SCRIPT_DEBUG') && SCRIPT_DEBUG ? '.dev' : '';
        wp_enqueue_script( 
            'presspermit-agent-select', 
            $path . "/common/js/agent-select{$suffix}.js", ['jquery', 'jquery-form'], 
            PRESSPERMIT_MEMBERSHIP_VERSION, 
            true 
        );
        
        return true;
    }

    function fltGroupMembersOrderby( $orderby ) {
        return "ORDER BY FIELD(u2g.status, 'active', 'scheduled', 'expired'), u.user_login";
    }

    function actAgentsSelectionPreTable( $id_suffix ) {
        if ( 'member' == $id_suffix ) :
        ?>
            </table>
            <table>
        <?php 
        endif;
    }

    function actAgentsSelectionPreDateFields( $id_suffix ) {
        if ( 'member' == $id_suffix ) :
        ?>
            <td>
            <table>
            <tr>
            <td style="vertical-align: middle;"><?php _e('From:', 'presspermit');?></td> 
            <td><input type="text" id="pp_member_start" name="pp_member_start" size="9" placeholder="<?php _e('date or #days', 'presspermit');?>" title="<?php _e('Select membership start date or enter number of days to delay. Blank or zero value means immediate membership.', 'presspermit');?>" /></td>
            </tr>
            
            <tr>
            <td style="vertical-align: middle;"><?php _e('To:', 'presspermit');?> </td>
            <td><input type="text" id="pp_member_end" name="pp_member_end" size="9" placeholder="<?php _e('date or #days', 'presspermit');?>" title="<?php _e('Select membership end date or enter duration in days. Blank or zero value means perpetual membership.', 'presspermit');?>" /></td>
            </tr>
            </table>
            </td>
        <?php 
        endif;
    }

    function fltAgentsSelectionArgs( $args, $agent_type, $id_suffix ) {
        if ( 'member' == $id_suffix ) {
            $args['width_current'] = 235;
            
            $url = add_query_arg( 'pp_refresh_member_status', '1' );
            $title = esc_attr( __('refresh member status', 'presspermit') );
            $args['label_selections'] = sprintf( 
                __( 'Current Selections: %1$s refresh %2$s' ), 
                '<span style="float:right"><small><a href="' . esc_url($url) . '" title="' . $title . '">', 
                '</a></small></span>' 
            );
        }

        return $args;
    }

    function fltAgentsSelectionCSV( $csv, $id_suffix, $current_selections ) {
        if ( 'member' == $id_suffix ) {
            $csv = '';
            foreach ( $current_selections as $agent ) {
                $start_caption = '';
                $end_caption = '';
                
                if ( $agent->date_limited ) {
                    if ( $start_stamp = strtotime( $agent->start_date_gmt ) )
                        $start_caption = date( 'Y/m/d', $start_stamp );
                    
                    if ( $end_stamp = strtotime( $agent->end_date_gmt ) )
                        $end_caption = date( 'Y/m/d', $end_stamp );
                }

                $csv .= $agent->ID . '|' . str_replace( '/', '-', $start_caption ) . '|' . str_replace( '/', '-', $end_caption ) . ',';
            }
        }

        return $csv;
    }

    function fltAgentsSelectionAttribs( $return, $agent_type, $id_suffix, $stored_agent ) {
        if ( 'member' == $id_suffix ) {
            $display_property = (( 'user' == $agent_type ) && ! defined( 'PP_USER_RESULTS_DISPLAY_NAME' )) 
            ? 'user_login' 
            : 'display_name'; 
        
            $class = '';
            $mindate_attrib = '';
            $maxdate_attrib = '';
            $start_caption = '';
            $end_caption = '';
            
            $_title = (( 'user' == $agent_type ) && ( empty($stored_agent->display_name) || defined('PP_USER_RESULTS_DISPLAY_NAME') )) 
            ? $stored_agent->user_login 
            : $stored_agent->display_name;
            
            if ( $stored_agent->date_limited ) {
                $start_stamp = strtotime( $stored_agent->start_date_gmt );

                if ($start_stamp && (!in_array($stored_agent->start_date_gmt, [constant('PRESSPERMIT_MIN_DATE_STRING'), '0000-00-00 00:00:00']))) {
                    $start_caption = date( 'Y/m/d', $start_stamp );
                    $mindate_attrib = ' data-startdate="' . str_replace('/', '-', $start_caption ) . '"';
                }
                
                $end_stamp = strtotime( $stored_agent->end_date_gmt );
                if ( $end_stamp && ( $end_stamp < strtotime(PRESSPERMIT_MAX_DATE_STRING) ) ) {
                    $end_caption = date( 'Y/m/d', $end_stamp );
                    $maxdate_attrib = ' data-enddate="' . str_replace('/', '-', $end_caption ) . '"';
                }

                $return['user_caption'] = sprintf( 
                    __( '%1$s (%2$s - %3$s)', 'presspermit-pro' ), 
                    $stored_agent->$display_property, 
                    $start_caption, 
                    $end_caption 
                );
                
                $_title = sprintf( __( '%1$s (%2$s - %3$s)', 'presspermit-pro' ), $_title, $start_caption, $end_caption );
                
                if ( 'scheduled' == $stored_agent->status ) { 
                    $class = ' class="pp-scheduled"';
                    $title = sprintf( __('SCHEDULED: %s', 'presspermit'), $_title );
                } elseif ( 'expired' == $stored_agent->status ) { 
                    $class = ' class="pp-expired"';
                    $title = sprintf( __('EXPIRED: %s', 'presspermit'), $_title );
                } elseif ( $end_caption ) {
                    $title = sprintf( __('ACTIVE with future expiration: %s', 'presspermit'), $_title );
                } else
                    $title = sprintf( __('ACTIVE: %s', 'presspermit'), $_title );
                
                /*
                //$return['user_caption'] = $stored_agent->$display_property 
                . sprintf( __( ' (%1$s to %2$s)', 'presspermit' ), $start_caption, $end_caption );  // todo: RTL
                */
            } else {
                $return['user_caption'] = $stored_agent->$display_property;
                $title = sprintf( __('ACTIVE: %s', 'presspermit'), $_title );
            }
            
            $return['attribs'] = 'title="' . esc_attr($title) . '"' . $class . $mindate_attrib . $maxdate_attrib;
        }
        
        return $return;
    }
}
