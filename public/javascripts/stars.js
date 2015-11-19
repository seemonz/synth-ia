$(function(){ 
  var secondFrameWidth = document.getElementById('second-frame').clientWidth;
  var secondFrameHeight = document.getElementById('second-frame').clientHeight;
  var stars = [];
  var initialStars = 50;
  var maxSize = 5;

  var secondSVG = d3.select("#second-frame")
      .append("svg")
      .attr("width", secondFrameWidth)
      .attr("height", secondFrameHeight)

  function initializeStars() {
    for (var i = 0; i < initialStars; i++) {
      stars.push({
        x: Math.floor(Math.random() * secondFrameWidth),
        y: Math.floor(Math.random() * secondFrameHeight),
        size: Math.random() * maxSize,
        speed: undefined
      });
    }
  }

  function erase(){
    secondSVG.selectAll("*").remove();
  }

  function draw() {
    stars.forEach(function(star){
      secondSVG.append("circle")
        .style("fill", "white")
        .attr("r", star.size / 2)
        .attr("cx", star.x)
        .attr("cy", star.y)
    });
  }

  function update() {
    stars.forEach(function(star){
      star.speed = star.size;
      star.x -= star.speed;
      if (star.x < 0) {
        star.x += secondFrameWidth;
      }
    });
  }

  function moveStars() {
    erase();
    draw();
    update();
    requestAnimationFrame(moveStars);
  }

  initializeStars();  
  moveStars();
}) 