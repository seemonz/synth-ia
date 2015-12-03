var currentNote;
var playerLoop;
var mainSVG;
var currentX;
var currentY;
var prevX;
var prevY;

var frameHeight;
var frameWidth;
var changingHeight;
var maxBarHeight;
var minBarHeight;
var barWidth;
var lowerLimit;
var upperLimit;
var numberOfNotes;

var down = false;
var clickAndReleased = false;
var fadeOutCounter = 0;
var fadeInCounter = 0;
var fadeOut;

function strokeIt(){
  var randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
  $('svg line').css('stroke-width', .5).css('stroke', '#8C001A');
  setTimeout(function(){ $('svg line').css('stroke-width', .5).css('stroke', 'grey'); }, 125);
};

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
    mainSVG.select('#nyan-cat' + mice[key].playerId).attr("y", snappyTransition(Math.min(mice[key].currentY, frameHeight)) - 50)
        .attr("x",  mice[key].currentX - 50);
  }
}

function startInterval(id){
  function generateTrail(x, y, height){
  var rect = mainSVG.append("rect");
  var randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
  rect.style("stroke", randomColor)
    .style("stroke-width", 4)
    .attr("width", 1)
    .attr("height", height)
    .attr("x", x)
    .attr("y", y)
    // .attr("ry", 5)
    .transition()
    .ease("linear")
    .duration(2000)
    // .attr('y', mice[id].currentY - mice[id].height / 2)
    .attr("x", -50)
    .remove()
  }
  var trail =  setInterval(function(){
    var oldY = mice[id].currentY;
    changingHeight = setBarHeight();
    generateTrail(mice[id].currentX - 50, mice[id].currentY - mice[id].height / 2, mice[id].height);
    if (fadeOutCounter > 0) {
      fadeOutCounter -= 1;
    }
    if (fadeInCounter < 5) {
      fadeInCounter += 1;
    }
  }, 31.25);
  return trail;
}

function setBarHeight() {
  if (down) {
    if ((minBarHeight * Math.pow(2, fadeInCounter)) < (maxBarHeight)) {
      return minBarHeight * Math.pow(2, fadeInCounter);
    } else {
      return maxBarHeight;
    }
  } else if (fadeOutCounter > 0) {
    return maxBarHeight * Math.pow(0.80, -(fadeOutCounter - 10));
  } else {
    return minBarHeight;
  }
}

function snappyTransition(y) {
  var noteAreaHeight = (frameHeight / 12);
  for (var i = 1; i <= 12; i++) {
    if (y <= noteAreaHeight * i) {
      return noteAreaHeight / 2 * (2 * i - 1);
    }
  }
}

$(function() {

  frameWidth = document.getElementById('main-frame').clientWidth;
  frameHeight = document.getElementById('main-frame').clientHeight;
  // console.log(frameWidth + 'x' + frameHeight)
  maxBarHeight = frameHeight * 0.15;
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
    // mainSVG.select('#nyan-cat' + playerId).attr("y", snappyTransition(Math.min(currentY, frameHeight)) - 50)
    //   .attr("x", prevX - 50);
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

  $('body').on('keydown', function(event) {
    // the keys are / Z X C V / A S D F / Q W E R /
    var keycodes = [90, 88, 67, 86, 65, 83, 68, 70, 81, 87, 69, 82];
    var noteAreaHeight = (frameHeight / 12);
    for (var i = 0; i <= 12; i++) {
      if (keycodes.indexOf(event.keyCode) === (-1 * (i - 12))) {
        prevY = currentY;
        currentY = noteAreaHeight / 2 * (2 * i - 1);
        // mainSVG.select('#nyan-cat' + playerId).attr("y", currentY - 50)
        // sound wave gen
        down = true;
        fadeInCounter = 0;
      }
    }
  });

  // sound wave gen
  $('body').on('keyup', function(event) {
    var keycodes = [90, 88, 67, 86, 65, 83, 68, 70, 81, 87, 69, 82];
    if (keycodes.indexOf(event.keyCode) != -1) {
      down = false;
      clickAndReleased = true;
      fadeOutCounter = 10;
    }
  })

  $(document).on('mousedown', function(e) {
    down = true;
    fadeInCounter = 0;
  });

  $(document).on('mouseup', function(e) {
    down = false;
    clickAndReleased = true;
    fadeOutCounter = 10;
  });
});
