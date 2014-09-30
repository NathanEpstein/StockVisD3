//define global variables
var canvasWidth = 550;
var canvasHeight = 250;
var xPad = 50;
var yPad = 50;
var counter = 24; //initialized to have 2 years of returns in past
var speed = 500;
var binNum = 7;
var running = true;
var bars;
var renderPoint;

//define menu button functions
var pause = function(){
  running = false;
}
var speedUp = function(){
  if (speed > 100){
    speed -= 100;
  }
}
var slowDown = function(){
  if (speed < 1000){
    speed += 100
  }
}
var play = function(){
  pause();
  bars.remove();
  running = true;
  renderPoint(counter);
}

  d3.csv('/resources/S&P.csv', function(file){


  // set parameters for canvas and axes
  var heightScale = d3.scale.linear()
                    .domain([24,0])
                    .range([0,canvasHeight - yPad]);

  var widthScale = d3.scale.linear()
                  .domain([-0.3, 0.7])
                  .range([0,canvasWidth - xPad]);

  var xAxis = d3.svg.axis()
              .scale(widthScale)
              .orient('bottom');

  var yAxis = d3.svg.axis()
              .scale(heightScale)
              .orient('left');

  var canvas = d3.select('#hist').append('svg')
      .attr('width', canvasWidth)
      .attr('class', 'axis')
      //.attr('class', 'jumbotron')
      .attr('height', 350);

  var canvas2 = d3.select('#plot').append('svg')
        .attr('width', canvasWidth)
        .attr('class', 'axis')
        //.attr('class', 'jumbotron')
        .attr('height', 350);


  var xLabel = canvas.append("text")
              .attr("class", "x label")
              .attr("text-anchor", "end")
              .attr("x", 375)
              .attr("y", 275)
              .text("S&P 500 Percentage Returns");

  var yLabel = canvas.append("text")
              .attr("class", "y label")
              .attr("text-anchor", "end")
              .attr("y", 9)
              .attr('x', -100)
              // .attr("dy", "100")
              .attr("transform", "rotate(-90)")
              .text("Frequency");

  //CANVAS TRANSLATIONS DO NOT ADJUST DYNAMICALLY
  //PADDING: 25PX ABOVE AND BELOW AXES, 50PX ON THE LEFT
  canvas.append('g')
    .attr('transform', 'translate(50,225)')
    .call(xAxis);

  canvas.append('g')
    .attr('transform', 'translate(50,25)')
    .call(yAxis);

  //timeline stuff here
  //
  // var scrub = d3.select('#timeline')
  //               //.attr('class', 'jumbotron')
  //               .attr('id', "timeline");


  var context = [
      { 'name': 'Panic of 1907', 'start': 1906, 'end': 1907},
      { 'name': 'World War 1', 'start': 1914, 'end': 1918 },
      { 'name': 'Great Depression', 'start': 1929, 'end': 1932},
      { 'name': 'World War 2', 'start': 1939, 'end': 1945  },
      { 'name': 'Oil Crisis', 'start': 1972, 'end': 1974 },
      { 'name': '1987 Crash', 'start': 1987, 'end': 1987 },
      { 'name': 'Dotcom Bubble', 'start': 2000, 'end': 2002 },
      { 'name': 'Great Recession', 'start': 2007, 'end': 2009},
      { 'name': 'Start', 'start': 1873, 'end': 2014 },
    ];

  var tl = new timeline("timeline", context);
  tl.draw();

  var events = d3.select('timeline-event timeline-event-item');



  // define functions for use within renderPoint
  var months = ['January','February','March','April', 'May', 'June','July','August', 'September', 'October', 'November', 'December'];
  var parseDate = function(dateNum){
    dateNum = Number(dateNum.replace(',',''));
    var month = months[Math.round((Number(dateNum) % 1)/0.01) - 1];
    var year = Math.floor(Number(dateNum));
    return (month+', '+year);
  }

  var xMap = function(x){
    return (50 + (x + 0.3)*500) ;
  }

  var yMap = function(y){
    return (y*200/24);
  }

  var base = function(y){
    return (225 - yMap(y))
  }

  var getWidth = function(max, min){
    return ((xMap(max) - xMap(min))/(binNum))*(0.95)
  }

  var getColor = function(num){
    if(num < 1){
      return 'OrangeRed';
    }
    else{
      return "SteelBlue"
    }
  }

  var average = function(arr){
    if (arr.length == 0){
      return 0;
    }
    var sum = 0;
    for (var k=0; k<arr.length;k++){
      sum += arr[k];
    }
    return (sum/arr.length);
  }

  renderPoint = function(i){
    var data = [];
    var ret = 1;

    for (var j=0; j<24; j++){
      data.push(file[i-j]);
      ret = ret * (1 + Number(file[i-j]['Return']));
    }

  var mapFun = data.map(function(x){
    var datum = Number(x['Return'].replace(',',''));
    return datum;
  });

    var date = file[i]['Date'];
    var price = file[i]['S&P Price'];

    $('#date').html(parseDate(date));
    $('h2').html(Number(price.replace(',','')).toFixed(2));


    var hist = d3.layout.histogram()
      .bins(binNum)
      (mapFun);

    bars = canvas.selectAll('.bar')
      .data(hist)
      .enter()
      .append('g');

    var min = hist[0][0];
    var max = hist[binNum - 1][hist[binNum - 1].length - 1];


    //UPDATE PLOT CANVAS HERE

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
                  .text("S&P 500 Trailing 24 Months: "+date);

    var yLabel2 = canvas.append("text")
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




    //END OF PLOT CANVAS UPDATE

    bars.append('rect')
      .attr('x', function(d){return xMap(d.x);})
      .attr('y', function(d){return base(d.y)})
      .attr('width', function(d){return d.dx*500*(0.95);})
      .attr('height', function(d){return yMap(d.y);})
      .attr('fill', getColor(ret));


    //recursion for animation
    // setTimeout(function(){
    //   if (running && (i+1 < file.length)){
    //     bars.remove();
    //     counter++;
    //     renderPoint(i+1);
    //   }
    // }, speed)
  }
  renderPoint(counter);
});