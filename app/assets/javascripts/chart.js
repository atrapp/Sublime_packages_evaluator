// *********************************
// *****   global variables   ******
// *********************************

var svg;

var svgBubbleChart;
var svgBubbleChartRadius;
var svgBarChart;

var width = 480;
var height = 480;

// ***************************
// *****   build svg's   *****
// ***************************

function buildSvg() {
  svg = d3.select('#d3bubblechart')
  // svg = d3.select('#d3bubblechartradius')
  // svg = d3.select('#d3barchart')
      .append('svg')
        .attr('width', width)
        .attr('height', height);       
}

function buildSvgBubbleChart() {
  svgBubbleChart = d3.select('#d3bubblechart')
      .append('svg')
        .attr('width', width)
        .attr('height', height);  
  // svgBubbleChart = d3.select('#d3bubblechart');        
}

function buildSvgBubbleChartRadius() {
  
  svgBubbleChartRadius = d3.select('#d3bubblechartradius')
      .append('svg')
        .attr('width', width)
        .attr('height', height);  
  // svgBubbleChartRadius = d3.select('#d3bubblechartradius');
}

function buildSvgPieChart() {
  
  svgPieChart = d3.select('#d3piechart')
      .append('svg')
        .attr('width', width)
        .attr('height', height);  
  // svgBubbleChartRadius = d3.select('#d3bubblechartradius');
}


function buildSvgBarChart() {
  
  svgBarChart = d3.select('#d3barchart')
      .append('svg')
        .attr('width', width)
        .attr('height', height); 
  // svgBarChart = d3.select('#d3barchart');       
}

// ****************************
// *****   remove svg's   *****
// ****************************

function removeSvg() {
  d3.select('svg') 
      .remove();
}

function removeSvgBubbleChart() {      
  d3.select('svgBubbleChart') 
      .remove();
}

function removeSvgBubbleChartRadius() {
  d3.select('svgBubbleChartRadius')
      .remove();
}

function removeSvgBarChart() {
  d3.select('svgBarChart')
      .remove();  
}


// ********************************************
// *****   Bubble Chart with equally sized 
// *****   for better display of information  
// ********************************************

