let dispense;
$(document).ready(function(){

    //generating graph
    generateForm(7);
    $.get("/getList",function(data){
        data.forEach(function(element){
            let o = new Option(element[1], element[0]);
            $(o).html(element[1]);
            if(element[0] === ""){$(o).attr('disabled','disabled');}
            $("#user_filter_user").append(o);
        });

    });


});

function download(){
    console.log("HI");
    generatePDF();


}

function submitFilter(){
    //$.post("/filter",function(data){
    let days = $("#user_filter_date").val();
    let searchTerm = $("#user_filter_user").val();
    let status = $("#user_filter_status").val();

    $.post("/submission/search/" + searchTerm,function(data){
        let submissions = $(".submissions");
        submissions.empty();
        console.log(data);
        submissions.append( "<tbody>\r\n <tr class=\"submission\">\r\n  <th class=\"submission_name\"> "+"Name"+"<\/th>\r\n  <th class=\"submission_date\">"+"Date"+"<\/th>\r\n  <th class=\"submission_dispense\">"+"Dispense"+"<\/th>\r\n  <th class=\"submission_status\">"+"Status"+"<\/th>\r\n<\/tr>");
        data.forEach(function(element){
            submissions.append("<tr class=\"submission\">\r\n  <td class=\"submission_name\"> "+element.name+"<\/td>\r\n  <td class=\"submission_date\">"+element.date+"<\/td>\r\n  <td class=\"submission_dispense\">"+element.dispense+"<\/td>\r\n  <td class=\"submission_status\">"+element.status+"<\/td>\r\n<\/tr>");
        });
        generateForm(days);

    });

    //})
}



function generateForm(n){

    $.get("/getChartData/" + n,function (data){
        let submission = data[0];
        dispense = data[1];
        let rest = 100 - dispense;
        if(rest <= 0){rest = 0;}
        let labels = [];

        for (let i = 0; i < n; i++) {
            labels.push(" ");
        }
        $('#pie_graph').remove(); // this is my <canvas> element
        $("#trend_graph").remove();
        $('.graph').append('<canvas id="pie_graph" width="400" height="400"><canvas>').append('<canvas id="trend_graph" width="600" height="400"><canvas>');
        let pieGraph = $("#pie_graph");
        let lineGraph = $("#trend_graph");
        pieGraph.css('float','left');
        lineGraph.css('float','left').css('margin-left','150px');
        let pie_graph_data = {datasets: [{
                data: [dispense,rest],
                backgroundColor:[
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                ],
                borderColor:[
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                ],
            }],

            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: [
                'money spent',
                'money left'
            ]};
        let doughnutChart = new Chart(pieGraph,{
            type:"doughnut",
            data:pie_graph_data,
            options:{
                responsive:false,
                maintainAspectRatio: false
            },
            cutoutPercentage: 70
        });
        let line_graph_data = {datasets: [{
                label: 'Applying Tasks',
                data: submission,
                borderColor:[
                    'rgba(255, 99, 132, 0.2)',
                ],
            }],
            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: labels,
            xAxisID: ['Week'],
            yAxisID: ['Requests']

        };



        let lineGraphChart = new Chart(lineGraph,{
            type:'line',
            data:line_graph_data,
            options:{
                responsive:false,
                maintainAspectRatio: false
            }
        });
        new Chart(lineGraph,{
            type:'line',
            data:line_graph_data,
            options:{
                responsive:false,
                maintainAspectRatio: false
            }
        });

    });
    //changing status color

    $(".submission_status").each(function() {
        switch($(this).text()){
            case "Pending":
                $(this).css('color','#F7AE51');
                break;
            case "Approved":
                $(this).css('color','#2FF75C');
                break;
            case "Declined":
                $(this).css('color','#f71b1b');
                break;
            default:
                $(this).css('color','#000000');
        }
    });

}


function generatePDF(){
    //get all data set
    $.get("/myname",function(myName) {
        let doc = new jsPDF('p', 'pt', 'letter');
        let user = $('#user_filter_user').find(":selected").text();
        const margin = 50;
        doc.setFont("arial", "bold");
        doc.setFontSize(20);
        doc.text(margin, 20, 'obEN Invoice Report');
        doc.setFont("arial", "normal");
        doc.setFontSize(10);
        doc.text(margin, 40, 'Reporter: ' + myName);
        if (user === 'me') {
            doc.text(margin, 60, 'Employee/Department:' + myName); //TODO
        }
        else{
            doc.text(margin, 60, 'Employee/Department:' + user); //TODO

        }
        doc.text(margin,80,'Total amount: ' + dispense);
        doc.text(margin,100,'Date: ' + dispense);
        doc.autoTable({
            startY: 140,
            html:"#list"
        });
        doc.save();
    });



}