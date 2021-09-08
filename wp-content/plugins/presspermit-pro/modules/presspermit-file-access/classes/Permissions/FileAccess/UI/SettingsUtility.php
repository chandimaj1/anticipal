<?php
namespace PublishPress\Permissions\FileAccess\UI;

use \PublishPress\Permissions\UI\SettingsAdmin as SettingsAdmin;

class SettingsUtility
{
    public static function requestedAttachFiles()
    {
        if (defined('PRESSPERMIT_REQUESTED_ATTACH_FILES')) {
            return;
        }

        if ($key = presspermit()->getOption('file_filtering_regen_key')) {
            if (!empty($_GET['key']) && ($key == $_GET['key'])) {  // user must store their own non-null key before this will work
                http_response_code(200);
                self::attachLinkedUploads(!empty($_GET['echo']));
            } else {
                http_response_code(403);
                echo SettingsAdmin::getStr('attachments_util_invalid_regen_key');
            }
        } else {
            http_response_code(401);
            echo SettingsAdmin::getStr('attachments_util_no_regen_key');
        }

        exit(0);
    }

    public static function display()
    {
    ?>
    <div class='wrap'>
        <table width="100%">
            <tr>
                <td width="90%">
                    <h2><?php _e('Attachments Utility', 'presspermit-pro') ?></h2>
                    <?php
                    $uploads = FileAccess::getUploadInfo();
                    $upload_path = $uploads['baseurl'];
                    $upload_dir = $uploads['basedir'];
                    printf(
                        __('Back to %1$sPermissions Settings%2$s', 'presspermit-pro'), 
                        "<a href='admin.php?page=presspermit-settings&pp_tab=file_access'>", 
                        '</a>'
                    );
                    ?>
                </td>
            </tr>
        </table>

        <?php
        if (!function_exists('pp_plugin_search_url')) {
            function pp_plugin_search_url($search, $search_type = 'tag')
            {
                $url = get_option('siteurl') . "/wp-admin/plugin-install.php?tab=search&type=$search_type&s=$search";
                return $url;
            }
        }

        echo '<br />';
        echo SettingsAdmin::getStr('attachments_util_disclaimer');
        echo '<div class="pp-instructions"><ol><li>';
        echo SettingsAdmin::getStr('attachments_util_wp_tree');
        echo '</li><li>';

        $search_replace_url = pp_plugin_search_url('replace');

        if (false !== strpos($upload_path, 'http://www.')) {
            $www_msg = SettingsAdmin::getStr('attachments_util_www');
        } else {
            $www_msg = SettingsAdmin::getStr('attachments_util_no_www');
        }

        printf( // 'Files linked from WP Posts and Pages must be in %1$s (or a subdirectory of it) to be filtered. After moving files, you may use %2$s a search and replace plugin%3$s to conveniently update the URLs stored in your Post / Page content. %4$s'
            SettingsAdmin::getStr('attachments_util_search_replace'),
            '<strong>' . $uploads['baseurl'] . '</strong>', 
            "<a href='$search_replace_url'>", '</a>', 
            $www_msg
        );
        
        echo '</li><li>';
        echo SettingsAdmin::getStr('attachments_util_postmeta_link');
        echo '</li></ol></div>';

        if (!empty($_POST['pp_run_utility'])) {
            self::attachLinkedUploads(true);
        }
        ?>
        <form action="" method="post">
            <div class="submit" style="border:none;float:right;margin:0;">
                <input type="submit" name="pp_run_utility" value="<?php _e('Register File Attachments &raquo;', 'presspermit-pro'); ?>"/>
            </div>
        </form>

        <br />
        <div>
    <?php
        if ($val = get_option("presspermit_file_filtering_regen_key")) {
            echo SettingsAdmin::getStr('attachments_util_cron_task');
            $url = site_url("index.php?action=presspermit-attachment-utility&amp;key=$val");
            echo("<div style='margin-left:30px;margin-bottom:5px'><a href='$url' target='_blank'>$url</a></div>");

        } else {
            echo SettingsAdmin::getStr('attachments_util_cron_task_need_regen_key');
        }
        ?>
        </div>
    <?php
    }

