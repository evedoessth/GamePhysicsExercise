/* template GTAT2 Game Technology & Interactive Systems */

/* Eve Schütze 4.Übung 25.10.2021*/


//TODO:when ball gets to p1 switch to different beta, len, s and 
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
var nullXShape = canvasWidth;
var nullYShape = canvasHeight*0.8;
let resetButton;
let startButton;
var Vreal = 2; //Geschwindigkeit m/s
var V0;
var vxBall;

var nullX = canvasWidth*0.898; //The point where the golfball lies at the start
var nullY = canvasHeight*0.7  //Upper limit of the flat ground.

var M;
var G;
var flagPole;
var flag;
var water;

var rBall = 0.16;
var dBall = 0.32;

var sBall;
var vBall;
var grav = 9.81;
var gStrich = [];
var beta;
var beta_arr = [];
var len = [];
var x0;



var t;
var dt;
var fr;
var x;

var move;
var gridX,gridY, grid, buttonHeight,buttonWidth

gridX = canvasWidth/100.0;                       // GridX = 1% Fensterbreite 
gridY = canvasHeight/100.0;                      // GridY = 1% Fensterhöhe
grid = Math.sqrt(gridX*gridY);
buttonWidth = 10*gridX;                    // Buttonbreite 9% Fensterbreite
buttonHeight = 6*grid; 

P = [
    [2.5,0],              
    [-3.5,0],       
    [-6.7,-1.5],     
    [-9.8,0],       
    //Waterpit
    [-11.2,0],     
    //grass
    [-13.3,0],      
    [-16.4,0],     
    //Sandhill
    [-17,0],        
    [-19.1,0],      
    [-22.1,-3]
];

for(let i = 0; i<P.length-1; i++){
  let be = Math.atan2(P[i][1]-P[i+1][1],P[i][0]-P[i+1][0]);
  beta_arr.push(be);
}
for(let j = 0; j<beta_arr.length; j++) {
  let gs = grav * Math.sin(beta_arr[j]);
  gStrich.push(gs);
}

for(let k = 0; k<P.length-1;k++){
  let l = Math.sqrt(Math.pow(P[k][0]-P[k+1][0],2)+ Math.pow(P[k][1]-P[k+1][1],2));
  len.push(l);
}
console.log(gStrich);
console.log(beta_arr);


function setup() {							/* here are program-essentials to put */
  createCanvas(windowWidth, windowHeight);
  
  background(199, 243, 252);
  
  
  x = 0;
  t = 0;
  
  move = false;
  V0 = Vreal;
  vxBall = V0;
  fr = 60;
  frameRate(fr);
  dt = 1.0 / fr;
  

  


}


function draw() {							/* here is the dynamic part to put */
	/* administrative work */
  background(199, 243, 252);
  M = (0.2036*canvasWidth)/5;
  
  x0=nullX;
   //to control changes in the width of the model
	/* calculations */

  switch(status) {
    case "1.plane":
    case "1.slope": 

  }

	beta = Math.atan2(calcSectLength(2,1));
  calcGStrich(beta);
  /*if(move) {
    t = t + dt;
    x = x-V0 * dt;
    if(s < than len of 1st plane) {
      
        
        sBall = 0;
        vBall = vxBall;
      
    }
  } */
  if(move) {
    t = t + dt;
    x = x-V0 * dt;
    if(x <= -3.5*M) {
      x = -3.5*M;
      move = false;
      t = 0;
    
    }
  }
  

	/* display */
  
  push();
     
    translate(nullX,nullY);
    drawPlayGround();
  pop();  
    


  // calculate beta, g' and length with the formulas
  // v=v*g'*dt
  //s=s*vs*dt

  //Ball
  push();
    translate(nullX,nullY);
    ball();
    /*push();
      translate(P[1][0],(P[1][1] - rBall)*M);
      rotate(beta);
       
          
          
    pop();*/
  pop();

  push();
    drawButtons();
  pop();
  //--------------------------------------------------------------------------------------------------------------------------
  
}

function moveBall() {
  move = true;
}

function calcGStrich(angle) {
  gStrich = grav * Math.sin(angle);
}

function ball() {
  noStroke();
  fill(golfBallColour);
  circle(x*M, -rBall*M, dBall*M);
}

function addBetaToArray() {
  beta_arr[0]=Math.atan2(Math.hypot(P[1][0]-P[0][0], P[1][1], P[0][1]));
}


function calcSectLength (Point1, Point2) {  
    return Math.hypot(P[Point2][0]-P[Point1][0], P[Point2][1], P[Point1][1]);
}


function windowResized() {					/* responsive part */
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  resizeCanvas(windowWidth, windowHeight);
}
