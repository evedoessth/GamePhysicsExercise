//Colours//////////////////////////////////////////////////////////////////////////////////////////////////////////
var waterColour = [99, 198, 247];
var groundColour = [252, 151, 56];
var outlineColour = [35, 121, 161];
var grassColour = [55, 184, 94];
var golfBallColour = [245, 145, 127];
var sandColour = [255, 226, 138];
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var N = [0, 0];								// Nullpunkt
var Point = [0, 0];	          // variabler Punkt

G = [ 
    [2.5,1.4],      //0
    [2.5,0],        //1
    //grass        
    [-3.5,0],       //2
    [-6.7,-1.5],    //3 
    [-9.8,0],       //4
    //Waterpit
    [-11.2,0],      //5
    [-11.4,1],      //6
    [-13.1,1],      //7
    //grass
    [-13.3,0],      //8
    [-16.4,0],      //9
    //Pit
    [-16.4,0.8],    //10
    [-17,0.8],      //11
    //Sandhill
    [-17,0],        //12
    [-19.1,0],      //13
    [-22.1,-3],     //14
    [-22.1,1.4]     //15
  ];

  
  flagPole = [
    [-17.55,0],
    [-17.55,-4.1]
  ];
  
  flag = [
    [-17.55,-4.1],
    [-17.55,-3.4],
    [-19.3,-3.8]
  ];
  
  water = [
    [-11,0.2],
    [-11,1],
    [-13.5,1],
    [-13.5,0.2]
  ];

  



function drawPlayGround(){
    strokeWeight(2);
    stroke(outlineColour);
    fill(groundColour);
    //////////////////////////////////////////////////////////////////////////////////////////////
    //Flag
    push();
    
      stroke(0,0,0);
      strokeWeight(4);
      beginShape();
        for(var i = 0; i <= 1; i++) {
          vertex(flagPole[i][0]*M,flagPole[i][1]*M);
        }
      endShape();
    pop();
    push();
      fill(sandColour);
      stroke(outlineColour);
      beginShape();
        for(var i = 0; i <= 2; i++) {
          vertex(flag[i][0]*M,flag[i][1]*M);
        }
      endShape(CLOSE);
    pop();

    //Water
    push();
      fill(waterColour);
      beginShape();
        for(var i = 0; i <= 3; i++) {
          vertex(water[i][0]*M,water[i][1]*M);
        }
      endShape(CLOSE);
    pop();
    //////////////////////////////////////////////////////////////////////////////////////////////////////

    //Ground
    beginShape();
      for(var i = 0; i <= 15; i++) {
        vertex(G[i][0]*M,G[i][1]*M);
      }
  
    endShape(CLOSE);
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////
    
    push(); 
      noFill();
      strokeWeight(5);
      //Sand
      push();
        stroke(sandColour);
        beginShape();
          for(var i = 12;i <= 14; i++) {
            vertex(G[i][0]*M,G[i][1]*M);

          }
        endShape();
      pop();
      //Grass
      push();
        stroke(grassColour);
        beginShape();
          for(var i = 8;i <= 9; i++) {
            vertex(G[i][0]*M,G[i][1]*M);
          }
        endShape();
        beginShape();
          for(var i = 1;i <= 5; i++) {
            vertex(G[i][0]*M,G[i][1]*M);
          }
          
        endShape();
      pop();
    pop();
}

function drawButtons() {
  var resX = 2*gridX;
    var neX = 88*gridX;
    var paX = 45*gridX;
    var butY = 85*gridY;
    textAlign(CENTER, CENTER);
    textFont("Comic Sans MS");
    textSize(3*grid);
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
      fill("lightblue");    
      rect(paX, butY,buttonWidth, buttonHeight,20);
      noStroke()
      fill("white");
      text("Pause",paX + 0.5*buttonWidth,butY + 0.5*buttonHeight);
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

      if(mouseX >= paX && mouseX <= (paX)+buttonWidth &&
         mouseY >= butY && mouseY <= butY+buttonHeight ){
        move = false;
      }

      if(mouseX >= neX && mouseX <= neX+buttonWidth &&
      mouseY >= butY && mouseY <= butY+buttonHeight ){
        moveBall();
        
      }
    }
}