var currentNote;
var playerLoop;
var mainSVG;
var currentX;
var currentY;
var prevX;
var prevY;

var maxBarHeight;
var minBarHeight;
var barWidth;
var lowerLimit;
var upperLimit;
var numberOfNotes;

function createNyan(id, cat, x, y ){
  mainSVG.append("image")
  .attr("id", "nyan-cat" + id)
  .attr("xlink:href", "../images/" + cat)
  .attr("height", 100)
  .attr("width", 100)
  .attr("x", x)
  .attr("y", y)
}

function killNyan(id) {
  mainSVG.select('image[id="nyan-cat' + id + '"]').remove();
}

// nyan render function
function nyans() {
  for (var key in mice) {
    mainSVG.select('#nyan-cat' + mice[key].playerId).attr("y", mice[key].currentY - 50)
        .attr("x",  mice[key].currentX - 50);
  }
}

function startTrail(){
  generateTrail(currentX, currentY, 10);
}

function generateTrail(x, y, height){
  var rect = mainSVG.append("rect");
  var randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
  rect.style("stroke", randomColor)
    .style("stroke-width", 4)
    .attr("width", 4)
    .attr("height", 4)
    .attr("x", x)
    .attr("y", y)
    // .attr("ry", 5)
    .transition()
    .ease("linear")
    .duration(2000)
    .attr("x", -50)
    .remove()
}

$(function() {

  var frameWidth = document.getElementById('main-frame').clientWidth;
  var frameHeight = document.getElementById('main-frame').clientHeight;
  // console.log(frameWidth + 'x' + frameHeight)
  maxBarHeight = frameHeight * 0.25;
  minBarHeight = frameHeight * 0.01;
  barWidth = frameHeight * 0.005;
  lowerLimit = frameWidth * 0.6;
  upperLimit = frameWidth * 0.8;
  numberOfNotes = 12;

  mainSVG = d3.select("#main-frame")
    .append("svg")
    .attr("width", frameWidth)
    .attr("height", frameHeight)

  //music ladder
  for (var i = 1; i < 12; i++) {
    mainSVG.append("line")
      .style("stroke", "gray")
      .style("stroke-width", 0.5)
      .attr("x1", 0)
      .attr("y1", frameHeight / 12 * i)
      .attr("x2", frameWidth)
      .attr("y2", frameHeight / 12 * i);
  }

  // update current mouse X, Y to pass for visualization
  $('#main-frame').on('mousemove', function(e) {
    prevX = currentX;
    prevY = currentY;
    currentX = e.pageX - $('#main-frame').offset().left;
    currentY = e.pageY - $('#main-frame').offset().top;
    mainSVG.select('#nyan-cat' + playerId).attr("y", snappyTransition(Math.min(currentY, frameHeight)) - 50)
      .attr("x", prevX - 50);
    setCurrentNote(currentY);
    // console.log(currentX + ' x ' + currentY);
  });

  function reverseNoteOrder(note){
    return (-1 * (note - numberOfNotes))
  }

  function setCurrentNote(y) {
      var spaceBetweenLines = Math.round(frameHeight/numberOfNotes);
      var aNote = Math.floor(y/spaceBetweenLines);
      currentNote = reverseNoteOrder(aNote);
    }

  function snappyTransition(y) {
    var noteAreaHeight = (frameHeight / 12);
    for (var i = 1; i <= 12; i++) {
      if (y <= noteAreaHeight * i) {
        return noteAreaHeight / 2 * (2 * i - 1);
      }
    }
  }

  $('body').on('keydown', function(event) {
    // the keys are / Z X C V / A S D F / Q W E R /
    var keycodes = [90, 88, 67, 86, 65, 83, 68, 70, 81, 87, 69, 82];
    var noteAreaHeight = (frameHeight / 12);
    for (var i = 0; i <= 12; i++) {
      if (keycodes.indexOf(event.keyCode) === (-1 * (i - 12))) {
        prevY = currentY;
        currentY = noteAreaHeight / 2 * (2 * i - 1);
        mainSVG.select('#nyan-cat' + playerId).attr("y", currentY - 50)
      }
    }
  });

  setInterval(startTrail, 125);

});
