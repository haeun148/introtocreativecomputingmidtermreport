var incX = 0.02;
var incY = 0.05;
var distance=20;
var wavesHeight = 300;
let seedNum;
let noiseImg;


let looping = true;
var frame = 0;

var m = 0;
var n;
let mic, fft, spectrum; 
var amp;
var volhistory = [];

let img;

function preload(){
  img = loadImage('earth.png');
}

function setup() {
  
  textAlign(CENTER, CENTER);
  frameRate(20);
  createCanvas(windowWidth, windowHeight);
 n= windowHeight;
  angleMode(DEGREES);
  amp = new p5.Amplitude();
 mic = new p5.AudioIn(); 
 mic.start(); 
   fft = new p5.FFT();
  fft.setInput(mic);
  
  noiseImg = createGraphics(windowWidth, height);
  noiseImg.noStroke();
  noiseImg.fill(0);
  for(let i = 0; i < width * height * 0.3; i++)
  {
    let x = random(width);
    let y = random(height);
    let d = noise(0.01 * x , 0.01 * y) * 0.5 + 1;
    noiseImg.ellipse(x, y, d, d);
  }
  
  ellipseMode(CENTER);
  seedNum = int(random(10000));
}

function draw() {
  var vol = mic.getLevel();
   cc = map(vol,0,1,30,400);
  
    fft.analyze();
  const center = fft.getCentroid();
  
  if(frameCount % 40 == 0){
    randomSeed();
  } 
  randomSeed(seedNum);
  background(0,120);
  noStroke();
    
  fill(cc*2);
  cloud(-random(100),height/1.5 - height * 0.2, height * 0.3); //맨뒤구름
  image(noiseImg, 0, - height * 0.09);
  image(noiseImg, 0, - height * 0.1);
  cloud(0, height/1.2 ,height * 0.225); //중간구름
    image(noiseImg, 0, 0);
  
  if (center < 50 || center > 2000){
    spectrum = 20;
  }
  else{
    spectrum =map(center, 50, 2000, 50, 165);
  }
  
    var zOff = looping? frameCount * 0.01: frame*0.01;
  noFill();
  sw =map(center, 50, 2000, 0.5, 2.5);
  strokeWeight(sw);
  stroke(150,spectrum);
  var yOff = 0;
  for (var y1 = -wavesHeight ; y1 < height+wavesHeight; y1+=distance){
    var xOff = 0;
    beginShape();
    for (var x1 = -wavesHeight; x1 < width; x1 +=distance) {
      var n1 = noise(xOff, yOff,zOff);
       var value = map(n1,0,1,-wavesHeight,wavesHeight);
      curveVertex(x1, y1+value);
      xOff+=incX;
    }
    endShape();
    yOff+=incY;
  }

    volhistory.push(vol);
  stroke(205);
  fill(0,200);

  strokeWeight( 1.5);
    translate(width/2,height/2);
    beginShape();
    for (let i = 0; i <360; i++) {
      let r = map(volhistory[i], 0, 1, 160, 1400);
      let x = r * cos(i);
      let y = r * sin(i);
      
      vertex(x,y);
    }
    endShape();
    if (volhistory.length > 360){
      volhistory.splice(0,1);
    }
  
  image(img, -157.5,-157.5, 315, 315);
  
  noStroke();
  fill(0);
  rect(width/2-50,-height/2, 50, height);
  
  fill(255);
  textSize(18);
  let msg = 'LET US NOT TAKE THIS PLANET FOR GRANTED';
  for(i=0; i<textWidth(msg); i++){
    text(msg[i],width/2-25,-height/2+30+20*i);
  }

}

function cloud(noiseOff, baseY, maxOff)
{
  let x = -maxOff;
  beginShape();
  while(x < width + maxOff)
  {
      let yOffset = noise(x * 0.01 + frameCount /200 + noiseOff, baseY) * maxOff;
      let y = baseY - yOffset;
      let dia = (noise(x * 0.01, baseY * 0.01)  + 0.1)* (maxOff);
      ellipse(x, y, dia, dia);
      vertex(x, y);
      x += dia * 0.35;
  }
  vertex(width, baseY);
  vertex(width, height);
  vertex(0, height);
  vertex(0, baseY);
  endShape(CLOSE);

}