function bubbleChart() {

  var div = d3.select("#d3bubblechart").append("div")
      .attr("class", "tooltip")
          .style("opacity", 0);

  var force = d3.layout.force()
      .charge(0)
      .gravity(0.05)
      .nodes(packages)
      .size([width-50, height-50]);

  force.start();

  var elemEnter = svg.selectAll("g")     
      .data(packages)   
          .enter().append("g")

  elemEnter.append("circle")     
      .attr("r", function(d) { return radius = 35; })

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
  
  elemEnter.append('text')
      .text(function(d){ return d.name.slice(0,10); })
      .style('font-size', '10px');     

  force.on("tick", function(e) {
    var q = d3.geom.quadtree(packages),
        i = 0,
        n = packages.length;

    while (++i < n) {     
      q.visit(collide(packages[i]));      
    }

    svg.selectAll("circle")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    svg.selectAll("text")
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

  // svg.selectAll('g').data(packages).exit().remove();

}



function bubbleChart2() {

  var div = d3.select("#d3bubblechart").append("div")
      .attr("class", "tooltip")
          .style("opacity", 0);

  var force = d3.layout.force()
      .charge(0)
      .gravity(0.05)
      .nodes(packages)
      .size([width-50, height-50]);

  force.start();

  var elemEnter = svgBubbleChart.selectAll("g")     
      .data(packages)   
          .enter().append("g").attr('class','bubble')

  elemEnter.append("circle")     
      .attr("r", function(d) { return radius = 35; })

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
  
  elemEnter.append('text')
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

    // svgBubbleChart.selectAll('g').data(packages).exit().remove();

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

  svgBubbleChart.selectAll('g').data(packages).exit().remove();

}


// ********************************************
// *****   Bubble Chart by Radius for  
// *****   showing popularity by installs  
// ********************************************

function bubbleChartRadius2() {

  var div = d3.select("#d3bubblechartradius").append("div")
      .attr("class", "tooltip")
          .style("opacity", 0);

  var force = d3.layout.force()
      .charge(0)
      .gravity(0.05)
      .nodes(packages)
      .size([width-50, height-50]);

  force.start();

  var elemEnter = svgBubbleChartRadius.selectAll("g")     
      .data(packages)   
          .enter().append("g").attr('class','bubbleR')

  elemEnter.append("circle")     
      .attr("r", function(d) { return d.unique_installs/1000; })

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
  
  elemEnter.append('text')
      .text(function(d){ 

        if (d.unique_installs > 30000) {
          return d.name; 
        } else
        {
          return ''; //d.installs_rank;
        };
      })
      .style('font-size', '10px');         

  force.on("tick", function(e) {
    var q = d3.geom.quadtree(packages),
        i = 0,
        n = packages.length;

    while (++i < n) {
      q.visit(collide(packages[i]));      
    }

    svgBubbleChartRadius.selectAll("circle")
            .data(packages)
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    svgBubbleChartRadius.selectAll("text")
            .data(packages)
        .attr("dx", function(d) { return d.x-25; })
        .attr("dy", function(d) { return d.y; });



    // svgBubbleChartRadius.selectAll('g').data(packages).exit().remove();
  });

  function collide(node) {
   
    var r = node.unique_installs/100, 
        nx1 = node.x - r,
        nx2 = node.x + r,
        ny1 = node.y - r,
        ny2 = node.y + r;
    return function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== node)) {
        var x = node.x - quad.point.x,
            y = node.y - quad.point.y,
            l = Math.sqrt(x * x + y * y)
            r = node.unique_installs/1000 + quad.point.unique_installs/1000;          
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

  svgBubbleChartRadius.selectAll('g').data(packages).exit().remove();

}



function bubbleChartRadius() {

  var div = d3.select("#d3bubblechartradius").append("div")
      .attr("class", "tooltip")
          .style("opacity", 0);

  var force = d3.layout.force()
      .charge(0)
      .gravity(0.05)
      .nodes(packages)
      .size([width-50, height-50]);

  force.start();

  var elemEnter = svg.selectAll("g")     
      .data(packages)   
          .enter().append("g")

  elemEnter.append("circle")     
      .attr("r", function(d) { return d.unique_installs/1000; })

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
  
  elemEnter.append('text')
      .text(function(d){ 

        if (d.unique_installs > 30000) {
          return d.name; 
        } else
        {
          return ''; //d.installs_rank;
        };
      })
      .style('font-size', '10px');         

  force.on("tick", function(e) {
    var q = d3.geom.quadtree(packages),
        i = 0,
        n = packages.length;

    while (++i < n) {
      q.visit(collide(packages[i]));      
    }

    svg.selectAll("circle")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    svg.selectAll("text")
        .attr("dx", function(d) { return d.x-25; })
        .attr("dy", function(d) { return d.y; });


  });

  function collide(node) {
   
    var r = node.unique_installs/100, 
        nx1 = node.x - r,
        nx2 = node.x + r,
        ny1 = node.y - r,
        ny2 = node.y + r;
    return function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== node)) {
        var x = node.x - quad.point.x,
            y = node.y - quad.point.y,
            l = Math.sqrt(x * x + y * y)
            r = node.unique_installs/1000 + quad.point.unique_installs/1000;          
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

}


// // ********************************************
// // *****   Bar Chart for packages 
// // *****   showing popularity by installs  
// // ********************************************

// // bars are HORIZONTAL AND COLORED
// // -------------------------------
// function barChart2() {

//   var div = d3.select("#d3barchart").append("div")
//       .attr("class", "tooltip")
//           .style("opacity", 0);

//   var barHeight = 17;

//   var x = d3.scale.linear()
//       .domain([0, 25])
//       .range([0, width]);

//   var bar = svg.selectAll("g")
//       .data(packages)
//          .enter().append("g")
//             .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

//   bar.append("rect")
//       .attr("width", function(d) { return d.unique_installs/100; })
//       .attr("height", barHeight - 1)
//       .attr("class", "bar")

//       .style("fill", function(d, i) { 
//           switch (true) {
//             case (d.unique_installs > 2000000): 
//               color = "red";           
//               break;
//             case (d.unique_installs <= 2000000 && d.unique_installs > 100000):
//               color = "#ff7070"; // light red           
//               break;
//             case (d.unique_installs <= 100000 && d.unique_installs > 10000):
//               color = "blue";        
//               break;
//             case (d.unique_installs <= 10000 && d.unique_installs > 5000):
//               color = "steelblue";         
//               break;
//             case (d.unique_installs <= 5000 && d.unique_installs > 1000):
//               color = "lightblue";         
//               break;
//             case (d.unique_installs <= 1000 && d.unique_installs > 500):
//               color = "orange";         
//               break;             
//             default:
//              color = "#fc6"; // light orange        
//           }
//         return color;
//       })

//       .on("mouseover", function(d) {
//           div.transition()        
//               .duration(200)      
//               .style("opacity", .9);           
//           div.html( d.name + "<br />Rank: " + d.installs_rank + "<br />Installs: " + d.unique_installs)  
//               .style("left", (d3.event.pageX) + "px")     
//               .style("top", (d3.event.pageY - 28) + "px");    
//           })   

//       .on("mouseout", function(d) {       
//           div.transition()        
//               .duration(500)      
//               .style("opacity", 0);   
//           });  

// }

// bars are VERTICAL (upside down) WITH ONE COLOR
// ----------------------------------------------
function barChart() {

  var div = d3.select("#d3barchart").append("div")
      .attr("class", "tooltip")
          .style("opacity", 0);

  var barWidth = 17;

  var y = d3.scale.linear()
      .domain([0, 25])
      .range([width, 0]);

  var bar = svg.selectAll("g")
      .data(packages)
         .enter().append("g")
            .attr("transform", function(d, i) { return "translate(" + i * barWidth + ", 0)"; });

  bar.append("rect")      
      .attr("height", function(d) { return d.unique_installs/100; })
      .attr("width", barWidth - 1)
      .attr("class", "bar")

      // .style("fill", function(d, i) { 
      //     switch (true) {
      //       case (d.unique_installs > 2000000): 
      //         color = "red";           
      //         break;
      //       case (d.unique_installs <= 2000000 && d.unique_installs > 100000):
      //         color = "#ff7070"; // light red           
      //         break;
      //       case (d.unique_installs <= 100000 && d.unique_installs > 10000):
      //         color = "blue";        
      //         break;
      //       case (d.unique_installs <= 10000 && d.unique_installs > 5000):
      //         color = "steelblue";         
      //         break;
      //       case (d.unique_installs <= 5000 && d.unique_installs > 1000):
      //         color = "lightblue";         
      //         break;
      //       case (d.unique_installs <= 1000 && d.unique_installs > 500):
      //         color = "orange";         
      //         break;             
      //       default:
      //        color = "#fc6"; // light orange        
      //     }
      //   return color;
      // })

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
}



// bars are VERTICAL (upside down) WITH ONE COLOR
// ----------------------------------------------
function barChart2() {

  var div = d3.select("#d3barchart").append("div")
      .attr("class", "tooltip")
          .style("opacity", 0);

  var barWidth = 17;

  var y = d3.scale.linear()
      .domain([0, 25])
      .range([width, 0]);

  var elemEnter = svgBarChart.selectAll("g")
      .data(packages)
         .enter().append("g")
            .attr("transform", function(d, i) { return "translate(" + i * barWidth + ", 0)"; });

  elemEnter.append("rect")      
      .attr("height", function(d) { return d.unique_installs/100; })
      .attr("width", barWidth - 1)
      .attr("class", "bar")

      // .style("fill", function(d, i) { 
      //     switch (true) {
      //       case (d.unique_installs > 2000000): 
      //         color = "red";           
      //         break;
      //       case (d.unique_installs <= 2000000 && d.unique_installs > 100000):
      //         color = "#ff7070"; // light red           
      //         break;
      //       case (d.unique_installs <= 100000 && d.unique_installs > 10000):
      //         color = "blue";        
      //         break;
      //       case (d.unique_installs <= 10000 && d.unique_installs > 5000):
      //         color = "steelblue";         
      //         break;
      //       case (d.unique_installs <= 5000 && d.unique_installs > 1000):
      //         color = "lightblue";         
      //         break;
      //       case (d.unique_installs <= 1000 && d.unique_installs > 500):
      //         color = "orange";         
      //         break;             
      //       default:
      //        color = "#fc6"; // light orange        
      //     }
      //   return color;
      // })

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

  svgBarChart.selectAll('g').data(packages).exit().remove();
}



// ----------------------------------------------

function pieChart() {


  var div = d3.select("#d3piechart").append("div")
      .attr("class", "tooltip")
          .style("opacity", 0);

// var div = d3.select("body").append("div")
//     .style("position", "absolute")
//     .style("text-align", "center")
//     .style("width", "240px")
//     .style("height", "2.5em")
//     .style("font", "1.5em sans-serif")
//     .style("color", "yellow")
//     .style("pointer-events", "none")
//     .style("background", "black")
//     .style("border-radius", "8px")
//     .style("border", "solid 1px green")
//     .style("opacity", 0);



  // var data = [ {amount: 10, color: "red"}, {amount: 20, color: "green"}, {amount: 5, color: "blue"}];
  var data = packages;
  var color = d3.scale.category20c();

  var arc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(200);

  var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.unique_installs; });




  var chart = svgPieChart.append("g")
        .attr("transform", "translate(250,250)");

  var arcGs = chart.selectAll(".arc")
        .data(pie(data))
     .enter().append("g");

 

  arcGs.append("path")
        .attr("d", arc)
        .style("fill", function(d, i) { return color(i); })
        
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




}
