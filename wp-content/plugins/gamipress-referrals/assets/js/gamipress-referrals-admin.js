(function( $ ) {

    // Update sample URLs shown on plugin settings
    function gamipress_referrals_update_sample_urls() {

        var url_parameter = $('input#gamipress_referrals_url_parameter').val();

        $('.gamipress-referrals-sample-url').each(function() {

            if( $(this).data('original-url') === undefined )
                $(this).data( 'original-url', $(this).text() )

            $(this).text( $(this).data('original-url').replace( '?ref', '?' + url_parameter ) );
        });

    }

    if( $('.gamipress_settings input#gamipress_referrals_url_parameter').length ) {

        $('body').on( 'change keyup keypress', 'input#gamipress_referrals_url_parameter', function() {
            gamipress_referrals_update_sample_urls();
        } );

        gamipress_referrals_update_sample_urls();

    }



})( jQuery );