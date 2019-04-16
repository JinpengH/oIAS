
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
        console.log("debug", i);
        // if (i === true) {
        //     i = 1;
        // }
        // else {
        //     i = 0;
        // }
        $(this).val(i);
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
    if (status === true) {
        console.log("true");
    }
    else if (status === false) {
        console.log("false");
    }
    else if (status === "Inactive") {
        status = false;
        console.log("inactive");
    }
    else if (status === "Active") {
        status = true;
        console.log("active");
    }
    else {
        console.log("unexpected");
    }
    console.log(status);
    console.log(params);

    $.post("/admin/assign-user/" + email + "/" + team + "/" + type + "/" + status, function(data){
        if(data){
            alert(data.err);
        }
    });
}

//changing status


