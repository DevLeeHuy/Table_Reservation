const listRes = document.querySelectorAll(".chart-container");

listRes.forEach((e) => {
  let id = e.getAttribute("resID");
  let rating = +e.getAttribute("rating");
  let revenues = e.querySelectorAll(".quantity-" + id);
  var listRev = [];
  revenues.forEach((e) => {
    listRev = [
      ...listRev,
      {
        label: "Tháng: " + (listRev.length + 1),
        value: e.value,
      },
    ];
  });
  drawChart(id, rating, listRev);
  console.log(id + "  " + rating);
});

function drawChart(id, rating, revenues) {
  const avg =
    revenues.reduce((sum, month) => sum + month.value * 1, 0) / revenues.length;
  //STEP 3 - Chart Configurations
  const chartConfig2 = {
    type: "column2d",
    renderAt: "columnChart-" + id,

    width: "90%",
    height: "80%",
    dataFormat: "json",
    dataSource: {
      // Chart Configuration
      chart: {
        caption: "Danh thu trong năm",
        subCaption: "Nhà hàng",
        xAxisName: "Tháng",
        yAxisName: "Số khách",
        numberSuffix: " Người",
        theme: "fusion",

        paletteColors: "#d6F5F5, #F0368C,#123dea",
      },
      // Chart Data
      data: revenues,
      trendlines: [
        {
          line: [
            {
              startvalue: `${avg}`,
              valueOnRight: "1",
              displayvalue: "Trung bình",
              showOnTop: 1,
              alpha: 90,
              toolText: "Trung bình",
            },
          ],
        },
      ],
    },
  };

  const chartData = [
    {
      label: rating + "/" + 10,
      value: `${(10 - rating).toFixed(2)}`,
    },
    {
      label: "",
      value: `${rating}`,
    },
  ];
  //STEP 3 - Chart Configurations
  const chartConfig = {
    type: "doughnut2d",
    renderAt: "pieChart-" + id,
    width: "90%",
    height: "80%",
    dataFormat: "json",
    dataSource: {
      // Chart Configuration
      chart: {
        //   caption: "Split of Revenue by Product Categories",
        //  subCaption: "Last year",

        defaultCenterLabel: "Hài lòng:\n" + rating + "/" + 10,
        //  centerLabel: "Revenue from $label: $value", //luc hover vào phần vòng
        decimals: "1",
        theme: "fusion",
        pieRadius: "90",
        doughnutRadius: "80",
        paletteColors: "#F5F5F5, #F0368C",
        //palette: 3,
        pieRadius: "90",
        doughnutRadius: "80",
        startingAngle: "90",
        showLegend: "0",
        showPercentValues: 0,
        showPercentInToolTip: 0,
        showLabels: 0,

        toolTipBorderColor: "#666666",
        toolTipBgColor: "#efefef",
        toolTipBgAlpha: "80",
        showToolTipShadow: "1",
        plottooltext: `$value`,
        //  showPrintMenuItem: 1,   Show in cái chart
      },
      // Chart Data
      data: chartData,
    },
  };

  FusionCharts.ready(function () {
    const fusioncharts = new FusionCharts(chartConfig);
    fusioncharts.render();

    const fusioncharts2 = new FusionCharts(chartConfig2);
    fusioncharts2.render();
  });
  let flag = true;

  const changeChart = () => {
    const fusioncharts = new FusionCharts(flag ? chartConfig : chartConfig2);
    fusioncharts.render();
    flag = !flag;
    console.log(flag);
  };
}
