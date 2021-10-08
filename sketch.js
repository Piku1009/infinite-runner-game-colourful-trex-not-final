var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var sun,sunImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;
var jumpSound , checkPointSound, dieSound;
var gameOver, restart;


function preload(){

  trex_running =   loadAnimation("trex2.png","trex5.png","trex6.png");
  trex_collided = loadAnimation("trex2.png");
  sunImage = loadImage("sun.png")
  groundImage = loadImage("ground3.png");
  
  cloudImage = loadImage("cloud-1.png");
  
  obstacle1 = loadImage("cactus1.png");
  obstacle2 = loadImage("cactus2.png");
 obstacle3 = loadImage("cactus3.png");
  obstacle4 = loadImage("cactus4.png");
  obstacle5 = loadImage("cactus2.png");
  obstacle6 = loadImage("cactus3.png");
  
  gameOverImg = loadImage("gameOverText.png");
  restartImg = loadImage("resetButton.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
  
}

function setup() {

  createCanvas(displayWidth, windowHeight);
  
  trex = createSprite(50,height-20,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  sun = createSprite(width-30,30,20,20)
  sun.addImage(sunImage)
  
  ground = createSprite(5000,height-11,displayWidth*200,50);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  groundImage.scale=20
  
  gameOver = createSprite(width-810,height-300);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(displayWidth-800,height-250);
  restart.addImage(restartImg);
  restart.setCollider("rectangle",- 15,-15,85,85);
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,height-10,displayWidth*100,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  
  background("lightBlue");
  text("Score: "+ score, width-500,50);
  invisibleGround.debug = true;
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    
    //change the trex animation
    trex.changeAnimation("running", trex_running);
    
    // //jump when the space key is pressed
    if(touches.length>0||keyDown("space") && trex.y >= height-85 ) {
      trex.velocityY = -12;
       jumpSound.play();
      touches = [];
    }
  //console.log(trex.y)
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
       dieSound.play();
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    
  }
  if(mousePressedOver(restart)&&gameState===END)
    {
      reset();
    }
  
  drawSprites();
}
function reset()
{
  gameState = PLAY;
   gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(displayWidth-60,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 500;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}



function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(displayWidth-50,height-32,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
     default: break;
    }
    obstacle.setCollider('rectangle',10 ,0,30,60)
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

