
$(document).ready(function(){

    //when approved is clicked correctly remove them
    $(".decline").click(function(){
        let id = $(this).attr('id');
        $(this).parent().parent().css('display','none')
        $.post("submission/decline/" + id,function(data){

        });

    });
    $(".approve").click(function(){
        let id = $(this).attr('id');
        $(this).parent().parent().css('display','none')
        $.post("submission/approve/" + id,function(data){

        });
    });
    //adding tooltips
    tippy('.name',{
        arrow:true,
        flip:true,
    });
    tippy('.type',{
        arrow:true,
        flip:true,
    });
    tippy('.description',{
        arrow:true,
        flip:true,
    });

//changing status

    $(".list_status").each(function() {
        switch($(this).text()){
            case "Pending":
                $(this).css('color','#F7AE51');
                break;
            case "Approved":
                $(this).css('color','#19a854');
                break;
            case "Declined":
                $(this).css('color','#f71b1b');
                break;
            default:
                $(this).css('color','#000000');
        }
    });



// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {


    $('#float_button').on('click', function() {
        $('.submission_form').fadeIn();
    });



    $('.forms_buttons-cancel').on('click', function() {
        $('.submission_form').fadeOut();
    });

};
});


function checkForm(){
    let dispense = document.forms["submission"]["dispense"].value;

    if(isNaN(dispense)){
        alert("Dispense must be numbers!");
        return false;
    }


    let ext = $('#forms_file').val().split('.').pop().toLowerCase();
    if($.inArray(ext, ['png','jpg','jpeg','pdf']) === -1) {
        alert('Invalid extension! extension must be png,jpg,jpeg or pdf');
        return false;
    }

    return true;
}


function assignUserGroup(params,email){
    let team = $("#department" + params).val();
    let type = $("#group" + ((-1)*params)).val();
    $.post("/admin/assign-user/" + email + "/" + team + "/" + type, function(data){

    });
}
