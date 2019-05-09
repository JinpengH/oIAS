$(document).ready(function() {
    $(".header_profile").css("color","#c5c5c5f2");
    $('.change_profile_image').on('click', function () {
        $('.submission_form').fadeIn();
    });


    $('.forms_buttons-cancel').on('click', function () {
        $('.submission_form').fadeOut();
    });

    $("#card_address,#card_telephone")
        .focusout(function() {
            let address = $("#card_address").text();
            let telephone = $("#card_telephone").text();
            console.log(address);
            $.get("/save/"+address+"/"+telephone, function(data){

            })
        })

});


function checkForm(){


    let ext = $('#forms_file').val().split('.').pop().toLowerCase();
    if($.inArray(ext, ['png','jpg','jpeg']) === -1) {
        alert('Invalid extension! extension must be png,jpg or jpeg');
        return false;
    }

    return true;
}



