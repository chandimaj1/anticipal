<?php
namespace PublishPress\Permissions\Teaser;

/**
 * PPTX_AdminFilters class
 *
 * @package PressPermit
 * @author Kevin Behrens <kevin@agapetry.net>
 * @copyright Copyright (c) 2011-2021, Kevin Behrens
 *
 */
class Admin
{
    function __construct()
    {
        add_action('presspermit_permissions_menu', [$this, 'permissions_menu'], 14, 2);
        add_action('admin_print_scripts', [$this, 'markActiveSubmenu'], 20);

        if ('presspermit-settings' == presspermitPluginPage()) {
            $urlpath = plugins_url('', PRESSPERMIT_TEASER_FILE);
            wp_enqueue_style('presspermit-teaser-settings', $urlpath . '/common/css/settings.css', [], PRESSPERMIT_TEASER_VERSION);

            add_action('presspermit_options_ui', [$this, 'actOptionsUI']);
        }

        if (!empty($_REQUEST['page'])) {
            if ('presspermit-teaser' == $_REQUEST['page']) {
                $url = admin_url('admin.php?page=presspermit-settings&pp_tab=teaser');
                wp_redirect($url);
            }
        }
    }

    function actOptionsUI()
    {
        require_once(PRESSPERMIT_TEASER_CLASSPATH . '/UI/SettingsTabTeaser.php');
        new UI\SettingsTabTeaser();
    }

    function markActiveSubmenu() {
        if (('presspermit-settings' == presspermitPluginPage()) && !empty($_REQUEST['pp_tab']) && ('teaser' == $_REQUEST['pp_tab'])) :
        ?>
            <script type="text/javascript">
                /* <![CDATA[ */
                jQuery(document).ready(function ($) {
                    $('#adminmenu li.toplevel_page_presspermit-groups ul.wp-submenu li').removeClass('current');
                    $('#adminmenu li.toplevel_page_presspermit-groups ul.wp-submenu li a[href="admin.php?page=presspermit-teaser"]').parent().addClass('current');
                });
                /* ]]> */
            </script>
        <?php endif;
    }

    function permissions_menu($pp_options_menu, $handler)
    {
        add_submenu_page(
            $pp_options_menu, 
            __('Teaser', 'presspermit-pro'), 
            __('Teaser', 'presspermit-pro'), 
            'read', 
            'presspermit-teaser', 
            $handler
        );
    }
}
