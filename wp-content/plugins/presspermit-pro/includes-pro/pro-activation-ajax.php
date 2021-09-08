<?php
namespace PublishPress\Permissions;

require_once(PRESSPERMIT_PRO_ABSPATH . '/includes-pro/pro-maint.php');

switch ($_GET['pp_ajax_settings']) {
    case 'activate_key':
        check_admin_referer('wp_ajax_pp_activate_key');
        if (
            is_multisite() && !is_super_admin() && (PWP::isNetworkActivated() || PWP::isMuPlugin())
        ) {
            return;
        }

        $request_vars = [
            'edd_action' => "activate_license",
            'item_id' => PRESSPERMIT_EDD_ITEM_ID,
            'license' => sanitize_key($_GET['key']),
            'url' => site_url(''),
        ];

        $response = PressPermitMaint::callHome('activate_license', $request_vars);
        $result = json_decode($response);
        if (is_object($result) && ('valid' == $result->license)) {
            $setting = ['license_status' => $result->license, 'license_key' => $_GET['key'], 'expire_date' => $result->expires];
            presspermit()->updateOption('edd_key', $setting);
        } else {
            // If invalid as a Press Permit Pro upgrade key, try activating as a new Permissions Pro key
            $edd_item_id = 34506;
            $request_vars['item_id'] = $edd_item_id;
            $response = PressPermitMaint::callHome('activate_license', $request_vars);
            $result = json_decode($response);

            if (is_object($result) && ('valid' == $result->license)) {
                $setting = ['license_status' => $result->license, 'license_key' => $_GET['key'], 'expire_date' => $result->expires];
                presspermit()->updateOption('edd_key', $setting);
                update_option('presspermit_edd_id', $edd_item_id);
            }
        }

        echo $response;
        exit();

        break;

    case 'deactivate_key':
        check_admin_referer('wp_ajax_pp_deactivate_key');
        if (
            is_multisite() && !is_super_admin() && (PWP::isNetworkActivated() || PWP::isMuPlugin())
        ) {
            return;
        }

        $support_key = presspermit()->getOption('edd_key');
        $request_vars = [
            'edd_action' => "deactivate_license",
            'item_id' => PRESSPERMIT_EDD_ITEM_ID,
            'license' => $support_key['license_key'],
            'url' => site_url(''),
        ];

        $response = PressPermitMaint::callHome('deactivate_license', $request_vars);

        $result = json_decode($response);
        if (is_object($result) && $result->license != 'valid') {
            presspermit()->deleteOption('edd_key');
        }

        echo $response;
        exit();

        break;
}
