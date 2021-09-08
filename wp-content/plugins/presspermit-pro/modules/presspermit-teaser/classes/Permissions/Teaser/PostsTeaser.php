<?php
namespace PublishPress\Permissions\Teaser;

require_once(PRESSPERMIT_TEASER_CLASSPATH . '/PostFilters.php');
require_once(PRESSPERMIT_TEASER_CLASSPATH . '/PostFiltersFront.php');

class PostsTeaser
{
    private $buffer_found_posts = 0;
    private $readable_posts = [];

    function __construct() {
        add_filter('presspermit_get_teaser_text', [$this, 'fltGetTeaserText'], 10, 6);
    }

    // Manipulate the results set in various ways to prepare it for teaser filtering
    // Determine which listed items are readable (i.e. will not be teased). Clear private status so teased items will not be hidden completely or trigger a 404
    function postsTeaserPrepResults($results, $tease_otypes, $args = '')
    {
        $defaults = ['request' => '', 'object_type' => '', 'query_obj' => false, 'rkey' => ''];
        $args = array_merge($defaults, (array)$args);
        foreach (array_keys($defaults) as $var) {
            $$var = $args[$var];
        }

        global $wpdb;

        if (!$query_obj) {
            global $wp_query;
            $query_obj = $wp_query;
        }

        if (did_action('wp_meta') && !did_action('wp_head'))
            return $results;

        if (count($results) == 1 && isset($results[0]->ID) && (0 == $results[0]->ID)) {
            $this->readable_posts[$rkey][] = 0;
            return $results;
        }

        if (!$request) {
            // try to get it from wpdb instead
            if (!empty($wpdb->last_query))
                $request = $wpdb->last_query;
            else
                return [];  // don't risk exposing hidden content if something goes wrong with query logging
        }

        // don't risk exposing hidden content if there is a problem with query parsing
        if (!$pos = strpos(strtoupper($request), " FROM"))
            return [];

        // Pagination could be broken by subsequent query for filtered ids, so buffer current paging parameters
        // ( this code mimics WP_Query::get_posts() )
        if (!empty($query_obj->query_vars['posts_per_page'])) {
            $this->buffer_found_posts = $wpdb->get_var(apply_filters('found_posts_query', 'SELECT FOUND_ROWS()'));

            if ($this->buffer_found_posts >= $query_obj->query_vars['posts_per_page']) {
                $restore_pagination = true;
                $this->buffer_found_posts = apply_filters_ref_array( 'found_posts', array( $this->buffer_found_posts, &$query_obj ) );
            }
        }

        $private_stati = get_post_stati(['private' => true]);
        if (in_array('attachment', $tease_otypes, true))
            $private_stati [] = 'inherit';

        $fudge_private_posts = is_single() || is_page() || is_attachment();

        // remove LIMIT AND ORDER BY clauses so listed posts will not be incorrectly excluded even if db is not paging/sorting correctly
        $request = str_replace('SQL_CALC_FOUND_ROWS ', '', $request);
        if ($pos_suffix = self::getSuffixPos($request))
            $request = substr($request, 0, $pos_suffix);

        // append ID clause to omit IDs which are not in the current result set
        $post_ids = [];
        foreach (array_keys($results) as $key) {
            $post_ids[] = $results[$key]->ID;
        }

        $matches = [];

        $request_part = strval($request);
        if ($where_pos = stripos($request, 'WHERE '))
            $request_part = substr($request, 0, $where_pos);

        if ($return = preg_match('/SELECT .* FROM [^ ]+posts AS ([^ ]) .*/', $request_part, $matches))
            $p = $matches[1];
        elseif ($return = preg_match('/SELECT .* FROM ([^ ]+)posts .*/', $request_part, $matches))
            $p = $matches[1] . 'posts';
        else
            $p = false;

        if ($p) {
            add_filter('presspermit_posts_clauses_where', [$this, 'fltLimitPostIDs'], 10, 3);
            $filtered_request = apply_filters('presspermit_posts_request', $request, ['skip_teaser' => true, 'object_types' => $object_type, 'p' => $p, 'post_ids' => $post_ids]);
            remove_filter('presspermit_posts_clauses_where', [$this, 'fltLimitPostIDs']);
        } else {
            $filtered_request = "SELECT * FROM $wpdb->posts WHERE 1=2";
        }

        if (!$rkey) {
            $rkey = md5($request);
        }

        $this->readable_posts[$rkey] = $wpdb->get_col($filtered_request);
        $hide_custom_private = [];

        foreach (array_keys($results) as $key) {
            $id = $results[$key]->ID;

            if (empty($this->readable_posts[$rkey]) || !in_array($id, $this->readable_posts[$rkey])) {
                $type = $results[$key]->post_type;

                if (!in_array($type, $tease_otypes, true))
                    continue;

                // Defeat a WP core secondary safeguard so we can apply the teaser message rather than 404
                if (in_array($results[$key]->post_status, $private_stati, true)) {
                    // don't want the teaser message (or presence in category archive listing) if we're hiding a page from listing
                    if (!isset($hide_custom_private[$type]))
                        $hide_custom_private[$type] = Teaser::getHiddenStatuses($type);

                    if (in_array($results[$key]->post_status, $hide_custom_private[$type], true)) {
                        $need_reindex = true;
                        unset ($results[$key]);
                        continue;

                    } elseif ($fudge_private_posts) {
                        $results[$key]->post_status = 'publish';

                        if ('attachment' == $type) {
                            do_action('presspermit_teaser_restore_post_parent', $id, $results[$key]->post_parent);
                            $results[$key]->post_parent = 0;
                            $results[$key]->guid = '';
                        }
                    }
                }
            }
        }

        if (!empty($need_reindex))  // re-index the array so paging isn't confused
            $results = array_values($results);

        // pagination could be broken by the filtered ids query performed in this function, so original paging parameters were buffered
        if (!empty($restore_pagination)) {
            // WP query will apply found_posts filter shortly after this function returns.  Feed it the buffered value from original unfiltered results.
            // Static flag in created function ensures it is only applied once.
            add_filter('found_posts', [$this, 'fltRestorePagination'], 1);
        }

        return $results;
    }

