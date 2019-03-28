
$(document).ready(function() {

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


