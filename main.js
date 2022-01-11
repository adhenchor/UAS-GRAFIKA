// inisialisasi variabel
var app = new Vue({
  el: "#app",
  data: {
    chart: null,
    city: "",
    dates: [],
    temps: [],
    loading: false,
    errored: false
  },
  //metode pengambilan data
  methods: {
    getData: function() {
      this.loading = true;

      if (this.chart != null) {
        this.chart.destroy();
      }
      // mengambil data dari server
      axios
        .get("https://api.openweathermap.org/data/2.5/forecast", {
          params: {
            q: this.city,
            units: "imperial",
            appid: "fd3150a661c1ddc90d3aefdec0400de4"
          }
        })
        .then(response => {
          this.dates = response.data.list.map(list => {
            return list.dt_txt;
          });

          this.temps = response.data.list.map(list => {
            return list.main.temp;
          });

          // membuat object chart
          var ctx = document.getElementById("Chartku");
          this.chart = new Chart(ctx, {
            type: "line",

            // dataset yang akan ditampilkan
            data: {
              labels: this.dates,
              datasets: [
                {
                  label: "Rata-Rata Temp.",
                  backgroundColor: "rgba(252,226,98,0.5)",
                  borderColor: "rgb(255,169,0)",
                  fill: false,
                  data: this.temps
                }
              ]
            },
            options: {
              title: {
                display: true,
                text: "Temperatur Suatu Tempat dengan Chart.js"
              },
              tooltips: {
                callbacks: {
                  label: function(tooltipItem, data) {
                    var label =
                      data.datasets[tooltipItem.datasetIndex].label || "";

                    if (label) {
                      label += ": ";
                    }

                    label += Math.floor(tooltipItem.yLabel);
                    return label + "°F";
                  }
                }
              },
              scales: {
                xAxes: [
                  {
                    type: "time",
                    time: {
                      unit: "hour",
                      displayFormats: {
                        hour: "M/DD - hA"
                      },
                      tooltipFormat: "MMM. DD @ hA"
                    },
                    scaleLabel: {
                      display: true,
                      labelString: "Tanggal/Waktu"
                    }
                  }
                ],
                yAxes: [
                  {
                    scaleLabel: {
                      display: true,
                      labelString: "Temperature (°F)"
                    },
                    ticks: {
                      callback: function(value, index, values) {
                        return value + "°F";
                      }
                    }
                  }
                ]
              }
            }
          });
        })

        .catch(error => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => (this.loading = false));
    }
  }
});
