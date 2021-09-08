<?php
/**
 * Submissions
 *
 * @package     GamiPress\Submissions\Custom_Tables\Submissions
 * @since       1.0.0
 */
// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Parse query args for submissions
 *
 * @since  1.0.0
 *
 * @param string $where
 * @param CT_Query $ct_query
 *
 * @return string
 */
function gamipress_submissions_submissions_query_where( $where, $ct_query ) {

    global $ct_table;

    if( $ct_table->name !== 'gamipress_submissions' )
        return $where;

    $table_name = $ct_table->db->table_name;
    $user_id = false;

    // User ID
    if( isset( $ct_query->query_vars['user_id'] ) && absint( $ct_query->query_vars['user_id'] ) !== 0 ) {

        $user_id = $ct_query->query_vars['user_id'];

        if( is_array( $user_id ) ) {
            $user_id = implode( ", ", $user_id );

            $where .= " AND {$table_name}.user_id IN ( {$user_id} )";
        } else {
            $where .= " AND {$table_name}.user_id = {$user_id}";
        }
    }

    // Post ID
    if( isset( $ct_query->query_vars['post_id'] ) && absint( $ct_query->query_vars['post_id'] ) !== 0 ) {

        $post_id = $ct_query->query_vars['post_id'];

        if( is_array( $post_id ) ) {
            $post_id = implode( ", ", $post_id );

            $where .= " AND {$table_name}.post_id IN ( {$post_id} )";
        } else {
            $where .= " AND {$table_name}.post_id = {$post_id}";
        }
    }

    // Status
    if( isset( $ct_query->query_vars['status'] ) && ! empty( $ct_query->query_vars['status'] ) ) {

        $status = $ct_query->query_vars['status'];

        if( is_array( $status ) ) {
            $status = implode( "', '", $status );

            $where .= " AND {$table_name}.status IN ( '{$status}' )";
        } else {
            $where .= " AND {$table_name}.status = '{$status}'";
        }
    }

    return $where;
}
add_filter( 'ct_query_where', 'gamipress_submissions_submissions_query_where', 10, 2 );

/**
 * Define the search fields for submissions
 *
 * @since 1.0.0
 *
 * @param array $search_fields
 *
 * @return array
 */
function gamipress_submissions_search_fields( $search_fields ) {

    $search_fields[] = 'status';

    return $search_fields;

}
add_filter( 'ct_query_gamipress_submissions_search_fields', 'gamipress_submissions_search_fields' );

/**
 * Columns for submissions list view
 *
 * @since  1.0.0
 *
 * @param array $columns
 *
 * @return array
 */
function gamipress_submissions_manage_submissions_columns( $columns = array() ) {

    $columns['submission']  = __( 'Submission', 'gamipress-submissions' );
    $columns['user']        = __( 'User', 'gamipress-submissions' );
    $columns['post']        = __( 'To Award', 'gamipress-submissions' );
    $columns['date']        = __( 'Date', 'gamipress-submissions' );
    $columns['status']      = __( 'Status', 'gamipress-submissions' );
    $columns['actions']     = __( 'Actions', 'gamipress-submissions' );

    return $columns;
}
add_filter( 'manage_gamipress_submissions_columns', 'gamipress_submissions_manage_submissions_columns' );

/**
 * Sortable columns for submissions list view
 *
 * @since 1.0.0
 *
 * @param array $sortable_columns
 *
 * @return array
 */
function gamipress_submissions_manage_submissions_sortable_columns( $sortable_columns ) {

    $sortable_columns['submission']   = array( 'submission_id', false );
    $sortable_columns['user']       = array( 'user_id', false );
    $sortable_columns['post']       = array( 'post_id', false );
    $sortable_columns['date']       = array( 'date', true );
    $sortable_columns['status']     = array( 'status', false );

    return $sortable_columns;

}
add_filter( 'manage_gamipress_submissions_sortable_columns', 'gamipress_submissions_manage_submissions_sortable_columns' );

/**
 * Columns rendering for submissions list view
 *
 * @since  1.0.0
 *
 * @param string $column_name
 * @param integer $object_id
 */
