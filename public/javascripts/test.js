var currentNote;

$(function() {
  var mouseX = frameWidth * 0.8;
  var mouseY = frameHeight / 2;
  var percent = 1;
  var down = false;
  var clickAndReleased = false;
  var fadeOutCounter = 0;
  var fadeInCounter = 0;
  var fadeOut;

  var frameWidth = document.getElementById('main-frame').clientWidth;
  var frameHeight = document.getElementById('main-frame').clientHeight;
  console.log(frameWidth + 'x' + frameHeight)
  // var maxBarHeight = frameHeight * 0.25;
  // var minBarHeight = frameHeight * 0.01;
  // var barWidth = frameHeight * 0.005;
  // var lowerLimit = frameWidth * 0.6;
  // var upperLimit = frameWidth * 0.8;

  var mainSVG = d3.select("#main-frame")
    .append("svg")
    .attr("width", frameWidth)
    .attr("height", frameHeight)
    .attr("color", "yellow");

  function generateTrail(x, y, height) {
    var trail = mainSVG.append("trail");
    trail
      .attr("width", 5)
      .attr("height", height)
      .attr("x", x)
      .attr("y", y)
      .attr("ry", 5)
      .transition()
      .ease("linear")
      .duration(2000)
      .attr("x", -50)
      .remove()
  };

  setInterval(generateTrail(currentX, currentY, 10), 25);

});