    private static function getSuffixPos($request)
    {
        $request_u = strtoupper($request);

        $pos_suffix = strlen($request) + 1;
        foreach ([' ORDER BY ', ' GROUP BY ', ' LIMIT '] as $suffix_term) {
            if ($pos = strrpos($request_u, $suffix_term)) {
                if ($pos < $pos_suffix) {
                    $pos_suffix = $pos;
                }
            }
        }

        return $pos_suffix;
    }

    function fltRestorePagination($found_posts)
    {
        static $been_here;

        if (empty($been_here)) {
            $been_here = true;
            return $this->buffer_found_posts;
        }

        return $found_posts;
    }

    public function fltLimitPostIDs($where, $clauses, $args)
    {
        if (!empty($args['post_ids'])) {
            return "$where AND {$args['p']}.ID IN (" . implode(',', $args['post_ids']) . ')';
        } else {
            return $where . ' AND 1=2';
        }
    }

    // apply teaser modifications to the recordset.  Note: this is applied later than 
    function applyPostsTeaser($results, $tease_otypes, $args = [])
    {
        $defaults = ['request' => '', 'user' => false];
        $args = array_merge($defaults, (array)$args);
        foreach (array_keys($defaults) as $var) {
            $$var = $args[$var];
        }

        $pp = presspermit();

        if (did_action('wp_meta') && !did_action('wp_head'))
            return $results;

        if (!is_object($user)) {
            global $current_user;
            $user = $current_user;
        }

        $rkey = md5($request);

        if (!$request || !isset($this->readable_posts[$rkey])) {
            $args['rkey'] = $rkey;
            $results = $this->postsTeaserPrepResults($results, $tease_otypes, $args);
        }

        $teaser_replace = $teaser_prepend = $teaser_append = $excerpt_teaser = $more_teaser = $x_chars_teaser = [];

        foreach ($tease_otypes as $type) {
            $teaser_replace[$type]['post_content'] = self::getTeaserText('replace', 'content', 'post', $type, $user);
            $teaser_prepend[$type]['post_content'] = self::getTeaserText('prepend', 'content', 'post', $type, $user);
            $teaser_append[$type]['post_content'] = self::getTeaserText('append', 'content', 'post', $type, $user);

            $teaser_replace[$type]['post_excerpt'] = self::getTeaserText('replace', 'excerpt', 'post', $type, $user);
            $teaser_prepend[$type]['post_excerpt'] = self::getTeaserText('prepend', 'excerpt', 'post', $type, $user);
            $teaser_append[$type]['post_excerpt'] = self::getTeaserText('append', 'excerpt', 'post', $type, $user);

            $teaser_prepend[$type]['post_title'] = self::getTeaserText('prepend', 'name', 'post', $type, $user);
            $teaser_append[$type]['post_title'] = self::getTeaserText('append', 'name', 'post', $type, $user);

            $teaser_type = $pp->getTypeOption('tease_post_types', $type);
            if ('excerpt' == $teaser_type)
                $excerpt_teaser[$type] = true;
            elseif ('more' == $teaser_type) {
                $excerpt_teaser[$type] = true;
                $more_teaser[$type] = true;
            } elseif ('x_chars' == $teaser_type) {
                $excerpt_teaser[$type] = true;
                $more_teaser[$type] = true;
                $x_chars_teaser[$type] = true;
            }
        }

        // strip content from all $results rows not in $items
        $args = [
            'teaser_prepend' => $teaser_prepend,
            'teaser_append' => $teaser_append,
            'teaser_replace' => $teaser_replace,
            'excerpt_teaser' => $excerpt_teaser,
            'more_teaser' => $more_teaser,
            'x_chars_teaser' => $x_chars_teaser,
        ];

        foreach (array_keys($results) as $key) {
            $id = $results[$key]->ID;

            if (empty($this->readable_posts[$rkey]) || !in_array($id, $this->readable_posts[$rkey])) {
                if (in_array($results[$key]->post_type, $tease_otypes, true)) {
                    self::applyTeaser($results[$key], 'post', $results[$key]->post_type, $args);
                }
            }
        }

        return $results;
    }

