// *********************************
// *****   global variables   ******
// *********************************

var svg;

var svgBubbleChart;
var svgPieChart;
var svgBarChart;

var width = 480;
var height = 420;


// ***************************
// *****   build svg's   *****
// ***************************

function buildSvgBubbleChart() {
  svgBubbleChart = d3.select('#d3bubblechart')
      .append('svg')
        .attr('width', width)
        .attr('height', height)        
        .style('margin', "10px");
}

function buildSvgPieChart() {  
  svgPieChart = d3.select('#d3piechart')
      .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('margin', "0 10px");
}

function buildSvgBarChart() {  
  svgBarChart = d3.select('#d3barchart')
      .append('svg')
        .attr('width', width)
        .attr('height', height)        
        .style('margin', "0 10px");   
}


// // ****************************
// // *****   remove svg's   *****
// // ****************************

// function removeSvgBubbleChart() {      
//   d3.select('svgBubbleChart') 
//       .remove();
// }

// function removeSvgPieChart() {
//   d3.select('svgPieChart')
//       .remove();
// }

// function removeSvgBarChart() {
//   d3.select('svgBarChart')
//       .remove();  
// }


// ***************************
// *****   bubbleChart   ***** 
// ***************************

function bubbleChart() {

  var updateSelection = svgBubbleChart.selectAll("g").data(packages);
  var enterSelection = updateSelection.enter();
  var enterUpdateSelection = enterSelection.append("g").attr('class','bubble');
  var exitSelection = svgBubbleChart.selectAll('g').data(packages).exit();

  var div = d3.select("#d3bubblechart").append("div")
      .attr("class", "tooltip")
          .style("opacity", 0);

  var force = d3.layout.force()
      .charge(0)
      .gravity(0.05)
      .nodes(packages)
      .size([width-50, height-50]);

  force.start();

  enterUpdateSelection
      .append("circle")         
          .attr("r", function(d) { return radius = 35; });

  enterUpdateSelection
      .append("text");       


  updateSelection.select("circle")  
      .style("fill", function(d, i) {       
          switch (true) {
            case (d.unique_installs > 2000000): 
              color = "red";           
              break;
            case (d.unique_installs <= 2000000 && d.unique_installs > 100000):
              color = "#ff7070"; // light red           
              break;
            case (d.unique_installs <= 100000 && d.unique_installs > 10000):
              color = "blue";        
              break;
            case (d.unique_installs <= 10000 && d.unique_installs > 5000):
              color = "steelblue";         
              break;
            case (d.unique_installs <= 5000 && d.unique_installs > 1000):
              color = "lightblue";         
              break;
            case (d.unique_installs <= 1000 && d.unique_installs > 500):
              color = "orange";         
              break;             
            default:
             color = "#fc6"; // light orange        
          }
        return color;
      })
          
      .on("mouseover", function(d) {      
          div.transition()        
              .duration(200)      
              .style("opacity", .9);           
          div.html( d.name + "<br />Rank: " + d.installs_rank + "<br />Installs: " + d.unique_installs)  
              .style("left", (d3.event.pageX) + "px")     
              .style("top", (d3.event.pageY - 28) + "px");    
          })   

      .on("mouseout", function(d) {       
          div.transition()        
              .duration(500)      
              .style("opacity", 0);   
          });
  
  updateSelection.select("text")
      .text(function(d){ return d.name.slice(0,10); })
      .style('font-size', '10px');     


  force.on("tick", function(e) {
    var q = d3.geom.quadtree(packages),
        i = 0,
        n = packages.length;

    while (++i < n) {     
      q.visit(collide(packages[i]));      
    }

    svgBubbleChart.selectAll("circle")
        .data(packages)
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    svgBubbleChart.selectAll("text")   
        .data(packages)
        .attr("dx", function(d) { return d.x-25; })
        .attr("dy", function(d) { return d.y; }); 
  });

  function collide(node) {
          
    var r = radius + (radius+1),
        nx1 = node.x - r,
        nx2 = node.x + r,
        ny1 = node.y - r,
        ny2 = node.y + r;        
    return function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== node)) {
        var x = node.x - quad.point.x,
            y = node.y - quad.point.y,
            l = Math.sqrt(x * x + y * y);         
        if (l < r) {
          l = (l - r) / l * .5;
          node.x -= x *= l;
          node.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2
          || x2 < nx1
          || y1 > ny2
          || y2 < ny1;
    };
  }

  exitSelection.remove();
}


