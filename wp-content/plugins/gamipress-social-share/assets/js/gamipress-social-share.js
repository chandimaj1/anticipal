function gamipress_social_share_url_shared( url, social_network ) {

    // Trigger a javascript event to let other functions work with it
    jQuery('body').trigger( 'gamipress_social_share_url_pre_shared', [ url, social_network ] );

    jQuery.ajax({
        url: gamipress_social_share.ajaxurl,
        type: 'POST',
        data: {
            action: 'gamipress_social_share_url_shared',
            nonce: gamipress_social_share.nonce,
            url: url,
            social_network: social_network
        },
        dataType: 'json',
        success: function ( response ) {
            // Trigger a javascript event to let other functions work with it
            jQuery('body').trigger( 'gamipress_social_share_url_shared', [ url, social_network ] );
        }
    });

}

// ----------------------------------------------------------------------
// Twitter
// ----------------------------------------------------------------------

window.twttr = (function (d,s,id) {
    var t, js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return window.twttr || {}; js=d.createElement(s); js.id=id;
    js.src='https://platform.twitter.com/widgets.js'; fjs.parentNode.insertBefore(js, fjs);
    return window.twttr || (t = { _e: [], ready: function(f){ t._e.push(f) } });
}(document, 'script', 'twitter-wjs'));

twttr.ready(function (twttr) {
    // Tweet event
    twttr.events.bind('tweet', function (event) {

        var url = jQuery(event.target).data('url');

        if( url === undefined || url.length === 0 )
            url = event.target.baseURI;

        setTimeout( function() {
            gamipress_social_share_url_shared( url, 'twitter' );
        }, gamipress_social_share.twitter_delay );

    });
});

// ----------------------------------------------------------------------
// Facebook
// ----------------------------------------------------------------------

var facebook_cbs = [];
var facebook_events = [];
var facebook_url = undefined;

if ( jQuery('#fb-root').length === 0)
    jQuery('body').append('<div id="fb-root"></div>');

(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = '//connect.facebook.net/en_US/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

if ( window.fbAsyncInit )
    var gamipress_fbAsyncInit_original = window.fbAsyncInit;

window.fbAsyncInit = function() {

    // Init the FB JS SDK
    window.FB.init({
        appId: gamipress_social_share.facebook_app_id,
        status: true,
        cookie: true,
        xfbml: true,
        version: 'v2.5'
    });

    window.FB.Event.subscribe('edge.create', function(href, widget) {
        // Like/Recommend event
        gamipress_social_share_url_shared( href, 'facebook' );
    });

    // Looks like this event has been deprecated, also, there is no way to catch the window open event since button is on an iframe
    window.FB.Event.subscribe('message.send', function(href) {
        // Share event
        // @deprecated Not working (including with all.js), tested with different SDK versions without success
        gamipress_social_share_url_shared( href, 'facebook' );
    });

    if( gamipress_fbAsyncInit_original )
        gamipress_fbAsyncInit_original();

};

// Click listener for Facebook share button
jQuery('body').on('click', '.gamipress-social-share-facebook-share', function() {

    facebook_url = jQuery(this).data('href');

    window.FB.ui({
        method: 'share',
        href: facebook_url,
        display: 'popup'
    }, function( response ) {

        // When not shared, response is undefined
        if( response === undefined ) return;

        // Check if Facebook share url has been setup
        if( facebook_url === undefined ) return;

        // Share event
        gamipress_social_share_url_shared( facebook_url, 'facebook_share' );

        // Reset current Facebook share url
        facebook_url = undefined;
    });
});

// Facebook events listener
var facebook_listener = function( e ) {

    if ( e.origin.indexOf && e.origin.indexOf("facebook") !== -1 && jQuery('.gamipress-social-share-facebook').length ) {

        // Build the facebook buttons cbs
        gamipress_social_share_build_facebook_buttons_cbs();

        var event_data = gamipress_social_share_parse_query( e.data );

        // Check if event cb comes from one of our buttons
        if ( facebook_cbs.length && facebook_cbs.indexOf( event_data.cb ) !== -1 ) {

            var button = jQuery('.gamipress-social-share-facebook[data-cb="' + event_data.cb + '"]');

            // Skip the first event
            if( button.data('first-event') === 'true' ) {

                facebook_events.push( e.data );

                // Events should happen on this order: resize, plugin_ready and resize.flow
                var event_index = 0;

                for (var i in facebook_events) {

                    if( facebook_events[i].indexOf('resize&') !== -1 ) {
                        event_index = 1;
                    }

                    if( event_index === 1 && facebook_events[i].indexOf('plugin_ready&') !== -1 ) {
                        event_index = 2;
                    }

                    if( event_index === 2 && facebook_events[i].indexOf('resize.flow&') !== -1 ) {
                        event_index = 3;
                    }
                }

                if( event_index === 3 && facebook_events.length >= 4 ) {

                    var href = button.find('.fb-like').data('href');

                    gamipress_social_share_url_shared( href, 'facebook' );

                    // Reset event vars
                    facebook_events = [];
                    button.data( 'first-event', 'false' );
                }

            } else {
                button.data( 'first-event', 'true' );
            }

        }
    }

};
window.addEventListener ? window.addEventListener("message", facebook_listener, false) : window.attachEvent("onmessage", facebook_listener);

// Turn an URL query into an array of key => value
function gamipress_social_share_parse_query( query ) {
    if (typeof query !== "string") return false;

    var query_args = [];
    var query_parts = query.split("&");

    if ( query_parts.length ) {
        for (var i in query_parts) {
            var query_arg = query_parts[i].split("=");

            query_args[query_arg[0]] = query_arg[1];
        }
    }

    return query_args
}

function gamipress_social_share_build_facebook_buttons_cbs() {

    if( facebook_cbs.length >= jQuery('.gamipress-social-share-facebook').length ) return;

    // Loop all facebook buttons placed by Social Share to meet their cb
    jQuery('.gamipress-social-share-facebook').each(function () {

        var button = jQuery(this);

        var button_cb = gamipress_social_share_get_facebook_button_cb( button );

        if( button_cb && facebook_cbs.indexOf( button_cb ) === -1 ) {

            // Add the button cb as data attribute
            button.attr( 'data-cb', button_cb );

            // Store the button cb on facebook cbs array
            facebook_cbs[facebook_cbs.length] = button_cb;
        }
    });

}

function gamipress_social_share_get_facebook_button_cb( button ) {

    var cb = false;

    if( button ) {

        var iframe_src = button.find("iframe").attr("src");

        if ( iframe_src ) {

            var iframe_src_parts = gamipress_social_share_parse_query( iframe_src );
            var channel = false;

            if ( iframe_src_parts ) {
                for (var i in iframe_src_parts ) {
                    if (i === 'channel') {
                        channel = decodeURIComponent( iframe_src_parts[i] );
                        break
                    }
                }
            }

            if ( channel ) {

                // Channel url contains a ?version=42#cb=... so need to split by #
                if( channel.indexOf('#') !== -1 )
                    channel = channel.split('#')[1];

                var channel_parts = gamipress_social_share_parse_query( channel );

                if( channel_parts.cb )
                    cb = channel_parts.cb;

            }
        }

    }

    return cb;

}

// ----------------------------------------------------------------------
// LinkedIn
// ----------------------------------------------------------------------

var linkedin_url = undefined;

(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = 'https://platform.linkedin.com/in.js';
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'linkedin-js'));

