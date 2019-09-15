// Define SVG area dimensions
var svgWidth = 1500;
var svgHeight = 600;

// Define the chart's margins as an object
var margin = {
  top: 50,
  right: 225,
  bottom: 50,
  left: 225
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load data from data.csv
d3.csv("assets/data/data.csv").then(function (healthData) {

  // Print the healthData
  //console.log(healthData);

  // get the data that you want to plot
  // get the list of state names
  var states = healthData.map(data => data.state);
  console.log("states", states);
  // get the list of poverty rates
  var poverty = healthData.map(data => parseFloat(data.poverty));
  console.log("poverty", poverty);
  // get the list of healthcare rates
  var healthcare = healthData.map(data => parseFloat(data.healthcare));
  console.log("healthcare", healthcare);

  // Configure a linear scale with a range between the 0 and chartWidth
  var xLinearScale = d3.scaleLinear()
    .domain([5, d3.max(poverty)])
    .range([0, chartWidth]);

  // Configure a linear scale with a range between the chartHeight and 0
  var yLinearScale = d3.scaleLinear()
    .domain([4, d3.max(healthcare)])
    .range([chartHeight, 0]);

  // Create two new functions passing the scales in as arguments
  // These will be used to create the chart's axes
  //var bottomAxis = d3.axisBottom(x);
  var leftAxis = d3.axisLeft(yLinearScale);
  var bottomAxis = d3.axisBottom(xLinearScale)


  // Append an SVG group element to the chartGroup, create the left axis inside of it
  chartGroup.append("g")
    .classed("axis", true)
    .call(leftAxis);

  // Append an SVG group element to the chartGroup, create the bottom axis inside of it
  // Translate the bottom axis to the bottom of the page
  chartGroup.append("g")
    .classed("axis", true)
    .attr("transform", "translate(0, " + chartHeight + ")")
    .call(bottomAxis);


  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 20)
    .attr("fill", "blue")
    .attr("opacity", ".3");


  var circlesText = chartGroup.selectAll()
    .data(healthData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .text(d => d.abbr)
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("fill", "black");



  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

  var povertyLabel = labelsGroup.append("text")
    .attr("x", 5)
    .attr("y", 25)
    .attr("font-weight", 500)
    .text("In Poverty(%)");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -50)
    .attr("x", -300)
    .attr("dy", "1em")
    .attr("font-weight", 750)
    .classed("axis-text", true)
    .text("Lacks Healthcare (%)");





});