function gamipress_submissions_manage_submissions_custom_column(  $column_name, $object_id ) {

    // Setup vars
    $submission = ct_get_object( $object_id );

    switch( $column_name ) {
        case 'submission':
            ?>

            <strong>
                <a href="<?php echo ct_get_edit_link( 'gamipress_submissions', $submission->submission_id ); ?>">#<?php echo $submission->submission_id; ?></a>
            </strong>

            <?php
            break;
        case 'user':
            $user = get_userdata( $submission->user_id );

            if( $user ) :

                if( current_user_can('edit_users')) {
                    ?>

                    <strong><a href="<?php echo get_edit_user_link( $submission->user_id ); ?>"><?php echo $user->display_name; ?></a></strong>
                    <br>
                    <?php echo $user->user_email; ?>

                    <?php
                } else {
                    echo $user->display_name . '<br>' . $user->user_email;
                }

            endif;
            break;
        case 'post':
            $post = gamipress_get_post( $submission->post_id );

            if( $post ) :

                if( current_user_can( 'edit_post', $submission->post_id ) ) {
                    ?>

                    <strong><a href="<?php echo get_edit_post_link( $submission->post_id ); ?>"><?php echo $post->post_title; ?></a></strong>

                    <?php
                } else {
                    echo $post->post_title;
                }

            endif;
            break;
        case 'status':
            $statuses = gamipress_submissions_get_submission_statuses(); ?>

            <span class="gamipress-submissions-status gamipress-submissions-status-<?php echo $submission->status; ?>"><?php echo ( isset( $statuses[$submission->status] ) ? $statuses[$submission->status] : $submission->status ); ?></span>

            <?php
            break;
        case 'date':
            ?>

            <abbr title="<?php echo date( 'Y/m/d g:i:s a', strtotime( $submission->date ) ); ?>"><?php echo date( 'Y/m/d', strtotime( $submission->date ) ); ?></abbr>

            <?php
            break;
        case 'actions':
            $url = add_query_arg( array( 'submission_id' => $object_id ) );

            if( $submission->status === 'pending' ) :
                $approve_url = add_query_arg( array( 'gamipress_submissions_action' => 'approve' ), $url );
                $reject_url = add_query_arg( array( 'gamipress_submissions_action' => 'reject' ), $url ); ?>

                <a href="<?php echo $approve_url; ?>"><?php _e( 'Approve', 'gamipress-submissions' ); ?></a>
                |
                <a href="<?php echo $reject_url; ?>" style="color:#a00;"><?php _e( 'Reject', 'gamipress-submissions' ); ?></a>

            <?php elseif ( $submission->status === 'approved' ) :
                $revoke_url = add_query_arg( array( 'gamipress_submissions_action' => 'revoke' ), $url ); ?>

                <a href="<?php echo $revoke_url; ?>"><?php _e( 'Revoke', 'gamipress-submissions' ); ?></a>

            <?php elseif ( in_array( $submission->status, array( 'rejected', 'revoked' ) ) ) :
                $pending_url = add_query_arg( array( 'gamipress_submissions_action' => 'pending' ), $url ); ?>

                <a href="<?php echo $pending_url; ?>"><?php _e( 'Mark as pending', 'gamipress-submissions' ); ?></a>

            <?php endif;
            break;
    }
}
add_action( 'manage_gamipress_submissions_custom_column', 'gamipress_submissions_manage_submissions_custom_column', 10, 2 );

/**
 * Submission actions handler
 *
 * Fire hook gamipress_submissions_process_submission_action_{$action}
 *
 * @since 1.0.0
 */
