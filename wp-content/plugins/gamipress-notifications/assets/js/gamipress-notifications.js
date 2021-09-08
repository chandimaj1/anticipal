(function( $, document ) {

    // Add our notify style
    $.gamipress_notify.addStyle('gamipress', {
        html: '<div>' +
            '<div class="gamipress-notification-close"></div>' +
            '<div class="gamipress-notification-content" data-notify-html="content"></div>' +
        '</div>'
    });

    // Programmatically trigger propagating hide event
    $(document).on('click', '.gamipress-notification .gamipress-notification-close', function() {
        $(this).trigger('notify-hide');
    });

    /**
     * Function to determine if current tab has the focus
     *
     * @since 1.1.3
     */
    function gamipress_notifications_is_document_visible() {

        // Support to all browsers visibility APIs
        var state, event, keys = {
            hidden: "visibilitychange",
            webkitHidden: "webkitvisibilitychange",
            mozHidden: "mozvisibilitychange",
            msHidden: "msvisibilitychange"
        };

        for ( state in keys ) {
            if ( state in document ) {
                event = keys[state];
                break;
            }
        }

        return ! document[state];
    }

    var notifications_displayed = [];

    /**
     * Shows a notification
     *
     * @since 1.1.3
     *
     * @param {string} content HTML content to show, check templates provided on this add-on to see examples of HTML passed
     */
    function gamipress_notifications_notify( content ) {

        var id = $(content).attr('id');
        var extra_classes = $(content).attr('class');

        // Prevent duplicated notifications
        if( notifications_displayed.includes(id) ) {
            return;
        }

        notifications_displayed.push(id);

        // Prevent duplicate notifications
        if( $('#' + id + '.gamipress-notification').length ) {
            return;
        }

        var position = gamipress_notifications.position;

        // Backward compatibility, notify js don't works if middle position is set first
        if( position === 'middle left' ) {
            position = 'left middle';
        } else if( position === 'middle right' ) {
            position = 'right middle';
        }

        // Setup our notification object
        $.gamipress_notify( {
            content: content,
        }, {
            style: 'gamipress',
            id: id,
            className: 'notification gamipress-notification ' + extra_classes,

            position: position,

            clickToHide: gamipress_notifications.click_to_hide,
            autoHide: ( gamipress_notifications.auto_hide && parseInt( gamipress_notifications.auto_hide_delay ) > 0 ),
            autoHideDelay: gamipress_notifications.auto_hide_delay,

            showAnimation: 'slideDown',
            showDuration: 400,

            hideAnimation: 'slideUp',
            hideDuration: 200,
            onOpen: function( notification ) {
                var show_sound = notification.find('#gamipress-notification-show-sound');

                if( show_sound.length ) {
                    gamipress_notifications_play_sound( show_sound.data('src') );
                }
            },
            onClose: function( notification ) {
                var hide_sound = notification.find('#gamipress-notification-hide-sound');

                if( hide_sound.length ) {
                    gamipress_notifications_play_sound( hide_sound.data('src') );
                }
            }
        });

    }

    /**
     * Helper function to play an audio
     *
     * @since 1.1.9
     *
     * @param {string} src HTML content to show, check templates provided on this add-on to see examples of HTML passed
     */
    function gamipress_notifications_play_sound ( src ) {

        var filename = src.split(/[\\\/]/).pop();

        // Bail if not a correct filename
        if( filename === undefined ) return;

        var src_parts = src.match(/\.([^.]+)$/);

        // Bail if can't determine the file extension
        if( src_parts === null ) return;

        var ext = src_parts[1];
        var id = filename.replace( '.', '_' );

        // Create and setup the source element
        var source = document.createElement('source');
        source.src = src;
        source.type = 'audio/' + ext; // audio/{file extension}

        // Create the audio element
        var audio = document.createElement('audio');
        audio.id = id;

        // Append the source element
        audio.appendChild( source );

        // Append audio element to the body
        document.body.appendChild( audio );

        audio.currentTime = 0;
        audio.volume = 1;

        audio.load();

        setTimeout(function() {
            // Try to play the audio
            audio.play().catch(() => {

                // Try to play the audio again (this commonly works in some browser
                audio.play().catch(() => {});
            });
        }, 0);
    }

    // Setup vars
    var notifications_request;
    var times_without_notifications = 0;

    // Check for new notifications
    function gamipress_notifications_check_notices() {

        // Bail if live checks are disabled
        if( gamipress_notifications.disable_live_checks ) {
            return;
        }

        // Get the configured notifications check delay
        var delay = parseInt( gamipress_notifications.delay );

        // Bail if document is not visible
        if( ! gamipress_notifications_is_document_visible() ) {
            // Check notifications again before a delay to meet if document is visible
            setTimeout( gamipress_notifications_check_notices, delay );
            return;
        }

        var attempts_to_cancel = parseInt( gamipress_notifications.attempts_to_cancel );

        if( attempts_to_cancel !== 0 ) {

            // Bail if user has exceed the number of attempts to cancel live checks
            if( times_without_notifications > attempts_to_cancel ) {
                return;
            }

        }

        // Bail if there is a request already running
        if( notifications_request !== undefined ) {
            return;
        }

        var show_user_points = $('.gamipress-user-points').length;

        notifications_request = $.ajax({
            url: gamipress_notifications.ajaxurl,
            data: {
                action: 'gamipress_notifications_get_notices',
                nonce: gamipress_notifications.nonce,
                user_points: show_user_points
            },
            success: function( response ) {

                var i;

                if( response.data.notices !== undefined && response.data.notices.length ) {

                    // Loop all notices to show them
                    for( i = 0; i < response.data.notices.length; i++ ) {

                        var content = response.data.notices[i];

                        // Show the notification
                        gamipress_notifications_notify( content );

                    }

                    // Notifications found so reset this var value
                    times_without_notifications = 0;

                } else {
                    // Increase times without notifications
                    times_without_notifications++;
                }

                // Check notices again before a delay
                setTimeout( gamipress_notifications_check_notices, delay );

                if( show_user_points && response.data.user_points.length ) {

                    // Loop all points info
                    for( i = 0; i < response.data.user_points.length; i++ ) {

                        var user_points = response.data.user_points[i];

                        // Update the HTML with old user points with new balance
                        $('.gamipress-user-points.gamipress-is-current-user .gamipress-user-points-' + user_points.points_type + ' .gamipress-user-points-count').text( user_points.points );

                    }
                }

                // Restore request var to allow request again
                notifications_request = undefined;

            }
        });

    }

    var notifications_last_check_request;

    // Update last check
    function gamipress_notifications_update_last_check() {

        // Bail if there is a request already running
        if( notifications_last_check_request !== undefined ) {
            return;
        }

        notifications_last_check_request = $.ajax({
            url: gamipress_notifications.ajaxurl,
            data: {
                action: 'gamipress_notifications_last_check',
                nonce: gamipress_notifications.nonce,
                last_check: $('#gamipress-notifications-user-last-check').data('value'),
            },
            success: function( response ) {
                // Restore request var to allow request again
                notifications_last_check_request = undefined;
            }
        });
    }

    // Initial check

    // Check in line notices
    $('.gamipress-notifications-user-notices > div').each(function() {

        // Bail show sound div
        if( $(this).attr('id') === 'gamipress-notification-show-sound' )
            return true;

        // Bail hide sound div
        if( $(this).attr('id') === 'gamipress-notification-hide-sound' )
            return true;

        var content = $(this)[0].outerHTML;
        var show_selector = '#gamipress-notification-show-sound';
        var hide_selector = '#gamipress-notification-hide-sound';

        // Append show sound html
        if( $(this).next(show_selector).length )
            content += $(this).next(show_selector)[0].outerHTML;

        // Append hide sound html
        if( $(this).next(hide_selector).length )
            content += $(this).next(hide_selector)[0].outerHTML;

        // If show sound and hide sound then append it
        if( $(this).next(show_selector).next(hide_selector).length )
            content += $(this).next(show_selector).next(hide_selector)[0].outerHTML;

        gamipress_notifications_notify( content );

        // Update last check to ensure that user is able to see page loaded notifications
        setTimeout( gamipress_notifications_update_last_check, gamipress_notifications.last_check_delay );
    });

    // Check server notices (if enabled)
    if( ! gamipress_notifications.disable_live_checks ) {
        gamipress_notifications_check_notices();
    }

})( jQuery, document );