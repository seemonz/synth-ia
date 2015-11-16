$(function() {
  var frameWidth = document.getElementById('main-frame').clientWidth;
  var frameHeight = document.getElementById('main-frame').clientHeight;
  var circleRadius = frameHeight * 0.05;
  var maxBarHeight = frameHeight * 0.25;
  var minBarHeight = frameHeight * 0.01;
  var barWidth = frameHeight * 0.01;
  var lowerLimit = frameWidth * 0.6;
  var upperLimit = frameWidth * 0.8;
  var mouseX = 0;
  var mouseY = frameHeight / 2;
  var percent = 0.5;
  var down = false;
  var clickAndReleased = false;
  var fadeOutCounter = 0;
  var fadeInCounter = 0;
  var fadeOut;
  var currentNote;

  var dataset = [1]

  // sets the canvas
  var mainSVG = d3.select("#main-frame")
    .append("svg")
    .attr("width", frameWidth)
    .attr("height", frameHeight);

  //music ladder
  for (var i = 1; i < 12; i++) {
    mainSVG.append("line")
      .style("stroke", "gray")
      .style("stroke-width", 3)
      .attr("x1", 0)
      .attr("y1", frameHeight / 12 * i)
      .attr("x2", frameWidth)
      .attr("y2", frameHeight / 12 * i);
  }

  //upper & lower limit lines
  mainSVG.append("line")
    .style("stroke", "gray")
    .attr("x1", lowerLimit)
    .attr("y1", 0)
    .attr("x2", lowerLimit)
    .attr("y2", frameHeight);

  mainSVG.append("line")
    .style("stroke", "gray")
    .attr("x1", upperLimit)
    .attr("y1", 0)
    .attr("x2", upperLimit)
    .attr("y2", frameHeight);

  //main controller circle
  mainSVG.append("circle")
    .style("stroke", "gray")
    .style("fill", "white")
    .attr("r", circleRadius)
    .attr("cx", lowerLimit + (upperLimit - lowerLimit) / 2)
    .attr("cy", frameHeight / 2)
    .on("mouseover", function() {
      d3.select(this).style("fill", "aliceblue");
    })
    .on("mouseout", function() {
      d3.select(this).style("fill", "white");
    });

  function generateTrail(x, y, height) {
    mainSVG.append("rect")
      .style("fill", function() {
        if (down || fadeOutCounter > 0) {
          return "green";
        } else {
          return "white";
        }
      })
      .style("stroke", "green")
      .attr("width", barWidth)
      .attr("height", height)
      .attr("x", x)
      .attr("y", y)
      .transition()
      .ease("linear")
      .duration(3000)
      .attr("x", -100)
      .remove()
  }

  $(document).on("mousemove", function(e) {
    mouseX = e.pageX - $('#main-frame').offset().left;
    mouseY = e.pageY - $('#main-frame').offset().top;
    mainSVG.select('circle').attr("cy", mouseY)
      .attr("cx", withinBoundaries(mouseX));
    percent = (mainSVG.select('circle').attr("cx") - lowerLimit) / (upperLimit - lowerLimit);
    setCurrentNote(mouseY);
  });

  function setCurrentNote(y) {
    currentNote = Math.round(-1 * ((y - circleRadius) / (frameHeight / 12) - 12));
  }

  function withinBoundaries(x) {
    return function() {
      if (x < (upperLimit - circleRadius) && x > (lowerLimit + circleRadius)) {
        return x;
      } else if (x >= (upperLimit - circleRadius)) {
        return upperLimit - circleRadius;
      } else if (x <= (lowerLimit + circleRadius)) {
        return lowerLimit + circleRadius;
      }
    }
  }

  $(document).on('mousedown', function(e) {
    down = true;
    fadeInCounter = 0;
  });

  $(document).on('mouseup', function(e) {
    down = false;
    clickAndReleased = true;
    fadeOutCounter = 10;
  });

  setInterval(function() {
    if (!down) {
      clickAndReleased = false;
    }
    function setBarHeight() {
      if (down) {
        if ((minBarHeight * Math.pow(2.5, fadeInCounter)) < (maxBarHeight * percent)) {
          return minBarHeight * Math.pow(2.5, fadeInCounter);
        } else {
          return maxBarHeight * percent;
        }
      } else if (fadeOutCounter > 0) {
        return maxBarHeight * percent * Math.pow(0.80, -(fadeOutCounter - 10));
      } else {
        return minBarHeight;
      }
    }
    var x = lowerLimit - 2 * 10;
    generateTrail(x, mouseY - setBarHeight() / 2, setBarHeight());
    if (down) {
      // triggerNote(currentNote);
    }
    if (fadeOutCounter > 0) {
      fadeOutCounter -= 1;
    }
    if (fadeInCounter < 10) {
      fadeInCounter += 1;
    }
  }, 30);

});
