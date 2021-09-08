<?php
/**
 * Plugin Name: PressPermit Teaser
 * Plugin URI:  https://publishpress.com/press-permit
 * Description: On the site front end, replace non-readable content with placeholder text
 * Author:      PublishPress
 * Author URI:  https://publishpress.com/
 * Version:     2.7
 * Text Domain: pptx
 * Domain Path: /languages/
 * Min WP Version: 4.7
 */

/*
Copyright 2019 PublishPress

This file is part of PressPermit Teaser.

PressPermit Teaser is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

PressPermit Teaser is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this plugin.  If not, see <http://www.gnu.org/licenses/>.
*/

if (!defined('ABSPATH')) exit; // Exit if accessed directly

if (!defined('PRESSPERMIT_TEASER_FILE')) {
    define('PRESSPERMIT_TEASER_FILE', __FILE__);
    define('PRESSPERMIT_TEASER_ABSPATH', __DIR__);
    define('PRESSPERMIT_TEASER_CLASSPATH', __DIR__ . '/classes/Permissions/Teaser');

    if (!defined('PRESSPERMIT_VERSION')) {
        return;
    }

    $ext_version = PRESSPERMIT_VERSION;

    if (is_admin()) {
        $title = __('Teaser', 'presspermit-pro');
    } else {
        $title = 'Teaser';
    }

    if (presspermit()->registerModule(
        'teaser', $title, dirname(plugin_basename(__FILE__)), $ext_version, ['min_pp_version' => '2.7-beta']
    )) {
        define('PRESSPERMIT_TEASER_VERSION', $ext_version);

        class_alias('\PressShack\LibArray', '\PublishPress\Permissions\Teaser\Arr');
        class_alias('\PressShack\LibWP', '\PublishPress\Permissions\Teaser\PWP');

        require_once(__DIR__ . '/classes/Permissions/Teaser.php');
        \PublishPress\Permissions\Teaser::instance();

        class_alias('\PublishPress\Permissions\Teaser', '\PublishPress\Permissions\Teaser\Teaser');
        class_alias('\PublishPress\Permissions\Teaser', '\PublishPress\Permissions\Teaser\UI\Teaser');

        require_once(__DIR__ . '/classes/Permissions/TeaserHooks.php');
        new \PublishPress\Permissions\TeaserHooks();
    }
} else {
    add_action(
        'init',
        function()
        {
            do_action('presspermit_duplicate_module', 'teaser', dirname(plugin_basename(__FILE__)));
        }
    );
    return;
}