function gamipress_submissions_handle_submission_actions() {

    if( isset( $_REQUEST['gamipress_submissions_action'] ) && isset( $_REQUEST['submission_id'] ) ) {

        $action = $_REQUEST['gamipress_submissions_action'];
        $submission_id = absint( $_REQUEST['submission_id'] );

        if( $submission_id !== 0 ) {

            /**
             * Hook gamipress_submissions_process_submission_action_{$action}
             *
             * @since 1.0.0
             *
             * @param integer $submission_id
             */
            do_action( "gamipress_submissions_process_submission_action_{$action}", $submission_id );

            // Redirect to the same URL but without the action var if action do not process a redirect
            wp_redirect( remove_query_arg( array( 'gamipress_submissions_action' ) ) );
            exit;

        }

    }

}
add_action( 'admin_init', 'gamipress_submissions_handle_submission_actions' );

/**
 * Approve submission action
 *
 * @since 1.0.0
 *
 * @param integer $submission_id
 */
function gamipress_submissions_process_approve_action( $submission_id ) {

    // Setup the CT Table
    $ct_table = ct_setup_table( 'gamipress_submissions' );

    // Check the object
    $submission = ct_get_object( $submission_id );

    if( ! $submission ) {
        return;
    }

    // Only can approve pending submissions
    if( $submission->status !== 'pending' ) {
        return;
    }

    // Award item to the user
    $post = gamipress_get_post( $submission->post_id );

    if( $post ) {

        if( in_array( $post->post_type, gamipress_get_achievement_types_slugs() ) ) {
            // Award the achievement
            gamipress_award_achievement_to_user( $submission->post_id, $submission->user_id, get_current_user_id() );
        } else if( in_array( $post->post_type, gamipress_get_achievement_types_slugs() ) ) {
            // Award the rank
            gamipress_award_rank_to_user( $submission->post_id, $submission->user_id, array( 'admin_id' => get_current_user_id() ) );
        }

    }

    // Update the submission status
    $ct_table->db->update(
        array( 'status' => 'approved' ),
        array( 'submission_id' => $submission_id )
    );

    $redirect = add_query_arg( array( 'message' => 'submission_approved' ) );
    $redirect = remove_query_arg( array( 'gamipress_submissions_action' ), $redirect );

    if( isset( $_REQUEST['page'] ) && $_REQUEST['page'] === 'gamipress_submissions' ) {
        $redirect = remove_query_arg( array( 'submission_id' ), $redirect );
    }

    // Redirect to the same submission edit screen and with the var message
    wp_redirect( $redirect );
    exit;

}
add_action( 'gamipress_submissions_process_submission_action_approve', 'gamipress_submissions_process_approve_action' );

/**
 * Reject submission action
 *
 * @since 1.0.0
 *
 * @param integer $submission_id
 */
function gamipress_submissions_process_reject_action( $submission_id ) {

    // Setup the CT Table
    $ct_table = ct_setup_table( 'gamipress_submissions' );

    // Check the object
    $submission = ct_get_object( $submission_id );

    if( ! $submission ) {
        return;
    }

    // Only can reject pending submissions
    if( $submission->status !== 'pending' ) {
        return;
    }

    // Update the submission status
    $ct_table->db->update(
        array( 'status' => 'rejected' ),
        array( 'submission_id' => $submission_id )
    );

    $redirect = add_query_arg( array( 'message' => 'submission_rejected' ) );
    $redirect = remove_query_arg( array( 'gamipress_submissions_action' ), $redirect );

    if( isset( $_REQUEST['page'] ) && $_REQUEST['page'] === 'gamipress_submissions' ) {
        $redirect = remove_query_arg( array( 'submission_id' ), $redirect );
    }

    // Redirect to the same submission edit screen and with the var message
    wp_redirect( $redirect );
    exit;

}
add_action( 'gamipress_submissions_process_submission_action_reject', 'gamipress_submissions_process_reject_action' );

/**
 * Revoke submission action
 *
 * @since 1.0.0
 *
 * @param integer $submission_id
 */
