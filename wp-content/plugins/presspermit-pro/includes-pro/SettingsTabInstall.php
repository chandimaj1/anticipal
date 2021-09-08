<?php

namespace PublishPress\Permissions\UI;

use PublishPress\Permissions\Factory;

class SettingsTabInstall
{
    public function __construct()
    {
        @load_plugin_textdomain('presspermit-pro-hints', false, dirname(plugin_basename(PRESSPERMIT_PRO_FILE)) . '/languages');

        add_filter('presspermit_option_tabs', [$this, 'optionTabs'], 0);
        add_filter('presspermit_section_captions', [$this, 'sectionCaptions']);
        add_filter('presspermit_option_captions', [$this, 'optionCaptions']);
        add_filter('presspermit_option_sections', [$this, 'optionSections']);

        add_action('presspermit_install_options_ui', [$this, 'optionsUI']);
    }

    public function optionTabs($tabs)
    {
        $tabs['install'] = __('Install', 'press-permit-core');
        return $tabs;
    }

    public function sectionCaptions($sections)
    {
        $new = [
            'key' => __('License Key', 'press-permit-core'),
            'version' => __('Version', 'press-permit-core'),
            'modules' => __('Modules', 'press-permit-core'),
            /* 'beta_updates' => __('Beta Updates', 'press-permit-core'), */
            'help' => PWP::__wp('Help'),
        ];

        $key = 'install';
        $sections[$key] = (isset($sections[$key])) ? array_merge($sections[$key], $new) : $new;
        return $sections;
    }

    public function optionCaptions($captions)
    {
        $opt = [
            'key' => __('settings', 'press-permit-core'),
            /* 'beta_updates' => __('Receive beta version updates for modules', 'press-permit-core'), */
            'help' => __('settings', 'press-permit-core'),
        ];

        return array_merge($captions, $opt);
    }

    public function optionSections($sections)
    {
        $new = [
            'key' => ['edd_key'],
            'beta_updates' => ['beta_updates'],
            'help' => ['no_option'],
            'modules' => ['no_option'],
        ];

        $key = 'install';
        $sections[$key] = (isset($sections[$key])) ? array_merge($sections[$key], $new) : $new;
        return $sections;
    }