// ************************
// *****   pieChart   *****
// ************************

function pieChart() {

  var div = d3.select("#d3piechart").append("div")
      .attr("class", "tooltip")
          .style("opacity", 0);
  
  var arc = d3.svg.arc()
      .innerRadius(0)
      .outerRadius(200);

  var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d.unique_installs; });     

  var chart = svgPieChart.append("g")
      .attr("transform", "translate(250,210)");

  var arcGs = chart.selectAll(".arc")
      .data(pie(packages))
          .enter().append("g");

  arcGs.append("path")
        .attr("d", arc)        
        .style("stroke", "white")
        .style("stroke-width", 1)
        .style("fill", function(d, i) {       
          switch (true) {           
            case (d.data.unique_installs > 2000000): 
              color = "red";           
              break;
            case (d.data.unique_installs <= 2000000 && d.data.unique_installs > 100000):
              color = "#ff7070"; // light red           
              break;
            case (d.data.unique_installs <= 100000 && d.data.unique_installs > 10000):
              color = "blue";        
              break;
            case (d.data.unique_installs <= 10000 && d.data.unique_installs > 5000):
              color = "steelblue";         
              break;
            case (d.data.unique_installs <= 5000 && d.data.unique_installs > 1000):
              color = "lightblue";         
              break;
            case (d.data.unique_installs <= 1000 && d.data.unique_installs > 500):
              color = "orange";         
              break;             
            default:
             color = "#fc6"; // light orange        
          }
        return color;
        });

  function mouseover(d) {
      div.transition()        
          .duration(200)      
          .style("opacity", .9);
      div.html( d.data.name + "<br />Rank: " + d.data.installs_rank + "<br />Installs: " + d.data.unique_installs)  
          .style("left", (d3.event.pageX) + "px")     
          .style("top", (d3.event.pageY - 28) + "px"); 
  }

  function mouseout() {
      div.transition()        
          .duration(500)      
          .style("opacity", 0);  
  }

  d3.selectAll("g")
      .on("mouseover", mouseover)
      .on("mouseout",  mouseout);

}


// ************************
// *****   barChart   *****
// ************************

function barChart() {

  var updateSelection = svgBarChart.selectAll("rect").data(packages);
  var enterSelection = updateSelection.enter();
  var enterUpdateSelection = enterSelection.append("rect").attr('class','bar');
  var exitSelection = svgBarChart.selectAll('rect').data(packages).exit();

  var div = d3.select("#d3barchart").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  var barWidth = width/packages.length;

  updateSelection     
      .attr("x", function (d, i) { return i * barWidth; })
      .attr("y", function (d, i) { return height - (d.unique_installs/100); })
      .attr("width", barWidth-1)
      .attr("height", function(d) { return d.unique_installs/100; })
      .style("fill", function(d, i) {        
          switch (true) {
            case (d.unique_installs > 2000000): 
              color = "red";           
              break;
            case (d.unique_installs <= 2000000 && d.unique_installs > 100000):
              color = "#ff7070"; // light red           
              break;
            case (d.unique_installs <= 100000 && d.unique_installs > 10000):
              color = "blue";        
              break;
            case (d.unique_installs <= 10000 && d.unique_installs > 5000):
              color = "steelblue";         
              break;
            case (d.unique_installs <= 5000 && d.unique_installs > 1000):
              color = "lightblue";         
              break;
            case (d.unique_installs <= 1000 && d.unique_installs > 500):
              color = "orange";         
              break;             
            default:
             color = "#fc6"; // light orange        
          }
        return color;
      })
          
      .on("mouseover", function(d) {      
          div.transition()        
              .duration(200)      
              .style("opacity", .9);           
          div.html( d.name + "<br />Rank: " + d.installs_rank + "<br />Installs: " + d.unique_installs)  
              .style("left", (d3.event.pageX) + "px")     
              .style("top", (d3.event.pageY - 28) + "px");    
          })   

      .on("mouseout", function(d) {       
          div.transition()        
              .duration(500)      
              .style("opacity", 0);   
          });

  exitSelection.remove();  

}
