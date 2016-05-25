void setup() {
	size(200, 200);
	background(200);
	stroke(255);
	println("hello web!");
	console.log("hi");

}

var keys = [];
var x=25;
var y=25;
color fillVal = color(126);
 
void draw() {
  fill(fillVal);
  keyHandling();
  rect(x, y, 50, 50);
}

var keyHandling = function() {
	    if (keys[UP]) { y-=6; console.log("UP");}
	    if (keys[DOWN]) { y += 6; console.log("DOWN");}
	    if (keys[LEFT]) { x -= 6; console.log("LEFT");}
	    if (keys[RIGHT]) { x += 6; console.log("RIGHT");}
	};

void keyPressed() { keys[keyCode] = true; console.log(keyCode);};
// var keyPressed= function() { keys[keyCode] = true; };

void keyReleased() { keys[keyCode] = false; }; 
// var keyReleased= function() { keys[keyCode] = false; }; 