    public function optionsUI()
    {
        $pp = presspermit();

        $ui = SettingsAdmin::instance();
        $tab = 'install';

        require_once(PRESSPERMIT_PRO_ABSPATH . '/includes-pro/library/Factory.php');
        $container      = \PublishPress\Permissions\Factory::get_container();
        $licenseManager = $container['edd_container']['license_manager'];

        $use_network_admin = $this->useNetworkUpdates();
        $suppress_updates = $use_network_admin && !is_super_admin();

        $section = 'key'; // --- UPDATE KEY SECTION ---
        if (!empty($ui->form_options[$tab][$section]) && !$suppress_updates) : ?>
            <tr>
                <td scope="row" colspan="2">
                    <?php

                    global $activated;

                    //$id = 'support_key';
                    $id = 'edd_key';

                    if (!get_transient('presspermit-refresh-update-info')) {
                        $pp->keyStatus(true);
                        set_transient('presspermit-refresh-update-info', true, 86400);
                    }

                    $opt_val = $pp->getOption($id);

                    if (!is_array($opt_val) || count($opt_val) < 2) {
                        $activated = false;
                        $expired = false;
                        $key = '';
                        $opt_val = [];
                    } else {
                        $activated = !empty($opt_val['license_status']) && ('valid' == $opt_val['license_status']);
                        $expired = $opt_val['license_status'] && ('expired' == $opt_val['license_status']);
                    }

                    if (isset($opt_val['expire_date']) && is_date($opt_val['expire_date'])) {
                        $date = new \DateTime(date('Y-m-d H:i:s', strtotime($opt_val['expire_date'])), new \DateTimezone('UTC'));
                        $date->setTimezone(new \DateTimezone('America/New_York'));
                        $expire_date_gmt = $date->format("Y-m-d H:i:s");
                        $expire_days = intval((strtotime($expire_date_gmt) - time()) / 86400);
                    } else {
                        unset($opt_val['expire_date']);
                    }

                    $msg = '';

                    // @todo: replace these strings with EDD Integration equivalents

                    if ($expired) {
                        $class = 'activating';
                        $is_err = true;
                        $msg = sprintf(
                            'Your license key has expired. For continued priority support, <a href="%s">please renew</a>.',
                            'admin.php?page=presspermit-settings&amp;pp_renewal=1'
                        );
                    } elseif (!empty($opt_val['expire_date'])) {
                        $class = 'activating';
                        if ($expire_days < 30) {
                            $is_err = true;
                        }

                        if ($expire_days == 1) {
                            $msg = sprintf(
                                'Your license key will expire today. For updates and priority support, <a href="%s">please renew</a>.',
                                $expire_days,
                                'admin.php?page=presspermit-settings&amp;pp_renewal=1'
                            );
                        } elseif ($expire_days < 30) {
                            $msg = sprintf(
                                'Your license key (for plugin updates) will expire in %d day(s). For updates and priority support, <a href="%s">please renew</a>.',
                                $expire_days,
                                'admin.php?page=presspermit-settings&amp;pp_renewal=1'
                            );
                        } else {
                            $class = "activating hidden";
                        }
                    } elseif (!$activated) {
                        $class = 'activating';
                        $msg = sprintf(
                            'For updates to Permissions Pro, activate your <a href="%s">PublishPress license key</a>.',
                            'https://publishpress.com/pricing/'
                        );
                    } else {
                        $class = "activating hidden";
                        $msg = '';
                    }
                    ?>

                    <div class="pp-key-wrap">

                    <?php if ($expired && (!empty($key))) : ?>
                    
                        <span class="pp-key-expired"><?php _e("Key Expired", 'press-permit-core') ?></span>
                        <input name="<?php echo($id); ?>" type="text" id="<?php echo($id); ?>" style="display:none"/>
                        <button type="button" id="activation-button" name="activation-button"
                                class="button-secondary"><?php _e('Deactivate Key', 'press-permit-core'); ?></button>
                    <?php else : ?>
                        <div class="pp-key-label" style="float:left">
                            <span class="pp-key-active" <?php if (!$activated) echo 'style="display:none;"';?>><?php _e("Key Activated", 'press-permit-core') ?></span>
                            <span class="pp-key-inactive" <?php if ($activated) echo 'style="display:none;"';?>><?php _e("License Key", 'press-permit-core') ?></span>
                        </div>

                            <input name="<?php echo($id); ?>" type="text" placeholder="<?php _e('(please enter publishpress.com key)', 'press-permit-pro');?>" id="<?php echo($id); ?>"
                                   maxlength="40" <?php echo ($activated) ? ' style="display:none"' : ''; ?> />
                        
                            <button type="button" id="activation-button" name="activation-button"
                                    class="button-secondary"><?php echo (!$activated) ? __('Activate Key', 'press-permit-core') : __('Deactivate Key', 'press-permit-core'); ?></button>
                    <?php endif; ?>

                        <img id="pp_support_waiting" class="waiting" style="display:none;position:relative"
                             src="<?php echo esc_url(admin_url('images/wpspin_light.gif')) ?>" alt=""/>

                        <div class="pp-key-refresh" style="display:inline">
                            &bull;&nbsp;&nbsp;<a href="https://publishpress.com/checkout/purchase-history/"
                                                       target="_blank"><?php _e('review your account info', 'press-permit-core'); ?></a>
                        </div>
                    </div>

                    <?php if ($activated) : ?>
                        <?php if ($expired) : /* @todo: replace this text with EDD Integration equivalent */ ?>
                            <div class="pp-key-hint-expired">
                                <span class="pp-key-expired pp-key-warning"> <?php echo 'note: Renewal does not require deactivation. If you do deactivate, re-entry of the license key will be required.'; ?></span>
                            </div>
                        <?php elseif ($pp->getOption('display_hints')) : ?>
                            <div class="pp-key-hint">
                            <span class="pp-subtext"> <?php echo SettingsAdmin::getStr('key-deactivation');?></span>
                            </div>
                        <?php endif; ?>

                    <?php elseif (!$expired) : ?>
                        <div class="pp-key-hint">
                        </div>
                    <?php endif ?>

                    <div id="activation-status" class="<?php echo $class ?>"><?php echo $msg; ?></div>
                    <div class="pp-settings-caption" style="display:none;">
                        <a href="<?php echo admin_url('admin.php?page=presspermit-settings'); ?>"><?php _e('reload module info', 'press-permit-core'); ?></a>
                    </div>

                    <?php if (!empty($is_err)) : ?>
                        <div id="activation-error" class="error"><?php echo $msg; ?></div>
                    <?php endif; ?>

                        <?php
                        if (!$activated || $expired) {
                            /*
                            require_once(PRESSPERMIT_CLASSPATH . '/UI/HintsPro.php');
                            HintsPro::proPromo();
                            */
                        }
                        ?>
                </td>
            </tr>
            <?php

            do_action('presspermit_support_key_ui');
            self::footer_js($activated, $expired);
        endif; // any options accessable in this section

        $section = 'version'; // --- VERSION SECTION ---
        ?>
            <tr>
                <th scope="row"><?php echo $ui->section_captions[$tab][$section]; ?></th>
                <td>

                    <?php
                    $update_info = [];

                    $info_link = '';

                    if (!$suppress_updates) {
                        $wp_plugin_updates = get_site_transient('update_plugins');
                        if (
                            $wp_plugin_updates && isset($wp_plugin_updates->response[plugin_basename(PRESSPERMIT_PRO_FILE)])
                            && !empty($wp_plugin_updates->response[plugin_basename(PRESSPERMIT_PRO_FILE)]->new_version)
                            && version_compare($wp_plugin_updates->response[plugin_basename(PRESSPERMIT_PRO_FILE)]->new_version, PRESSPERMIT_PRO_VERSION, '>')
                        ) {
                            $slug = 'presspermit-pro';

                            $_url = "plugin-install.php?tab=plugin-information&plugin=$slug&section=changelog&TB_iframe=true&width=600&height=800";
                            $info_url = ($use_network_admin) ? network_admin_url($_url) : admin_url($_url);

                            $info_link = "&nbsp;<span class='update-message'> &bull;&nbsp;&nbsp;<a href='$info_url' class='thickbox'>"
                                . sprintf(__('view %s&nbsp;details', 'press-permit-core'), $wp_plugin_updates->response[plugin_basename(PRESSPERMIT_PRO_FILE)]->new_version)
                                . '</a></span>';
                        }
                    }

                    ?>
                    <p>
                        <?php printf(__('Permissions Pro Version: %1$s %2$s', 'press-permit-core'), PRESSPERMIT_PRO_VERSION, $info_link); ?>

                        &nbsp;&nbsp;&bull;&nbsp;&nbsp;<a href="admin.php?page=presspermit-settings&amp;presspermit_refresh_updates=1"><?php _e('update check / install', 'press-permit-core'); ?></a>

                        <br/>
                        <span style="display:none"><?php printf(__("Database Schema Version: %s", 'press-permit-core'), PRESSPERMIT_DB_VERSION); ?><br/></span>
                    </p>

                    <p>
                    <?php
                    global $wp_version;
                    printf(__("WordPress Version: %s", 'press-permit-core'), $wp_version);
                    ?>
                    </p>
                    <p>
                    <?php printf(__("PHP Version: %s", 'press-permit-core'), phpversion()); ?>
                    </p>
                </td>
            </tr>
        <?php

        $section = 'modules'; // --- EXTENSIONS SECTION ---
        if (!empty($ui->form_options[$tab][$section])) : ?>
            <tr>
                <th scope="row">
                    <?php

                    echo $ui->section_captions[$tab][$section];
                    ?>
                </th>
                <td>

                    <?php
                    $missing = $inactive = [];

                    $ext_info = $pp->admin()->getModuleInfo();
                    
                    $pp_modules = presspermit()->getActiveModules();
                    $active_module_plugin_slugs = [];

                    if ($pp_modules) : ?>
                        <?php

                        $change_log_caption = __('<strong>Change Log</strong> (since your current version)', 'press-permit-core');

                        ?>
                        <h4 style="margin-top:0"><?php _e('Active Modules:', 'press-permit-core'); ?></h4>
                        <table class="pp-extensions">
                            <?php foreach ($pp_modules as $slug => $plugin_info) :
                                $info_link = '';
                                $update_link = '';
                                $alert = '';
                                ?>
                                <tr>
                                    <td <?php if ($alert) {
                                        echo 'colspan="2"';
                                    }
                                    ?>>
                                        <?php $id = "module_active_{$slug}";?>

                                        <label for="<?php echo $id; ?>">
                                            <input type="checkbox" id="<?php echo $id; ?>"
                                                   name="presspermit_active_modules[<?php echo $plugin_info->plugin_slug;?>]"
                                                   value="1" checked="checked" />

                                            <?php echo __($plugin_info->label);?>
                                        </label>

                                        <?php
                                            echo ' <span class="pp-gray">'
                                                . "</span> $info_link $update_link $alert"
                                        ?>
                                    </td>

                                    <?php if (!empty($ext_info) && !$alert) : ?>
                                        <td>
                                            <?php if (isset($ext_info->blurb[$slug])) : ?>
                                                <span class="pp-ext-info"
                                                      title="<?php if (isset($ext_info->descript[$slug])) {
                                                          echo esc_attr($ext_info->descript[$slug]);
                                                      }
                                                      ?>">
                                                <?php echo $ext_info->blurb[$slug]; ?>
                                            </span>
                                            <?php endif; ?>
                                        </td>
                                    <?php endif; ?>
                                </tr>
                            <?php 
                                $active_module_plugin_slugs[]= $plugin_info->plugin_slug;
                            endforeach; ?>
                        </table>
                    <?php
                    endif;

