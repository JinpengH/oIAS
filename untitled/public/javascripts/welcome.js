
$(document).ready(function(){
    $(".header_dashboard").css("color","#c5c5c5f2");
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {


    $('#float_button').on('click', function() {
        $('.submission_form').fadeIn();
    });



    $('.forms_buttons-cancel').on('click', function() {
        $('.submission_form').fadeOut();
    });

};
});


function checkForm(){
    let dispense = document.forms["submission"]["dispense"].value;

    if(isNaN(dispense)){
        alert("Dispense must be numbers!");
        return false;
    }


    let ext = $('#forms_file').val().split('.').pop().toLowerCase();
    if($.inArray(ext, ['png','jpg','jpeg','pdf']) === -1) {
        alert('Invalid extension! extension must be png,jpg,jpeg or pdf');
        return false;
    }

    return true;
}

