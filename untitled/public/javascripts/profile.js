$(document).ready(function() {
    $('.change_profile_image').on('click', function () {
        $('.submission_form').fadeIn();
    });


    $('.forms_buttons-cancel').on('click', function () {
        $('.submission_form').fadeOut();
    });

});


function checkForm(){


    let ext = $('#forms_file').val().split('.').pop().toLowerCase();
    if($.inArray(ext, ['png','jpg','jpeg']) === -1) {
        alert('Invalid extension! extension must be png,jpg or jpeg');
        return false;
    }

    return true;
}



