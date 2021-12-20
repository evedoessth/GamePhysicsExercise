/******************************* 9. Übung *******************************************/
/* Autor: Dr.-Ing. V. Naumburger	                                                */
/* Datum: 28.10.2021                                                                */
/************************************************************************************/

//Bearbeitet von Eve Schütze s0573682
//13.12.2021 


/*************************** Variablendeklaration ***********************************/
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;

var M;											// Maßstab
var xi0, yi0;                                	// Koordinatenursprung intern
var basicLength = 5;							// Grundlänge in [m]
var bodyHeight = 1.8;							// Körpergröße in [m]
var playgroundWidth = basicLength*23.9/16.9;	// Playgroundbreite in [m]

var x0, y0;										// Koordinatenursprung	
var frmRate = 60;      							// Screen-Refreshrate 
var t, dt;                						// Zeitvariable, Increment der Zeitv.
var timeScale = 0.1;
var g = -9.81;		// Erdbeschleunigungskonstante [m/s²], wirksame und aktuelle Erdbeschleunigungskonstante
var cR;							
var cW = 0.45;		//Strömungsbeiwert
var rho = 1.3;
var sign,sign0;

var s = 0, vs = 0;								// Weg, Weggeschwindigkeit

var xBall, yBall;								// Golfball
var dBall = 0.060;								// Balldurchmesser real: 3,2cm => 0.032m so 3,8cm => 0.038m
var mBall = 0.0025;								// Ballmasse 2,5g => 0,0025kg
var aBall= Math.PI * Math.pow((dBall/2),2);
var colorBall = "#76e8c2";	
var vxBall, vyBall;								// Ballgeschwindigkeit
var vx0Ball = -7.6; 							// Startgeschwindigkeit 300 km/h = 300/3,6 m/s
var vy0Ball = 0;			//5 km/h
var vWind = 0;


var vToGoal = -7.6; 
var vToWater =  -5.5;

var goalTicker ;
var totalTry = 1;
var xPutter, yPutter;							// Golfschläger (Putter)
var gammaPutter = 0;							// Winkel des Golfschlägers
var lengthPutter = 0.35*bodyHeight;
var dPutter = 0.1;								// Durchmesser Golfschläger real: 3,2cm => 0.032m
var colorPutter = "#aaaaaa";	

var NewTrial, newTrial = false;					// Push-Button ""neuer Versuch", Variable
var Reset, reset, START, INIT;					// Reset-Button, Variable, Start der Bewegungsberechnung
var Debug, debug, Next, next;					// Debugging Buttons


var status = "start";							// state-machine

var Putter, putter;								// Schläger, Maus sensibel

var flag = [
			[-5.2, 0],
			[-5.2,0.8],
			[-5.2,0.7],
			[-5.2,0.6]
];

function setup() {								/* prepare program */
  	createCanvas(windowWidth, windowHeight);
	evaluateConstants(90, 90);					// Erzeuge elementare Konstanten
	M = 0.85*canvasWidth/playgroundWidth; 		// dynamischer Maßstab
	
	xi0 = 25.0*canvasWidth/29.7;				// Koordinatenursprung (willkürlich gewählt)
	yi0 = 15.3*canvasHeight/21.0;

	frameRate(frmRate); 						// setzen der Bildwechselfrequenz
	timeScale = 1; //200/abs(vx0Ball*M);				// schnelle Bewegung
	
	// Objectdeclarations
	NewTrial = new PushButton(80, 90, "NEW", '#6ede54', true);		// xPos, yPos, onName, onColor, modus
	Reset = new PushButton(10, 90, "Reset", '#d93b3b', true);
	Debug = new ToggleButton(40, 90, "debug", '#6ede54', "run", '#d93b3b');						//xPos, yPos, onName, onColor, offName, offColor
	Next = new PushButton(50, 90, "next", '#6ede54', true);	
	
	START = true;
	INIT = false;
	goalTicker = 0;
	t = 0; 
	dt = 0;
	xPutter = 0;								// Startlage Putter bezügl. "0"
	yPutter = dPutter/2;
	radiusPutter = lengthPutter;
	xBall = 0, yBall = dBall/2;					// Startlage Golfball	
	vxBall = 0; vyBall = 0;						// Startgeschwindigkeit Golfball
	vWind = windRandomizer();
	changeFlagPos();
	
	for (var i = 1; i < P.length - 1; i++)		// Berechnung der Neigungswinkel und Längen der Geradenstücke
		{
			beta_i[i] = atan2((P[i+1][1]-P[i][1]), (P[i+1][0]-P[i][0]));		// Segmentwinkel bezgl. x-Achse
			len_i[i] = sqrt(sq(P[i+1][1]-P[i][1]) + sq(P[i+1][0]-P[i][0]));		// Segmentlänge
			g_i[i] = g*sin(beta_i[i]);											// gewichtete Gravitationskonstante
			//console.log(i+" beta: "+degrees(beta_i[i])+"° l: "+len_i[i]);
		}
	beta_i[0] = PI;											// Neigungswinkel 1. plane
	len_i[0] = sqrt(sq(P[1][1]-N[1]) + sq(P[1][0]-N[0]));		// Länge 1. plane
	g_i[0] = 0;
	//console.log(0+" beta: "+degrees(beta_i[0])+"° l: "+len_i[0]);
}

