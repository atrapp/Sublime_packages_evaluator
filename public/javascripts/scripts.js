// *********************************
// *****   global variables   ******
// *********************************

var timer;
var svg;
var data = [];

// starting position for drawing circles and lines
var xPos = 45;
var yPos = 0;
var xLPos = 45;

// *************************
// *****   build svg   *****
// *************************

function buildSvg(){
  
  svg = d3.select('body')
      .append('svg')
        .attr('width', '100%')
        .attr('height', '75%')  
        .style('border', '1px solid black');
}

// *************************
// *****   draw path   *****
// *************************

function drawPath(data){
 
  var elem = svg.selectAll('g')
        .data(data)
          .append('g')

  // creates the line for the path
  var lineFunction = d3.svg.line()
        .x(function(d) { return xLPos += 25; })
        .y(function(d) { return (100-(d.days/11))+350; })                        
        .interpolate("linear");

  // d contains a series of path descriptions to draw the graph
  var lineGraph = svg.append('path')
        .attr("d", lineFunction(data)); 
}

// ***************************
// *****   draw circle   *****
// ***************************

function drawCircle(data){
 
  var elem = svg.selectAll('g')
        .data(data)

  // creates an element 'elemEnter' for each president to combine circle and text
  var elemEnter = elem.enter()
        .append('g')

  // creates a circle for each president, all same size but y-pos dependent on days 
  var circle = elemEnter.append('circle')         
        .attr('r', function(d){ return 10; })
        .attr('cx', function(d){ return xPos += 25; })        
        .attr('cy', function(d){ return (100-(d.days/11))+350; }) 

  // creates an invisible tooltip (div) for each circle, which appears on mouseover/mousemove event 
  var div = d3.select("body").append("div")
        .attr("class", "tooltip")
          .style("opacity", 0);

  // creates a text for each presindent, with appears together with the circle
  elemEnter.append('text')
        .transition()
          .duration(500) 
            .attr('dx', function(d){ return xPos-5; })        
            .attr('dy', function(d){ return (100-(d.days/11))+330; })
            .text(function(d){ return d.start ; })
              .style('font-size', '10px');

  // on mouseover the tooltip (div) appears
  elemEnter.select("circle").on("mouseover", function(d) {
        div.transition()
          .duration(300)
            .style('opacity', 1)
        circle.transition()
          .duration(300)
            .attr('r', function(d){ return 15; })
            .style('fill', 'blue');
  });

  // on mousemove information about the president will be shown
  elemEnter.select("circle").on("mousemove", function(d) {
    var imgName = d.name + ".jpg";
    var imgPath = "../images/" + imgName; 

    div
      // mouse position relative to the left and top of the circle 
      .style("left", (d3.event.pageX - 40) + "px")
      .style("top", (d3.event.pageY + 20) + "px")
      .html("<img src=" + imgPath + " /><p>" + d.name + "</br>" + d.days +" days</p>");
    
    // once the mouse is over a circle it changes its color to blue and display info
    // in the textfield at the bottom   
    // elemEnter.style('fill', 'blue');              
    $p.html("President " + d.name + ", " + d.days + " days in office, " + d.start + " - " + d.end);
  });

  // on mouseout the tooltip (div) disappears
  elemEnter.select("circle").on("mouseout", function(d) {
        div.transition()
          .duration(500)
            .style("opacity", 0)
        circle.transition()
          .duration(300)
            .attr('r', function(d){ return 10; })
            .style('fill', 'black');        
  });

  // on mouse click the element 'elemEnter' (circle and text) will be removed from the graph
  elemEnter.on("click", function(d) {  
      elemEnter.remove()   
  });

  // unneeded elements will be removed from the svg
  svg.selectAll('elem')
    .data(data)
      .exit()
      .remove()
}

// ****************************
// *****   Load them up   *****
// ****************************

window.onload = function(){
  $header3 = $('<h3>');
  $header3.html("Presidents of the United States");
  $('body').append($header3); 

  buildSvg();
  // draw a graph based on the days in office (y-pos)
  drawPath(presidents);
  // display one president after the other as a circle w/text on the graph
  timer = setInterval(function(){
    var president = presidents.shift() // first president in array
    data.push(president); 
    drawCircle(data);
    if (presidents.length === 0) window.clearInterval(timer); // stop timer
  }, 10);   

  $div = $('<div>'); 
  $p = $('<p>').addClass('infotext').html("mouse over on circle to display info about president / mouse click on circle to remove president from graph");
  $div.append($p);
  $p = $('<p>').addClass('infobox').html("info about president appears here");
  $div.append($p);
  $('body').append($div);
}