function gamipress_submissions_process_revoke_action( $submission_id ) {

    // Setup the CT Table
    $ct_table = ct_setup_table( 'gamipress_submissions' );

    // Check the object
    $submission = ct_get_object( $submission_id );

    if( ! $submission ) {
        return;
    }

    // Only can revoke approved submissions
    if( $submission->status !== 'approved' ) {
        return;
    }

    // Revoke item to the user
    $post = gamipress_get_post( $submission->post_id );

    if( $post ) {

        if( in_array( $post->post_type, gamipress_get_achievement_types_slugs() ) ) {
            // Award the achievement
            gamipress_revoke_achievement_to_user( $submission->post_id, $submission->user_id );
        } else if( in_array( $post->post_type, gamipress_get_achievement_types_slugs() ) ) {
            // Award the rank
            gamipress_revoke_rank_to_user( $submission->post_id, $submission->user_id, 0, array( 'admin_id' => get_current_user_id() ) );
        }

    }

    // Update the submission status
    $ct_table->db->update(
        array( 'status' => 'revoked' ),
        array( 'submission_id' => $submission_id )
    );

    $redirect = add_query_arg( array( 'message' => 'submission_revoked' ) );
    $redirect = remove_query_arg( array( 'gamipress_submissions_action' ), $redirect );

    if( isset( $_REQUEST['page'] ) && $_REQUEST['page'] === 'gamipress_submissions' ) {
        $redirect = remove_query_arg( array( 'submission_id' ), $redirect );
    }

    // Redirect to the same submission edit screen and with the var message
    wp_redirect( $redirect );
    exit;

}
add_action( 'gamipress_submissions_process_submission_action_revoke', 'gamipress_submissions_process_revoke_action' );

/**
 * Pending submission action
 *
 * @since 1.0.0
 *
 * @param integer $submission_id
 */
function gamipress_submissions_process_pending_action( $submission_id ) {

    // Setup the CT Table
    $ct_table = ct_setup_table( 'gamipress_submissions' );

    // Check the object
    $submission = ct_get_object( $submission_id );

    if( ! $submission ) {
        return;
    }

    // Only can mark as pending rejected or revoked submissions
    if( ! in_array( $submission->status, array( 'rejected', 'revoked' ) ) ) {
        return;
    }

    // Update the submission status
    $ct_table->db->update(
        array( 'status' => 'pending' ),
        array( 'submission_id' => $submission_id )
    );

    $redirect = add_query_arg( array( 'message' => 'submission_pending' ) );
    $redirect = remove_query_arg( array( 'gamipress_submissions_action' ), $redirect );

    if( isset( $_REQUEST['page'] ) && $_REQUEST['page'] === 'gamipress_submissions' ) {
        $redirect = remove_query_arg( array( 'submission_id' ), $redirect );
    }

    // Redirect to the same submission edit screen and with the var message
    wp_redirect( $redirect );
    exit;

}
add_action( 'gamipress_submissions_process_submission_action_pending', 'gamipress_submissions_process_pending_action' );

/**
 * Add submissions edit screen custom messages
 *
 * @since 1.0.0
 *
 * @param array $messages
 *
 * @return array
 */
function gamipress_submissions_submission_updated_messages( $messages ) {

    $messages['submission_approved']    = __( 'Submission approved successfully.', 'gamipress-submissions' );
    $messages['submission_rejected']    = __( 'Submission rejected successfully.', 'gamipress-submissions' );
    $messages['submission_revoked']     = __( 'Submission revoked successfully.', 'gamipress-submissions' );
    $messages['submission_pending']     = __( 'Submission marked as pending successfully.', 'gamipress-submissions' );

    return $messages;
}
add_filter( 'ct_table_updated_messages', 'gamipress_submissions_submission_updated_messages' );

/**
 * Register custom submissions meta boxes
 *
 * @since  1.0.0
 */
function gamipress_submissions_add_submissions_meta_boxes() {

    add_meta_box( 'gamipress_submissions_details', __( 'Details', 'gamipress-submissions' ), 'gamipress_submissions_details_meta_box', 'gamipress_submissions', 'normal', 'core' );
    add_meta_box( 'gamipress_submissions_forminator', 'Forminator submission', 'gamipress_submissions_forminator_meta_box', 'gamipress_submissions', 'normal', 'core' );
    add_meta_box( 'gamipress_submissions_actions', __( 'Actions', 'gamipress-submissions' ), 'gamipress_submissions_actions_meta_box', 'gamipress_submissions', 'side', 'core' );
    remove_meta_box( 'submitdiv', 'gamipress_submissions', 'side' );

}
add_action( 'add_meta_boxes', 'gamipress_submissions_add_submissions_meta_boxes' );

