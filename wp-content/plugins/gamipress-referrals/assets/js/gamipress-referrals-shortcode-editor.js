(function( $ ) {

    // Current user field
    $( '#gamipress_affiliate_id_current_user, #gamipress_referral_url_current_user, #gamipress_referrals_count_current_user').on('change', function() {
        var target = $(this).closest('.cmb-row').next(); // User ID field

        if( $(this).prop('checked') ) {
            target.slideUp().addClass('cmb2-tab-ignore');
        } else {
            if( target.closest('.cmb-tabs-wrap').length ) {
                // Just show if item tab is active
                if( target.hasClass('cmb-tab-active-item') )
                    target.slideDown();
            } else {
                target.slideDown();
            }

            target.removeClass('cmb2-tab-ignore');
        }
    });

})( jQuery );