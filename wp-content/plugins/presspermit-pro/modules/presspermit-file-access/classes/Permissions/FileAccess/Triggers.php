<?php
namespace PublishPress\Permissions\FileAccess;

class Triggers
{
    function __construct() {
        // Actions that may trigger file rules expiration or regen
        add_action('presspermit_init', [$this, 'actDetectFlushRequest']);
        add_action('shutdown', [$this, 'actCheckExpirationFlag']);

        add_action('presspermit_activate', ['\PublishPress\Permissions\FileAccess', 'expireFileRules']);
        add_action('presspermit_deactivate', ['\PublishPress\Permissions\FileAccess', 'clearAllFileRules']);

        add_action('save_post', [$this, 'actSavePost'], 20, 2);

        if (!defined('PP_DISABLE_ATTACHMENT_RULES_REGEN')) {
            add_action('add_attachment', [$this, 'actSaveAttachment'], 20);
            add_action('edit_attachment', [$this, 'actSaveAttachment'], 20);
        }

        // To avoid redundant regen of uploads/.htaccess, allow main post save operation to trigger it (possibly after changing visibility)
        if (false === strpos($_SERVER['SCRIPT_NAME'], 'async-upload.php')) {
            if (!defined('PRESSPERMIT_LIMIT_HTACCESS_ATTMOD_REGEN')) {
                add_action('add_attachment', ['\PublishPress\Permissions\FileAccess', 'expireFileRules']);
                add_action('edit_attachment', ['\PublishPress\Permissions\FileAccess', 'expireFileRules']);
                add_action('delete_attachment', ['\PublishPress\Permissions\FileAccess', 'expireFileRules']);
            }
        }

        /* This trigger is not currently needed, but left as a pattern for possible third party integration issues
        add_action('presspermit_attach_media', [$this, 'actDetectPostAttachment'], 10, 2);
        */
        
        if (!defined('PRESSPERMIT_LIMIT_HTACCESS_REDIRECT_REGEN')) {
            add_filter('wp_redirect', [$this, 'actDetectPostAttachmentRedirect'], 5, 2);  // detect file attachment via find posts ajax
        }

        // Enable additional actions
        add_filter(
            'presspermit_exception_item_deletion_hooks', 
            function()
            {
                return true;
            }
        );
        
        if (!defined('PRESSPERMIT_LIMIT_HTACCESS_EXCMOD_REGEN')) {
            // Exception insertion / removal may affect attachment access.
            add_action('presspermit_removed_exception_item', [$this, 'actRemovedExceptionItem'], 10, 2);
            add_action('presspermit_inserted_exception_item', [$this, 'actInsertedExceptionItem']);
        }

        // Option changes which trigger file rule expiration
        if (!defined('PRESSPERMIT_LIMIT_HTACCESS_OPTION_REGEN')) {
            add_action('update_option_presspermit_small_thumbnails_unfiltered', [$this, 'actExpireOnOptionChange'], 10, 2);
            add_action('update_option_presspermit_unattached_files_private', [$this, 'actExpireOnOptionChange'], 10, 2);
        }

        if (!defined('PRESSPERMIT_LIMIT_HTACCESS_OPTION_RESET_REGEN')) {
            add_action('admin_head', [$this, 'actDetectOptionsReset']);
        }
    }

    function actSaveAttachment($attachment_id)
    {
        FileAccess::flushFileRules();
    }

    function actSavePost($post_id, $post)
    {
        if (!empty(presspermit()->flags['ignore_save_post'])) {
            return;
        }

        // No need to flush file rules unless this post has at least one attachment
        global $wpdb;
        if ($current_attachment_ids = $wpdb->get_col("SELECT ID FROM $wpdb->posts WHERE post_type = 'attachment' AND post_parent = '$post_id'")) {
            require_once(PRESSPERMIT_FILEACCESS_CLASSPATH . '/PostSave.php');
            PostSave::maybeFlushFileRules($post_id, compact('current_attachment_ids'));
        }
    }