/**
 * Submission details meta box
 *
 * @since  1.0.0
 *
 * @param stdClass  $submission
 */
function gamipress_submissions_details_meta_box( $submission ) {

    ?>
    <table class="form-table">
        <tbody>

        <tr>
            <th><?php _e( 'Submission', 'gamipress-submissions' ); ?></th>
            <td><?php echo '#' . $submission->submission_id; ?></td>
        </tr>

        <tr>
            <th><?php _e( 'User', 'gamipress-submissions' ); ?></th>
            <td><?php $user = get_userdata( $submission->user_id );

                if( $user ) :

                    if( current_user_can('edit_users')) {
                        ?>

                        <strong><a href="<?php echo get_edit_user_link( $submission->user_id ); ?>"><?php echo $user->display_name; ?></a></strong>
                        <br>
                        <?php echo $user->user_email; ?>

                        <?php
                    } else {
                        echo $user->display_name . '<br>' . $user->user_email;
                    }

                endif; ?></td>
        </tr>

        <tr>
            <th><?php _e( 'To Award', 'gamipress-submissions' ); ?></th>
            <td><?php $post = gamipress_get_post( $submission->post_id );

                if( $post ) :

                if( current_user_can( 'edit_post', $submission->post_id ) ) {
                ?>

                <strong><a href="<?php echo get_edit_post_link( $submission->post_id ); ?>"><?php echo $post->post_title; ?></a></strong>

                <?php
                } else {
                    echo $post->post_title;
                }

                endif; ?></td>
        </tr>

        <tr>
            <th><?php _e( 'Notes', 'gamipress-submissions' ); ?></th>
            <td><?php echo $submission->notes; ?></td>
        </tr>

        <tr>
            <th><?php _e( 'Status', 'gamipress-submissions' ); ?></th>
            <td><?php $statuses = gamipress_submissions_get_submission_statuses(); ?>
                <span class="gamipress-submissions-status gamipress-submissions-status-<?php echo $submission->status; ?>"><?php echo ( isset( $statuses[$submission->status] ) ? $statuses[$submission->status] : $submission->status ); ?></span>
                <?php ?></td>
        </tr>

        <tr>
            <th><?php _e( 'Date', 'gamipress-submissions' ); ?></th>
            <td><abbr title="<?php echo date( 'Y/m/d g:i:s a', strtotime( $submission->date ) ); ?>"><?php echo date( 'Y/m/d', strtotime( $submission->date ) ); ?></abbr></td>
        </tr>

        </tbody>
    </table>
<?php
}


/**
 * Forminator submission data
 *  |CJ|
 */

