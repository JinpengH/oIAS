
$(document).ready(function() {
    $(".user_team").each(function(element){
        let i = $(this).attr("value");
        $(this).val(i);
    });
    $(".user_type").each(function(element){
        let i = $(this).attr("value");
        $(this).val(i);
    });
    $(".user_status").each(function(element){
        let i = $(this).attr("value");
        if(typeof i === 'undefined'){
            $(this).val(0);
        }
        else{
            $(this).val(1);
        }
        // if (i === true) {
        //     i = 1;
        // }
        // else {
        //     i = 0;
        // }

    });
    $('#float_button').on('click', function() {
        $('.submission_form').fadeIn();
    });



    $('.forms_buttons-cancel').on('click', function() {
        $('.submission_form').fadeOut();
    });

});

function assignUserGroup(params,email){
    let team = $("#department" + params).val();
    console.log(team);
    let type = $("#group" + ((-1)*params)).val();
    console.log(type);
    let status = $("#active" + params).val();

    console.log(status);

    $.post("/admin/assign-user/" + email + "/" + team + "/" + type + "/" + status, function(data){
        if(data){
            alert("Successfully submitted!");
        }
    });
}

//changing status


