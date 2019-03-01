$(document).ready(function(){
    //generating graph
    let dispense = 50;

    var pieGraph = $("#pie_graph");
    var lineGraph = $("#trend_graph");
    var pie_graph_data = {datasets: [{
            data: [dispense,100-dispense],
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
    var doughnutChart = new Chart(pieGraph,{
        type:"doughnut",
        data:pie_graph_data,
        options:{
            responsive:false,
            maintainAspectRatio: false
        },
        cutoutPercentage: 70
    });
    var line_graph_data = {datasets: [{
            data: [2,4,5,1,2],
            borderColor:[
                'rgba(255, 99, 132, 0.2)',
            ],
        }],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday'
        ],
        xAxisID: ['Week'],
        yAxisID: ['Requests']

    };



    var lineGraphChart = new Chart(lineGraph,{
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

    //generating pdf version

});
