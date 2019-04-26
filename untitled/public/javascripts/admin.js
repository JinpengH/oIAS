$(document).ready(function(){
    $("#login_forget_password").click(function(){
        var username = document.getElementById("username").value;
        var post = $.post("/admin/reset",{username:username});
        post.done(function(result){
            alert(result.message);
        });


    })


});