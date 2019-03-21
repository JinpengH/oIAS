
$(document).ready(function(){


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
    let list_status_first = $(".list_status:first");
    let list_status = $(".list_status");
    switch(list_status_first.text()){
        case "Pending":
            list_status.css('color','#F7AE51');
            break;
        case "Approved":
            list_status.css('color','#2FF75C');
            break;
        case "Declined":
            list_status.css('color','#f71b1b');
            break;
        default:
            list_status.css('color','#f71b1b');
    }

    $(".decline").on('click',function(){
        let res = $(".decline").val();
        console.log(res);
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