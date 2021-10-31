/* template GTAT2 Game Technology & Interactive Systems */

/* Eve Schütze 4.Übung 25.10.2021*/
//TODO: Add Text to Buttons 
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
var nullXShape = canvasWidth;
var nullYShape = canvasHeight*0.8;
let resetButton;
let startButton;
var V0 = 36; //Geschwindigkeit m/s
var nullX;
var nullY;
var M;
var G;
var flagPole;
var flag;
var water;

var x0;

var beta;
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
]



function setup() {							/* here are program-essentials to put */
  createCanvas(windowWidth, windowHeight);
  
  background(199, 243, 252);
  
  nullX = displayWidth*0.898; //The point where the golfball lies at the start
  nullY = canvasHeight*0.7  //Upper limit of the flat ground. 
  x0=nullX;
  x = 0;
  t = 0;
  
  move = false;

  fr = 60;
  frameRate(fr);
  dt = 1.0 / fr;

  


}


function draw() {							/* here is the dynamic part to put */
	/* administrative work */
  background(199, 243, 252);
  M = (0.2036*canvasWidth)/5;
   //to control changes in the width of the model
	/* calculations */
	beta = Math.atan2(calcSectLength(2,1));
  
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

  //Ball
  push();
    ball();    
  pop();

  push();
    drawButtons();
  pop();
  //--------------------------------------------------------------------------------------------------------------------------
  
}

function moveBall() {
  move = true;
}

function ball() {
  translate(nullX,nullY + (-0.16*M));
  noStroke();
  fill(golfBallColour);
  circle(x, 0, 0.32*M);
}


function calcSectLength (Point1, Point2) {  
    return Math.hypot(P[Point2][0]-P[Point1][0], P[Point2][1], P[Point1][1]);
}


function windowResized() {					/* responsive part */
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  resizeCanvas(windowWidth, windowHeight);
}
