//I couldn't figure out how to use a custom mapbox style with a mapbox map.
//I always got an unkonwn error when using my token and a custom style.
//After a long troubleshooting i tried to load mapbox without Mappa.js and managed to get the style to work,
//but i still wanted to use Mappa.js because it's much more easy to use.
//At the end i found a workaround to load the Mapbox style with a Leaflet map.


var myMap;
var canvas;
var mappa = new Mappa('Leaflet'); //loading leaflet map
var position; //user geo location
var step = 1;
var you; //user webcam capture
var myArray=[-1,1];

function preload() {
  position = getCurrentPosition();
  redx = loadImage('./assets/redx.png');
  scroll = loadImage('./assets/scroll.png');
}

// L.mapbox.accessToken = 'pk.eyJ1Ijoic3RlZmVycm85NyIsImEiOiJjazU0OGJmb3EwNDF3M21wNWExMGd6YWhkIn0.WC7fwaVH6_71tm2RVUllaQ';
// var myMap = L.mapbox.map('map')
//     .setView([0, 0], 9)
//     .addLayer(L.mapbox.styleLayer('mapbox://styles/steferro97/ck53z857j8iuh1cqldmo0jjkp'));


var options = {
  lat: 0,
  lng: 0,
  zoom: 6,
  style: "https://api.mapbox.com/styles/v1/steferro97/ck53z857j8iuh1cqldmo0jjkp/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3RlZmVycm85NyIsImEiOiJjazU0OGJmb3EwNDF3M21wNWExMGd6YWhkIn0.WC7fwaVH6_71tm2RVUllaQ",
}

var posizioneUno; //
var posizioneDue;
var posizioneTre;

var pointOne;
var pointTwo;
var pointThree;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  options.lat = position.latitude;
  options.lng = position.longitude;

  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
  myMap.onChange(drawPoint); //update the map only wen the map is moved
  canvas.mouseClicked(check);
  you = createCapture(VIDEO);
  you.size(windowWidth/3.5, windowWidth/4.5);
  you.hide();

  imageMode(CENTER);

  //First mark on the map appear in a random position in an area around the user position
  posizioneUno = {
    lat: (position.latitude + random(myArray)*random(3, 4)),
    lng: (position.longitude + random(myArray)*random(3, 4))
  }
  //Second mark is closer to user position
  posizioneDue = {
    lat: (position.latitude + random(myArray)*random(2, 3)),
    lng: (position.longitude + random(myArray)*random(2, 3))
  }
  //User position
  posizioneTre = {
    lat: (position.latitude),
    lng: (position.longitude)
  }

  textFont('Caveat');
  textAlign(CENTER);
  textSize(windowWidth/15);
}

//Check if marks are clicked and goes to the next step
function check() {
  console.log(step);
  if (step == 1) {
    if (mouseX > ((pointOne.x) - 30) && mouseX < ((pointOne.x) + 30) && mouseY > ((pointOne.y) - 30) && mouseY < ((pointOne.y) + 30)) {
      step = 2;
      drawPointTwo();
    }
  } else if (step == 2) {
    if (mouseX > ((pointTwo.x) - 30) && mouseX < ((pointTwo.x) + 30) && mouseY > ((pointTwo.y) - 30) && mouseY < ((pointTwo.y) + 30)) {
      step = 3;
      drawPointThree();
    }
  } else if (step == 3) {
    if (mouseX > ((pointThree.x) - 30) && mouseX < ((pointThree.x) + 30) && mouseY > ((pointThree.y) - 30) && mouseY < ((pointThree.y) + 30)) {
      step = 4;
      drawPoint();
    }
  }
}

function drawPoint() {
  clear();

  pointOne = myMap.latLngToPixel(posizioneUno.lat, posizioneUno.lng);
  var puntoUno = image(redx, pointOne.x, pointOne.y, 50, 50);

  if (step > 1) {
    drawPointTwo();
  }

  textFont('Caveat');
  textAlign(CENTER);
  textSize(windowWidth/15);

  if(step<4){
    noStroke();
    text('Find the treasure!',windowWidth/2,120);
  }
}

function drawPointTwo() {
  stroke('black');
  strokeWeight(4);

  pointTwo = myMap.latLngToPixel(posizioneDue.lat, posizioneDue.lng);

  drawingContext.setLineDash([10, 5]);
  line(pointOne.x, pointOne.y, pointTwo.x, pointTwo.y);

  var puntoDue = image(redx, pointTwo.x, pointTwo.y, 50, 50);

  if (step > 2) {
    drawPointThree();
  }
}

function drawPointThree() {
  stroke('black');
  strokeWeight(4);

  pointThree = myMap.latLngToPixel(posizioneTre.lat, posizioneTre.lng);

  drawingContext.setLineDash([10, 5]);
  line(pointTwo.x, pointTwo.y, pointThree.x, pointThree.y);

  var puntoTre = image(redx, pointThree.x, pointThree.y, 50, 50);
}


function draw() {
  if (step > 3) {
    clear();
    noStroke();
    var treasure = image(scroll, windowWidth/2, windowHeight/2, windowWidth*0.8, windowWidth*0.56);
    image(you,windowWidth/2,(windowHeight/2)+windowWidth/16,windowWidth/3.5, windowWidth/4.5);
    text('You are a treasure!',windowWidth/2,(windowHeight/2)-windowWidth/13);
  }
}