function gamipress_submissions_forminator_meta_box($submission) {
    //var_dump($submission);

    //Get forminator form ID
    $shortcode = get_post_meta( $submission->post_id, '_gamipress_submissions_cj_form_shortcode', true );
    $pattern = '/(?<=id=")(.*)(?=")/';
    
    $forminator_form_id;
    if (preg_match($pattern, $shortcode, $match) == 1) {
        $forminator_form_id=$match[1];
    }

    //Get Latest forminator submission by the user
    global $wpdb;
    $sql = "SELECT DISTINCT e.entry_id FROM {$wpdb->prefix}frmt_form_entry as e, {$wpdb->prefix}frmt_form_entry_meta as em
    WHERE e.entry_id = em.entry_id
    AND e.form_id =  %d
    AND em.meta_key = 'user_id'
    AND em.meta_value = %d
    ORDER BY e.date_created DESC 
    LIMIT 1";
    $result = $wpdb->get_results( $wpdb->prepare( $sql, $forminator_form_id,  $submission->user_id) );
    
    //Get the Entry id for the last submission
    $forminator_entry_id = $result[0]->entry_id;

    //Forminator Modals
    $forminator_entry = Forminator_API::get_entry($forminator_form_id, $forminator_entry_id);
    $forminator_form = Forminator_API::get_form( $forminator_form_id );
    ?>

    <?php
    $admin_url = admin_url("/admin.php?page=forminator-entries&form_type=forminator_forms&form_id=$forminator_form_id&entry_id=$forminator_entry_id");
    render_form_submissions( $forminator_form, $forminator_entry );
    ?>
    <p>
        <a href="<?=$admin_url?>">Forminator form <?=$forminator_entry_id?></a>
    </p>
   <?php 
}
    // Helper function for gamipress submissions meta box
    function render_form_submissions( $form, $entry ) {
        $field_labels = array();

        // Get fields labels
        if ( ! is_null( $form ) ) {
            if ( is_array( $form->fields ) ) {
                foreach ( $form->fields as $field ) {
                    $field_labels[ $field->slug ] = $field->get_label_for_entry();
                }
            }
        }
        ?>
        <table class="form-table">
            <tbody>
                <tr>
                    <th>Form title</th>
                    <td><?php echo( is_null( $form ) ? esc_html( __( 'Not Found' ) ) : esc_html( $form->name ) ); ?></td>
                </tr>
                <tr>
                    <th>Entry id</th>
                    <td><?php echo esc_html( $entry->entry_id ); ?></td>
                </tr>
                <?php
                    // Show all entries
                    foreach ( $entry->meta_data as $field_id => $meta ) : 
                         if ( isset( $field_labels[ $field_id ] ) ) : // only display entry with field label exist
                            $field_value = $meta['value']; 
                ?>
                        <tr>
                            <th><?php echo esc_html( $field_labels[ $field_id ] ); ?></th>
                            <td>
                            <?php 
                                if ( is_array( $field_value ) ){ // show key too when its array value (multiname, multiple choices) 

                                   // var_dump($field_value);

                                    foreach ( $field_value as $key => $val ){
                                        echo ('<div class="entry_files">');
                                            //If file uploads (single or multiple)
                                            $r = '';
                                            if (esc_html($key)=="file"){
                                                $r = format_multientries($key, $val);
                                            }else{
                                                $r  = "<div class='entry_file'>";
                                                $r .=   "<div class='entry_label'>$k :</div>";
                                                $r .=   "<div class='entry_value'>$v</div>";
                                                $r .= "</div>";
                                            }
                                            echo ($r);
                                            
                                        echo ('</div>');
                                    }     
                                }else {
                                    echo esc_html( $field_value );
                                }
                            ?>
                            <td>
                        </tr>
                <?php 
                        endif; 
                    endforeach; 
                ?>
            </tbody>
        </table>
        <?php
    }


    //get multi file entries
    function format_multientries($key, $val){
        $k = esc_html( $key );
        $v = esc_html( $val );
        $ext = false;
        $r = "";

        //Single File Uploads
        if (count($val["file_path"])==1){
            $file_ext = pathinfo($val['file_path'], PATHINFO_EXTENSION);
            $file_url = $val['file_url'];
            $r .= format_file_entry($file_ext, $file_url);

        //Multi File Uploads
        }else if(count($val["file_url"])>1){
            foreach ($val["file_url"] as $file_id=>$file_url){
                $file_path = $val["file_path"][$file_id];
                $file_ext = pathinfo($file_path, PATHINFO_EXTENSION);
                $r .= format_file_entry($file_ext, $file_url);
            }
        }
        return $r;
    }

    //File entry view
    function format_file_entry($ext, $file_url){
        $r = "<div class='file_entry_container'>";
                //Show if file is an image
                if ($ext && ($ext=="png" || $ext=="jpg" || $ext=="jpeg" || $ext=="bmp")){
                    $r  .= "<a class='entry_file' href='".$file_url."' target='_blank'>";
                    $r .= "<img class='entry_image' src='".$file_url."' />";
                    $r .= "</a>";
                }else{
                    $r .= "<a class='entry_file' href='".$file_url."' target='_blank'>";
                    $r .= "<img src='".get_stylesheet_directory_uri()."/template_common_assets/img/no_image_found.png"."' />";
                    $r .= "</a>";
                }
        $r.="</div>";
        return $r;
    }


    //Styling
    add_action('admin_head', 'cj_custom_gamipress_submissions_styles');

    function cj_custom_gamipress_submissions_styles() {
    echo '
    <style>
    .entry_files .file_entry_container{
        width: 200px;
        height: 200px;
        padding: 10px;
        margin: 5px;
        position: relative;
        float: left;
        overflow: hidden;
        border: solid 4px;
        border-radius: 5px;
    }
    .entry_files .file_entry_container:hover{
        opacity:.8;
        cursor:pointer;
    }

    .entry_files .file_entry_container .entry_file img {
        position: relative;
        height: 100%;
        width: auto;
    }
    </style>';
    }