    public function fltGetTeaserText($text, $teaser_operation, $variable, $source_name, $object_type, $user = false)
    {
        return self::getTeaserText($teaser_operation, $variable, $source_name, $object_type, $user);
    }

    public static function getTeaserText($teaser_operation, $variable, $source_name, $object_type, $user = false)
    {
        if (!is_object($user)) {
            global $current_user;
            $user = $current_user;
        }

        $anon = ($user->ID == 0) ? '_anon' : '';

        if ($msg = presspermit()->getOption("tease_{$teaser_operation}_{$variable}{$anon}", true)) {
            if (defined('PP_TRANSLATE_TEASER')) {
                // otherwise, this is only loaded for admin
                $msg = translate($msg, 'presspermit-pro');

                if (!empty($msg) && !is_null($msg) && is_string($msg))
                    $msg = htmlspecialchars_decode($msg);
            }

            if ('content' == $variable)
                $msg = str_replace('[login_form]', is_singular() ? wp_login_form(['echo' => false,]) : '', $msg);

            return apply_filters('presspermit_teaser_text', $msg, $teaser_operation, $variable, $object_type, (bool)$anon);
        }
    }

    public static function applyTeaser(&$post, $source_name, $post_type, $args = '')
    {
        $defaults = [
            'excerpt_teaser' => '',
            'teaser_prepend' => '',
            'teaser_append' => '',
            'teaser_replace' => '',
            'more_teaser' => '',
            'x_chars_teaser' => '',
        ];
        $args = array_merge($defaults, (array)$args);
        foreach (array_keys($defaults) as $var) {
            $$var = $args[$var];
        }

        $id = $post->ID;

        $post->pp_teaser = true;
        
        Teaser::instance()->setTeasedPost($id);

        if (!empty($post->post_password)) {
            $excerpt_teaser[$post_type] = $more_teaser[$post_type] = $x_chars_teaser[$post_type] = false;
        }

        if (!empty($x_chars_teaser[$post_type]))
            $num_chars = (defined('PP_TEASER_NUM_CHARS')) ? PP_TEASER_NUM_CHARS : 50;

        // Content replacement mode is applied in the following preference order:
        // 1. Custom excerpt, if available and if selected teaser mode is "excerpt", "excerpt or more", or "excerpt, pre-more or first x chars"
        // 2. Pre-more content, if applicable and if selected teaser mode is "excerpt or more", or "excerpt, pre-more or first x chars"
        // 3. First X Characters (defined by PP_TEASER_NUM_CHARS), if total content is longer than that and selected teaser mode is "excerpt, pre-more or first x chars"

        $use_excerpt_suffix = true;

        // optionally, use post excerpt as the hidden content teaser instead of a fixed replacement
        if (!empty($excerpt_teaser[$post_type]) && !empty($post->post_excerpt)) {
            $post->post_content = $post->post_excerpt;

        } elseif (!empty($more_teaser[$post_type]) && ($more_pos = strpos($post->post_content, '<!--more-->'))) {
            $post->post_content = substr($post->post_content, 0, $more_pos + 11);
            $post->post_excerpt = $post->post_content;
            if (is_single() || is_page() || is_attachment())
                $post->post_content .= '<p class="pp_more_teaser">' . $teaser_replace[$post_type]['post_content'] . '</p>';

            // since no custom excerpt or more tag is stored, use first X characters as teaser - but only if the total length is more than that
        } elseif (!empty($x_chars_teaser[$post_type]) && !empty($post->post_content) && (strlen(strip_tags($post->post_content)) > $num_chars)) {
            if (defined('PP_TRANSLATE_TEASER')) {
                // otherwise, this is only loaded for admin
                @load_plugin_textdomain('presspermit-pro', false, dirname(plugin_basename(PRESSPERMIT_PRO_FILE)) . '/languages');
            }

            // since we are stripping out img tag, also strip out image caption applied by WP
            $post->post_content = preg_replace("/\[caption.*\]/", '', $post->post_content);
            $post->post_content = str_replace("[/caption]", '', $post->post_content);

            $post->post_content = sprintf(_x('%s...', 'teaser suffix', 'presspermit'), substr(strip_tags($post->post_content), 0, $num_chars));
            $post->post_excerpt = $post->post_content;

            if (is_single() || is_page())
                $post->post_content .= '<p class="pp_x_chars_teaser">' . $teaser_replace[$post_type]['post_content'] . '</p>';

        } else {
            if (isset($teaser_replace[$post_type]['post_content']))
                $post->post_content = str_replace('%permalink%', get_permalink($post->ID), $teaser_replace[$post_type]['post_content']);
            else
                $post->post_content = '';

            // Replace excerpt with a user-specified fixed teaser message, 
            // but only if since no custom excerpt exists or teaser options aren't set to some variation of "use excerpt as teaser"
            if (!empty($teaser_replace[$post_type]['post_excerpt']))
                $post->post_excerpt = $teaser_replace[$post_type]['post_excerpt'];
            else
                $post->post_excerpt = '';

            // If PP_FORCE_EXCERPT_SUFFIX is defined, use the "content" prefix and suffix only when fully replacing content with a fixed teaser 
            $use_excerpt_suffix = false;
        }

        // Deal with ambiguity in teaser settings.  Previously, content prefix/suffix was applied even if RS substitutes the excerpt as displayed content.  
        // To avoid confusion with existing installations, only use excerpt prefix/suffix if a value is set or constant is defined.
        if ($use_excerpt_suffix && defined('PP_FORCE_EXCERPT_SUFFIX')) {
            $teaser_prepend[$post_type]['post_content'] = $teaser_prepend[$post_type]['post_excerpt'];
            $teaser_append[$post_type]['post_content'] = $teaser_append[$post_type]['post_excerpt'];
        }

        foreach ($teaser_prepend[$post_type] as $col => $entry)
            if (isset($post->$col))
                $post->$col = $entry . $post->$col;

        foreach ($teaser_append[$post_type] as $col => $entry)
            if (isset($post->$col)) {
                if (($col == 'post_content') && !empty($more_pos)) {  // WP will strip off anything after the more comment
                    $post->$col = str_replace('<!--more-->', "$entry<!--more-->", $post->$col);
                } else
                    $post->$col .= $entry;
            }

        // no need to display password form if we're blocking content anyway
        if (!empty($post->post_password))
            $post->post_password = '';

        if (presspermit()->getOption('teaser_hide_thumbnail'))
            add_filter('get_post_metadata', [__CLASS__, 'fltHidePostThumbnail'], 10, 3);
    }

    public static function fltHidePostThumbnail($thumb_id, $object_id, $meta_key)
    {
        if ('_thumbnail_id' == $meta_key) {
            remove_filter('get_post_metadata', [__CLASS__, 'fltHidePostThumbnail'], 10, 3);
            return 0;
        }
    }
}
