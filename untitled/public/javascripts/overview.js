
$(document).ready(function() {
    $(".user_team").each(function(element){
        let i = $(this).attr("value");
        $(this).val(i);
    });
    $(".user_type").each(function(element){
        let i = $(this).attr("value");
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
    let type = $("#group" + ((-1)*params)).val();
    $.post("/admin/assign-user/" + email + "/" + team + "/" + type, function(data){

    });
}

//changing status


