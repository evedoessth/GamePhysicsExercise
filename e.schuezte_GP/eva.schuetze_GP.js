/* template GTAT2 Game Technology & Interactive Systems */

/* Eve Schütze 4.Übung 25.10.2021*/
//TODO: Add Text to Buttons 
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
var gridX,gridY, grid, buttonHeight,buttonWidth

gridX = canvasWidth/100.0;                       // GridX = 1% Fensterbreite 
gridY = canvasHeight/100.0;                      // GridY = 1% Fensterhöhe
grid = Math.sqrt(gridX*gridY);
buttonWidth = 10*gridX;                    // Buttonbreite 9% Fensterbreite
buttonHeight = 6*grid; 



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
  var resX = 2*gridX;
  var neX = 88*gridX;
  var butY = 85*gridY;
    textAlign(CENTER, CENTER);
    textFont("Comic Sans MS");
    textSize(4*grid);
    stroke(outlineColour);
    strokeWeight(4);
    push();
      fill("red");    
      rect(resX, butY,buttonWidth, buttonHeight,20);
      noStroke()
      fill("white");
      text("Reset",resX + 0.5*buttonWidth,butY + 0.5*buttonHeight);
    pop();
    push();
      fill("lightgreen");
      rect(neX, butY,buttonWidth, buttonHeight,20);
      noStroke()
      fill("white");
      text("New",neX + 0.5*buttonWidth,butY + 0.5*buttonHeight);
    pop();

    if(mouseIsPressed){
      if(mouseX >= resX && mouseX <= (resX)+buttonWidth &&
         mouseY >= butY && mouseY <= butY+buttonHeight ){
        setup();
      }

      if(mouseX >= neX && mouseX <= neX+buttonWidth &&
      mouseY >= butY && mouseY <= butY+buttonHeight ){
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
