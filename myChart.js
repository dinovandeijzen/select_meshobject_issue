function renderChart(data, labels) {
    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        
        data: {
            labels: labels,
            datasets: [{
                label: 'energy duration curve  kWh',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            }]
        },
    });
}

$("#renderBtn").click(
    function () {

        
        data =  energyDemand.demands[44].heatingDemand;
        labels = energyDemand.standardMetricHeating;
        const oeleie= labels.map(te => Math.round(te*10000));  //example for now



        renderChart(  data,oeleie);
        console.log("hi") ;
    }
);