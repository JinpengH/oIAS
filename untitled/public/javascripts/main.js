$(document).ready(function(){

    getSubmissions();




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


function getSubmissions(){

}