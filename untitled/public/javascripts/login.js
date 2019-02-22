$(document).ready(function(){

    $("#forms_button-flip").click(function() {
        $(".front").fadeOut("slow", function () {
            $(".back").fadeIn();
        })
    })
    $(".forms_button-flip-back").click(function() {
        $(".back").fadeOut("slow", function () {
            $(".front").fadeIn();
        })
    })

    function forgetPassword(){
        var email = $("#login_email").toString();
        console.log(email);

        alert("Message has been sent to this email");
    }


});
