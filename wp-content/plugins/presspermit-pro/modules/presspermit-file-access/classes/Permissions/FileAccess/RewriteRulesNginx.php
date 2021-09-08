<?php
namespace PublishPress\Permissions\FileAccess;

/**
 * Rewrite class
 *
 * Nginx configuration file generation.
 * 
 * Currently requires separate server intervention to trigger Nginx config reload.
 * To output Nginx rewrite rules, define the following constants in wp-config.php:
 *	
 *		define( 'PP_NGINX_CFG_PATH', '/path/to/your/supplemental/file.conf' );
 *		define( 'PP_FILE_ROOT', '/wp-content' );  // typical configuration (modify with actual path to folder your uploads folder is in, relative to http root) 
 *
 *	NOTE that you will need to provide your own server scripts to trigger an Nginx reload upon config file update.
 *	
 *	On network installations, rules from all sites are inserted into the same file, specified by PP_NGINX_CFG_PATH.  Each site's rules are preceded by a distinguishing comment tag.
 *	
 *	To disable .htaccess output, define the following constant (in addition to PP_NGINX_CFG_PATH) :
 *	
 *		define( 'PP_NO_HTACCESS', true );
 *	
 *	You may manually force regeneration of Nginx or .htaccess rules by creating the file defined in this constant:
 *	
 *		define( 'PP_FILE_REGEN_TRIGGER', '/path/to/your/trigger/file' ); 
 * 
 * @package PressPermit
 * @author Kevin Behrens <kevin@agapetry.net>
 * @copyright Copyright (c) 2011-2018, Agapetry Creations LLC
 *
 */
class RewriteRulesNginx
{
    static function &buildSiteFileConfig($args = [])
    {
        $defaults = ['regenerate_keys' => false];
        $args = array_merge($defaults, (array)$args);
        foreach (array_keys($defaults) as $var) {
            $$var = $args[$var];
        }

        global $wpdb;

        $home_root = parse_url(get_option('home'));
        $home_root = trailingslashit($home_root['path']);

        $uploads = FileAccess::getUploadInfo();

        $baseurl = trailingslashit($uploads['baseurl']);

        $arr_url = parse_url($baseurl);
        $rewrite_base = $arr_url['path'];

        if (defined('PP_FILE_ROOT')) {
            $pos = strpos($rewrite_base, PP_FILE_ROOT);
            if ($pos) {
                $rewrite_base = substr($rewrite_base, $pos);
            }
        }

        $file_keys = [];
        $has_postmeta = [];

        if (!$regenerate_keys) {
            if ($key_results = $wpdb->get_results("SELECT pm.meta_value, p.guid, p.ID FROM $wpdb->postmeta AS pm INNER JOIN $wpdb->posts AS p ON p.ID = pm.post_id WHERE pm.meta_key = '_rs_file_key'")) {
                foreach ($key_results as $row) {
                    $file_keys[$row->guid] = $row->meta_value;
                    $has_postmeta[$row->ID] = $row->meta_value;
                }
            }
        }

        $new_rules = "\n";

        require_once(PRESSPERMIT_FILEACCESS_CLASSPATH . '/Analyst.php');
        if (!$attachment_results = Analyst::identifyProtectedAttachments()) {
            return $new_rules;
        }

        if (is_multisite())
            $new_rules .= "location ~* $rewrite_base" . ' {' . "\n";
        else
            $new_rules .= "location $rewrite_base" . ' {' . "\n";

        $main_rewrite_rule = "RewriteRule ^(.*) {$home_root}index.php?attachment=$1&pp_rewrite=1 [NC,L]\n";

        $htaccess_urls = [];

        $unfiltered_ids = $wpdb->get_col("SELECT post_id FROM $wpdb->postmeta WHERE meta_key = '_pp_file_filtering' AND meta_value = '0' AND post_id IN ('" . implode("','", array_keys($attachment_results)) . "')");

        if ($pass_small_thumbs = presspermit()->getOption('small_thumbnails_unfiltered'))
            $thumb_filtered_ids = $wpdb->get_col("SELECT post_id FROM $wpdb->postmeta WHERE meta_key = '_pp_file_filtering' AND meta_value = 'all' AND post_id IN ('" . implode("','", array_keys($attachment_results)) . "')");
        else
            $thumb_filtered_ids = [];

        foreach ($attachment_results as $row) {
            if (false === strpos($row->guid, $baseurl))  // no need to include any attachments which are not in the uploads folder
                continue;

            if (in_array($row->ID, $unfiltered_ids))
                continue;

            if (!empty($file_keys[$row->guid])) {
                $key = $file_keys[$row->guid];
            } else {
                $key = urlencode(str_replace('.', '', uniqid(strval(rand()), true)));
                $file_keys[$row->guid] = $key;
            }

            if (!isset($has_postmeta[$row->ID]) || ($key != $has_postmeta[$row->ID]))
                update_post_meta($row->ID, "_rs_file_key", $key);

            if (isset($htaccess_urls[$row->guid]))  // if a file is attached to multiple protected posts, use a single rewrite rule for it
                continue;

            $htaccess_urls[$row->guid] = true;

            $rel_path = str_replace($baseurl, '', $row->guid);

            // escape spaces
            $file_path = str_replace(' ', '\s', $rel_path);

            // escape horiz tabs (yes, at least one user has them in filenames)
            $file_path = str_replace(chr(9), '\t', $file_path);

            // strip out all other nonprintable characters.  Affected files will not be filtered, but we avoid 500 error.  Possible TODO: advisory in file attachment utility
            $file_path = preg_replace('/[\x00-\x1f\x7f]/', '', $file_path);

            // escape all other regular expression operator characters
            $file_path = preg_replace('/[\^\$\.\+\[\]\(\)\{\}]/', '\\\$0', $file_path);

            $redirect_path = urlencode($rel_path);

            if (0 === strpos($row->post_mime_type, 'image') && $pos_ext = strrpos($file_path, '\.')) {
                $thumb_path = substr($file_path, 0, $pos_ext);
                $ext = substr($file_path, $pos_ext + 2);

                // covers main file and thumbnails that use standard naming pattern
                $new_rules .= 
                'if ( $arg_rs_file_key != "' . $key . '" ) { rewrite "^/(.*)/' . '$thumb.php?attachment=' . $redirect_path . '&pp_rewrite=1 last; }' . "\n";

                // possible TODO:
                //if ( $pass_small_thumbs && ! in_array( $row->ID, $thumb_filtered_ids ) )
                // $new_rules .= "RewriteCond %{REQUEST_URI} !^(.*)" . (int) get_option('thumbnail_size_w') . 'x' . (int) get_option('thumbnail_size_h') . "\.jpg$ [NC]\n";

                // if resized image file(s) exist, include rules for them
                $guid_pos_ext = strrpos($rel_path, '.');
                $pattern = $uploads['path'] . '/' . substr($rel_path, 0, $guid_pos_ext) . '-??????????????' . substr($rel_path, $guid_pos_ext);
                if (glob($pattern)) {
                    $new_rules .= 'if ( $arg_rs_file_key != "' . $key . '" ) { rewrite "^/(.*)/' . '$thumb.php?attachment=' . $redirect_path . '&pp_rewrite=1 last; }' . "\n";
                }
            } else {
                //$new_rules .= "RewriteCond %{REQUEST_URI} ^(.*)/$file_path" . "$ [NC]\n";
                $new_rules .= 'if ( $arg_rs_file_key != "' . $key . '" ) { rewrite "^/(.*)/' . '$file.php?attachment=' . $redirect_path . '&pp_rewrite=1 last; }' . "\n";
            }
        } // end foreach protected attachment

        /*
        if ( Network::msBlogsRewriting() ) {
            $blog_id = get_current_blog_id();
            $file_filtered_sites = (array) get_site_option( 'pp_file_filtered_sites' );
            if ( ! in_array( $blog_id, $file_filtered_sites ) ) {
                // this site needs a file redirect rule in root .htaccess
                NetworkLegacy::flushMainRules();
            }
        }
        */

        $new_rules .= '}' . "\n";

        return $new_rules;
    }

