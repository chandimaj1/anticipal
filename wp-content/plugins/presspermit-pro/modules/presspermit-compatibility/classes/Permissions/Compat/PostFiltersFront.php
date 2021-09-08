<?php
namespace PublishPress\Permissions\Compat;

//use \PressShack\LibWP as PWP;

class PostFiltersFront 
{
    function __construct() {
        add_filter('presspermit_unfiltered_content', [$this, 'fltUnfiltered']);
        add_filter('user_has_cap', [$this, 'fltPublicPostPreviewCaps'], 200, 3);
    }

    private function publicPostPreviewAvailable() {
        // compat with Public Post Preview plugin
        if (!empty($_REQUEST['_ppp']) && !is_admin() && empty($_POST) && class_exists('DS_Public_Post_Preview')
        ) {
            if (!empty($_REQUEST['page_id'])) {
                $post_id = $_REQUEST['page_id'];
            } else {
                $post_id = (!empty($_REQUEST['p'])) ? $_REQUEST['p'] : PWP::getPostID();
            }

            if ($post_id) {
                if (method_exists('DS_Public_Post_Preview', 'is_public_preview_available')) {
                    $reflection = new \ReflectionMethod('DS_Public_Post_Preview', 'is_public_preview_available');
                    if ($reflection->isPublic() && $reflection->isStatic()) {
                        return DS_Public_Post_Preview::is_public_preview_available($post_id);
                    }
                }

                // if method exists and is public static, this never executes
                require_once(PRESSPERMIT_COMPAT_CLASSPATH . '/PublicPostPreview.php');
                return PublicPostPreview::is_public_preview_available($post_id);
            }
        }

        return false;
    }

    function fltUnfiltered($unfiltered)
    {
        return ($unfiltered) ? $unfiltered : $this->publicPostPreviewAvailable();
    }

    public function fltPublicPostPreviewCaps($wp_sitecaps, $orig_reqd_caps, $args) {
        if (!empty($args[0]) && ('pp_administer_content' == $args[0])) { // In general, this capability does not grant editing access; it merely disables PressPermit filtering
            if ($this->publicPostPreviewAvailable()) {
                $wp_sitecaps = array_merge($wp_sitecaps, ['pp_administer_content' => true]);
            }
        }

        return $wp_sitecaps;
    }
}