                    echo "<input type='hidden' name='presspermit_reviewed_modules' value='" . implode(',', $active_module_plugin_slugs) . "' />";

                    $inactive = $pp->getDeactivatedModules();

                    ksort($inactive);
                    if ($inactive) : ?>
                        <h4>
                            <?php
                            _e('Inactive Modules:', 'press-permit-core')
                            ?>
                        </h4>

                        <table class="pp-extensions">
                            <?php foreach ($inactive as $plugin_slug => $module_info) :
                                $slug = str_replace('presspermit-', '', $plugin_slug);
                                ?>
                                <tr>
                                    <td>
                                    
                                    <?php $id = "module_deactivated_{$slug}";?>

                                    <label for="<?php echo $id; ?>">
                                        <input type="checkbox" id="<?php echo $id; ?>"
                                                name="presspermit_deactivated_modules[<?php echo $plugin_slug;?>]"
                                                value="1" />

                                        <?php echo (!empty($ext_info->title[$slug])) ? $ext_info->title[$slug] : $this->prettySlug($slug);?></td>
                                    </label>

                                    <?php if (!empty($ext_info)) : ?>
                                        <td>
                                            <?php if (isset($ext_info->blurb[$slug])) : ?>
                                                <span class="pp-ext-info"
                                                      title="<?php if (isset($ext_info->descript[$slug])) {
                                                          echo esc_attr($ext_info->descript[$slug]);
                                                      }
                                                      ?>">
                                                <?php echo $ext_info->blurb[$slug]; ?>
                                            </span>
                                            <?php endif; ?>
                                        </td>
                                    <?php endif; ?>
                                </tr>
                            <?php endforeach; ?>
                        </table>
                    <?php
                    endif;

                    ksort($missing);
                    if ($missing) :
                        ?>
                        <h4><?php _e('Available Modules:', 'press-permit-core'); ?></h4>
                        <table class="pp-extensions">
                            <?php foreach (array_keys($missing) as $slug) :
                                if ($activated && isset($update_info[$slug]) && !$need_supplemental_key && !$suppress_updates) {
                                    $_url = "update.php?action=$slug&amp;plugin=$slug&pp_install=1&TB_iframe=true&height=400";
                                    $install_url = ($use_network_admin) ? network_admin_url($_url) : admin_url($_url);
                                    $url = wp_nonce_url($install_url, "{$slug}_$slug");
                                    $install_link = "<span> &bull; <a href='$url' class='thickbox' target='_blank'>" . __('install', 'press-permit-core') . '</a></span>';
                                } else {
                                    $install_link = '';
                                }
                                ?>

                                <tr>
                                    <td>
                                        <?php

                                            $caption = ucwords(str_replace('-', ' ', $slug));
                                            echo '<span class="plugins update-message">'
                                                . '<a href="' . Settings::pluginInfoURL($slug) . '" class="thickbox" title=" ' . $caption . '">'
                                                . str_replace(' ', '&nbsp;', $caption) . '</a></span>';

                                        ?></td>
                                    <?php if (!empty($ext_info)) : ?>
                                        <td>
                                            <?php if (isset($ext_info->blurb[$slug])) : ?>
                                                <span class="pp-ext-info"
                                                      title="<?php if (isset($ext_info->descript[$slug])) {
                                                          echo esc_attr($ext_info->descript[$slug]);
                                                      }
                                                      ?>">
                                                <?php echo $ext_info->blurb[$slug]; ?>
                                            </span>
                                            <?php endif; ?>
                                        </td>
                                    <?php endif; ?>
                                </tr>
                            <?php endforeach; ?>
                        </table>
                        <p style="padding-left:15px;">
                            <?php

                            if (!$activated) {
                                echo '<span class="pp-red">'
                                    . __('For updates, please activate your PublishPress Pro license key above.', 'press-permit-core')
                                    . '<span>';
                            }
                            ?>
                        </p>
                    <?php
                    endif;

                    ?>
                </td>
            </tr>
        <?php
        endif; // any options accessable in this section

    } // end function optionsUI()

    private static function footer_js($activated, $expired)
    {
        // Remove translation wrappers for these strings because they will be replaced by equivalent wordpress-edd-license-integration calls
        $vars = [
            'activated' => ($activated || !empty($expired)) ? true : false,
            'expired' => !empty($expired),
            'activateCaption' => 'Activate Key',
            'deactivateCaption' => 'Deactivate Key',
            'noConnectCaption' => 'The request could not be processed due to a connection failure.',
            'noEntryCaption' => 'Please enter the license key shown on your order receipt.',
            'errCaption' => 'An unidentified error occurred.',
            'keyStatus' => json_encode([
                'deactivated' => 'The key has been deactivated.',
                'valid' => 'The key has been activated.',
                'expired' => 'The key has expired.',
                'invalid' => 'The key is invalid.',
            ]),
            'activateURL' => wp_nonce_url(admin_url(''), 'wp_ajax_pp_activate_key'),
            'deactivateURL' => wp_nonce_url(admin_url(''), 'wp_ajax_pp_deactivate_key'),
            'refreshURL' => wp_nonce_url(admin_url(''), 'wp_ajax_pp_refresh_version'),
        ];

        wp_localize_script('presspermit-settings', 'ppSettings', $vars);
    }

    private function useNetworkUpdates()
    {
        return false; //(is_multisite() && (is_network_admin() || PWP::isNetworkActivated() || PWP::isMuPlugin()));
    }

    private function pluginUpdateUrl($plugin_file, $action = 'upgrade-plugin')
    {
        $_url = "update.php?action=$action&amp;plugin=$plugin_file";
        $url = ($this->useNetworkUpdates()) ? network_admin_url($_url) : admin_url($_url);
        $url = wp_nonce_url($url, "{$action}_$plugin_file");
        return $url;
    }

    private function prettySlug($slug)
    {
        switch ($slug) {  // @todo: adjust this upstream
            case 'collaboration':
                return __('Collaborative Publishing', 'press-permit-core');
                break;

            case 'statuses':
                return __('Status Control', 'press-permit-core');
                break;

            case 'circles':
                return __('Access Circles', 'press-permit-core');
                break;

            case 'compatibility':
                return __('Compatibility Pack', 'press-permit-core');
                break;
            
            case 'sync':
                return __('Sync Posts', 'press-permit-core');
                break;

            default:
                $slug = str_replace('presspermit-', '', $slug);
                $slug = str_replace('Pp', 'PP', ucwords(str_replace('-', ' ', $slug)));
                $slug = str_replace('press', 'Press', $slug); // temp workaround
                $slug = str_replace('Wpml', 'WPML', $slug);
                return $slug;
        }
    }
} // end class
