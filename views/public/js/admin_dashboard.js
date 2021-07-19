anychart.onDocumentReady(function () {
  // set the data
  var males = document.querySelector("#males").value;
  var females = document.querySelector("#females").value;
  var data = [
    { x: "Male", value: males },
    { x: "Female", value: females },
  ];

  // create the chart
  var chart = anychart.pie();

  // set the chart title
  chart.title("Tỉ lệ nam nữ sử dụng website");

  // add the data
  chart.data(data);

  // display the chart in the container
  chart.container("piechart");
  chart.draw();
});
