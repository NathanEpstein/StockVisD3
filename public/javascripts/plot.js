//TO DO
// 2) make timeline draggable/clickable
// 3) make timeline size responsive
// 4) show date on timeline

// inside the update function

var priceArray = [];
for (var m=0; m<24; m++){
  priceArray.push(file[m-24+i]['S&P Price']);
}

var heightScale2 = d3.scale.linear()
                    .domain([max+Math.abs(max)*0.25,min-Math.abs(min)*0.25])
                    .range([0,canvasHeight - yPad]);

var widthScale2 = d3.scale.linear()
                .domain([-23,0])
                .range([0,canvasWidth - xPad]);

var xAxis2 = d3.svg.axis()
            .scale(widthScale2)
            .orient('bottom');

var yAxis2 = d3.svg.axis()
            .scale(heightScale2)
            .orient('left');


var xLabel2 = canvas2.append("text")
              .attr("class", "x label")
              .attr("text-anchor", "end")
              .attr("x", 375)
              .attr("y", 275)
              .text("S&P 500 Trailing 24 Months: "+parseDate(date));

var yLabel2 = canvas2.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 9)
            .attr('x', -100)
            // .attr("dy", "100")
            .attr("transform", "rotate(-90)")
            .text("Price");

canvas2.append('g')
    .attr('transform', 'translate(50,225)')
    .call(xAxis2);

canvas2.append('g')
    .attr('transform', 'translate(50,25)')
    .call(yAxis2);


//AXES DEFINED ABOVE





