(function( $ ) {

    // Listen for our change to our trigger type selectors
    $('.requirements-list').on( 'change', '.select-trigger-type', function() {

        // Grab our selected trigger type
        var trigger_type = $(this).val();
        var member_type_field = $(this).siblings('.select-bp-member-type');

        member_type_field.hide();

        if( trigger_type === 'gamipress_bp_set_member_type' ) {
            member_type_field.show();
        }

    });

    // Loop requirement list items to show/hide inputs on initial load
    $('.requirements-list li').each(function() {

        // Grab our selected trigger type
        var trigger_type = $(this).find('.select-trigger-type').val();
        var member_type_field = $(this).find('.select-bp-member-type');

        member_type_field.hide();

        if( trigger_type === 'gamipress_bp_set_member_type' ) {
            member_type_field.show();
        }

    });

    $('.requirements-list').on( 'update_requirement_data', '.requirement-row', function(e, requirement_details, requirement) {

        if( requirement_details.trigger_type === 'gamipress_bp_set_member_type' ) {
            requirement_details.bp_member_type = requirement.find( '.select-bp-member-type' ).val();
        }

    });

})( jQuery );