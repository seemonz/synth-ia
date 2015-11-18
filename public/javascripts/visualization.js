var currentNote;
$(function() {

  var frameWidth = document.getElementById('main-frame').clientWidth;
  var frameHeight = document.getElementById('main-frame').clientHeight;
  var circleRadius = frameHeight * 0.05;
  var maxBarHeight = frameHeight * 0.25;
  var minBarHeight = frameHeight * 0.01;
  var barWidth = frameHeight * 0.005;
  var lowerLimit = frameWidth * 0.6;
  var upperLimit = frameWidth * 0.8;
  var dataset = [1]

  var mainSVG = d3.select("#main-frame")
    .append("svg")
    .attr("width", frameWidth)
    .attr("height", frameHeight)
    .attr("color", "yellow");

  //music ladder
  for (var i = 1; i < 12; i++) {
    mainSVG.append("line")
      .style("stroke", "gray")
      .style("stroke-width", 2)
      .attr("x1", 0)
      .attr("y1", frameHeight / 12 * i)
      .attr("x2", frameWidth)
      .attr("y2", frameHeight / 12 * i);
  }

  //upper & lower limit lines
  // mainSVG.append("line")
  //   .style("stroke", "white")
  //   .style("stroke-width", 4)
  //   .attr("x1", lowerLimit)
  //   .attr("y1", 0)
  //   .attr("x2", lowerLimit)
  //   .attr("y2", frameHeight)
  //   .attr("stroke-dasharray", "1,10");

  // mainSVG.append("line")
  //   .style("stroke", "white")
  //   .style("stroke-width", 4)
  //   .attr("x1", upperLimit)
  //   .attr("y1", 0)
  //   .attr("x2", upperLimit)
  //   .attr("y2", frameHeight)
  //   .attr("stroke-dasharray", "1,10");


  var defs = mainSVG.append("defs");

  var filter = defs.append("filter")
    .attr("id", "drop-shadow")
    .attr("height", "100")
    .attr("width", "100")

  filter.append("feGaussianBlur")
    .attr("in", "SourceGraphic")
    .attr("stdDeviation", 5)


  var blurFilter = defs.append("filter")
    .attr("id", "blur")
    .append("feGaussianBlur")
    .attr("in", "SourceGraphic")
    .attr("stdDeviation", 2)



  // filter.append("feOffset")
  //     .attr("in", "blur")
  //     .attr("dx", 1)
  //     .attr("dy", 1)
  //     .attr("result", "offsetBlur")

  var feMerge = filter.append("feMerge")

  feMerge.append("feMergeNode")
    .attr("in", "offsetBlur")

  feMerge.append("feMergeNode")
    .attr("in", "SourceGraphic")




  //main controller circle
  // mainSVG.append("circle")
  //   .style("stroke", "none" )
  //   .style("fill", "red")
  //   .attr("r", circleRadius)
  //   .attr("cx", lowerLimit + (upperLimit - lowerLimit)/2)
  //   .attr("cy", frameHeight/2)
  //   .attr("filter", "url(#drop-shadow)")


  var imgs = mainSVG.selectAll("image").data([0]);

  imgs.enter()
    .append("svg:image")
    .attr("id", "nyan-cat")
    .attr("xlink:href", "../images/nyan_cat.gif")
    .attr("height", 100)
    .attr("width", 100)
    .attr("x", frameWidth * 0.7)
    .attr("y", frameHeight * 0.35)



  // mainSVG.append("rect")
  //   .style("stroke", "yellow")
  //   .style("fill", "yellow")
  //   .attr("stroke-width", 3)
  //   .attr("x", lowerLimit + (upperLimit - lowerLimit)/2 - 50)
  //   .attr("y", frameHeight/2)
  //   .attr("ry", 8)
  //   .attr("rx", 8)
  //   .attr("height", 105)
  //   .attr("width", 3)
  //   .attr("filter", "url(#drop-shadow)")


  function generateTrail(x, y, height) {

    var rect = mainSVG.append("rect");
    // var rect = rects[barIndex];

    rect.style("fill", function() {
        if (down || fadeOutCounter > 0) {
          return "green";
        } else {
          return "white";
        }
      })
      .style("stroke", "green")
      // .attr("filter", "url(#drop-shadow)")

    .style("stroke-width", 3)
      .attr("width", barWidth)
      .attr("height", height)
      .attr("x", x)
      .attr("y", y)
      .attr("ry", 5)

    .transition()
      .ease("linear")
      .duration(2000)
      .attr("x", -50)
      .remove()

    // barIndex = (barIndex + 1) % NUM_BARS;
  };

  var mouseX = frameWidth * 0.8;
  var mouseY = frameHeight / 2;
  var percent = 1;
  var down = false;
  var clickAndReleased = false;
  var fadeOutCounter = 0;
  var fadeInCounter = 0;
  var fadeOut;

  $(document).on("mousemove", function(e) {
    mouseX = e.pageX - $('#main-frame').offset().left;
    mouseY = e.pageY - $('#main-frame').offset().top;

    mainSVG.select('#nyan-cat').attr("y", snappyTransition(mouseY) - 50)
      .attr("x", mouseX - 50);

    // percent = (mainSVG.select('circle').attr("cx") - lowerLimit)/(upperLimit - lowerLimit);
    setCurrentNote(mouseY);
  });


  function snappyTransition(y) {
    var noteAreaHeight = (frameHeight / 12);

    for (var i = 1; i <= 12; i++) {
      if (y <= noteAreaHeight * i) {
        return noteAreaHeight / 2 * (2 * i - 1);
      }
    }
  }

  function setCurrentNote(y) {
    currentNote = Math.round(-1 * ((y - circleRadius) / (frameHeight / 12) - 12));
  }

  $(document).on('mousedown', function(e) {
    down = true;
    fadeInCounter = 0;
  });

  // $(document).on('keydown', function(e){
  //    if (e.keyCode === 32){
  //     down = true;
  //   }
  // });

  $(document).on('mouseup', function(e) {
    down = false;
    clickAndReleased = true;
    fadeOutCounter = 10;
    // console.log("released")
  });

  // $(document).on('keyup', function(e){
  //    if (e.keyCode === 32){
  //       down = false;
  //       clickAndReleased = true;
  //       fadeOutCounter = 10;
  //       console.log("")
  //   }
  // });


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

    generateTrail(mouseX - 50, mouseY - setBarHeight() / 2, setBarHeight());


    if (down) {}

    if (fadeOutCounter > 0) {
      fadeOutCounter -= 1;
    }

    if (fadeInCounter < 10) {
      fadeInCounter += 1;
    }

  }, 20);



  $('body').on('keydown', function(event) {
    // the keys are / Z X C V / A S D F / Q W E R /
    var keycodes = [90, 88, 67, 86, 65, 83, 68, 70, 81, 87, 69, 82];
    var noteAreaHeight = (frameHeight / 12);
    for (var i = 0; i <= 12; i++) {
      if (keycodes.indexOf(event.keyCode) === (-1 * (i - 12))) {
        mouseY = noteAreaHeight / 2 * (2 * i - 1);
        mainSVG.select('#nyan-cat').attr("y", mouseY - 50)
        down = true;
        fadeInCounter = 0;
      }
    }
  })

  $('body').on('keyup', function(event) {
    var keycodes = [90, 88, 67, 86, 65, 83, 68, 70, 81, 87, 69, 82];
    if (keycodes.indexOf(event.keyCode) != -1) {
      down = false;
      clickAndReleased = true;
      fadeOutCounter = 10;
    }
  })


  /* =============== space shit ================== */

  // var ctx = c.getContext("2d");
  var stars = [];
  var initialStars = 50;
  var n = initialStars;
  var incrementStars = 5;
  var maxSize = 5;
  // mouse = false,
  var i;

  var secondFrameWidth = document.getElementById('second-frame').clientWidth;
  var secondFrameHeight = document.getElementById('second-frame').clientHeight;

  var secondSVG = d3.select("#second-frame")
    .append("svg")
    .attr("width", secondFrameWidth)
    .attr("height", secondFrameHeight)


  function init() {
    for (i = 0; i < initialStars; i++) {
      stars.push({
        x: Math.floor(Math.random() * secondFrameWidth),
        y: Math.floor(Math.random() * secondFrameHeight),
        size: Math.random() * maxSize,
        speed: undefined
      });
    }

    draw();
  }



  function draw() {
    // ctx.clearRect(0,0,c.width,c.height);
    // $("#mainFrame").empty();
    // svg.selectAll("*").remove();

    secondSVG.selectAll("*").remove();
    for (var i = 0; i < n; i++) {
      star = stars[i];
      secondSVG.append("circle")
        // .style("stroke", "none" )
        .style("fill", "white")
        .attr("r", star.size / 2)
        .attr("cx", star.x)
        .attr("cy", star.y)


    }
  }


  function update() {
    for (var i = 0; i < n; i++) {
      star = stars[i];
      star.speed = star.size;

      // if (mouse)
      //   star.x-=star.speed*10;
      // else
      star.x -= star.speed;

      if (star.x < 0) {
        // delete star;
        // console.log("must delete!!");
        // secondSVG.select('circle')
        star.x += secondFrameWidth;
      }
    }
  }


  function createNewStars() {
    // n+=incrementStars;
    // console.log(n);
    for (var i = 0; i < incrementStars; i++) {
      stars.push({
        x: +Math.floor(Math.random() * secondFrameWidth),
        y: Math.floor(Math.random() * secondFrameHeight),
        size: Math.random() * maxSize,
        speed: undefined
      });
    }
  }


  function main() {
    draw();
    update();
    requestAnimationFrame(main);
  }

  setInterval(createNewStars, 500);
  init();
  main();



});
