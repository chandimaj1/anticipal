<?php
/**
 * Plugin Name: PublishPress Permissions Pro
 * Plugin URI:  https://publishpress.com/permissions
 * Description: Advanced yet accessible content permissions. Give users or groups type-specific roles. Enable or block access for specific posts or terms.
 * Author: PublishPress
 * Author URI:  https://publishpress.com/
 * Version: 3.5.7
 *
 * Copyright (c) 2021 PublishPress
 *
 * GNU General Public License, Free Software Foundation <https://www.gnu.org/licenses/gpl-3.0.html>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, orF:\www\wp50\wp-content\plugins\presspermit-pro\includes-pro\settings-pro.dev.js
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @package     PressPermit Pro
 * @category    Core
 * @author      PublishPress
 * @copyright   Copyright (c) 2021 PublishPress. All rights reserved.
 *
 **/

// @todo: enforce PHP version requirement

if (!defined('ABSPATH')) exit; // Exit if accessed directly

if (!defined('PRESSPERMIT_PRO_FILE')) {
    define('PRESSPERMIT_PRO_FILE', __FILE__);
    define('PRESSPERMIT_PRO_ABSPATH', __DIR__);

    // negative priority to precede any default WP action handlers
    add_action(
        'plugins_loaded', 
        function()
        {
            if (defined('PRESSPERMIT_PRO_VERSION')) {
                return;
            }

            define('PRESSPERMIT_PRO_VERSION', '3.5.7');

            $edd_id = get_option('presspermit_edd_id', 21050);
            define('PRESSPERMIT_EDD_ITEM_ID', $edd_id);

            require_once(__DIR__ . '/includes-pro/admin-load.php');
            new \PublishPress\Permissions\AdminLoadPro();
    
            require_once(__DIR__ . '/vendor/publishpress/publishpress-permissions/press-permit-core.php');
        }
        , -10
    );
    
    register_activation_hook(
        __FILE__, 
        function()
        {
            require_once( __DIR__.'/vendor/publishpress/publishpress-permissions/activation.php' );
        }
    );

    register_deactivation_hook(
        __FILE__, 
        function()
        {
            do_action('presspermit_deactivate');
        }
    );
} else {
    if (is_admin()) {
        global $pagenow;
        if (('plugins.php' == $pagenow) && !strpos(urldecode($_SERVER['REQUEST_URI']), 'deactivate')) {
            add_action('all_admin_notices', function()
            {
                $msg = sprintf(
                    '<strong>Error:</strong> Multiple copies of %1$s activated. Only the copy in folder "%2$s" is functional.',
                    'Permissions Pro',
                    dirname(plugin_basename(PRESSPERMIT_PRO_FILE))
                );

                echo "<div id='message' class='error fade' style='color:black'>" . $msg . '</div>';
            }, 5);
        }
    }
    return;
}