    /* This trigger is not currently needed, but left as a pattern for possible third party integration issues
    function actDetectPostAttachment($attachment_id, $post_id) {
        require_once(PRESSPERMIT_FILEACCESS_CLASSPATH . '/PostSave.php');
        PostSave::maybeFlushFileRules($post_id);
    }
    */

    // Expire file rules on new attachment of existing Media
    function actDetectPostAttachmentRedirect($location, $status)
    {
        if (!empty($_REQUEST['found_post_id']) && isset($_REQUEST['media'])) {
            FileAccess::expireFileRules();
        }

        return $location;
    }

    function actInsertedExceptionItem($eitem)
    {
        static $expired = null;
        if (!is_null($expired)) {
            return;
        }

        require_once(PRESSPERMIT_FILEACCESS_CLASSPATH . '/Analyst.php');
        if (Analyst::exceptionsAffectAttachments($eitem)) {
            $expired = true;
            FileAccess::expireFileRules();
        }
    }

    function actRemovedExceptionItem($eitem_id, $eitem)
    {
        $this->actInsertedExceptionItem($eitem);
    }

    function actExpireOnOptionChange($new_option_value, $old_option_value)
    {
        if ($old_option_value !== $new_option_value) {
            FileAccess::expireFileRules();
        }

        return $new_option_value;
    }

    function actDetectOptionsReset()
    {
        if (isset($_POST['presspermit_defaults'])) {
            // User asked to restore default options, so restore htaccess rule for attachment filtering (if it's not disabled)
            if (is_multisite() && Network::msBlogsRewriting()) {
                NetworkLegacy::flushMainRules();
            }

            FileAccess::expireFileRules();
        }
    }

    // Executes on init
    function actDetectFlushRequest()
    {
        if (!empty($_GET['action']) && ('presspermit-expire-file-rules' == $_GET['action'])) {
            require_once(PRESSPERMIT_FILEACCESS_CLASSPATH . '/RuleFlush.php');
            RuleFlush::requestedFileRuleFlush();

        } elseif (!empty($_GET['action']) && ('presspermit-attachment-utility' == $_GET['action'])) {
            require_once(PRESSPERMIT_FILEACCESS_CLASSPATH . '/UI/SettingsUtility.php');
            UI\SettingsUtility::requestedAttachFiles();

        } else {
            $this->actCheckExpirationFlag();
        }
    }

    // Executes on shutdown
    function actCheckExpirationFlag()
    {
        // Don't process a queued regen on an Ajax request or plugin (de)activation. There are dedicated handlers for PP/PPF (de)activation.
        //if (is_admin() && ((!empty($_POST)) || (defined('DOING_AJAX') && DOING_AJAX) || presspermit()->admin()->isPluginAction())) {
        if (is_admin() && ((defined('DOING_AJAX') && DOING_AJAX) || presspermit()->admin()->isPluginAction())) {
            return;
        }

        if (!defined('PRESSPERMIT_LIMIT_HTACCESS_TRIGGER_REGEN')) {
            $regen_trigger_file = (defined('PP_FILE_REGEN_TRIGGER')) ? PP_FILE_REGEN_TRIGGER : '';
            if ($regen_triggered = $regen_trigger_file && file_exists($regen_trigger_file)) {
                @unlink($regen_trigger_file);
            }
        }

        if (presspermit()->getOption('file_rules_expired') || $regen_triggered) {
            delete_option('presspermit_file_rules_expired');
            
            $_args = [];

            if (presspermit()->getOption('regenerate_file_keys') || $regen_triggered) {
                $_args['regenerate_keys'] = true;
                delete_option('presspermit_regenerate_file_keys');
            }

            if (FileAccess::flushFileRules($_args)) {
                //delete_option('presspermit_file_rules_expired');
            }
        }
    }
}
