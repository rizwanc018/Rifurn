window.addEventListener('DOMContentLoaded', event => {

    const datatablesSimple = document.getElementById('datatables');
    if (datatablesSimple) {
        new simpleDatatables.DataTable(datatablesSimple);
    }
});

// salesReport = salesReport.reverse()

console.log( points)

var ctx = document.getElementById("myAreaChart");
// var myLineChart = new Chart(ctx, {
//     type: 'line',
//     data: {
//         labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
//         datasets: [{
//             label: "Revenue",
//             lineTension: 0.3,
//             backgroundColor: "rgba(78, 115, 223, 0.05)",
//             borderColor: "rgba(78, 115, 223, 1)",
//             pointRadius: 3,
//             pointBackgroundColor: "rgba(78, 115, 223, 1)",
//             pointBorderColor: "rgba(78, 115, 223, 1)",
//             pointHoverRadius: 3,
//             pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
//             pointHoverBorderColor: "rgba(78, 115, 223, 1)",
//             pointHitRadius: 10,
//             pointBorderWidth: 2,
//             data: [0, 10000, 5000, 15000, 10000, 20000, 15000, 25000, 20000, 30000, 25000, 40000],
//         }],
//     },
//     options: {
//         maintainAspectRatio: false,
//         layout: {
//             padding: {
//                 left: 10,
//                 right: 25,
//                 top: 25,
//                 bottom: 0
//             }
//         },
//         scales: {
//             xAxes: [{
//                 time: {
//                     unit: 'date'
//                 },
//                 gridLines: {
//                     display: false,
//                     drawBorder: false
//                 },
//                 ticks: {
//                     maxTicksLimit: 7
//                 }
//             }],
//             yAxes: [{
//                 ticks: {
//                     maxTicksLimit: 5,
//                     padding: 10,
//                     // Include a dollar sign in the ticks
//                     callback: function (value, index, values) {
//                         return '$' + number_format(value);
//                     }
//                 },
//                 gridLines: {
//                     color: "rgb(234, 236, 244)",
//                     zeroLineColor: "rgb(234, 236, 244)",
//                     drawBorder: false,
//                     borderDash: [2],
//                     zeroLineBorderDash: [2]
//                 }
//             }],
//         },
//         legend: {
//             display: false
//         },
//         tooltips: {
//             backgroundColor: "rgb(255,255,255)",
//             bodyFontColor: "#858796",
//             titleMarginBottom: 10,
//             titleFontColor: '#6e707e',
//             titleFontSize: 14,
//             borderColor: '#dddfeb',
//             borderWidth: 1,
//             xPadding: 15,
//             yPadding: 15,
//             displayColors: false,
//             intersect: false,
//             mode: 'index',
//             caretPadding: 10,
//             callbacks: {
//                 label: function (tooltipItem, chart) {
//                     var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
//                     return datasetLabel + ': $' + number_format(tooltipItem.yLabel);
//                 }
//             }
//         }
//     }
// });
var myLineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: label,
      datasets: [{
        label: 'Revenue',
        data: points,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  var ctx = document.getElementById("myPieChart");
  var myPieChart = new Chart(ctx, {
    type: 'doughnut',
    // type: 'polarArea',
    data: {
      labels: ["COD", "Wallet", "Online"],
      datasets: [{
        data: paymentPoints,
        backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
        hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
        hoverBorderColor: "rgba(234, 236, 244, 1)",
      }],
    },
    options: {
      maintainAspectRatio: false,
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
      },
      legend: {
        display: false
      },
      cutoutPercentage: 80,
    },
  });