    public static function attachLinkedUploads($echo = false)
    {
        global $wpdb;

        $blog_id = get_current_blog_id();

        if (is_multisite() && is_super_admin() && PWP::isNetworkActivated()) {
            global $wpdb;
            $blog_ids = $wpdb->get_col("SELECT blog_id FROM $wpdb->blogs ORDER BY blog_id");
            $orig_blog_id = $blog_id;
        } else {
            $blog_ids = [$blog_id];
        }


        $uploads = \PublishPress\Permissions\FileAccess::getUploadInfo();
        $upload_path = $uploads['baseurl'];
        $upload_dir = $uploads['basedir'];

        foreach ($blog_ids as $id) {
            if (count($blog_ids) > 1) {
                switch_to_blog($id);

                if ($echo) {
                	_e("<br /><strong>site $id :</strong><br />");
            	}
            }

            $site_url = untrailingslashit(get_option('siteurl'));
            if (false === strpos($uploads['baseurl'], $site_url)) {
                if ($echo) {
                    echo SettingsAdmin::getStr('attachments_util_external_content_dir');
                    echo '<br /><br />';
                    echo SettingsAdmin::getStr('attachments_util_terminated');
                }

                return false;
            }

            $post_types = array_diff(get_post_types(['public' => true, 'show_ui' => true], 'names', 'or'), ['attachment']);
            $post_type_in = "'" . implode("','", $post_types) . "'";

            if ($post_ids = $wpdb->get_col("SELECT ID FROM $wpdb->posts WHERE post_type IN ($post_type_in) ORDER BY post_type, post_title")) {
                $stored_attachments = [];
                if ($results = $wpdb->get_results("SELECT post_parent, guid FROM $wpdb->posts WHERE post_type = 'attachment'")) {
                    foreach ($results as $row) {
                        $stored_attachments[$row->post_parent][$row->guid] = true;
                    }
                }

                // for reasonable memory usage, only hold 10 posts in memory at a time
                $found_links = 0;
                $num_inserted = 0;
                $num_posts = count($post_ids);
                $bite_size = 10;
                $num_bites = $num_posts / $bite_size;

                if ($num_posts % $bite_size) {
                    $num_bites++;
                }

                if ($echo) {
                    printf(  // "<strong>checking %s posts / pages...</strong>"
                        SettingsAdmin::getStr('attachments_util_checking_posts_pages'),
                        $num_posts
                    );

                    echo '<br /><br />';
                }

                for ($i = 0; $i < $num_bites; $i++) {
                    $id_in = "'" . implode("','", array_slice($post_ids, $i * $bite_size, $bite_size)) . "'";

                    if (!$results = $wpdb->get_results("SELECT ID, post_content, post_author, post_title, post_type FROM $wpdb->posts WHERE ID IN ($id_in)")) {
                        continue;
                    }

                    foreach ($results as $row) {
                        $linked_uploads = [];

                        // preg_match technique learned from https://stackoverflow.com/questions/138313/how-to-extract-img-src-title-and-alt-from-html-using-php
                        $tags = ['img' => [], 'a' => []];

                        $content = $row->post_content;

                        preg_match_all('/<img[^>]+>/i', $row->post_content, $tags['img']);
                        preg_match_all('/<a[^>]+>/i', $row->post_content, $tags['a']);  // don't care that this will terminate with any enclosed tags (i.e. img)

                        foreach (array_keys($tags) as $tag_type) {
                            foreach ($tags[$tag_type]['0'] as $found_tag) {
                                $found_attribs = ['src' => '', 'href' => '', 'title' => '', 'alt' => ''];

                                if (!preg_match_all('/(alt|title|src|href)=("[^"]*")/i', $found_tag, $tag_attributes)) {
                                    continue;
                                }

                                foreach ($tag_attributes[1] as $key => $attrib_name) {
                                    $found_attribs[$attrib_name] = trim($tag_attributes[2][$key], "'" . '"');
                                }

                                if (!$found_attribs['href'] && !$found_attribs['src']) {
                                    continue;
                                }

                                $file_url = ($found_attribs['src']) ? $found_attribs['src'] : $found_attribs['href'];

                                if (!strpos($file_url, '.')) {
                                    continue;
                                }

                                if (is_multisite() && strpos($uploads['url'], 'blogs.dir')) {
                                    $file_url = str_replace('/files/', "/wp-content/blogs.dir/$blog_id/files/", $file_url);
                                }

                                // links can't be registered as attachments unless they're in the WP uploads path
                                if (false === strpos($file_url, $upload_path)) {
                                    if ($echo) {
                                        printf( // '%1$s skipping unfilterable file in %2$s "%3$s":%4$s %5$s'
                                            SettingsAdmin::getStr('attachments_util_skipping_unfilterable'),
                                            '<span class="pp-brown">',
                                            $row->post_type, 
                                            $row->post_title, 
                                            '</span>',
                                            $file_url
                                        );
                                        
                                        echo '<br /><br />';
                                    }

                                    continue;
                                }

                                // make sure the linked file actually exists
                                if (!file_exists(str_replace($upload_path, $upload_dir, $file_url))) {
                                    if ($echo) {
                                        printf(  // '%1$s skipping missing file in %2$s "%3$s":%4$s %5$s' 
                                            SettingsAdmin::getStr('attachments_util_skipping_missing'),
                                            '<span class="pp-red">',
                                            $row->post_type, 
                                            $row->post_title, 
                                            '</span>',
                                            $file_url
                                        );

                                        echo '<br /><br />';
                                    }

                                    continue;
                                }

                                $caption = ($found_attribs['title']) ? $found_attribs['title'] : $found_attribs['alt'];

                                // we might find the same file sourced in both link and img tags
                                if (!isset($linked_uploads[$file_url]) || !$linked_uploads[$file_url]) {
                                    $found_links++;
                                    $linked_uploads[$file_url] = $caption;
                                }

                            } // end foreach found tag
                        } // end foreach loop on 'img' and 'a'

                        foreach ($linked_uploads as $file_url => $caption) {
                            $unsuffixed_file_url = preg_replace("/-[0-9]{2,4}x[0-9]{2,4}./", '.', $file_url);

                            $file_info = wp_check_filetype($unsuffixed_file_url);

                            if (!isset($stored_attachments[$row->ID][$unsuffixed_file_url])) {
                                $att = [];
                                $att['guid'] = $unsuffixed_file_url;

                                $info = pathinfo($unsuffixed_file_url);

                                if (isset($info['filename'])) {
                                    $att['post_name'] = $info['filename'];
                                    $att['post_title'] = $info['filename'];
                                }

                                $att['post_excerpt'] = $caption;
                                $att['post_author'] = $row->post_author;
                                $att['post_parent'] = $row->ID;
                                $att['post_category'] = wp_get_post_categories($row->ID);

                                if (isset($file_info['type'])) {
                                    $att['post_mime_type'] = $file_info['type'];
                                }

                                $num_inserted++;

                                if ($echo) {
                                    printf( // '%1$s<strong>new attachment</strong> in %2$s "%3$s":%4$s %5$s'
                                        SettingsAdmin::getStr('attachments_util_new_attachment'),
                                        '<span class="pp-green">',
                                        __(ucwords($row->post_type)), 
                                        $row->post_title, 
                                        '</span>',
                                        $file_url
                                    );
                                }

                                wp_insert_attachment($att);
                            } else {
                                if ($echo) {
                                    printf( // '%1$s attachment OK in %2$s "%3$s":%4$s %5$s'
                                        SettingsAdmin::getStr('attachments_util_attachment_ok'),
                                        '<span class="pp-blue">',
                                        __(ucwords($row->post_type)), 
                                        $row->post_title, 
                                        '</span>',
                                        $file_url
                                    );
                                }
                            }

                            if ($echo) {
                                echo '<br /><br />';
                            }

                        } // end foreach linked_uploads

                    } // end foreach post in this bite

                } // endif for each 10-post bite

                if ($echo) {
                    echo '<strong>';

                    printf( // "Operation complete: %s linked uploads were found in your post / page content."
                        SettingsAdmin::getStr('attachments_util_linked_uploads_found'),
                        $found_links
                    );
                    
                    echo '<br /><br />';

                    if ($num_inserted) {
                        printf( // '<strong>%s attachment records were added to the database.</strong>'
                            SettingsAdmin::getStr('attachments_util_files_added'),
                            $num_inserted
                        );

                        echo '<br /><br />';
                    } elseif ($found_links) {
                        echo SettingsAdmin::getStr('attachments_util_already_registered');
                        echo '<br /><br />';
                    }
                }
            }

            if ($echo && (count($blog_ids) > 1)) {
                echo '<hr />';
            }

        } // end foreach site

        if (count($blog_ids) > 1) {
            switch_to_blog($orig_blog_id);
        }

        return true;
    }
}
