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


// <!-- date start  -->
    $('.date').datepicker({
        multidate: true,
        format: 'dd-mm-yyyy '
    });
// <!-- date End  -->
