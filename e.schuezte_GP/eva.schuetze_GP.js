/* template GTAT2 Game Technology & Interactive Systems */

/* Eve Schütze 4.Übung 08.11.2021*/
//Done with help by Laura Unverzagt (State Machine and change to different state) 


//TODO:when ball gets to p1 switch to different beta, len_arr, s and 
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
var nullXShape = canvasWidth;
var nullYShape = canvasHeight*0.8;
let resetButton;
let startButton;
var state;

var Vreal = 2; //Geschwindigkeit m/s
var V0;
//var vxBall;

var nullX = canvasWidth*0.898; //The point where the golfball lies at the start
var nullY = canvasHeight*0.7  //Upper limit of the flat ground.

var x0 = 0;
var y0 = 0;

var M;
var G;
var flagPole;
var flag;
var water;

var rBall = 0.16;
var dBall = 0.32;
var vBall = 0;
var xBall;
var yBall;

var G_CONSTANT = 9.81;
var gStrich = [];
var grav;
var beta = 0, beta_arr = [];
var len = 0, len_arr = [];


var t;
var dt;
var fr;
var s;

var move;
var gridX, gridY, grid, buttonHeight,buttonWidth

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
  let gs = G_CONSTANT * Math.sin(beta_arr[j]);
  gStrich.push(gs);
}

for(let k = 0; k<P.length-1;k++){
  let l = Math.sqrt(Math.pow(P[k][0]-P[k+1][0],2)+ Math.pow(P[k][1]-P[k+1][1],2));
  len_arr.push(l);
}


function setup() {							/* here are program-essentials to put */
  createCanvas(windowWidth, windowHeight);
  state = "start";
  background(199, 243, 252);
  xBall = 0;
  yBall = 0;
  
  s = 0;
  t = 0;
  
  move = false;
  V0 = Vreal;
  //vxBall = V0;
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
  if(s<P[1][0]){
  console.log("1.slope");
    state = "1.slope";
    vBall = v;
    beta = beta_arr[1];
    x0 = P[1][0];
    y0 = P[1][1];
  }
  
  grav = gStrich[0];
  switch(state) {
    case "start" : 
                  beta = beta_arr[0];
                  x0 = xBall;
                  t = 0;
                  v = V0;
                  break;
    case "1.plane": 
                    beta = beta_arr[0];
                    if(move) {
                      
                      s = s-V0 * dt;
                    }
                    break;
    case "1.slope": 
                    vBall = vBall + grav * dt;
                    s = s + vBall * dt;
                    xBall = x0 - s* Math.cos(beta) - (0.5*dBall)*Math.sin(beta);
                    yBall = s * Math.sin(beta) - (0.5*dBall) * Math.cos(beta);
                    break;
                    
  }
  t = t + dt;

	/* display */
  
  push();
     
    translate(nullX,nullY);
    drawPlayGround();
  pop();  
    


  

  //Ball
  push();
    translate(nullX,nullY);
    
    push();
      translate(x0,(y0 +(0.5*rBall)*M));
      //translate(0,ball.y+(0.5*rBall)*M);
      rotate(beta_arr[0]);
      ball(); 
         
          
    pop();
  pop();

  push();
    drawButtons();
  pop();
  //--------------------------------------------------------------------------------------------------------------------------
  drawDebug()
}

function moveBall() {
  move = true;
  state = "1.plane";
}


function ball() {
  noStroke();
  fill(golfBallColour);
  circle(s*M, -rBall*M, dBall*M);
}

function drawDebug() {
  text('betaArray: ' + beta_arr,100,100);
  text('currentBeta: ' + beta, 100,125);
  text('xBall: ' + xBall,100,150);
  text('yBall: ' + yBall,100,160);
  text('stateMachine: ' + state,100,200);
  text('s: ' + s,100,210);
  text('x0: ' + x0,100,220);
  text('y0: ' + y0,100,230);
}

function windowResized() {					/* responsive part */
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  resizeCanvas(windowWidth, windowHeight);
}
