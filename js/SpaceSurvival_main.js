/*Init variables*/

var screenWidth = 400;
var screenHeight = 400;

void setup(){
	size(screenWidth,screenHeight);
	frameRate(30);
}




/*Game State Variables*/

//Counter
var time = 0; //Dont need second variable for minutes

//Accuracy:
var firedLasers = 0;
var missedLasers = 0;

//Original game states
var gameOn = false;
var gameState = "titleScreen";

//Misc.
var deadAliens=0;
var PuPush=false;
var foreverLaser=false;
var keys=[];
var ship;
var powerUps=[];

//Alien Object containers
var normAlienArray=[];
var downAlienArray=[];
var behindAlienArray=[];
var bossAliens=[];

//Alien Push Rates (In seconds)->
var pushRate1=130;//4
var pushRate2=230;//8
var pushRate3=330;//11

//FrameCount-> special variable counting frames since start
//Frame rate is frames displayed per second















//Skipped:
//boss variables

