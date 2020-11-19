//Create variables here
var dog,dogImg,happyDogImg,hungryDogImage,database,foodS,foodStock;
var frameCountNow = 0;
var gameState = "hungry";
var gameStateRef,input,name,currentTime;
var FeedTime,lastFeed,feed,addFood,lazyImage;
var foodObj,bedroomImage,gardenImage,washroomImage,runImage;
var input,button,deadDogImage;

function preload()
{
  dogImg = loadImage ("images/dogImg.png");
  happyDogImg = loadImage("images/dogImg1.png")
  bedroomImage = loadImage("virtual pet images/Bed Room.png")
  gardenImage = loadImage("virtual pet images/Garden.png")
  washroomImage = loadImage("virtual pet images/Wash Room.png")
  lazyImage = loadImage("virtual pet images/Lazy.png")
  runImage = loadImage("virtual pet images/running.png")
  deadDogImage = loadImage("virtual pet images/deadDog.png")
}

function setup() {
  database = firebase.database();
  createCanvas(1300, 700);
  
  foodObj = new Food();

  dog = createSprite(width/2+250,height/2,10,10);
  dog.addAnimation("dog",dogImg);
  dog.addAnimation("lazy",lazyImage);
  dog.addAnimation("run",runImage);
  dog.addAnimation("dead",deadDogImage);
  dog.addAnimation("happy",happyDogImg);
   
  dog.scale = 0.3;


  getGameState();

  feed = createButton("Feed the Dog");
  feed.position(950,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(1050,95);
  addFood.mousePressed(addFoods);
  
  input = createInput("Pet Name");
  input.position(920,120);

  button = createButton("Confirm");
  button.position(1000,145);
  button.mousePressed(createName);
  
}


function draw() {  
background("green")

currentTime = hour();

if(currentTime === lastFeed +1){
   gameState = "playing";
   updateGameState();
   foodObj.garden();
}
else if(currentTime === lastFeed +2){
   gameState = "lazy";
   updateGameState();
  foodObj.bedroom();
}
else if(currentTime > lastFeed + 2 && currentTime<= lastFeed + 4){
  gameState = "bathing";
  updateGameState();
  foodObj.washroom();
}
else {
   gameState = "dog";
   updateGameState();
   foodObj.display();
}

foodObj.getFoodStock();

getGameState();

feedTime = database.ref('FeedTime');
feedTime.on("value",function (data){
  lastFeed=data.val();
})

if(gameState === "dog"){
   feed.show();
  addFood.show();
  dog.addAnimation("dog",dogImg);
}
else {
 
  feed.hide();
  addFood.hide();
  dog.remove();



  

}

drawSprites();

textSize(32);
fill("red");

textSize(20);
text("Last Feed :" + lastFeed+ ":00",300,95);

text("Time Since Last Feed :"+ (currentTime - lastFeed),300,125);
}

function feedDog(){
  foodObj.deductFood();
  foodObj.updateFoodStock();
  dog.changeAnimation("happy",happyDogImg);
  gameState ="happy"
  updateGameState();
}

function addFoods(){
  foodObj.addFood();
  foodObj.updateFoodStock();
 }

async function hour(){

var site = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
var siteJSON = await site.json();
var dateTime = siteJSON.dateTime;
var hourTime = dataTime.slice(11,13);
return hourTime;
}

 function createName(){

 input.hide();
 button.hide();
 
 name = input.value();
 var greeting = createElement('h3');
 greeting.html("Pet's name :" + name);
 greeting.position(width/2+850,height/2+200);
}

function getGameState(){
  gameStateRef = database.ref('gameState');
  gameStateRef.on("value",function(data){
  gameState = data.val();
  });
};

function updateGameState(){
database.ref('/').update({
gameState : gameState
});

}








