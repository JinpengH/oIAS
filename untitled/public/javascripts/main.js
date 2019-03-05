
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

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {

    $('#sidebar_button').on('click', function() {
        $('.content').toggleClass('isOpen');
    });

    $('#float_button').on('click', function() {
        $('.submission_form').fadeIn();
    });

    $(".preview.list_button").on('click',function(){
        $(".modal").fadeIn();
    });

    $(".preview.list_button_cancel").on('click',function(){
        $(".modal").fadeOut();
    });

    $('.forms_buttons-cancel').on('click', function() {
        $('.submission_form').fadeOut();
    });

};
});


function checkForm(){
    let dispense = document.forms["submission"]["dispense"].value;
    console.log(typeof parseFloat(dispense));
    console.log(parseFloat(dispense));
    if(parseFloat(dispense)){return true;}
    else{
        alert("Dispense must be numbers!");
        return false;
    }

}