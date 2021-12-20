/* template GTAT2 Game Technology & Interactive Systems */

/* Eve Schütze 6.Übung 15.11.2021*/
//Done with help by Laura Unverzagt and Liz Kintzel (State Machine and change to different state ) 
//CR is my work


//TODO:when ball gets to p1 switch to different beta, len_arr, s and 
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
let resetButton;
let startButton;
 

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

var xBall, yBall;

var v0 = -1;
var v;
var vs = 0;
var vy;
var v0X, v0Y;
var grenzwert = 0.1;


var g = 9.81; 
var G_;
var cR =0.2;
var ground;
var beta = 0, beta_arr = [];
var sign = -1;


var t;
var dt;
var timeScale;
var fr;
var s;

	
var RESET, reset, START = false;
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
const states = {
  OFF: "off",
  PLANE_1: {
      TOL: "1. Ebene, to the left",
      TOR: "1. Ebene, to the right"
  },
  SLOPE_1: "1. schiefe Ebene",
  THROW: "schräger Wurf"

};
let state = states.OFF;


function setup() {							/* here are program-essentials to put */
  createCanvas(windowWidth, windowHeight);
  state = states.OFF;
  background(199, 243, 252);
  xBall = 0;
  yBall = dBall/2;
  x0 = 0;
  s = 0;
  t = 0;
  
  
  vs = v0;
  fr = 60;
  frameRate(fr);
  timeScale = 1.0;
  dt = timeScale/fr;

  beta_arr = [];
  for(let i = 0; i<P.length-1; i++){
    let x = P[i][1] - P[i+1][1];
    let y = P[i][0] - P[i+1][0];
    let be = Math.atan2(x,y);
    beta_arr.push(be);
    //console.log(be);
  }
  

}


function draw() {							/* here is the dynamic part to put */
	/* administrative work */
  background(199, 243, 252);
  M = (0.2036*canvasWidth)/5;
  
 
  if (state===states.PLANE_1.TOR && xBall>=P[0][0]) {
    state = states.OFF;
}
if (state===states.SLOPE_1 && xBall>=P[1][0]) {
      x0 = xBall;
      v = vs;
      ground = "grass";
    state = states.PLANE_1.TOR;
}
if (state===states.PLANE_1.TOL && xBall<=P[1][0]) {
    xBall = P[1][0];
    x0 = xBall;
		vs = v;
    ground = "grass";
    s=0;
    state = states.SLOPE_1;
}
if (state===states.SLOPE_1 && xBall<=P[2][0]) {
    x0=xBall;
    y0=yBall;
    vx = vs*Math.cos(beta);
    vy = vs*Math.sin(beta);
    vy = v0Y -g * dt;
    state = states.THROW;
}
if(abs(v)<grenzwert){ 
  state = states.OFF; 
  //console.log("heh");
}




switch (state) {
    case states.OFF: {
        x0 = xBall;
        v = v0;
        
        break;
    }
    case states.PLANE_1.TOL:
    case states.PLANE_1.TOR:{
        //console.log(state);
        beta = beta_arr[0];
        if (vs>0) sign = 1;
        G_ = gCalculation();
        v = v - G_ * dt;
			  s = s + v * dt;
			  xBall = x0 + s*Math.cos(beta) + rBall*Math.sin(beta);
			  yBall = P[0][1] + rBall;
        //console.log(G_);
        break;
        
    }
    case states.SLOPE_1: {
        //console.log(state);
        beta = beta_arr[1];
        xBall = x0;   
        if (vs>0) sign = 1;
        G_ = gCalculation();
        vs = vs + G_ * dt;
			  s = s + vs * dt;
			  xBall = x0 - s*Math.cos(beta)*dt + rBall*Math.sin(beta);	
			  yBall = s*Math.sin(beta)*dt + rBall*Math.cos(beta);  
        //console.log("s: " + s + " state: " + state + " beta: " + beta + " x: " + xBall + "y: " + yBall);
        break;
    }
    /*case states.THROW: {
        ballPos[0] = ballPos[0] + v0X * dt;
        vy = vy -g*dt;
        ballPos[1] = ballPos[1] + vy * dt;
        break;
    }*/
}
              


	/* display */
  
  push();
     
    translate(nullX,nullY);
    drawPlayGround();
  pop();  
    


  

  //Ball
  push();
    translate(nullX,nullY);
    
    push();
      translate(x0, y0);
      
      ball(); 
         
          
    pop();
  pop();

  push();
    drawButtons();
  pop();
  //--------------------------------------------------------------------------------------------------------------------------
  drawDebug()

}

function changeCR() {
  if(ground == "grass") {
    cR = 2.0;
  }
  else if (ground == "sand") {
    cR = 1.5;
  }
  else {
    cR = 0;
  }
  return cR;
}

function gCalculation() {
	let gStrich = sign * g * (Math.sin(beta) + cR*Math.cos(beta));			// sign / -1 für wenn auf horizontale, kein Plan was für schräge Ebene
	//console.log("sign: " + sign + " beta: " + beta + " cr: " + cR)
  return gStrich;
}
function ball() {
  
  noStroke();
  fill(golfBallColour);
  circle(xBall*M, -rBall*M, dBall*M);
}

function drawDebug() {
  text('betaArray: ' + beta_arr,100,100);
  text('currentBeta: ' + beta, 100,125);
  text('xBall: ' + xBall,100,150);
  text('yBall: ' + yBall,100,160);
  
  text('vBall: ' + -vs,100,170);
  text('stateMachine: ' + state,100,200);
  text('s: ' + s,100,210);
  text('x0: ' + x0,100,220);
  text('y0: ' + y0,100,230);
}
function newB(){
  // wtf JS???? lemme just compare a goddamn array
  if (xBall == 0) {
      state = states.PLANE_1.TOL;
  }
}

function windowResized() {					/* responsive part */
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  resizeCanvas(windowWidth, windowHeight);
}
