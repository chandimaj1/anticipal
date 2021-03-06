(function($) {

    // Listen for our change to our trigger type selectors
    $('.requirements-list').on( 'change', '.select-trigger-type', function() {

        // Grab our selected trigger type and achievement selector
        var trigger_type = $(this).val();
        var url_selector = $(this).siblings('.social-share-url');
        var social_network_selector = $(this).siblings('.select-social-network');

        if(
            trigger_type === 'gamipress_social_share_specific_url_on_any_network'
            || trigger_type === 'gamipress_social_share_specific_url_on_specific_network'
        ) {
            url_selector.show();
        } else {
            url_selector.hide();
        }

        if(
            trigger_type === 'gamipress_social_share_url_on_specific_network'
            || trigger_type === 'gamipress_social_share_specific_url_on_specific_network'
            || trigger_type === 'gamipress_social_share_share_on_specific_network'
            || trigger_type === 'gamipress_social_share_share_specific_on_specific_network'
            || trigger_type === 'gamipress_social_share_get_share_on_specific_network'
            || trigger_type === 'gamipress_social_share_get_share_specific_on_specific_network'
        ) {
            social_network_selector.show();
        } else {
            social_network_selector.hide();
        }

    });

    // Loop requirement list items to show/hide social share select on initial load
    $('.requirements-list li').each(function() {

        // Grab our selected trigger type and achievement selector
        var trigger_type = $(this).find('.select-trigger-type').val();
        var url_selector = $(this).siblings('.social-share-url');
        var social_network_selector = $(this).find('.select-social-network');

        if(
            trigger_type === 'gamipress_social_share_specific_url_on_any_network'
            || trigger_type === 'gamipress_social_share_specific_url_on_specific_network'
        ) {
            url_selector.show();
        } else {
            url_selector.hide();
        }

        if(
            trigger_type === 'gamipress_social_share_url_on_specific_network'
            || trigger_type === 'gamipress_social_share_specific_url_on_specific_network'
            || trigger_type === 'gamipress_social_share_share_on_specific_network'
            || trigger_type === 'gamipress_social_share_share_specific_on_specific_network'
            || trigger_type === 'gamipress_social_share_get_share_on_specific_network'
            || trigger_type === 'gamipress_social_share_get_share_specific_on_specific_network'
        ) {
            social_network_selector.show();
        } else {
            social_network_selector.hide();
        }

    });

    $('.requirements-list').on( 'update_requirement_data', '.requirement-row', function(e, requirement_details, requirement) {

        var trigger_type = requirement_details.trigger_type;

        if(
            trigger_type === 'gamipress_social_share_specific_url_on_any_network'
            || trigger_type === 'gamipress_social_share_specific_url_on_specific_network'
        ) {
            requirement_details.social_share_url = requirement.find( '.social-share-url' ).val();
        }

        if(
            trigger_type === 'gamipress_social_share_url_on_specific_network'
            || trigger_type === 'gamipress_social_share_specific_url_on_specific_network'
            || trigger_type === 'gamipress_social_share_share_on_specific_network'
            || trigger_type === 'gamipress_social_share_share_specific_on_specific_network'
            || trigger_type === 'gamipress_social_share_get_share_on_specific_network'
            || trigger_type === 'gamipress_social_share_get_share_specific_on_specific_network'
        ) {
            requirement_details.social_network = requirement.find( '.select-social-network' ).val();
        }

    });

})( jQuery );