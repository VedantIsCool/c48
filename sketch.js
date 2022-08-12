var bg, bgImg, backgroundImg;
var bottomGround;
var topGround;
var balloon, balloonImg;
var obsTop, birds, otherBalloons;
var obsBottom, smallBuildings, tallBuildings, lampPosts;
var gameOver, gameOverImg;
var restart, restartImg;
var score = 0;
var PLAY = 1;
var END = 0;
var gameState = PLAY;

function preload(){
bgImg = loadImage("assets/bg.png");
backgroundImg = loadImage("assets/bgImg2.png")

balloonImg = loadAnimation("assets/balloon1.png","assets/balloon2.png","assets/balloon3.png");

birds = loadImage("assets/obsTop2.png");
otherBalloons = loadImage("assets/obsTop1.png");

smallBuildings = loadImage("assets/obsBottom1.png");
tallBuildings = loadImage("assets/obsBottom3.png");
lampPosts = loadImage("assets/obsBottom2.png");

gameOverImg = loadImage("assets/gameOver.png");
restartImg = loadImage("assets/restart.png");

jumpSound = loadSound("assets/jump.mp3");
dieSound = loadSound("assets/die.mp3");
}

function setup(){
//create canvas
createCanvas(400,400);

//background image
bg = createSprite(165,485,1,1);
//bg.addImage(bgImg);
//bg.scale = 1.3

getBackgroundImage();

//creating top and bottom grounds
bottomGround = createSprite(200,390,800,20);
bottomGround.visible = false;

topGround = createSprite(200,10,800,20);
topGround.visible = false;
      
//creating balloon     
balloon = createSprite(100,200,20,50);
balloon.addAnimation("balloon",balloonImg);
balloon.scale = 0.2;
balloon.debug = true;

// intializing groups
topObstacleGroup = new Group();
bottomObstacleGroup = new Group();
barGroup = new Group();

// creating gameover and restart sprite
gameOver = createSprite(220,200);
restart = createSprite(220,240);
gameOver.addImage(gameOverImg);
gameOver.scale = 0.5;
restart.addImage(restartImg);
restart.scale = 0.5;
gameOver.visible = false;
restart.visible = false;
}

function draw() {
  
 // background("black");

    if(gameState === PLAY){
       //making the hot air balloon jump
       if(keyDown("space")) {
        balloon.velocityY = -6 ; 
        jumpSound.play();
      }

      //adding gravity
       balloon.velocityY = balloon.velocityY + 0.5;

       // spawning top and bottom obstacles
       spawnObstaclesBottom();
       spawnObstaclesTop();

       Bar();

       //condition for END state
       if(topObstacleGroup.isTouching(balloon) || balloon.isTouching(topGround) || balloon.isTouching(bottomGround) || bottomObstacleGroup.isTouching(balloon)){
        gameState = END;
        dieSound.play();
       }
    }
        
    if(gameState === END){
      gameOver.visible = true;
      gameOver.depth = gameOver.depth + 1;
      restart.visible = true;
      restart.depth = restart.depth + 1;

      //all sprites should stop moving in the end state
      balloon.velocityX = 0;
      balloon.velocityY = 0;
      topObstacleGroup.setVelocityXEach(0);
      bottomObstacleGroup.setVelocityXEach(0);
      barGroup.setVelocityXEach(0);
      
      // setting -1 lifetime so that obstacles dont disappear in the END state
      topObstacleGroup.setLifetimeEach(-1);
      bottomObstacleGroup.setLifetimeEach(-1);
      
      balloon.y = 200;

      // resetting the game
      if(mousePressedOver(restart)){
        reset();
      } 
    }

        drawSprites();
        Score();      
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  topObstacleGroup.destroyEach();
  bottomObstacleGroup.destroyEach();

  score = 0;
}

function spawnObstaclesTop() {
  if(World.frameCount % 60 === 0){
    obstacleTop = createSprite(400,50,40,50);

    //obstacleTop.addImage(obsTop1);
    obstacleTop.scale = 0.1;
    obstacleTop.velocityX = -4;

    //random Y position for top obstacles
    obstacleTop.Y = Math.round(random(10,100));

    //genrate random obstcales
    var rand = Math.round(random(1,2));
    switch(rand){
      case 1: obstacleTop.addImage(birds);
        break;
      case 2: obstacleTop.addImage(otherBalloons);
        break;
      default: break;
    }

    // assigin lifetime to the var
    obstacleTop.lifetime = 100;
    balloon.depth += 1;
    topObstacleGroup.add(obstacleTop);
  }
}

function spawnObstaclesBottom() {
  if(World.frameCount % 60 === 0){
    obstacleBottom = createSprite(400,305,40,50);

    obstacleBottom.addImage(smallBuildings);
    obstacleBottom.debug = true;
    obstacleBottom.scale = 0.1;
    obstacleBottom.velocityX = -4;

    //generate random obstacles
    obstacleBottom.Y = Math.round(random(10,100));

    var rand = Math.round(random(1,3));
    switch(rand){
      case 1: obstacleBottom.addImage(lampPosts);
        break;
      case 2: obstacleBottom.addImage(tallBuildings);
        break;
      case 3: obstacleBottom.addImage(smallBuildings);
        break;
      default: break;
    }

    //assign lifetime to the var
    obstacleBottom.lifetime = 100;
    balloon.depth += 1;
    bottomObstacleGroup.add(obstacleBottom);
  }
}

function Bar(){
  if(World.frameCount % 60 === 0){
    var bar = createSprite(400,200,10,800);
    bar.velocityX = -6;
    bar.depth = balloon.depth;
    bar.lifetime = 70;
    bar.visible = false;
    barGroup.add(bar);
  }
}

function Score(){
  if(balloon.isTouching(barGroup)){
    score += 1;
  }
  textFont("algerian");
  textSize(30);
  fill("yellow");
  text("Score: "+score,250,50);
}

// using API calls to set the background image according to the time

async function getBackgroundImage(){
  var response = await fetch("https://worldtimeapi.org/api/timezone/America/Chicago");
  var responseJSON = await response.json();

  var datetime = responseJSON.datetime;
  var hour = datetime.slice(11,13);

  if(hour >= 06 && hour <= 19){
    bg.addImage(bgImg);
    bg.scale = 1.3;
  }
  else{
    bg.addImage(backgroundImg);
    bg.scale = 1.5;
    bg.x = 200;
    bg.y = 200;
  }
}