    public static function insertWithMarkers($filename, $marker, $insertion, $args = [])
    {
        $defaults = ['invalidate_marker_suffix' => '', 'update_only' => false];
        $args = array_merge($defaults, (array)$args);
        foreach (array_keys($defaults) as $var) {
            $$var = $args[$var];
        }

        if (!file_exists($filename) || is_writeable($filename)) {
            if (!file_exists($filename)) {
                $markerdata = '';
            } else {
                $markerdata = explode("\n", implode('', file($filename)));
            }

            if (!$f = @fopen($filename, 'w'))
                return false;

            $foundit = false;
            if ($markerdata) {
                $state = true;
                foreach ($markerdata as $n => $markerline) {
                    $pos = strpos($markerline, '# BEGIN ' . $marker);
                    if ((false !== $pos) && $invalidate_marker_suffix) {
                        if (strpos($markerline, $invalidate_marker_suffix, $pos + strlen('# BEGIN ') + strlen($marker) - 1))
                            $pos = false;
                    }

                    if ($pos !== false)
                        $state = false;
                    if ($state) {
                        if ($n + 1 < count($markerdata))
                            fwrite($f, "{$markerline}\n");
                        else
                            fwrite($f, "{$markerline}");
                    }

                    $pos = strpos($markerline, '# END ' . $marker);
                    if ((false !== $pos) && $invalidate_marker_suffix) {
                        if (strpos($markerline, $invalidate_marker_suffix, $pos + strlen('# END ') + strlen($marker) - 1))
                            $pos = false;
                    }

                    if ($pos !== false) {
                        fwrite($f, "# BEGIN {$marker}\n");
                        if (is_array($insertion))
                            foreach ($insertion as $insertline)
                                fwrite($f, "{$insertline}\n");
                        fwrite($f, "# END {$marker}\n");
                        $state = true;
                        $foundit = true;
                    }
                }
            }

            if (!$foundit && !$update_only) {
                fwrite($f, "\n# BEGIN {$marker}\n");
                foreach ($insertion as $insertline)
                    fwrite($f, "{$insertline}\n");
                fwrite($f, "# END {$marker}\n");
            }
            fclose($f);

            return true;
        } else {
            return false;
        }
    }
}
