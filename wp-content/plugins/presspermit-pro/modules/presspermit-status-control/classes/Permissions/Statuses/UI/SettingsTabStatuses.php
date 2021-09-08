<?php
namespace PublishPress\Permissions\Statuses\UI;

use \PublishPress\Permissions\UI\SettingsAdmin as SettingsAdmin;

class SettingsTabStatuses
{
    //var $advanced_enabled;

    function __construct()
    {
        //$this->advanced_enabled = presspermit()->getOption( 'advanced_options' );

        add_filter('presspermit_option_tabs', [$this, 'optionTabs'], 3);

        add_filter('presspermit_section_captions', [$this, 'sectionCaptions']);
        add_filter('presspermit_option_captions', [$this, 'optionCaptions']);
        add_filter('presspermit_option_sections', [$this, 'optionSections']);

        add_action('presspermit_statuses_options_pre_ui', [$this, 'statuses_options_pre_ui']);
        add_action('presspermit_statuses_options_ui', [$this, 'statuses_options_ui']);

        //add_action( 'presspermit_options_ui_insertion', [ $this, 'advanced_tab_options_ui' ], 5, 2 );  // hook for UI insertion on Settings > Advanced tab
        add_filter('presspermit_cap_descriptions', [$this, 'flt_cap_descriptions'], 5);  // priority 5 for ordering between PPS and PPCC additions in caps list
    }

    function optionTabs($tabs)
    {
        $tabs['statuses'] = __('Statuses', 'presspermit-pro');
        return $tabs;
    }

    function sectionCaptions($sections)
    {
        $new = [
            'privacy' => __('Visibility', 'presspermit-pro'),
        ];

        if (defined('PRESSPERMIT_COLLAB_VERSION')) {
            $new['workflow'] = __('Workflow', 'presspermit-pro');
        }

        $key = 'statuses';
        $sections[$key] = (isset($sections[$key])) ? array_merge($sections[$key], $new) : $new;

        return $sections;
    }

    function optionCaptions($captions)
    {
        $captions['privacy_statuses_enabled'] = __('Custom Visibility Statuses', 'presspermit-pro');
        $captions['custom_privacy_edit_caps'] = __('Custom Visibility Statuses require status-specific editing capabilities', 'presspermit-pro');
        $captions['draft_reading_exceptions'] = __('Drafts visible on front end if specific Read Permissions assigned', 'presspermit-pro');

        if (defined('PRESSPERMIT_COLLAB_VERSION')) {
            $captions['supplemental_cap_moderate_any'] = __('Supplemental Editor Role for "standard statuses" also grants capabilities for Workflow Statuses', 'presspermit-pro');
            $captions['moderation_statuses_default_by_sequence'] = __('Publish button defaults to next workflow status (instead of highest permitted)', 'presspermit-pro');
        }

        return $captions;
    }

    function optionSections($sections)
    {
        $new = [
            'privacy' => ['privacy_statuses_enabled', 'custom_privacy_edit_caps', 'draft_reading_exceptions'],
        ];

        if (defined('PRESSPERMIT_COLLAB_VERSION')) {
            $new['workflow'] = ['supplemental_cap_moderate_any'];
            $new['workflow'][] = 'moderation_statuses_default_by_sequence';
        }

        $tab = 'statuses';
        $sections[$tab] = (isset($sections[$tab])) ? array_merge($sections[$tab], $new) : $new;

        return $sections;
    }

    function statuses_options_pre_ui()
    {
        if (presspermit()->getOption('display_hints')) :
            ?>
            <div class="pp-optionhint">
                <?php
                //printf( __( 'Add some caption here.', 'presspermit-pro') );
                ?>
            </div>
        <?php
        endif;
    }