function draw() {
	background(255);							// Hintergrund: weiß
/* administration */
	push();
		textSize(2.5*fontSize);
		textAlign(CENTER);
		text("(9.) Das ultimative Golf-Spiel", 50*gridX, 10*gridY);
		textSize(1.5*fontSize);
		text("timeScale: "+timeScale, 50*gridX, 13*gridY);
		text("Erfolgszähler: "+ goalTicker + " / gesamte Versuche: " + totalTry, 50*gridX, 16*gridY);
		if(goalTicker == 1) {
			push();
				textSize(3*fontSize);
				textStyle(BOLD);
				fill("#ffde4d");
				stroke("#d41e11");
				strokeWeight(6);
				text("GOAL!", 50*gridX, 25*gridY);
			pop();
		}
		textSize(fontSize);
		text("t: "+nf(t,3,2), 10*gridX, 20*gridY);
		
	pop();
	
	newTrial = NewTrial.drawButton(true);				// NewTrial-Button Darstellen und auswerten
	if (newTrial) 
		{
			newTrial = false;							// Pushbutton
			START = true;
			INIT = true;
			status = "start";
		}

	reset = Reset.drawButton(true);
	if(reset)
		{
			reset = false;								// Pushbutton
			START = true;
			INIT = false;
			status = "start";
			goalTicker = 0;
			vWind = windRandomizer();				//change the Wind every time the reset button is pushed
			changeFlagPos();
			t = 0;
			dt = 0;
			s = 0;
			xBall = 0;									// Startlage Golfball
			yBall = dBall/2;
			console.log("reset has been done");
		}
		
	debug = Debug.drawButton();	
	next = Next.drawButton(debug);
			
	if(debug)
		{
			textSize(fontSize);
			text("status: "+status, 14*gridX, 20*gridY);
			text("s: "+nf(s,2,3) + "          vs: "+nf(vs,2,3), 14*gridX, 22*gridY);
			text("xBall: "+nf(xBall,2,3) + "     yBall: "+nf(yBall,2,3), 14*gridX, 24*gridY);
			text("\u03b2: "+nf(beta,3,0), 14*gridX, 26*gridY);
		}

/* calculation */
	
	
		if (START)
			{
				beta = PI;									// Startwerte für Darstellung setzen
				len = len_i[0];
				Point = N;
				if (INIT)									// Programm wird mit NEW-Button gestartet
					{
						INIT = false;
						START = false;
						t = 0;
						dt = timeScale/frmRate;				// Zeitincrement
						xBall = 0;							// Startlage Golfball
						yBall = dBall/2;
						vxBall = vx0Ball;					// Startgeschwindigkeit setzen
						vyBall = 0;
					}
			}
		else
			{
				if (next || !debug)
					{
						next = false;						// Schrittbetrieb
						if(status == "start")										
							{	// rollt der Ball oder fliegt der Ball nach dem Start?
								if (yBall <= dBall/2 && vyBall == 0)
									{
										status = "1.plane";					// Ball bleibt auf der Ebene
										s = 0;								// Anfangsbed. für calculation
										vs = abs(vxBall);
										Point = N;							// Anfangsbed. für display
										//console.log("start"+" "+xBall);
									}				
								else
									{
										status = "flight";					// Ball startet im schrägen Wurf
										//console.log("flight"+" "+xBall);
									}	
							}
							
						switch (status)										// Berechnung vorbereiten
							{					
								case "1.plane":		if (len_i[0] > s && xBall <= P[0][0])
														{	// Ortsberechnung
															sign = signChange(); 	//Es ist doppelt aber ohne funktioniert nix
															g_ = gCalculation("grass");
															beta = beta_i[0];
															len = len_i[0];
															xBall0 = N[0];
															console.log("1.plane");		
														}
													else
														{	// Übergang 1.plane -> 1.slope
															status = "1.slope";				// Status ändern
															console.log("goto 1.slope");
															s = 0;							// Weg rücksetzen
															xBall0 = P[1][0];				// für calculation
															beta = beta_i[1];				// für calculation & display
															len = len_i[1];
															Point = P[1];					// für display
														}

													if(xBall >= P[0][0])					// Endbedingung rechter Rand
														{
															status = "end";
															dt = 0;							// Stop
															beta = PI;
															len = len_i[0];
															Point = P[0];
															xBall0 = P[0][0];
															s = 0;
															//console.log("*"+P[0][0]);
														} 
													break;
								
								case "1.slope":		if (len_i[1] > s && s >= 0) 
														{	// Zeitfunktion berechnen
															g_ = gCalculation("grass");
															beta = beta_i[1];
															len = len_i[1];
															xBall0 = P[1][0];
															console.log("1.slope");		
														}
													else
														{
															if (s >= len_i[1])
																{	// Übergang 1.slope -> flight
																	status = "on flight";
																	console.log("goto flight ");
																	beta = beta_i[1];
																	xBall = xBall;								// Startbed. für Mittelpunkt (!) schrägen Wurf
																	yBall = yBall;	
																	vxBall = vs*cos(beta);
																	vyBall = vs*sin(beta);
																	break;
																}
															if (s <= 0) 
																{	// Übergang 1.slope -> 1.plane
																	status = "1.plane";
																	console.log("goto 1.plane");
																	s = len_i[0];
																	beta = PI;
																	len = len_i[0];
																	xBall0 = N[0];
																	Point = N;
																}
														}		
													break;
			
								case "2.slope":		if (len_i[2] > s && s >= 0) 
														{
															g_ = gCalculation("grass");
															beta = beta_i[2];
															len = len_i[2];
															xBall0 = P[2][0];
															console.log("2.slope");		
														}
													else
														{
															if (s >= len_i[2])
																{	// Übergang 2.slope -> 2.plane
																	status = "2.plane";
																	console.log("goto 2.plane"+" "+len_i[2]);
																	s = 0;
																	beta = beta_i[3];
																	len = len_i[3];
																	xBall0 = P[3][0];
																	Point = P[3];
																	break;
																}
															if (s <= 0) 
																{
																	status = "error";				// Fehler: Rückkehr auf die 1. slope ist nicht möglich!
																	console.log("error");
																	s = 0;
																	xBall0 = N[0];
																}
														}		
													break;

								case "2.plane":		if (len_i[3] > s)
														{	// Ortsberechnung
															g_ = gCalculation("grass");
															beta = beta_i[3];
															len = len_i[3];
															xBall0 = P[3][0];
															console.log("2.plane");		
														}
													else
														{	// Ende im Wasser
															status = "water";				// Status ändern
															console.log("in water");
															s = 0;							// Weg rücksetzen
															xBall0 = P[3][0];
															dt = 0;
														}
													break;
								
							}
			
						switch (status)															// Berechnung ausführen
							{
								case "1.plane":
								case "1.slope":
								case "2.slope":
								case "2.plane":
								case "3.plane":
								case "4.plane":
								case "3.slope": 	
													if(Math.abs(vs) <0.006 && (status == "1.plane" || status == "2.plane" || status == "3.plane" || status == "4.plane")) {
														vs = 0;
													}
													else {
													vs = vs + g_*dt;							// Wegberechnung für Rollbewegung
													console.log("vs: " + vs + ", abs(vs): " + Math.abs(vs));
													s = s + vs*dt;
													xBall = xBall0 + s*cos(beta)  - (0.5*dBall)*sin(beta) ;  // Ballmittelpunkt!!!
													yBall = s*sin(beta)  - (0.5*dBall)*cos(beta);
													}
													break;
								case "on flight":	
								//
													vyBall = vyBall + (g-((cW * rho * aBall)/(2*mBall))*Math.sqrt(Math.pow(vyBall,2)*Math.pow(vxBall-vWind,2))*vyBall) * dt;	// Wegberechnung Flug				
													vxBall = vxBall - (((cW * rho * aBall)/(2*mBall))*Math.sqrt(Math.pow(vyBall,2)*Math.pow(vxBall-vWind,2))*vxBall) * dt; 
													//console.log("Wind in berechnung: " + vWind*3.6);
													//console.log(cW +" "+ rho + " " + mBall);
													//vyBall = vyBall + g*dt;					
													yBall = yBall + vyBall*dt;
													xBall = xBall + vxBall*dt;
													
													break;
							}
							

						t = t + dt;		
													// Zeit incrementieren	
					}	
					if(yBall <= 0) {
						
						
						// -4.03 -3.87 -3.4
						if(P[5][0] < xBall && xBall < P[4][0]){
							//xBall = (P[5][0]+P[4][0])/2;
							//yBall = (G[6][1]+0.5*dBall);
							status = "water";
						}
						else if(P[7][0] < xBall && xBall < P[6][0]) {
							status = "hole";
							goalTicker = 1;
						}
						else {
							status = "fell through";
						}
					}
			}

	
/* display */
	push();
	translate(xi0, yi0);
	scale(1, -1);
		playGround();								// Playground darstellen						
		stroke(colorPutter);						// Golfschläger
		push();										// Golfer
		translate(0, (lengthPutter + dPutter/2)*M);				// Verschieben in Drehpunkt
		rotate(PI/10);
			noFill();								// Drehpunkt
			ellipse(0,0, 0.05*M);
			fill(colorPutter);
			push();
				translate(0, -lengthPutter*M);		// Verschieben aus dem Drehpunkt
				ellipse(0, 0, dPutter*M);
				strokeWeight(3);
				line(0, 0, 0, 0.7*lengthPutter*M);  // Schlägerlänge reduziert
			pop();		
		pop();

		switch (status)
			{
				case "start": 
				case "1.plane": 
				case "1.slope":
				case "2.slope": 
				case "2.plane":
				case "end": 		ballOnSlope(s, len, beta, Point);
									//console.log("on 3.slope");
									break;
				case "on flight":    ballOnFlight(xBall, yBall);
									break;
				case "water":		push();
										translate((P[4][0]+P[5][0])*M/2, (G[6][1]+0.5*dBall)*M);
										fill(colorBall);
										ellipse(0, 0, dBall*M);
									pop();
									break;
				case "hole":		push();
										translate((P[6][0]+P[7][0])*M/2, (G[10][1]+0.5*dBall)*M);
										fill(colorBall);
										ellipse(0,0,dBall*M);
									pop();
									break;
				case "fell through": 
									vxBall = 0;
									t = 0;
									push();
										translate(xBall*M, 0);
										fill(colorBall);
										ellipse(0,0,dBall*M);
										push();
											scale(1,-1);
											fill("#d41e11");
											textSize(1.5*fontSize);
											textStyle(BOLD);
											text("Fail", 20, -20);
										pop();
									pop();
									
			}

		drawZeroCross();								// markiert den kartesischen Nullpunkt
	pop();
}

