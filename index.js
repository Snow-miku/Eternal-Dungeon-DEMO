let battleMusic, winMusic, attackSound, goku, tom, tomDefeated;

function preload() {
  colors = loadJSON("media/color-palette.json");
  battleMusic = loadSound("media/battle.mp3");
  winMusic = loadSound("media/win.mp3");
  attackSound = loadSound("media/attack.mp3");
  goku = loadImage("media/goku.png");
  tom = loadImage("media/tom-normal.png");
  tomDefeated = loadImage("media/tom-defeated.png");
  hit = loadImage("media/hit.png");
}

const textSize = 50;
let x, y;
let startButton, attackButton, winPrompt, dmgDisplay;
let hpBar1, hpBar2, hpBar1Outlin, hpBar2Outline, char1, char2, hitSprite;

let hp2, hp2Cur, hp2Width, hp2WidthCur;
let timer, seconds;
let gameStarted, attackAllowed; //the state of the game

// Create a new canvas to the browser size
function setup() {
  createCanvas(windowWidth, windowHeight);

  //get the center of the page
  x = width / 2;
  y = height / 2;

  //set the proper volume
  battleMusic.setVolume(0.1);
  attackSound.setVolume(0.2);
  winMusic.setVolume(0.3);

  startButton = new Sprite(x, y);
  startButton.textSize = textSize;
  startButton.text = "Start";
  startButton.w = textWidth("Start")*10;
  startButton.h = textSize * 1.5;
  startButton.textColor = colors.blue1;
  startButton.shapeColor = color(0, 0, 0, 0);
  startButton.strokeColor = colors.blue1;
  startButton.strokeWeight = 4;

  attackButton = new Sprite(x, y*1.7);
  attackButton.textSize = textSize;
  attackButton.text = "Attack!";
  attackButton.w = textWidth("Start")*10;
  attackButton.h = textSize * 1.5;
  attackButton.textColor = colors.blue1;
  attackButton.shapeColor = color(0, 0, 0, 0);
  attackButton.strokeColor = colors.blue1;
  attackButton.strokeWeight = 4;

  winPrompt = genText("YOU WIN!!");

  dmgDisplay = genText("");
  dmgDisplay.x = x * 1.5;
  dmgDisplay.y = y * 0.5;

  hpBar1 = genHealthBar(false);
  hpBar1.x = x * 0.5;
  hpBar2 = genHealthBar(false);
  hpBar2.x = x * 1.5;
  hpBar1Outline = genHealthBar(true);
  hpBar1Outline.x = x * 0.5;
  hpBar2Outline = genHealthBar(true);
  hpBar2Outline.x = x * 1.5;
  hp2Width = hpBar2.width;

  goku.resize(width/3.5, 0);
  char1 = genCharacter(goku);
  char1.x = x * 0.5;
  tom.resize(width/3.5, 0);
  char2 = genCharacter(tom);
  char2.x = x * 1.5;
  char2.addImage("defeated", tomDefeated);
  hit.resize(width/3.5, 0);
  hitSprite = genCharacter(hit);
  hitSprite.x = x * 1.5;

  initGame();
}

// On window resize, update the canvas size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  //get the center of the page
  x = width / 2;
  y = height / 2;
  //console.log(`width: ${width}, height: ${height}`);
}

function draw() {
  background(colors.black);

  if (!gameStarted) {
    if (startButton.mouse.pressing()) {
      startButton.shapeColor = colors.grey;
    }
    if (startButton.mouse.released()) {
        startGame();
    }
    if (mouse.released()) {
      startButton.shapeColor = color(0, 0, 0, 0);
    }
  }
  if (gameStarted) {
    if (attackAllowed) {
      if (attackButton.mouse.pressing()) {
        attackButton.textColor = colors.pink4;
        attackButton.shapeColor = colors.pink4;
      }
      if (attackButton.mouse.released()) {
        attack();
      }
      if (mouse.released()) {
        attackButton.textColor = colors.blue1;
        attackButton.shapeColor = color(0, 0, 0, 0);
      }
    }
    if (hp2Cur <= 0) {
      winGame();
    }
  }
}

