(function( $ ) {

    // Notifications check delay and attempts to cancel visibility
    $('#gamipress_notifications_disable_live_checks').on('change', function(e) {
        var target = $('.cmb2-id-gamipress-notifications-delay, .cmb2-id-gamipress-notifications-attempts-to-cancel');

        if( ! $(this).prop('checked') ) {
            target.slideDown().removeClass('cmb2-tab-ignore');
        } else {
            target.slideUp().addClass('cmb2-tab-ignore');
        }
    });

    if( $('#gamipress_notifications_disable_live_checks').prop('checked') ) {
        $('.cmb2-id-gamipress-notifications-delay, .cmb2-id-gamipress-notifications-attempts-to-cancel').hide().addClass('cmb2-tab-ignore');
    }

    // Auto hide delay visibility
    $('#gamipress_notifications_auto_hide').on('change', function(e) {
        var target = $('.cmb2-id-gamipress-notifications-auto-hide-delay');

        if( $(this).prop('checked') ) {
            target.slideDown().removeClass('cmb2-tab-ignore');
        } else {
            target.slideUp().addClass('cmb2-tab-ignore');
        }
    });

    if( ! $('#gamipress_notifications_auto_hide').prop('checked') ) {
        $('.cmb2-id-gamipress-notifications-auto-hide-delay').hide().addClass('cmb2-tab-ignore');
    }

    // Auto hide achievement notification
    $('#gamipress_notifications_disable_achievements').on('change', function(e) {
        var target = $('.cmb2-id-gamipress-notifications-achievement-title-pattern, .cmb2-id-gamipress-notifications-achievement-content-pattern');

        if( ! $(this).prop('checked') ) {
            target.slideDown().removeClass('cmb2-tab-ignore');
        } else {
            target.slideUp().addClass('cmb2-tab-ignore');
        }
    });

    if( $('#gamipress_notifications_disable_achievements').prop('checked') ) {
        $('.cmb2-id-gamipress-notifications-achievement-title-pattern, .cmb2-id-gamipress-notifications-achievement-content-pattern').hide().addClass('cmb2-tab-ignore');
    }

    // Auto hide step notification
    $('#gamipress_notifications_disable_steps').on('change', function(e) {
        var target = $('.cmb2-id-gamipress-notifications-step-title-pattern, .cmb2-id-gamipress-notifications-step-content-pattern');

        if( ! $(this).prop('checked') ) {
            target.slideDown().removeClass('cmb2-tab-ignore');
        } else {
            target.slideUp().addClass('cmb2-tab-ignore');
        }
    });

    if( $('#gamipress_notifications_disable_steps').prop('checked') ) {
        $('.cmb2-id-gamipress-notifications-step-title-pattern, .cmb2-id-gamipress-notifications-step-content-pattern').hide().addClass('cmb2-tab-ignore');
    }

    // Auto hide points award notification
    $('#gamipress_notifications_disable_points_awards').on('change', function(e) {
        var target = $('.cmb2-id-gamipress-notifications-points-award-title-pattern, .cmb2-id-gamipress-notifications-points-award-content-pattern');

        if( ! $(this).prop('checked') ) {
            target.slideDown().removeClass('cmb2-tab-ignore');
        } else {
            target.slideUp().addClass('cmb2-tab-ignore');
        }
    });

    if( $('#gamipress_notifications_disable_points_awards').prop('checked') ) {
        $('.cmb2-id-gamipress-notifications-points-award-title-pattern, .cmb2-id-gamipress-notifications-points-award-content-pattern').hide().addClass('cmb2-tab-ignore');
    }

    // Auto hide points deduct notification
    $('#gamipress_notifications_disable_points_deducts').on('change', function(e) {
        var target = $('.cmb2-id-gamipress-notifications-points-deduct-title-pattern, .cmb2-id-gamipress-notifications-points-deduct-content-pattern');

        if( ! $(this).prop('checked') ) {
            target.slideDown().removeClass('cmb2-tab-ignore');
        } else {
            target.slideUp().addClass('cmb2-tab-ignore');
        }
    });

    if( $('#gamipress_notifications_disable_points_deducts').prop('checked') ) {
        $('.cmb2-id-gamipress-notifications-points-deduct-title-pattern, .cmb2-id-gamipress-notifications-points-deduct-content-pattern').hide().addClass('cmb2-tab-ignore');
    }

    // Auto hide rank notification
    $('#gamipress_notifications_disable_ranks').on('change', function(e) {
        var target = $('.cmb2-id-gamipress-notifications-rank-title-pattern, .cmb2-id-gamipress-notifications-rank-content-pattern');

        if( ! $(this).prop('checked') ) {
            target.slideDown().removeClass('cmb2-tab-ignore');
        } else {
            target.slideUp().addClass('cmb2-tab-ignore');
        }
    });

    if( $('#gamipress_notifications_disable_ranks').prop('checked') ) {
        $('.cmb2-id-gamipress-notifications-rank-title-pattern, .cmb2-id-gamipress-notifications-rank-content-pattern').hide().addClass('cmb2-tab-ignore');
    }

    // Auto hide rank requirement notification
    $('#gamipress_notifications_disable_rank_requirements').on('change', function(e) {
        var target = $('.cmb2-id-gamipress-notifications-rank-requirement-title-pattern, .cmb2-id-gamipress-notifications-rank-requirement-content-pattern');

        if( ! $(this).prop('checked') ) {
            target.slideDown().removeClass('cmb2-tab-ignore');
        } else {
            target.slideUp().addClass('cmb2-tab-ignore');
        }
    });

    if( $('#gamipress_notifications_disable_rank_requirements').prop('checked') ) {
        $('.cmb2-id-gamipress-notifications-rank-requirement-title-pattern, .cmb2-id-gamipress-notifications-rank-requirement-content-pattern').hide().addClass('cmb2-tab-ignore');
    }

})( jQuery );