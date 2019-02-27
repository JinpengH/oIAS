$(document).ready(function() {

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {

    $('#sidebar_button').on('click', function() {
        $('.content').toggleClass('isOpen');
    });

    $('#float_button').on('click', function() {
        $('.submission_form').fadeIn();
    });

    $('.forms_buttons-cancel').on('click', function() {
        $('.submission_form').fadeOut();
    });

};
});


function getSubmissions(userId){
    $.ajax({
        url:'localhost:3000/',
        type: 'post',
        success: function(data) {
            console.log(data);
        }
    });
    $(".header_dashboard").click(function(){
        // alert(user.fullName);
    })
}