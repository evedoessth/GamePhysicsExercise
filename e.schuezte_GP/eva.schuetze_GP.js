/* template GTAT2 Game Technology & Interactive Systems */

/* Eve Schütze 4.Übung 25.10.2021*/
//TODO: Add Text to Buttons
//TODO: Fix speed on normal
//TODO: Put buttons 
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
var x0Shape = canvasWidth;
var y0Shape = canvasHeight*0.8;
let resetButton;
let startButton;
var V0 = 36; //Geschwindigkeit m/s
var x0;
var y0;
var M;
var G;
var flagPole;
var flag;
var water;


var t;
var dt;
var fr;
var x;

var move;




function setup() {							/* here are program-essentials to put */
  createCanvas(windowWidth, windowHeight);
  
  background(199, 243, 252);
  
  x0 = displayWidth*0.898; //The point where the golfball lies at the start
  y0 = canvasHeight*0.7  //Upper limit of the flat ground. 
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
    translate(x0,y0);
    drawPlayGround();
    
  pop();  

  //Ball
  push();
    ball();    
  pop();

  push();
  translate(0,0.85*canvasHeight);
    stroke(outlineColour);
    strokeWeight(4);
    push();
      fill("red");    
      rect(0.5*M, 0, 3*M, 1.2*M,20);
    pop();
    push();
      fill("lightgreen");
      rect((0.8*canvasWidth), 0, 3*M, 1.2*M,20);
    pop();

    if(mouseIsPressed){
      if(mouseX >= 0.5*M && mouseX <= 3.5*M &&
         mouseY >= 0 && mouseY <= 1.2*M ){
           setup();
         }

      if(mouseX >= 21*M && mouseX <= 24.5*M &&
        mouseY >= 0 && mouseY <= 1.2 ){
          moveBall();
      }
    }
  pop();
  //--------------------------------------------------------------------------------------------------------------------------
  
}

function moveBall() {
  move = true;
}

function ball() {
  translate(x0,y0+ (-0.16*M));
  noStroke();
  fill(golfBallColour);
  circle(x, 0, 0.32*M);
}
function windowResized() {					/* responsive part */
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  resizeCanvas(windowWidth, windowHeight);
}
