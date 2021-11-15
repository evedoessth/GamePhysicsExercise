/* template GTAT2 Game Technology & Interactive Systems */

/* Eve Schütze 5.Übung 08.11.2021*/
//Done with help by Laura Unverzagt (State Machine and change to different state) 


//TODO:when ball gets to p1 switch to different beta, len_arr, s and 
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
var nullXShape = canvasWidth;
var nullYShape = canvasHeight*0.8;
let resetButton;
let startButton;
var state;
 

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
var xBall, yBall;
var xBall0;
var vxBall, vyBall;
var vx0Ball = 2; //Geschwindigkeit m/s
var vy0Ball = 0;

var G_CONSTANT = 9.81;
var gStrich = [];
var grav;
var beta = 0, beta_arr = [];
var len = 0, len_arr = [];


var t;
var dt;
var timeScale;
var fr;
var s;

var START, INIT;
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



function setup() {							/* here are program-essentials to put */
  createCanvas(windowWidth, windowHeight);
  state = "start";
  background(199, 243, 252);
  xBall = 0;
  yBall = dBall/2;
  
  s = 0;
  t = 0;
  
  START = false;
  vBall = vx0Ball;
  fr = 60;
  frameRate(fr);
  timeScale = 1.0;
  dt = 0;

  for(let i = 1; i<P.length-1; i++){
    beta_arr[i] = Math.atan2(P[i+1][1]-P[i][1],P[i+1][0]-P[i][0]);
    gStrich[i] = G_CONSTANT * Math.sin(beta_arr[i]);
    len_arr[i] = Math.sqrt(Math.pow(P[i+1][1]-P[i][1],2)+ Math.pow(P[i+1][0]-P[i+1][0],2));
    //len_arr.push(l);
    console.log(i+" beta: "+degrees(beta_arr[i])+"° l: "+len_arr[i]);
  }
  beta_arr[0] = Math.PI;											// Neigungswinkel 1. plane
	len_arr[0] = Math.sqrt(Math.pow(P[1][1]-N[1],2) + Math.pow(P[1][0]-N[0],2));		// Länge 1. plane
	gStrich[0] = 0;
	console.log(0+" beta: "+degrees(beta_arr[0])+"° l: "+len_arr[0]);


}


function draw() {							/* here is the dynamic part to put */
	/* administrative work */
  background(199, 243, 252);
  M = (0.2036*canvasWidth)/5;
  
  
   //to control changes in the width of the model
	/* calculations */
  if(START) {

    beta = beta_arr[0];
    len = len_arr[0];
    Point = N;  
    if(INIT) {
      INIT = false;
      START = false;
      xBall = 0;							// Startlage Golfball
			yBall = dBall/2;
      vxBall = vx0Ball;					// Startgeschwindigkeit setzen
      vyBall = 0;
      t = 0; 
    }
  }
  else {
    
    grav = gStrich[0];
    if(state == "start") {
                    state = "1.plane";
                    s = 0;
                    vs = Math.abs(vxBall);
                    Point = N;
    }
    switch(state) {
      case "1.plane": 
                    if (len_arr[0] > s && xBall <= P[0][0])
                    {	// Ortsberechnung
                      grav = gStrich[0];
                      beta = beta_arr[0];
                      len = len_arr[0];
                      xBall0 = N[0];
                      console.log("1.plane");		
                    }
                  else
                    {	// Übergang 1.plane -> 1.slope
                      state = "1.slope";				// Status ändern
                      console.log("goto 1.slope");
                      s = 0;							// Weg rücksetzen
                      xBall0 = P[1][0];				// für calculation
                      beta = beta_arr[1];				// für calculation & display
                      len = len_arr[1];
                      Point = P[1];					// für display
                    }

                  if(xBall >= P[0][0])					// Endbedingung rechter Rand
                    {
                      state = "end";
                      dt = 0;							// Stop
                      beta = Math.PI;
                      len = len_arr[0];
                      Point = P[0];
                      xBall0 = P[0][0];
                      s = 0;
                      //console.log("*"+P[0][0]);
                    } 
                  break;
      case "1.slope": 
                  if(len_i[0] > s && xBall <= P[0][0]){
                    grav = gStrich[1];
                    beta = beta_arr[1];
                    len = len_arr[1];
                    xBall0 = P[1][0];
                  }
                  else  {
                    if (s >= len_arr[1])
                      {	// Übergang 1.slope -> 2.slope
                        state = "2.slope";
                        //console.log("goto 2.slope"+" "+len_i[2]);
                        s = 0;
                        beta = beta_arr[2];
                        len = len_arr[2];
                        Point = P[2];
                        xBall0 = P[2][0];
                        break;
                      }
                    if (s <= 0) 
                      {	// Übergang 1.slope -> 1.plane
                        state = "1.plane";
                        console.log("goto 1.plane");
                        s = len_arr[0];
                        beta = PI;
                        len = len_arr[0];
                        xBall0 = N[0];
                        Point = N;
                      }
                    }
                      break;
                      
      case "2.plane":		
                  if (len_i[3] > s) {	// Ortsberechnung
                      grav = gStrich[3];
                      beta = beta_arr[3];
                      len = len_arr[3];
                      xBall0 = P[3][0];
                      console.log("2.plane");		
                  }
                  else {	// Ende im Wasser
                      state = "water";				// Status ändern
                      console.log("in water");
                      s = 0;							// Weg rücksetzen
                      xBall0 = P[3][0];
                      dt = 0;
                  }
                    break;
    }
      
    switch (state)															// Berechnung ausführen
              {
                case "1.plane":
                case "1.slope":
                case "2.slope":
                case "2.plane":
                case "3.plane":
                case "4.plane":
                case "3.slope": 	
                          vBall = vBall + grav * dt;							
                          s = s + vBall * dt;
                          xBall = xBall0 + s * cos(beta);
                          yBall = s * sin(beta);
                          break;
              }
    t = t + dt;
  }
  


	/* display */
  
  push();
     
    translate(nullX,nullY);
    drawPlayGround();
  pop();  
    


  

  //Ball
  push();
    translate(nullX,nullY);
    scale(1, -1);
    push();
      translate(x0,y0);
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
  START = true;
  INIT = true;
  state = "start";
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
  
  text('yBall*M: ' + yBall*M,100,170);
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
