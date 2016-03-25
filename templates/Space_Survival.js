		var sketchProc=function(processingInstance){ with (processingInstance){
//ESTABLISH SETTINGS

size(400, 400); 
frameRate(30);

//NOW THE PROGRAM

//NOTES

//add life power ups and shields
//push power up on boss kill?
//create ghosting but a general for all alien types based on this.size
//difficulty levels!!!
//add 3 eye bos
//add ghosting
//add in z direction
//increase speed not numbers
//Add difficultly levels that affect push rate
//add tke away power up
//add money system for upgrades, like reload time is less
/** Create boss alien that when shot couple times becomes many aliens**/




//Establish "what" key word mouseIsPressed is, so I can use it later
var mouseIsPressed=false;

mousePressed=function(){
    mouseIsPressed = true;
};
    
mouseReleased= function(){
    mouseIsPressed = false;
};

//timing variables
var minutes=0;
var time=0;

//boss variables
var pushBoss=false;
var bx=450,by=random(400),bSize=55,bSpeed=(2,4),bossHealth=10;
var bossesKilled=0;

//accuracy counter
var firedLasers=0;
var missedLasers=0;

//Function to check what array the shot or hit alien is in
var checkAlien=function(arrayType,key){
    if(arrayType.indexOf(key)>=0){
        arrayType.splice(arrayType.indexOf(key),1);
    }        
};
//Game States
var gameOn=false;
var gameState="titleScreen";

//GLobal Variables
var deadAliens=0;
var PuPush=false;
var foreverLaser=false;
var keys=[];
var ship;
var powerUps=[];

//Alien Object holders
var normAlienArray=[];
var downAlienArray=[];
var behindAlienArray=[];
var bossAliens=[];

//push rates
var pushRate1=130;
var pushRate2=230;
var pushRate3=330;

//background draw Scene
var stars=[];
var numStars=200;
var moons=[];
var numMoons=50;

//Projectile Object
var Projectile = function(x,y,dx,dy,width,height) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.width = width;
    this.height = height;
    //using "powerUps.randomType"
    this.color=[
        color(255, 0, 0),
        color(0, 255, 0),
        color(242, 255, 66)
    ][powerUps.randomType];
};

Projectile.prototype.update = function() {
        //move
    this.x += this.dx;
    this.y += this.dy;
        // Remove if projectile is off screen
    if(ship.x>0&&ship.x<400&&ship.y>0&&ship.y<400){
        this.onScreen=true;
    }
    //if laser was fired on screen and doesnt hit then it missed
    if(this.x > 500&&this.onScreen){
        missedLasers++;
    }
    if (this.x>500 || this.x < 0 || this.y > 500 || this.y < 0) {
        this.remove = true;
    }
};

    /**NOW the Weapon Object (Universal for the most part) **/
var Weapon = function(reloadTime) {
    this.reloadTime = reloadTime;
    this.reloading = this.reloadTime;
};

// Move the projectiles
Weapon.prototype.update = function() {
    if (this.reloading < this.reloadTime) {
        this.reloading++;
    }
};

Weapon.prototype.fire = function() {
    if (this.reloading === this.reloadTime) {
        this.addProjectile();
        this.reloading = 0;
    }
};

/**                 ALL WEAPON VARIATIONS **/

var BasicLaser = function(x,y,dx,dy,width,height){
    Projectile.call(this,x,y,dx,dy,width,height);
};

BasicLaser.prototype = Object.create(Projectile.prototype);

BasicLaser.prototype.draw= function() {
    //switch the core "basic" laser's color depending on ship type
    switch(ship.powerUp){
        case "basic":
            fill(255, 0, 0);
        break;
        case "spray":
            fill(0, 255, 0);
        break;
        case "machinegun":
            fill(196, 0, 255);
    }
    //this is the fundamental laser
    ellipse(this.x, this.y, this.width, this.height);
};

var BasicWeapon = function() {
    Weapon.call(this, 20);    // Reload time
};
BasicWeapon.prototype = Object.create(Weapon.prototype);
BasicWeapon.prototype.addProjectile = function() {
    ship.projectiles.push(new BasicLaser(ship.x+20, ship.y, 10, 0, 5, 5));
      firedLasers++;
};

var SprayWeapon=function(){
    Weapon.call(this,20);
};
SprayWeapon.prototype = Object.create(Weapon.prototype);

SprayWeapon.prototype.addProjectile = function(){
    ship.projectiles.push(new BasicLaser(ship.x+20, ship.y, 8, -3, 5, 5));
    ship.projectiles.push(new BasicLaser(ship.x+20, ship.y, 10, 0, 5, 5));
    ship.projectiles.push(new BasicLaser(ship.x+20, ship.y, 8, 3, 5, 5));
    firedLasers+=3;
};

var HugeLaser = function(x,y,dx,dy,width,height){
    Projectile.call(this,x,y,dx,dy,width,height);
};
HugeLaser.prototype = Object.create(Projectile.prototype);
HugeLaser.prototype.draw= function() {
    if(frameCount%5){fill(255, 0, 0);}
    else{fill(255, 255, 0);}
    
    ellipse(this.x,this.y,this.width,this.height);
};

var HugeWeapon = function(){
    Weapon.call(this,10);
};
HugeWeapon.prototype = Object.create(Weapon.prototype);

HugeWeapon.prototype.addProjectile = function(){
    ship.projectiles.push(new HugeLaser(ship.x+40,ship.y,15,0,40,40));
    firedLasers++;
};

var MachineGunWeapon = function(){
    Weapon.call(this,2);
};
MachineGunWeapon.prototype = Object.create(Weapon.prototype);
MachineGunWeapon.prototype.addProjectile = function(){
    ship.projectiles.push(new BasicLaser(ship.x+20, ship.y, 10, 0, 5, 5));
    firedLasers++;
};

var weapons={
    basic: new BasicWeapon(),
    spray: new SprayWeapon(),
    huge: new HugeWeapon(),//devastator
    machinegun: new MachineGunWeapon()
};
                        //The Ship Object
var Ship = function(x,y){
    this.x=x;
    this.y=y;
    this.weapon=weapons.basic;
    this.projectiles=[];
    this.powerUp="basic";
    this.timerOn=false;
    this.timer=200;//This is the time for each power up
    this.lives=3;
};
Ship.prototype.draw= function() {
    for (var i = 0; i < this.projectiles.length; i++){
        this.projectiles[i].draw();
    }
        // A switch statement for ship design based on PU
        switch (this.powerUp){
            
            case "basic":
                stroke(0, 0, 0);
                fill(133, 133, 133);
                ellipse(this.x, this.y, 30, 17);
                fill(224, 224, 224);
                ellipse(this.x, this.y - 3, 22, 15);    
                //ellipse(this.x,this.y,20,20);
            break;
            
            case "spray":
                stroke(87, 235, 87);        
                fill(94, 114, 214);  
                ellipse(this.x,this.y,30,17); 
                noStroke();
                rect(this.x+12,this.y+-3,8,2);
                rect(this.x+12,this.y+0,8,2);
                rect(this.x+12,this.y+3,8,2);
                stroke(0, 0, 0);
                fill(107, 214, 205);
                ellipse(this.x,this.y-3,22,15); 
            break;
            
            case "huge":
                var colorRotate=function(){
                if(frameCount%10===0){fill(255, 255, 0);stroke(255, 255, 0);}
                else{fill(255, 0, 0);stroke(255, 0, 0);}};
                
                colorRotate();
                line(this.x,ship.y,ship.x+15,ship.y+8);
                line(this.x+15,this.y+8,this.x+25,this.y);
                fill(135, 8, 33);
                ellipse(this.x,this.y,30,17);
                fill(240, 119, 39);
                ellipse(this.x,this.y-3,22,15); 
                noStroke();
                triangle(this.x+20,this.y+-5-5,this.x+-5,this.y,this.x+20,this.y+6);                 stroke(255, 0, 0);
                colorRotate();
                line(this.x,ship.y,ship.x+20,ship.y+15);
                line(this.x+20,this.y+15,this.x+30,this.y+5);
                colorRotate();
                ellipse(this.x+25,this.y,3,3);
                ellipse(this.x+30,this.y+5,3,3);
            break;    
            
            case "machinegun":
                stroke(0, 21, 255);
                fill(133, 133, 133);
                ellipse(this.x, this.y, 30, 17);
                fill(224, 224, 224);
                ellipse(this.x, this.y - 3, 22, 15);
                noStroke();
                rect(this.x+8,this.y-3 ,10,5);
            break;
            
        }
        //just to ensure no extra pick up colors
        stroke(0, 0, 0);
};

Ship.prototype.update=function(){
    this.weapon.update();
    if(this.powerUp!=="basic"){
        this.timer-=0.5;  
            if(this.timer<=0){
                this.timer=200;
                this.powerUp="basic";
                this.timerOn=false;
                this.weapon=weapons.basic;
            }
        text("power up left : "+this.timer,200,380);
    }
    
    for (var i = 0; i < this.projectiles.length; i++) {
        this.projectiles[i].update();
    }
    // backwards or (i--) b/c 
    for (var i = this.projectiles.length - 1; i >= 0; i--) {
        if (this.projectiles[i].remove) {
            this.projectiles.splice(i, 1);
        }
    }
};

ship= new Ship(40,200);

/*********************************** ALIEN START UP*********************************/

//Alien constructor
var Alien = function(alienX,alienY,alienSize,speedX,speedY){
    this.alienX=alienX;
    this.alienY=alienY;
    this.alienSize=alienSize;
    this.speedX=speedX;
    this.speedY=speedY;
    this.shipHit = 0;
};

Alien.prototype.move=function(){
    this.alienX+=this.speedX;
    this.alienY+=this.speedY;
};

Alien.prototype.bound=function(){

	
	
    if(this.alienY>500){
        this.alienY=-100;
        this.alienX=random(400);
        this.speedY=random(0.5,5);
    }
    if(this.alienX<-300){
        this.alienX=500;
        this.alienY=random(400);
        this.speedX=random(-4,-0.5);
    }
    if(this.alienX>500){
        this.alienX=random(-200,-100);
        this.alienY=random(400);
        this.alienSpeedX=random(1,3);
    }
};

Alien.prototype.shot=function(){
    for(var i=0;i<ship.projectiles.length; i++){
        var d=dist(ship.projectiles[i].x,ship.projectiles[i].y,this.alienX,this.alienY); 
        if(d<this.alienSize/2+ship.projectiles[i].width/2){
            //predefined function( refer to it at top of program)
            checkAlien(normAlienArray,this);
            checkAlien(downAlienArray,this);
            checkAlien(behindAlienArray,this);
            //remove lasers that have hit
            ship.projectiles.splice(i,1); 
            deadAliens++;
                //ghosting
            fill(255, 0, 0);
            ellipse(this.alienX,this.alienY,this.alienSize+10,this.alienSize+10);
        }
    }
};
    
Alien.prototype.collision=function(){
    var distance=dist(ship.x,ship.y,this.alienX,this.alienY);
    if(distance-10<this.alienSize/2){
        ship.lives--;
        checkAlien(normAlienArray,this);
        checkAlien(downAlienArray,this);
        checkAlien(behindAlienArray,this);
        deadAliens++;
        //ghosting
        fill(255, 0, 0);
        ellipse(this.alienX,this.alienY,this.alienSize+10,this.alienSize+10);
    }
};
                        /***Normal Aliens**/

var normAlien=function(alienX,alienY,alienSize,speedX,speedY){
    Alien.call(this,alienX,alienY,alienSize,speedX,speedY);
    this.mX=20;
    this.mY=11;
};
normAlien.prototype=Object.create(Alien.prototype);

normAlien.prototype.draw= function() {
//head
    fill(92, 209, 46);
    ellipse(this.alienX,this.alienY,this.alienSize,this.alienSize);
    fill(255, 255, 255);
//eyes
    ellipse(this.alienX-2,this.alienY-1,18,18);
    ellipse(this.alienX-19,this.alienY-1,11,19);
    fill(255, 0, 0);
    ellipse(this.alienX+-6,this.alienY+-1,9,10);
    ellipse(this.alienX+-21,this.alienY+-1,6,10);
//mouth
    fill(0, 0, 0);
    this.mY = abs(10-(frameCount%20));
    ellipse(this.alienX+-8,this.alienY+14,this.mX,this.mY);

    this.bound();
    this.move();
    this.collision();
    this.shot();
};
/** Down Aliens or 2s**/

var downAlien=function(alienX,alienY,alienSize,speedX,speedY){
    Alien.call(this,alienX,alienY,alienSize,speedX,speedY);
    this.eye=0;
    this.eSpeed=random(0.5,2);
    this.m=0;
    this.mSpeed=random(0.5,3);
};
downAlien.prototype=Object.create(Alien.prototype);
downAlien.prototype.draw= function() {
    fill(0, 136, 255);
    ellipse(this.alienX,this.alienY,this.alienSize,this.alienSize);

    var downAlienDraw=function(x,y,m,mSpeed,eye,eSpeed){
        stroke(0, 0, 0);
        fill(34, 145, 91);
        ellipse(x,y,40,40);
        fill(0, 0, 0);
        ellipse(x+-8,y+-7,10,10);
        ellipse(x+8,y+-7,10,10);
        fill(255, 0, 0);
        ellipse(x+-13+eye,y+-4,5,5);
        ellipse(x+5+eye,y+-4,5,5);
        fill(255, 0, 0);
        beginShape(); 
        stroke(23, 163, 39);
        fill(0, 0, 0);
        vertex(x+19,y+5);
        bezierVertex(x+0,y+38+m,x+-29,y+-12+m,x+-16,y+-1);
        bezierVertex(x+-22,y+-15,x+-11,y+17,x+17,y+-3);
        endShape();
        fill(255, 255, 255);
        stroke(255, 255, 255);
        triangle(x+0,y+4,x+-4,y+3,x+-2,y+9);
        triangle(x+6,y+2,x+8,y+2,x+8,y+8);
        triangle(x+-9,y+3,x+-14,y+-1,x+-10,y+9);
        triangle(x+13,y+0,x+15,y+-2,x+13,y+6);
        stroke(0, 0, 0);
    };
    
    if(this.eye>7){this.eSpeed*=-1;}
    if(this.eye<-1){this.eSpeed*=-1;}
    this.eye+=this.eSpeed;
    if(this.m<-8){this.mSpeed*=-1;}
    if(this.m>5){this.mSpeed*=-1;}
    this.m+=this.mSpeed;
    downAlienDraw(this.alienX,this.alienY,this.m,this.mSpeed,this.eye,this.eSpeed);
    
    this.move();
    this.collision();
    this.bound();
    this.shot();
};



var behindAlien=function(alienX,alienY,alienSize,speedX,speedY){
    Alien.call(this,alienX,alienY,alienSize,speedX,speedY);
    this.eyeBlink=0;
    this.blinkSpeed=random(0.1,1);
    this.mouth=0;
    this.mouthSpeed=this.blinkSpeed*4;
};

behindAlien.prototype=Object.create(Alien.prototype);

behindAlien.prototype.draw= function() {
    
    if(this.eyeBlink>-8){
        this.blinkSpeed*=-1;
    }
    if(this.eyeBlink<0){
        this.blinkSpeed*=-1;
    }
    this.eyeBlink+=this.blinkSpeed;
   
    if(this.mouth>-8){this.mouthSpeed*=-1;}
    if(this.mouth<0){this.mouthSpeed*=-1;}
    this.mouth+=this.mouthSpeed;
   
    fill(27, 66, 20);
    stroke(0, 0, 0);
    ellipse(this.alienX,this.alienY,this.alienSize,this.alienSize);
    fill(0, 0, 0);
    strokeWeight(3);
    stroke(27, 66, 20);
    ellipse(this.alienX+-20,this.alienY+-10,20,20);
    ellipse(this.alienX+20,this.alienY+-10,20,20);
    fill(255, 0, 0);
    stroke(0, 0, 0);
    strokeWeight(1);
    ellipse(this.alienX+-20,this.alienY+-10,10+this.eyeBlink,16);
    ellipse(this.alienX+20,this.alienY+-10,10+this.eyeBlink,16);
    fill(0, 0, 0);
    ellipse(this.alienX+-20,this.alienY+-10,2,5);
    ellipse(this.alienX+20,this.alienY+-10,2,5);
    stroke(20, 148, 9);
    fill(0, 84, 0);
    ellipse(this.alienX,this.alienY,22,35+this.mouth*2);
    fill(0, 0, 0);
    stroke(59, 166, 16);
    ellipse(this.alienX,this.alienY,17,30+this.mouth*3);
    stroke(0, 0, 0);
    
    this.move();
    this.bound();
    this.collision();
    this.shot();
  
};

var bossAlien=function(alienX,alienY,alienSize,speedX,speedY,health){
    Alien.call(this,alienX,alienY,alienSize,speedX,speedY);
    this.mouth=0;
    this.dm=-1;
    this.speed=3;
    //changed health around
    this.health=10;
};

bossAlien.prototype=Object.create(Alien.prototype);

var t=0;
var tmove=0.3;

bossAlien.prototype.move= function(){
    var theda=atan2(ship.y-this.alienY,ship.x-this.alienX);
    fill(255, 0, 0);
    this.alienX+=this.speed*cos(theda);
    this.alienY+=this.speed*sin(theda);
};

bossAlien.prototype.shot=function(){
    for(var i=0;i<ship.projectiles.length; i++){
        var d=dist(ship.projectiles[i].x,ship.projectiles[i].y,this.alienX,this.alienY); 
        if(d<this.alienSize/2+ship.projectiles[i].width/2){
            if(bossAliens.indexOf(this)>=0){
                this.health--;
            }
            if(this.health<=0){
                bossAliens.splice(this,1);
                bossesKilled++;
                pushBoss=false;
            }
            ship.projectiles.splice(i,1);    
        }
    }

};

bossAlien.prototype.collision=function(){
    var distance =dist(ship.x,ship.y,this.alienX,this.alienY);
    if(distance<(this.alienSize/2)+8){
        ship.lives--;
    }
};

bossAlien.prototype.draw= function() {
    
    var eyeBall=function(centerX,centerY){
        
        var eyeX=ship.x;
        var eyeY=ship.y;
        var distance=dist(eyeX,eyeY,centerX,centerY);
        if(distance>10){
            eyeX = 4 * (ship.x - centerX)/distance + centerX;
            eyeY = 4 * (ship.y - centerY)/distance + centerY;
        }
        //draw eye
        fill(0, 0, 0);
        ellipse(centerX,centerY,20,20);
        fill(255, 0, 0);
        ellipse(centerX,centerY,20,15);
        //pupil
        strokeWeight(5);
        point(eyeX,eyeY);
        strokeWeight(1);
    };
    
    //need 255
    //body
    fill(163, 20*this.health+55, 25);
    ellipse(this.alienX,this.alienY,this.alienSize,this.alienSize);
    //tenticles
    var tenticle=function(x,y,b,q,z){
        noFill();
        stroke(b,q,z);
        strokeWeight(4);
        bezier(x+-13+t/4, y+47+t, x-t, y+30+t, x-26, y+31+t*4, x-11, y+25);
        bezier(x+3+t/4, y+48+t*2, x+16, y+34+t, x, y+32+t, x+1, y+28);
        bezier(x+19+t/4, y+47+t, x+12+t, y+30+t, x+37, y+31+t*2, x+16, y+21);
        stroke(0, 0, 0);
        strokeWeight(1);
        if(t>5){tmove*=-1;}
        if(t<0){tmove*=-1;}
        t+=tmove;
    }; 
   
        //eyes
    eyeBall(this.alienX-14,this.alienY+3);
    eyeBall(this.alienX+14,this.alienY+3);
    eyeBall(this.alienX,this.alienY-15);
        //mouth
    if(this.mouth<-10){this.dm*=-1;}
    if(this.mouth>0){this.dm*=-1;}
    this.mouth+=this.dm;
    strokeWeight(2);
    stroke(28, 107, 33);
    fill(255, 0, 0);
    ellipse(this.alienX,this.alienY+18,15+this.mouth,15);
    stroke(0, 0, 0);
    fill(0, 0, 0);
    ellipse(this.alienX,this.alienY+18,10+this.mouth,10+this.mouth);
    strokeWeight(1);
    
    tenticle(this.alienX,this.alienY,163,20*this.health+55,25);
        //LifeBar for boss
    fill(255, 0, 0);
    rect(100,370,160,20);
    fill(43, 255, 0);
    rect(100,370,this.health*16,20);
    
    this.move();
    this.shot();
    this.collision();
};

/******************END OF ALIENS>>>>>>>>>>POWER UPS*******************************/

var powerUpBalls = function(x,y,r){
    this.x=x;
    this.y=y;
    this.r=r;
    this.randomType=floor(random(3));
    this.color=[
        color(194, 194, 194),
        color(84, 247, 84),
        color(255, 0, 0),
        color(242, 255, 66)
    ][this.randomType];
    //originally had "basic" first
    this.randomWeapon = [
        "spray",
        "huge",
        "machinegun"
    ] [this.randomType];    
};

powerUpBalls.prototype.draw= function() {
    //should be changing colors
    fill(this.color);
    ellipse(this.x,this.y,this.r,this.r);
};

powerUpBalls.prototype.move=function(){
     this.x-=1;
};

//update part
powerUpBalls.prototype.update=function(){
    if(this.x<0){
        this.remove=true;
    }
        for(var i =powerUps.length-1; i>=0; i--){
            if(powerUps[i].remove){
                powerUps.splice(i,1);    
            }
        }
};

powerUpBalls.prototype.contact = function(){
    var distance = dist(this.x,this.y,ship.x,ship.y);
    if(distance<10+this.r/2){
        rect(200,200,50,50);
        ship.weapon=weapons[this.randomWeapon];
        ship.powerUp=this.randomWeapon;
        this.timerOn=true;
        this.remove=true;
    }
    
};
/** ESTABLISHING *******************************************************************/

var update=function(){    
    if(frameCount%30===0){time++;}
    
    if(time>=60){
        time=0;
        minutes++;
    }
    fill(255, 0, 0);
    text(time+(minutes*60)+" seconds",10,390);
    
    var totalTime=time+(minutes*60);
    
    if(frameCount%30===0&&pushRate1>30){
        pushRate1-=1;    
    }
    if(frameCount%30===0&&pushRate2>130){
        pushRate2-=1;    
    }
    if(frameCount%30===0&&pushRate3>230){
        pushRate3-=1;
    }

//INCREASE SPEEDS AS WELL
    if(frameCount%pushRate1===0){
        var aX=random(450,500),aY=random(400),aSize=50,dx,dy=0;
        if(deadAliens<50){dx=-random(1,4);}else{dx=-random(0.5,14);}
        normAlienArray.push(new normAlien(aX,aY,aSize,dx,dy));
    }
  
    if(frameCount%pushRate2===0){
        var x=random(400),y=random(-100,-50),size=40,dx=0,dy;
        if(deadAliens<50){dy=random(1,5);}else{dy=random(1,9);}
        downAlienArray.push(new downAlien(x,y,size,dx,dy));
    }
    
    if(frameCount%pushRate3===0){
        var x=random(-100,-50),y=random(400),size=50,dx; 
        if(deadAliens<50){dx=random(1,3);}else{dx=random(1,6);}
        behindAlienArray.push(new behindAlien(x,y,size,dx,0) ); 
    }
    textSize(12);
    /*text("PushRate1 : "+pushRate1,300,10);
    text("pushRate2 : "+pushRate2,300,20);
    text("pushRate3 : "+pushRate3,300,30);*/
    //text("# Aliens3 : "+behindAlienArray.length,10,375);
    ship.update();
    
    for (var i=0; i<powerUps.length; i++){
        powerUps[i].draw();
        powerUps[i].contact();
        powerUps[i].move();
        powerUps[i].update();
    }

    /**CHANGE BACK POWER UPS**/
    if(deadAliens%30===0&&powerUps.length<2&&deadAliens>0&&ship.weapon===weapons.basic){
        powerUps.push(new powerUpBalls(300,200,30));
    }
    

    
                /**Total time/boss pushes**!!!!!!!!!!!!!!**/
    var bAmount;
    //if(totalTime===1){pushBoss=true; bAmount=1;}
    if(totalTime%60===0&&totalTime!==0){pushBoss=true; bAmount=1;}
    //if(totalTime===120){pushBoss=true; bAmount=1;}
    if(pushBoss&&bossAliens.length<bAmount){
        bossAliens.push(new bossAlien(bx,by,bSize,bSpeed,bSpeed));
    }
    //text(bossAliens.length,100,100);
    for(var i=0;i<bossAliens.length;i++){
        bossAliens[i].draw();
    }
    fill(255, 0, 0);
    //text(totalTime+"TT",10,100);
};

var render=function(){
    
    /*for(var i=normAlienArray.length;i>0;i--){
        normAlienArray[i].draw();
    }
    for(var i=downAlienArray.length;i>0;i--){
        downAlienArray[i].draw();
    }
    for(var i=behindAlienArray.length;i>0;i--){
        behindAlienArray[i].draw();
    }*/
        
    for(var i=0;i<normAlienArray.length;i++){
        normAlienArray[i].draw();
    }
    for(var i=0;i<downAlienArray.length;i++){
        downAlienArray[i].draw();
    }
    for(var i=0;i<behindAlienArray.length;i++){
        behindAlienArray[i].draw();
    }
    
    ship.draw();
};

var drawStars=function(){
//Create other misc objects for dec.   
    for(var s=0;s<numStars; s++){stars.push({x:random(400),y:random(400)});}   
    var star=function(x,y,color){
        fill(161, 161, 161);
        ellipse(x,y,3,3);
    };
    for(var i=0;i<(numStars);i++){
        star(stars[i].x,stars[i].y);
        stars[i].x-=0.1;
        if(stars[i].x<0){stars[i].x=400; stars[i].y=random(400);}
    }  
    for(var m=0; m<numMoons;m++){
        moons.push( { x:random(400),y:random(400),size:random(1,5) } );
    }
    var moon=function(x,y,size){
        fill(255, 255, 255);
        ellipse(x,y,size,size);
    };
    for(var i=0;i<(numMoons);i++){
        moon(moons[i].x,moons[i].y,moons[i].size);
        var moonSpeed= sq(moons[i].size)*0.05;
        moons[i].x-=moonSpeed;
        if(moons[i].x<0){moons[i].x=400; moons[i].y=random(400);}
    }
};

var drawLives=function(x,y){
    for(var i=0;i<ship.lives;i++){
        fill(255, 0, 0);
        pushMatrix();
        scale(0.1);
        fill(255, 0, 0);
        bezier(x+45+i*250,y+60,x+170+i*250,y+-39,x+-198+i*250,y+-144,x+38+i*250,y+120);
        bezier(x+34+i*250,y+-15,x+64+i*250,y+-86,x+222+i*250,y+-42,x+38+i*250,y+120);
        noStroke();
        rect(x+32,y-28,30,30);
        stroke(0, 0, 0);
        popMatrix();
    }
};

var drawScene=function(){
    background(0, 0, 0);
    drawStars();    
    //text("# Aliens :"+normAlienArray.length,10,30);
    //text("# Aliens2 :"+downAlienArray.length,10,50);
    //text("behindAliens:" +behindAlienArray.length,10,70);
    text("Dead Aliens : "+deadAliens,5,375);
    //text("Laser Accuracy : "+accuracyL,300,300);
    //text("bossesKilled : "+bossesKilled,10,355);
    drawLives(80,3500);
    //eventually remove
    for (var i=0; i<powerUps.length; i++){
        text("W type : "+powerUps[i].randomType,268,10+i*10);
        text("powerUps length "+powerUps.length,50,100);
        text("Current ship Weapon : "+ship.weapon,20,20);
        text("why no name?^",100,40);
        text(powerUps[i].randomType,20,20+i*10);
        text(powerUps[i].randomWeapon,100,350);
        /*if(frameCount%50===0){
            debug(ship.weapon+" "+powerUps[i].randomType);
        }*/
    }
    
    
    //On Off side flip
    if(ship.x>450){
	ship.x=0;
	}
	if(ship.x<0){
	ship.x=400;
	}
	if(ship.y>450){
	ship.y=0;
	}
	if(ship.y<0){
	ship.y=400;
	}
	
	
	

    
};
    //ALL KEY MOVEMENTS
var keyHandling = function() {
    if (keys[UP]) { ship.y -= 6; }
    if (keys[DOWN]) { ship.y += 6; }
    if (keys[LEFT]) { ship.x -= 6; }
    if (keys[RIGHT]) { ship.x += 6; }
    if (keys[32]&&ship.x>0) { ship.weapon.fire();}
};


var keyPressed= function() { keys[keyCode] = true; };
var keyReleased= function() { keys[keyCode] = false; }; 
//BACKGROUND EYES
var eyeContainer=[];
var titleEyes=function(x,y,height,addedHeight,width,speed,timer){
    this.x=x;
    this.y=y;
    this.height=12;
    this.addedHeight=0;
    this.width=5;
    this.speed=-4;
    this.timer=random(1,30);
    this.blink=false;
    this.pairs=10;
};

titleEyes.prototype.draw= function() {
    fill(39, 94, 30);
    ellipse(this.x,this.y,22,22);
    fill(255, 0, 0);
    ellipse(this.x-6,this.y,this.width-1,this.height-2+this.addedHeight);
    ellipse(this.x+6,this.y,this.width-1,this.height-2+this.addedHeight);
};

var blinkAnimation=function(height,addedHeight,speed,blink){
        addedHeight+=speed;
        if(addedHeight<=-height){
            speed*=-1;
        }
        if((height+addedHeight)>height){
            blink=false;
        }
};    
    
titleEyes.prototype.update=function(){
    this.timer-=0.5;
    
    if(this.timer<=0){
        this.blink=true;
        this.blinking+=-2;
        this.timer=random(40,80);
    }
    
    if(this.blink){//&&this.blinking>0
        if(this.addedHeight<=-this.height){
            this.speed*=-1;
        }
        if(this.addedHeight>0){
            this.speed*=-1;
            this.blink=false;
        }
        
        this.addedHeight+=this.speed;
    }
};

var maxEyes=0;

while(maxEyes<70){
    var drawMe = true;
    var tempX = random(400);
    var tempY = random(400);
// Check every existing object in Array for distance
    for(var each in eyeContainer){
        
        if(dist(eyeContainer[each].x, eyeContainer[each].y, tempX, tempY) < 35){
            drawMe = false;
            break; // no need to keep searching
        }
    }
    if(drawMe){
        eyeContainer.push(new titleEyes(tempX,tempY));
        maxEyes++;
    }
}


var drawTitleScreen=function(){
   background(0, 0, 0); 

   fill(255, 0, 0);
   //text(eyeContainer.length,20,200);

    var bx1=100;
    var by1=300;
    var bx2=300;
    var by2=300;
    for(var i=0;i<eyeContainer.length;i++){
        eyeContainer[i].draw();
        eyeContainer[i].update();
        //text(round(eyeContainer[i].timer),20+i*20,20);
        //text(eyeContainer[i].addedHeight,20+i*20,50);
        
    }
    
    var gameOnAlien=function(x,y){
        //head
        fill(4, 51, 11);
        ellipse(x,y,50,50);
        //eyes
        fill(81, 82, 80);
        ellipse(x+11,y-1,18,18);
        ellipse(x-12,y-1,18,18);
        fill(255, 0, 0);
        ellipse(x+11,y+-1,8,10);
        ellipse(x+-12,y+-1,8,10);
        //mouth
        fill(0, 0, 0);
        rect(x-10,y+10,20,3);
        //ellipse(x,y+15,10,10);
        fill(235, 235, 235);
        ellipse(x+-50,y+-50,100,60);
        fill(0, 0, 0);
        text(" Click me to enter\n       The Void",x-100,y-50);
    };
    
    //gameOnAlien2
        var gameOnAlien2=function(x,y){
            fill(4, 51, 11);
            ellipse(x,y,50,50);
            fill(92, 209, 46);
            //head
            ellipse(x,y,50,50);
            fill(255, 255, 255);
            //eyes
            ellipse(x+11,y-1-5,18,18);
            ellipse(x-12,y-1-5,18,18);
            fill(255, 0, 0);
            ellipse(x+11,y+-1-5,8,10);
            ellipse(x+-12,y+-1-5,8,10);
            //mouth
            fill(0, 0, 0);
            ellipse(x,y+15,10,10);
        };
    
    var instructionsAlien=function(x,y){
        //head
        fill(4, 51, 11);
        ellipse(x,y,50,50);
        //eyes
        fill(81, 82, 80);
        ellipse(x+11,y-1,15,15);
        ellipse(x-12,y-1,15,15);
        fill(255, 0, 0);
        ellipse(x+11,y+-1,6,8);
        ellipse(x+-12,y+-1,6,8);
        //mouth
        fill(0, 0, 0);
        rect(x-10,y+10,20,3);
        fill(235, 235, 235);
        ellipse(x+-50,y+-50,100,60);
        fill(0, 0, 0);
        noFill();
        strokeWeight(3);
        rect(x+1,y+-11,18,18);
        rect(x+-22,y+-11,18,18);
        line(x-5,y,x+5,y);
        text("      Click me to\n           Learn!",x-100,y-50);
        strokeWeight(1);
    };
    
    var instructionsAlien2=function(x,y){
        //head
        fill(92, 209, 46);
        ellipse(x,y,50,50);
        //eyes
        fill(255, 255, 255);
        ellipse(x+11,y-1,15,15);
        ellipse(x-12,y-1,15,15);
        fill(255, 0, 0);
        ellipse(x+11,y+-1,6,8);
        ellipse(x+-12,y+-1,6,8);
        //mouth
        fill(0, 0, 0);
        ellipse(x,y+15,20,10);
        fill(235, 235, 235);
        ellipse(x+-50,y+-50,100,60);
        fill(0, 0, 0);
        noFill();
        strokeWeight(3);
        rect(x+1,y+-11,18,18);
        rect(x+-22,y+-11,18,18);
        line(x-3,y,x+2,y);
        text("      Click me to\n           Learn!",x-100,y-50);
        strokeWeight(1);
    };
    
    gameOnAlien(bx1,by1);
    
    var distance=dist(bx1,by1,mouseX,mouseY);
    if(distance<25&&gameState==="titleScreen"){
        gameOnAlien2(bx1,by1);
        if(mouseIsPressed){
            gameState="gameOn";
        }
        
    }
    instructionsAlien(bx2,by2);
    var distance2=dist(bx2,by2,mouseX,mouseY);
    if(distance2<25&&gameState==="titleScreen"){
        instructionsAlien2(bx2,by2);
        if(mouseIsPressed){
            gameState="instructions";
        }
    }
};

var drawInstructionScreen=function(){
    background(110, 199, 255);
    var buttonX=30;
    var buttonY=350;
    fill(0, 0, 0);
    textSize(20);
    //text("This Page Is Coming soon",80,40);
    //text("but for now.....",80,100);
    
    text("INSTRUCTIONS",115,40);
    text("______________",113,43);
    textSize(15);
    text("-SpaceBar to shoot \n-Arrow Keys to move\n-Every 30 aliens killed= 1 power up\n-Avoid ALL Aliens!",115,75);
    
    fill(255, 0, 0);
    text("Point System: \neach alien killed = +10\neach boss killed = +1000\neach second = +1 \neach minute = +480",20,200);
    //text("Basic Instructions : \n space bar to shoot\n arrowKeys to move \n every 30 aliens killed you get a power up \n hopefully you can figure out the rest",80,150);
    textSize(12);
    text("Hint's: hold down space bar during power ups, your fire rate is increased! \n Watch out for the boss, he is tricky and arrives on minute intervals. ",10,300);
    
    
    fill(255, 0, 0);
    rect(buttonX,buttonY,80,30);
    fill(0, 0, 0);
    text("Home",buttonX+25,buttonY+20);
    if(mouseX>buttonX&&mouseX<buttonX+80&&mouseY>buttonY&&mouseY<buttonY+30){
        fill(245, 229, 49);
        rect(buttonX,buttonY,80,30);
        fill(0, 0, 0);
        text("Home",buttonX+25,buttonY+20);
        
        if(mouseIsPressed){
            gameState="titleScreen";
        }
        
    }
    
    
};

var textMove=0;
var growSize=0;
var drawGameOver=function(){
    background(0, 0, 0);
    drawStars();
    if(growSize<3){
        growSize+=0.5;    
    }
    
    textMove++;
    textAlign(CENTER,TOP);
    textSize(8+growSize/2);
    text("You were a worthy young cadet",100,100+textMove);
    textSize(15);
    textAlign(LEFT,BASELINE);
    textSize(30);
    fill(255, 0, 0);
    text("Game Stats",120,80);
    text("__________",119,80);
    textSize(15);
    fill(255, 0, 0);
    //Laser accuracy
    var accuracyL;
    if(firedLasers>0){
        accuracyL= round(((firedLasers-missedLasers)/firedLasers)*100);
    }
    if(firedLasers===0){
        accuracyL=0;
    }
    text("* Aliens Killed : "+deadAliens,100,120);
    text("* Bosses Defeated : "+bossesKilled,100,140);
    text("* Bullets Expended : "+firedLasers,100,160);
    text("* Laser Accuracy : "+ accuracyL+" %",100,180);
    text("* Time In The Void : "+minutes+" minutes,"+" "+time+" seconds",100,200);

    
    var score=deadAliens*10+bossesKilled*1000+time+(minutes*480)+accuracyL*10;
    fill(0, 255, 9);
    text("TOTAL SCORE = "+score+ " POINTS ",106,242);
    var ranking;
    switch(true){
        case (score<120):
            ranking={
            text:"YOU SUCK",
            color:function(){fill(71, 50, 15);}
            };
            
        break;
        case (score>=120&&score<1300):
            ranking={
            text:"You're better off on Earth...",
            color:function(){fill(46, 74, 255);}
            };
        break;
        
        case (score>=1300&&score<1600):
            ranking={
            text:"Void Voyager",
            color:function(){fill(88, 80, 163);}
            }; 
        break;
            
        case (score>=2000&&score<2500):
            ranking={
            text:"True Astronaut",
            color:function(){fill(255, 255, 255);}
            }; 
        break;
            
            
            
        case (score>=2500&&score<3500):
            ranking={
            text:"Alien Annihilator",
            color:function(){fill(255, 119, 0);}
            };
            break;
            
        case (score>=3500&&score<4200):
            ranking={
            text:"Galactic Warrior",
            color:function(){fill(255, 0, 0); }
            };
        break;
            
        case (score>=4200&&score<5000):
            ranking={
            text:"Star Smasher",
            color:function(){fill(255, 255, 0); }
            };
        break;
        
        case (score>=5000):
            ranking={
            text:"NEIL ARMSTRONG!!!",
            color:function(){fill(0, 217, 255); }
            };
        break;
    }
    
    var rankingComplete=function(){
        ranking.color();
        text(ranking.text,181,340);
    };
    
    //fill(255, 255, 255);
    
    fill(255, 9, 0);
    text("    Well, You Fought You're Best, And \n       You're Best earned a ranking of : ",50,280);
    
    rankingComplete();
    
    
    fill(255, 255, 255);
    textSize(12);
    text("To play again,\nsimply refresh your browser!",240,370);
    textSize(11);
    text("A Samuel Studios Production",10,385);
};


   

var draw= function(){
   
    switch(gameState){
        case "titleScreen":
            drawTitleScreen();
        break;
        
        case "instructions":
            drawInstructionScreen();
        break;
            
        case "gameOn":
            keyHandling();
            drawScene();
            render();
            update();   
            
            if(ship.lives<=0){
                gameState="gameOver";
            }
            //text("shipLives : "+ship.lives,4,325);
            //text("bossesKilled : "+bossesKilled,10,335);
            /*for(var i=0;i<bossAliens.length;i++){
                text("bossLives : "+bossAliens[i].health,10,325);
            }*/
            
            //if(frameCount%30===0){debug(ship.weapon);}
            
            //bossOn();
        break;
        
        case "gameOver":
            drawGameOver();
        break;
  }

};


		}};