//----- Changes by Eva Schütze-----
/**
 * 
 * @param groundComponent - String, what ground the current slope/plane is made of
 * @returns the current gravitation under consideration of the friction and angle of the slope
 */
function gCalculation(groundComponent) {
	
	var gStrich = g*(Math.sin(beta)-sign*changeCR(groundComponent)*Math.cos(beta));		//Rollfriction calculation
	sign0 = sign;
	signChange();																		// sign / -1 wenn vs >1
	return gStrich;
}

/** 
 * Randomizes the strenght of the wind in a range between -15 and 15 kilometers per hour converted to meters per second
 * @returns the stength of the wind in meters per second
 */
function windRandomizer(){
	let windRand;
	let signWind = floor(random()*2);   												//decides the sign as either 1 or 0
	let nrWind = floor(random()*16);													//decides the strength
	if(signWind == 0 && nrWind != 0){		
		windRand = nrWind * -1;
	}
	else{windRand = nrWind;}
	windRand = windRand/3.6;															//converts kilometers per hour to meters per second	
	//console.log("Wind in Aufsetzung: " + windRand*3.6);
	return windRand;
}

/**
 * Changes the tip of the flag to show strength and direction of the wind
 */
function changeFlagPos(){
	flag[2][0] = flag[1][0]+(vWind*0.1);
}

/**
 * Assigns a value to cR depending on the type of ground
 * @param underGround  - what the ground is currently made of
 * @returns the friction value of the ground 
 */
function changeCR(underGround) {
	if(underGround == "grass") {
	  cR = 0.2;
	}
	else if (underGround == "sand") {
	  cR = 0.3;
	}
	else {
	  cR = 0;
	}
	return cR;
  }

/**
 * Changes the sign depending on the value of the current speed
 * @returns sign
 */
function signChange() {
	if(vs > 0){
		sign = 1;
	}
	else {
		sign = -1;
	}
	return sign;
}
//------


function windowResized() {						/* responsive design */
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  resizeCanvas(windowWidth, windowHeight);
}
