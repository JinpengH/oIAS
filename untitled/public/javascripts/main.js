$(document).ready(function(){






// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {

    $('#sidebar_button').on('click', function() {
        $('.content').toggleClass('isOpen');
    });

    $('#float_button').on('click', function() {
        $('.submission_form').fadeIn();
    });

    $(".preview.list_button").on('click',function(){
        $(".modal").fadeIn();
    });

    $(".preview.list_button_cancel").on('click',function(){
        $(".modal").fadeOut();
    });

    $('.forms_buttons-cancel').on('click', function() {
        $('.submission_form').fadeOut();
    });

};
});


function checkForm(){
    let dispense = document.forms["submission"]["dispense"].value;
    console.log(typeof parseFloat(dispense));
    console.log(parseFloat(dispense));
    if(parseFloat(dispense)){return true;}
    else{
        alert("Dispense must be numbers!");
        return false;
    }

}