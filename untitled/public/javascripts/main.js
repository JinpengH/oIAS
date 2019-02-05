var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {

    $('#sidebar_button').on('click', function() {
        $('.content').toggleClass('isOpen');
    });

};