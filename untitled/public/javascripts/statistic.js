

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

    })
});

function submitFilter(){
    //$.post("/filter",function(data){
        let days = $("#user_filter_date").val();
        let searchTerm = $("#user_filter_user").val();
        generateForm(days);
        $.post("/submission/search/" + searchTerm,function(data){
            let submission = $(".submission");
            submission.empty();
            //TODO do this tommmorow
            data.forEach(function(Element){
                console.log(Element.title);
                submission.append("<li class=\"submission\">\r\n  " + "<\/li>");
            })

        })

    //})
}

function generateForm(n){

    $.get("/getChartData/" + n,function (data){
        let submission = data[0];
        let dispense = data[1];
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
    let list_status_first = $(".submission_status:first");
    let list_status = $(".submission_status");
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
}
