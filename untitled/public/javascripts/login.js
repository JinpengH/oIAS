$(document).ready(function(){

    $("#forms_button-flip").click(function() {
        $(".front").fadeOut("slow", function () {
            $(".back").fadeIn();
        })
    });
    $(".forms_button-flip-back").click(function() {
        $(".back").fadeOut("slow", function () {
            $(".front").fadeIn();
        })
    });

    $("#login_forget_password").click(function(){
        var email = document.getElementById("login_email").value;
        var post = $.post("/reset",{email:email});
        post.done(function(result){
            alert(result.message);
        });


    })


});