// LinkedIn share callback
function gamipress_social_share_linkedin( url ) {
    gamipress_social_share_url_shared( url, 'linkedin' );
}

// Keep the original window.open function
var gamipress_social_share_original_window_open = window.open;
var gamipress_social_share_linkedin_window = false;
var gamipress_social_share_pinterest_window = false;

// Prevent to override window.open() function if linkedin or pinterest hasn't been placed
if( jQuery('.gamipress-social-share-linkedin, .gamipress-social-share-pinterest').length ) {

    // Override the window.open() function
    window.open = function( URL, name, specs ) {

        var current_window = gamipress_social_share_original_window_open( URL, name, specs );

        // Bail if not window opened
        if ( ! current_window ) return current_window;

        var window_name = name || current_window.name;

        if( window_name ) {

            if( window_name.substring(0, 10) === 'easyXDM_IN' || window_name.indexOf( '@linkedin/xdoor-sdk' ) !== -1 ) {
                // Current window is from LinkedIn
                gamipress_social_share_linkedin_window = current_window;
            } else if( window_name.substring(0, 3) === 'pin' ) {
                // Current window is from Pinterest
                gamipress_social_share_pinterest_window = current_window;
            }

        }

        return current_window;
    };

}

// Click listener for LinkedIn button
jQuery('body').on('click', '.gamipress-social-share-linkedin span', function() {

    // Get this button set URL
    linkedin_url = jQuery(this).closest('.gamipress-social-share').data('url');

    setTimeout( function() {

        // If linkedIn window is set, let's to add an interval to check when it is closed
        if ( gamipress_social_share_linkedin_window ) {

            // Store window object on a function var
            var linkedin_window = gamipress_social_share_linkedin_window;

            gamipress_social_share_linkedin_window = false;

            // Add an interval to check when the window gets closed
            var linkedin_interval = setInterval( function() {

                if( linkedin_window && linkedin_window.closed === true ) {

                    clearInterval( linkedin_interval );

                    // Let's to send the share action
                    gamipress_social_share_url_shared( ( linkedin_url !== undefined ? linkedin_url : window.location.href ), 'linkedin' );
                }

            }, 200);

        }

    }, 200);

});

// ----------------------------------------------------------------------
// Pinterest
// ----------------------------------------------------------------------

var pinterest_url = undefined;

(function(d,s,id) {
    if (d.getElementById(id)) return;
    var po = d.createElement(s); po.type = 'text/javascript'; po.async = true; po.defer = true; po.id = id;
    po.src = 'https://assets.pinterest.com/js/pinit.js';
    var ss = d.getElementsByTagName(s)[0]; ss.parentNode.insertBefore(po, ss);
})(document, 'script', 'pinterest-js');

function gamipress_social_share_pinterest( url ) {
    gamipress_social_share_url_shared( url, 'pinterest' );
}

jQuery('body').on('click', '.gamipress-social-share-pinterest a', function() {

    // Get this button set URL
    pinterest_url = jQuery(this).closest('.gamipress-social-share').data('url');

    setTimeout( function() {

        // If pinterest window is set, let's to add an interval to check when it is closed
        if ( gamipress_social_share_pinterest_window ) {

            // Store window object on a function var
            var pinterest_window = gamipress_social_share_pinterest_window;

            gamipress_social_share_pinterest_window = false;

            // Add an interval to check when the window gets closed
            var pinterest_interval = setInterval( function() {

                if( pinterest_window && pinterest_window.closed === true ) {

                    clearInterval( pinterest_interval );

                    // Let's to send the share action
                    gamipress_social_share_url_shared( ( pinterest_url !== undefined ? pinterest_url : window.location.href ), 'pinterest' );
                }

            }, 200);

        }

    }, 200);

});