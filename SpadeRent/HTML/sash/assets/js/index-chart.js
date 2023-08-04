/* Prospect chart-bar*/
var chart = c3.generate({
    bindto: '#chart-monthlyy', // id of chart wrapper
    data: {
        columns: [
            // each columns data
            ['data1', 17, 30, 9]
        ],
        type: 'bar', // default type of chart
        colors: {
            data1: '#2086C8'
        },
        names: {
            // name of each serie
            'data1': 'Maximum'
        }
    },
    axis: {
        x: {
            type: 'category',
            // name of each category
            categories: ['Won', 'Active', 'Lost']
        },
    },
    bar: {
        width: 120
    },
    legend: {
        show: false, //hide legend
    },
    padding: {
        bottom: 0,
        top: 0
    },
});

/* invoice chart */
var ctx = document.getElementById("chartPolarr");
var myChart = new Chart(ctx, {
    type: 'polarArea',
    data: {
        datasets: [{
            data: [18, 15, 9],
            backgroundColor: ['#1467B0', '#529EE0', '#414141'],
            hoverBackgroundColor: ['#1467B0', '#529EE0', '#414141'],
            borderColor: 'transparent',
        }],
        labels: ["Paid", "Unpaid", "Overdue"]
    },
    options: {
        scale: {
            gridLines: {
                color: 'rgba(119, 119, 142, 0.2)'
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            labels: {
                fontColor: "#9ba6b5"
            },
        },
    }
});

/*Banking stats chart-bar*/
var chart = c3.generate({
    bindto: '#chart-barr', // id of chart wrapper
    data: {
        columns: [
            // each columns data
            ['data1', 11, 8, 15, 18, 19, 17, 15, 11, 9, 16, 17, 13],
            ['data2', 7, 7, 5, 7, 9, 12, 11, 9, 14, 12, 14, 10]
        ],
        type: 'bar', // default type of chart
        colors: {
            data1: '#529EE0',
            data2: '#1467B0'
        },
        names: {
            // name of each serie
            'data1': 'Maximum',
            'data2': 'Minimum'
        }
    },
    axis: {
        x: {
            type: 'category',
            // name of each category
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
    },
    bar: {
        width: 14
    },
    legend: {
        show: false, //hide legend
    },
    padding: {
        bottom: 0,
        top: 0
    },
});

 /* Account status chart-donut*/
  /*---- morrisBar8----*/
  new Morris.Donut({
    element: 'morrisBar88',
    data: [{
        value: 25,
        label: 'data2'
    }, {
        value: 75,
        label: 'data1'
    }],
    backgroundColor: 'rgba(119, 119, 142, 0.2)',
    labelColor: '#77778e',
    colors: ['#529EE0', '#1467B0'],
    resize: true,
    formatter: function(x) {
        return x + "%"
    }
}).on('click', function(i, row) {
    console.log(i, row);
});
 /* Account status chart-donut*/

     /* Amount Status Chart*/
     var ctx = document.getElementById("chartAreaa");
     var myChart = new Chart(ctx, {
         type: 'line',
         data: {
             labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
             datasets: [{
                 label: "Data1",
                 borderColor: "#6c5ffc",
                 borderWidth: "3",
                 backgroundColor: "rgba(108, 95, 252, .1)",
                 data: [22, 44, 67, 43, 76, 45, 12]
             }, {
                 label: "Data2",
                 borderColor: "rgba(5, 195, 251 ,0.9)",
                 borderWidth: "3",
                 backgroundColor: "rgba(	5, 195, 251, 0.7)",
                 pointHighlightStroke: "rgba(5, 195, 251 ,1)",
                 data: [16, 32, 18, 26, 42, 33, 44]
             }]
         },
         options: {
             responsive: true,
             maintainAspectRatio: false,
             tooltips: {
                 mode: 'index',
                 intersect: false
             },
             hover: {
                 mode: 'nearest',
                 intersect: true
             },
             scales: {
                 xAxes: [{
                     ticks: {
                         fontColor: "#9ba6b5",
                     },
                     gridLines: {
                         color: 'rgba(119, 119, 142, 0.2)'
                     }
                 }],
                 yAxes: [{
                     ticks: {
                         beginAtZero: true,
                         fontColor: "#9ba6b5",
                     },
                     gridLines: {
                         color: 'rgba(119, 119, 142, 0.2)'
                     },
                 }]
             },
             legend: {
                 labels: {
                     fontColor: "#9ba6b5"
                 },
             },
         }
     });


// <!-- date start  -->
    $('.date').datepicker({
        multidate: true,
        format: 'dd-mm-yyyy '
    });
// <!-- date End  -->