    function statuses_options_ui()
    {
        $ui = \PublishPress\Permissions\UI\SettingsAdmin::instance(); 
        $tab = 'statuses';

        $section = 'privacy';                       // --- PRIVACY STATUS SECTION ---
        
        $privacy_statuses_enabled = $ui->getOption('privacy_statuses_enabled');
        $display_enable_checkbox = (true !== $privacy_statuses_enabled) && defined('PUBLISHPRESS_VERSION') && version_compare(PUBLISHPRESS_VERSION, '1.19', '>=') && PWP::isBlockEditorActive();
        
        if (!empty($ui->form_options[$tab][$section]) && ($display_enable_checkbox || ($privacy_statuses_enabled && !PPS::privacyStatusesDisabled()))) : ?>
            <tr>
                <th scope="row"><?php echo $ui->section_captions[$tab][$section]; ?>
                    <?php if ($privacy_statuses_enabled): ?>
                    <div class="pp-extra-heading pp-statuses-other-config">
                        <h4><?php _e('Additional Configuration:', 'presspermit-pro'); ?></h4>
                        <ul>
                            <li>
                                <a href="<?php echo admin_url('admin.php?page=presspermit-statuses&attrib_type=private'); ?>"><?php _e('Define Privacy Statuses', 'presspermit-pro'); ?></a>
                            </li>

                        </ul>
                    </div>
                    <?php endif;?>
                </th>

                <td>
                    <?php
                    if ($display_enable_checkbox) {
                        if ($statuses_used = PPS::customStatiUsed(['ignore_moderation_statuses' => true])) {
                            $args = ['val' => $privacy_statuses_enabled, 'no_storage' => true, 'disabled' => true];
                            $hint = SettingsAdmin::getStr('posts_using_custom_privacy');
                        } else {
                            $args = [];
                            $hint = '';
                        }

                        $ui->optionCheckbox('privacy_statuses_enabled', $tab, $section, $hint, '', $args);
                    }

                    if ($privacy_statuses_enabled && !PPS::privacyStatusesDisabled()) {
                        $args = (defined('PP_SUPPRESS_PRIVACY_EDIT_CAPS')) ? ['val' => 0, 'no_storage' => true, 'disabled' => true] : [];
                        $ui->optionCheckbox('custom_privacy_edit_caps', $tab, $section, true, '', $args);
                    }
                    ?>
                </td>
            </tr>
        <?php endif; // any options accessable in this section


        $section = 'workflow';                      // --- WORKFLOW STATUS SECTION ---
        if (!empty($ui->form_options[$tab][$section]) && defined('PRESSPERMIT_COLLAB_VERSION')) : ?>
            <tr>
                <th scope="row"><?php echo $ui->section_captions[$tab][$section]; ?>
                    <div class="pp-extra-heading pp-statuses-other-config">
                        <h4><?php _e('Additional Configuration:', 'presspermit-pro'); ?></h4>
                        <ul>
                            <?php
                            if (PPS::publishpressStatusesActive()) : ?>
                                <li>
                                    <a href="<?php echo admin_url('admin.php?page=pp-modules-settings&module=pp-custom-status-settings'); ?>"><?php _e('Define Workflow Statuses', 'presspermit-pro'); ?></a>
                                </li>

                            <?php elseif (PPS::publishpressStatusesActive('', ['skip_status_dropdown_check' => true])) : ?>
                                <li>
                                    <a href="<?php echo admin_url('admin.php?page=pp-modules-settings&module=pp-custom-status-settings'); ?>"><?php _e('Enable PublishPress Status Dropdown', 'presspermit-pro'); ?></a>
                                </li>
                            <?php elseif (defined('PUBLISHPRESS_VERSION')) : ?>
                                <li>
                                    <a href="<?php echo admin_url('admin.php?page=pp-modules-settings&module=pp-modules-settings-settings#modules-wrapper'); ?>"><?php _e('Turn on PublishPress Statuses', 'presspermit-pro'); ?></a>
                                </li>
                            <?php else : ?>
                                <li style="font-size:12px;font-weight:normal">
                                    <?php _e('Activate PublishPress', 'presspermit-pro'); ?></a>
                                </li>
                            <?php endif; ?>

                            <?php
                            $caption = (PPS::publishpressStatusesActive('', ['skip_status_dropdown_check' => true])) ? __('Workflow Order, Branching, Permissions', 'presspermit-pro') : __('Define Workflow Statuses', 'presspermit-pro');
                            ?>
                            <li>
                                <a href="<?php echo admin_url('admin.php?page=presspermit-statuses&attrib_type=moderation'); ?>"><?php echo $caption; ?></a>
                            </li>

                        </ul>
                    </div>
                </th>

                <td>
                    <?php
                    $ui->optionCheckbox('supplemental_cap_moderate_any', $tab, $section, true);
                    
                    if(!PWP::isBlockEditorActive()) {
                        $ui->optionCheckbox('moderation_statuses_default_by_sequence', $tab, $section, true);
                    }

                    $ui->optionCheckbox('draft_reading_exceptions', $tab, $section);
                    ?>
                </td>
            </tr>
        <?php endif; // any options accessable in this section
    }

    function flt_cap_descriptions($pp_caps)
    {
        foreach(['pp_define_post_status', 'pp_define_moderation', 'pp_define_privacy', 'set_posts_status', 'pp_moderate_any'] as $cap_name) {
            $pp_caps[$cap_name] = SettingsAdmin::getStr('cap_' . $cap_name);
        }

        return $pp_caps;
    }
}
