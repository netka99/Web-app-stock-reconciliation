function updateChart() {
  async function fetchData() {
    const url = "./dummydataSale.json";
    const url2 = "./dummydataReturn.json";
    const response = await fetch(url);
    const datapoints = await response.json();
    const response2 = await fetch(url2);
    const datapoints2 = await response2.json();

    return [datapoints, datapoints2];
  }

  fetchData().then((dataArr) => {
    // Create an empty object to store the summarized data
    const summarySale = {};
    const summaryReturn = {};

    // Loop through each sale in the data
    dataArr[0].Sale.forEach((sale) => {
      // If the product doesn't exist in the summarySale object, add it with an empty object
      if (!summarySale[sale.product]) {
        summarySale[sale.product] = {};
      }

      // If the date doesn't exist in the summarySale object for the product, add it with a quantity of 0
      if (!summarySale[sale.product][sale.date]) {
        summarySale[sale.product][sale.date] = 0;
      }

      // Add the quantity of the sale to the summarySale object for the product and date
      summarySale[sale.product][sale.date] += sale.quantity;
    });

    dataArr[1].Return.forEach((sale) => {
      if (!summaryReturn[sale.product]) {
        summaryReturn[sale.product] = {};
      }
      if (!summaryReturn[sale.product][sale.date]) {
        summaryReturn[sale.product][sale.date] = 0;
      }
      summaryReturn[sale.product][sale.date] += sale.quantity;
    });

    // Comparison of two objects for Sale and Return and concatinating dates
    // if there is no return for a sale's date pass 0
    const returnsByProduct = {};
    for (const product in summarySale) {
      returnsByProduct[product] = {};
      const saleDates = Object.keys(summarySale[product]);
      const returnDates = Object.keys(summaryReturn[product] || {});

      const allDates = [...new Set([...saleDates, ...returnDates])];

      for (const date of allDates) {
        const returnValue = summaryReturn[product]?.[date] || 0;
        returnsByProduct[product][date] = returnValue;
      }
    }

    //spliting data for Return into separate arrays to be able to pass to graph
    const valuesByProductReturn = {};
    const datesByProductReturn = {};

    for (const product in returnsByProduct) {
      const productDataReturn = returnsByProduct[product];
      const valuesReturn = [];
      const datesReturn = [];
      for (const date in productDataReturn) {
        valuesReturn.push(productDataReturn[date]);
        datesReturn.push(date);
      }
      valuesByProductReturn[product] = valuesReturn;
      datesByProductReturn[product] = datesReturn;
    }

    console.log(valuesByProductReturn, datesByProductReturn);

    //spliting data for Sale into separate arrays to be able to pass to graph
    const valuesByProduct = {};
    const datesByProduct = {};

    for (const product in summarySale) {
      const productData = summarySale[product];
      const values = [];
      const dates = [];
      for (const date in productData) {
        values.push(productData[date]);
        dates.push(date);
      }
      valuesByProduct[product] = values;
      datesByProduct[product] = dates;
    }

    //for each product button is assign event listener to
    //show graph with corresponding data
    const graphsPerProduct = document.querySelectorAll(
      ".summary-buttons-product"
    );
    graphsPerProduct.forEach((button) => {
      button.addEventListener("click", (e) => {
        const graphContainer = document.querySelector(".graphs");
        const id = e.currentTarget.dataset.id;
        console.log(id);
        if (id === "Kartacze") {
          myChart.config.data.labels = datesByProductReturn.Kartacze;
          myChart.config.data.datasets[0].data = valuesByProduct.Kartacze;
          myChart.config.data.datasets[1].data = valuesByProductReturn.Kartacze;
        }
        if (id === "Babka") {
          myChart.config.data.labels = datesByProductReturn.Babka;
          myChart.config.data.datasets[0].data = valuesByProduct.Babka;
          myChart.config.data.datasets[1].data = valuesByProductReturn.Babka;
        }
        if (id === "Kiszka") {
          myChart.config.data.labels = datesByProductReturn.Kiszka;
          myChart.config.data.datasets[0].data = valuesByProduct.Kiszka;
          myChart.config.data.datasets[1].data = valuesByProductReturn.Kiszka;
        }
        myChart.update();
        graphContainer.classList.add("active");
      });
    });
  });
}

//graph's logic
updateChart();
const ctx = document.getElementById("myChart");
const data = {
  labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  datasets: [
    {
      type: "bar",
      label: "Sprzedaż",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: ["rgba(131, 99, 192, 0.5)"],
      borderColor: ["rgb(131, 99, 192)"],
      borderWidth: 1,
    },
    {
      type: "line",
      label: "Zwrot",
      data: [10, 20, 30, 50],
      fill: false,
      borderColor: "rgb(54, 162, 235)",
      backgroundColor: ["rgba(54, 162, 235)"],
    },
  ],
};

const config = {
  type: "scatter",
  data: data,
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
};

const myChart = new Chart(ctx, config);