function startGame() {
  console.log("Game Started");
  gameStarted = true;
  battleMusic.loop();
  setTimeout(() => {
    attackAllowed = true;

    //start timer
    console.log("Start Timer.");
    timer = setInterval(function() {
      seconds++;
    }, 10);
  }, 3800)

  //switch visibility
  startButton.visible = false;
  attackButton.visible = true;
  hpBar1.visible = true;
  hpBar2.visible = true;
  hpBar1Outline.visible = true;
  hpBar2Outline.visible = true;
  char1.visible = true;
  char2.visible = true;
  char2.img = "char";
}

function endGame() {
  console.log("Game Ended");
  gameStarted = false;
}

function attack() {
  attackSound.stop();
  attackSound.play();
  hitSprite.visible = true;
  dmgDisplay.visible = true;
  setTimeout(() => {
    hitSprite.visible = false;
  }, 100);
  setTimeout(() => {
    dmgDisplay.visible = false;
  }, 500);

  //damge calculation
  let damage = Math.floor(random(500, 1000));
  dmgDisplay.text = `- ${damage}`;
  hp2Cur -= damage;
  console.log(`Dealt ${damage} damage. Current hp: ${hp2Cur}.`);

  //hp calculation
  hp2WidthCur = hp2Width * (hp2Cur / hp2);;
  hpBar2.x = 1.5 * x - (hp2Width - hp2WidthCur)/2;
  //console.log(`healthbar x position: ${hpBar2.x}.`);
  hpBar2.width = hp2WidthCur;
}

function winGame() {
  console.log("YOU WIN!!");
  battleMusic.stop();
  clearInterval(timer);//stop the timer
  console.log(`Spent ${seconds/100} seconds.`)
  winPrompt.visible = true;
  setTimeout(() => {
    char2.img = "defeated";
  }, 150);
  setTimeout(() => {
    winMusic.play();
  }, 1000);
  endGame();
  setTimeout(() => {
    initGame();
  }, 25000);
}

function initGame() {
  seconds = 0;

  //switch visibility
  startButton.visible = true;
  attackButton.visible = false;
  winPrompt.visible = false;
  dmgDisplay.visible = false;

  hpBar1.visible = false;
  hpBar2.visible = false;
  hpBar1Outline.visible = false;
  hpBar2Outline.visible = false;
  char1.visible = false;
  char2.visible = false;
  hitSprite.visible = false;

  //switch game state
  gameStarted = false;
  attackAllowed = false

  //restore character health;
  hp2 = 10000;
  hp2Cur = hp2;
  hpBar2.width = hp2Width;
  hp2WidthCur = hp2Width;
  hpBar2.x = 1.5 * x;
  hpBar2.width = hp2Width;
}

//create Sprite object for health bars
function genHealthBar(outline) {
  let hp = new Sprite();
  if (outline) {
    hp.shapeColor = color(0, 0, 0, 0);
    hp.strokeColor = colors.pink1;
  } else {
    hp.shapeColor = colors.green1;
    hp.strokeColor = color(0, 0, 0, 0);
  }
  hp.strokeWeight = 6;
  hp.y = y * 0.2;
  hp.h = 20;
  hp.width = x / 2;
  hp.collider = "none";
  hp.layer = 1;
  return hp;
}

//create Sprite object for characters
function genCharacter(link) {
  let char = new Sprite();
  char.addImage("char", link);
  char.collider = "none";
  char.layer = 0;
  return char;
}

//create Sprite object for characters
function genText(text) {
  let msg = new Sprite();
  msg.textSize = 100;
  msg.text = text;
  msg.textColor = colors.pink4;
  msg.shapeColor = color(0, 0, 0, 0);
  msg.strokeColor = color(0, 0, 0, 0);
  msg.strokeWeight = 10;
  msg.collider = "none"; // set the colliding space to zero
  msg.layer = 10;
  return msg;
}