/**End:gamipress_submissions_forminator_meta_box()  */





/**
 * Submission actions meta box
 *
 * @since  1.0.0
 *
 * @param stdClass  $submission
 */
function gamipress_submissions_actions_meta_box( $submission ) {

    global $ct_table;

    $submission_actions = array();

    if( $submission->status === 'pending' ) {
        $submission_actions['approve'] = array(
            'label' => __( 'Approve', 'gamipress-submissions' ),
            'icon' => 'dashicons-yes'
        );
        $submission_actions['reject'] = array(
            'label' => __( 'Reject', 'gamipress-submissions' ),
            'icon' => 'dashicons-no'
        );
    } else if( $submission->status === 'approved' ) {
        $submission_actions['revoke'] = array(
            'label' => __( 'Revoke', 'gamipress-submissions' ),
            'icon' => 'dashicons-undo'
        );
    } else if( in_array( $submission->status, array( 'rejected', 'revoked' ) ) ) {
        $submission_actions['pending'] = array(
            'label' => __( 'Mark as pending', 'gamipress-submissions' ),
            'icon' => 'dashicons-undo'
        );
    }

    $submission_actions = apply_filters( 'gamipress_submissions_submission_actions', $submission_actions, $submission );

    ?>
    <div class="submitbox" id="submitpost" style="margin: -6px -12px -12px;">

        <div id="minor-publishing">

            <div id="misc-publishing-actions submissions-actions" style="padding: 5px 0;">

                <?php foreach( $submission_actions as $action => $submission_action ) :

                    // Setup action vars
                    if( isset( $submission_action['url'] ) && ! empty( $submission_action['url'] ) ) {
                        $url = $submission_action['url'];
                    } else {
                        $url = add_query_arg( array( 'gamipress_submissions_action' => $action ) );
                    }

                    if( isset( $submission_action['target'] ) && ! empty( $submission_action['target'] ) ) {
                        $target = $submission_action['target'];
                    } else {
                        $target = '_self';
                    } ?>

                    <div class="misc-pub-section submission-action">

                        <?php if( isset( $submission_action['icon'] ) ) : ?><span class="dashicons <?php echo $submission_action['icon']; ?>" style="color: #82878c;"></span><?php endif; ?>

                        <a href="<?php echo $url; ?>" data-action="<?php echo $action; ?>" target="<?php echo $target; ?>">
                            <span class="action-label"><?php echo $submission_action['label']; ?></span>
                        </a>

                    </div>

                <?php endforeach; ?>

            </div>

        </div>

        <div id="major-publishing-actions">

            <?php
            if ( current_user_can( $ct_table->cap->delete_item, $submission->submission_id ) ) {

                printf(
                    '<a href="%s" class="submitdelete deletion" onclick="%s" aria-label="%s">%s</a>',
                    ct_get_delete_link( $ct_table->name, $submission->submission_id ),
                    "return confirm('" .
                    esc_attr( __( "Are you sure you want to delete this item?\\n\\nClick \\'Cancel\\' to go back, \\'OK\\' to confirm the delete." ) ) .
                    "');",
                    esc_attr( __( 'Delete permanently' ) ),
                    __( 'Delete Permanently' )
                );

            } ?>

            <div class="clear"></div>

        </div>

    </div>
    <?php

}