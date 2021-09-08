(function($){

    /**
     * Multi Form Submission Handling
     * |CJ|
     */
    console.log('listning for forminator submission');


    // Handle custom button click
    $('#quest-details-submission-button').on('click', function(){
        $('#gamipress-submission-form-submission-form .forminator-button-submit').trigger('click');
        $('#gamipress-submission-form-submission-form').css('display','none !important');
    });


    // handle On forminator form submit success, submit gamipress submission
    $(document).on( 'forminator:form:submit:success', function(e){
        $('#gamipress-submission-button').trigger('click'); 
    });

    /**
     * END: Form Submission handling
     */
    
    })(jQuery);