# Changelog by ChandimaJ

## Theme overrides

1. All the override files to the theme can be found in the Child Theme folder

files and folders
```
/wp-content/themes/vikinger-child/
|-template_common_assets(new)
|-template_specific_assets(new)
|-template-part(override)
|-functions.php(override)
|-page_quests.php(override)
|-single-quest-details-page.php(new)
```
<br>
<br>

2. Setup `single-quest-details` page

Create new page with the slug (permalink) `single-quest-details` 

Set the page template as `Quest details page`

<br>
<br>

3. Modifications to `function.php`

added the function `templete_specific_enqueues()` and the relavent hook to handle template page specific styles and scripts

```
/**
 * 
 * Enqueue Template specific styles and scripts
 * |CJ|
 */
function cj_template_specific_enqueue(){
    $template_assets = get_stylesheet_directory_uri().'/template_specific_assets';
    
    //Single Quest Details
    if ( is_page_template('single-quest-deatils-page.php') ) {
        wp_enqueue_style( 'single-quest-details-styles-min', $template_assets.'/single_quest_details/css/styles.min.css' );
        wp_enqueue_style( 'single-quest-details-styles', $template_assets.'/single_quest_details/css/styles.css' );
        wp_enqueue_style( 'single-quest-details-forminator-styles', $template_assets.'/single_quest_details/css/forminator.css' );
        wp_enqueue_script( 'single-quest-details-scripts',  $template_assets.'/single_quest_details/js/scripts.js', array('jquery'), '1.0.0', true );


    // Page quests    
    }else if ( is_page_template('page_quests.php') ) {
        wp_enqueue_style( 'page-quests-styles', $template_assets.'/page_quests/css/styles.css' );
    }
}
add_action( 'wp_enqueue_scripts', 'cj_template_specific_enqueue' );
/**
 *  End: template_specific_enqueue()
 */
```

_Note: the additions and modifications made by ChandimaJ is bounded by functions having |CJ| in it's description_

<br>
<br>

4. Modifications to `vikinger/includes/gamipress/vikinger-function-gamipress-achievement.php`

* Modifications required for single-quest-details page

Modified function `vikinger_gamipress_get_achievement()`

Modified `$achievement` object

Added parameter `'post_content'        => $gp_achievement->post_content,` to make post content avaialable to the front end of single-quest-details-page.php

<br>

* Modifications required for quests page

Modified function `vikinger_gamipress_get_achievements()`

Modified `$achievement` object

Added parameter `'post_excerpt'        => $gp_achievement->post_excerpt,` to make excerpt values avaialable to the front end of page_quests.php


<br />
<br />
<br />
<hr />
<br />

## Gamipress Plugin Overrides

### Submissions

#### Adding the forminator shortcode field for gamipress submission

1. Modified the page `/wp_content/plugins/gamipress-submissions/includes/admin.php` 

modified `function gamipress_submissions_meta_boxes()`

modified `gamipress_add_meta_box()`

Added
```
$prefix . 'cj_form_shortcode' => array(
                'name' 	    => __( 'Submission Form Shortcode', 'gamipress-submissions' ),
                'desc' 	    => __( 'Add the forminator form shortcode here. ex:[forminator_form id="4582"]', 'gamipress-submissions' ),
                'type' 	    => 'text',
                'default' 	=> __( '[forminator_form id="XXXX"]', 'gamipress-submissions' ),
            ),
```
in the `array()` return method.

<br/>
<br/>

#### Adding the *'manual step selection'* to the quest>backend>step select>

_ref:https://gamipress.com/snippets/tutorials/creating-a-custom-event/_


1. Modified file `/wp_content/plugins/gamipress/includes/admin.php` 

added the function `cj_manual_requirement_triggers( $triggers )`
to add the `Manual Step` event to the list of triggers, on the admin page.

```
function cj_manual_requirement_triggers( $triggers ) {

    // The array key will be the group label
    $triggers['Custom Events'] = array(
        // Every event of this group is formed with:
        // 'event_that_will_be_triggered' => 'Event Label'
        'custom_event_manual_step' => __( 'Manual step', 'gamipress' ),

        // Also, you can add as many events as you want
        // 'my_prefix_another_custom_event' => __( 'Another custom event label', 'gamipress' ),
        // 'my_prefix_super_custom_event' => __( 'Super custom event label', 'gamipress' ),
    );

    return $triggers;

}
add_filter( 'gamipress_activity_triggers', 'cj_manual_requirement_triggers' );
```

_Note the function can be found with the comment description |CJ|_

<br>
<br>

2. Modified file `/wp_content/plugins/gamipress/includes/admin/meta-boxes/requirements.ui.php`

Modified function `gamipress_build_requirement_title()`

Modified `switch ( $trigger_type )`

added `case 'custom_event_manual_step':` to
make the step post type to be a label. (so that it'll be shown only with the label omitting other parameters like times, limited to, etc.)

<br>
<br>

#### Adding custom JS (to submit gamipress submission on forminator submission)

1. Adding forminator meta data for user id for an entry (to identify entries for user)

Modified file `/Plugins/forminator/library/model/class-form-entry-model.php`

Modified function `set_fields()`

Added userid entry to `$meta_array` array before inserting meta data.

```
    /**
    * 
    * Saving UserID info as meta in the database
    * |CJ|
    */
    $user_id = array("name"=>"user_id", "value"=>get_current_user_id());
    array_push($meta_array, $user_id);
    /** End */
```

<br>
<br>

2. Handling multi-form submissions

The original buttons for both forminator submit button & gamipress submit buttons are hidden. Submission is handled by a JS.

Use the related scripts creted to first submit the forminator form, and if no errors, submit the gamipress-submission form.

The script can be found in file `child_theme/template_specific_assets/single_quest_details.js/scripts.js`


3. Showing the related forminator submission on the gamipress-submissions admin page

Modified file `/plugins/gamipress-submissions/includes/custom-tables/submissions.php`

Modified function `gamipress_submissions_add_submissions_meta_boxes()`

Added a new hook for the forminator submission meta box
`add_meta_box( 'gamipress_submissions_forminator', 'Forminator submission', 'gamipress_submissions_forminator_meta_box', 'gamipress_submissions', 'normal', 'core' );`


Created the relevent hook function `gamipress_submissions_forminator_meta_box`

```
<?php    
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
?>
```


















