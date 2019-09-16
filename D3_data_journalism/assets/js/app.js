function makeResponsive() {

  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");

  if (!svgArea.empty()) {
    svgArea.remove();
  }

  // @TODO: YOUR CODE HERE!
  var svgWidth = 960;
  var svgHeight = 500;

  var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
  };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;


  // Create an SVG wrapper, append an SVG group that will hold our chart,
  // and shift the latter by left and top margins.
  var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // Append an SVG group
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Initial Params
  var chosenXAxis = "poverty";
  var chosenYAxis = "healthcare";


  // function used for updating x-scale var upon click on axis label
  // creates the x-scale
  function xScale(healthData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
      d3.max(healthData, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);

    return xLinearScale;

  }

  // function used for updating y-scale var upon click on axis label
  // creates the y-scale
  function yScale(healthData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.7,
      d3.max(healthData, d => d[chosenYAxis]) * 1.1
      ])
      .range([height, 0]);

    return yLinearScale;

  }



  // function used for updating xAxis var upon click on axis label
  // renders the x-axis
  function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);

    return xAxis;
  }


  // function used for updating yAxis var upon click on axis label
  // renders the y-axis
  function yrenderAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
      .duration(1000)
      .call(leftAxis);

    return yAxis;
  }

  // function used for updating circles group with a transition to
  // new circles (X)
  function renderCircles(circlesGroup, newXScale, chosenXaxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
  }


  // function used for updating circles group with a transition to
  // new circles (Y)
  function yrenderCircles(circlesGroup, newYScale, chosenYaxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
  }

  // function used for updating the states that appear in circles with a transition to
  // a new axis (X)
  function rendercirclesText(circlesText, xLinearScale, chosenXaxis) {
    d3.selectAll("#circlesText").text("")
    circlesText.transition()
      .duration(1000)
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .text(d => d.abbr)
    return circlesText;
  }

  // function used for updating the states that appear in circles with a transition to
  // a new axis (Y)
  function yrendercirclesText(circlesText, yLinearScale, chosenYaxis) {
    d3.selectAll("#circlesText").text("")
    circlesText.transition()
      .duration(1000)
      .attr("y", d => yLinearScale(d[chosenYAxis]))
      .text(d => d.abbr)
    return circlesText;
  }



  // function used for updating circles group with new tooltip
  function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    if (chosenXAxis === "poverty") {
      var label = "Poverty:";
    }

    if (chosenXAxis === "income") {
      var label = "Income:";
    }

    if (chosenXAxis === "age") {
      var label = "Age:";
    }

    if (chosenYAxis === "healthcare") {
      var ylabel = "Healthcare:"
    }

    if (chosenYAxis === "smokes") {
      var ylabel = "Smokes:"
    }

    if (chosenYAxis === "obesity") {
      var ylabel = "Obesity:"
    }

    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([40, -70])
      .html(function (d) {
        return (`${d.state}<br>${label} ${d[chosenXAxis]}<br>${ylabel}: ${d[chosenYAxis]}`);
      });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function (healthData) {
      toolTip.show(healthData);
    })
      // onmouseout event
      .on("mouseout", function (healthData, index) {
        toolTip.hide(healthData);
      });

    return circlesGroup;
  }

  // Retrieve data from the CSV file and execute everything below
  d3.csv("assets/data/data.csv", function (err, healthData) {
    if (err) throw err;

    // parse data
    healthData.forEach(function (data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      data.age = +data.age;
      data.income = +data.income;
      data.smokes = +data.smokes;
      data.obesity = +data.obesity;
    });

    // xLinearScale function above csv import
    var xLinearScale = xScale(healthData, chosenXAxis);

    // Create y scale function
    // var yLinearScale = d3.scaleLinear()
    //   .domain([0, d3.max(healthData, d => d.healthcare)])
    //   .range([height, 0]);
    var yLinearScale = yScale(healthData, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    // append y axis
    // chartGroup.append("g")
    //   .call(leftAxis);
    var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      .attr("transform", `translate(0, 0)`)
      .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(healthData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", 20)
      .attr("fill", "blue")
      .attr("opacity", ".2");

    // append initial state labels
    var circlesText = chartGroup.selectAll()
      .data(healthData)
      .enter()
      .append("text")
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("y", d => yLinearScale(d[chosenYAxis]))
      .text(d => d.abbr)
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px")
      .attr("fill", "black")
      .attr("id", "circlesText");

    // Create group for  3 x- axis labels
    var labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("In Poverty (%)");

    var ageLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age (Median)");

    var incomeLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .text("Household Income (Median)")

    // Create group for 3 y-axis labels
    var ylabelsGroup = chartGroup.append("g")
      .attr("transform", "rotate(-90)")

    var healthcareLabel = ylabelsGroup.append("text")
      .attr("y", -60)
      .attr("x", -175)
      .attr("dy", "1em")
      .attr("value", "healthcare")
      .classed("active", true)
      .text("Lacks Healthcare (%)");

    var smokesLabel = ylabelsGroup.append("text")
      .attr("y", -80)
      .attr("x", -175)
      .attr("dy", "1em")
      .attr("value", "smokes")
      .classed("inactive", true)
      .text("Smokes (%)");

    var obesityLabel = ylabelsGroup.append("text")
      .attr("y", -100)
      .attr("x", -175)
      .attr("dy", "1em")
      .attr("value", "obesity")
      .classed("inactive", true)
      .text("Obese (%)");





    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // x axis labels event listener
    labelsGroup.selectAll("text")
      .on("click", function () {
        // get value of selection
        var value = d3.select(this).attr("value");
        //console.log(value);
        if (value !== chosenXAxis) {

          // replaces chosenXAxis with value
          chosenXAxis = value;

          console.log(`xAxis ${chosenXAxis} yAxis ${chosenYAxis}`);

          // functions here found above csv import
          // updates x scale for new data
          xLinearScale = xScale(healthData, chosenXAxis);

          // updates x axis with transition
          xAxis = renderAxes(xLinearScale, xAxis);

          // updates circles with new x values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

          // updates circles with new state values
          circlesText = rendercirclesText(circlesText, xLinearScale, chosenXAxis);

          // // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);


          // changes classes to change bold text
          if (chosenXAxis === "poverty") {
            povertyLabel
              .classed("active", true)
              .classed("inactive", false);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          if (chosenXAxis == "income") {
            incomeLabel
              .classed("active", true)
              .classed("inactive", false);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          if (chosenXAxis == "age") {
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          }
        }
      });


    // y axis labels event listener
    ylabelsGroup.selectAll("text")
      .on("click", function () {
        // get value of selection
        var value = d3.select(this).attr("value");
        console.log(value);
        if (value !== chosenYAxis) {

          // replaces chosenYAxis with value
          chosenYAxis = value;

          console.log(`xAxis ${chosenXAxis} yAxis ${chosenYAxis}`);

          // functions here found above csv import
          // updates y scale for new data
          yLinearScale = yScale(healthData, chosenYAxis);

          // updates y axis with transition
          yAxis = yrenderAxes(yLinearScale, yAxis);

          // updates circles with new x values
          circlesGroup = yrenderCircles(circlesGroup, yLinearScale, chosenYAxis);

          // updates circles with new state values
          circlesText = yrendercirclesText(circlesText, yLinearScale, chosenYAxis);

          // // // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);


          // changes classes to change bold text
          if (chosenYAxis === "healthcare") {
            healthcareLabel
              .classed("active", true)
              .classed("inactive", false);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          if (chosenYAxis == "smokes") {
            smokesLabel
              .classed("active", true)
              .classed("inactive", false);
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          if (chosenYAxis == "obesity") {
            obesityLabel
              .classed("active", true)
              .classed("inactive", false);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
          }
        }
      });



  });
}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, responsify() is called.
d3.select(window).on("resize", makeResponsive);