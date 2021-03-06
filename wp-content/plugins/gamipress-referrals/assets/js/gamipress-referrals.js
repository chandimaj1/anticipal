(function( $ ) {

    function gamipress_referrals_is_valid_url(url) {
        return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
    }

    $('body').on( 'click', '#gamipress-referrals-form-submit-button', function(e) {

        var form = $(this).closest('.gamipress-referrals-form');
        var url = form.find('#gamipress-referrals-form-url-input').val();
        var referral_url_input = form.find('#gamipress-referrals-form-referral-url-input');
        var query_parameter = gamipress_referrals.url_parameter + '=' + gamipress_referrals.referral_id;

        // Remove all errors
        form.find('.gamipress-referrals-form-error').remove();

        if( gamipress_referrals_is_valid_url( url ) || url.indexOf('/localhost') !== -1 ) {

            // Update the referral URL input
            referral_url_input.val( url + ( url.indexOf('?') !== -1 ? '&' : '?' ) + query_parameter );

            // Show referral URL wrapper visibility
            form.find('.gamipress-referrals-form-referral-url').slideDown();

        } else {

            // Inform about the error
            form.find('.gamipress-referrals-form-url').append('<div class="gamipress-referrals-form-error">' + gamipress_referrals.invalid_url + '</div>');

            // Hide referral URL wrapper visibility
            form.find('.gamipress-referrals-form-referral-url').slideUp();

            // Clean the referral URL input
            referral_url_input.val( '' );

        }

    } );

})( jQuery );