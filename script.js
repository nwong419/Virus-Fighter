/* global createCanvas, colorMode, HSB, frameRate, background, width, height, stroke, noFill, rect, noStroke, console, keyCode, UP_ARROW,
DOWN_ARROW, RIGHT_ARROW, LEFT_ARROW, text, fill, random, collideRectRect, textFont, mousePressed, loadImage, loadAnimation, loadAnimation, 
backgroundColor, Player, Obstacles, startingScreenIcon*/

//Note I put in the code for collision and movement

let points, lives;
let p1;
let grid = 50;
let screen = 0;
let obstacles = [];
let timerValue = 30; //lower time for debugging
//let secondsWithPowerup = 0;
//let startedPowerupTimer = false;
let powerupTime = 0;
let powerTimerSet = false;
let retry;
let button;
let home;
let hbutton;
let x1 = 0;
let x2;
let scrollSpeed = 2;
let facts, factNum;

function setup() {
  createCanvas(650, 650);
  colorMode(HSB, 360, 50, 50);
  points = 0;
  lives = 0;
  button = false;
  hbutton = false;
  x2 = width;
  //time = 5000;
  backgroundColor = 95;
  factNum = int(random(0, 10));
  setInterval(changeFacts, 10000);
  p1 = new Player((width * 1) / 6, grid);
  for (let x = 0; x < 5; x++) {
    obstacles.push(new Obstacles(width, random(50, height - 150), p1));
  }

  //animation with p5.play??
  startingScreenIcon = loadAnimation(
    "https://cdn.glitch.com/332ecae8-9a4b-42fb-9693-fbda03cb35f6%2Fsign1.png?v=1595623876635",
    "https://cdn.glitch.com/332ecae8-9a4b-42fb-9693-fbda03cb35f6%2Fsign2.png?v=1595623880330",
    "https://cdn.glitch.com/332ecae8-9a4b-42fb-9693-fbda03cb35f6%2Fsign3.png?v=1595623883009",
    "https://cdn.glitch.com/332ecae8-9a4b-42fb-9693-fbda03cb35f6%2Fsign4.png?v=1595623885545",
    "https://cdn.glitch.com/332ecae8-9a4b-42fb-9693-fbda03cb35f6%2Fsign5.png?v=1595623889147",
    "https://cdn.glitch.com/332ecae8-9a4b-42fb-9693-fbda03cb35f6%2Fsign6.png?v=1595623893150",
    "https://cdn.glitch.com/332ecae8-9a4b-42fb-9693-fbda03cb35f6%2Fsign7.png?v=1595623899603",
    "https://cdn.glitch.com/332ecae8-9a4b-42fb-9693-fbda03cb35f6%2Fsign8.png?v=1595623904739",
    "https://cdn.glitch.com/332ecae8-9a4b-42fb-9693-fbda03cb35f6%2Fsign9.png?v=1595623913126",
    "https://cdn.glitch.com/332ecae8-9a4b-42fb-9693-fbda03cb35f6%2Fsign10.png?v=1595623920192",
    "https://cdn.glitch.com/332ecae8-9a4b-42fb-9693-fbda03cb35f6%2Fsign11.png?v=1595623923579"
  );
  
  endingScreenIcon = loadAnimation(lock1,lock2,lock3,lock4);
  endingScreenIcon.frameDelay = 15;
  
  startingScreenIcon.frameDelay = 7;

  frameRate(30); //smaller number is slower

  //timer
  setInterval(timeIt, 1000);
  setInterval(powerupTimerIt, 1000);
  //loadText();
}

function draw() {
  //switching screens
  if (screen == 0) {
    startScreen();
    button = false;
    hbutton = false;
  } else if (screen == 2) {
    background(backgroundColor);
    hbutton = false;
    button = false;
    backgroundScroll();
    displayScores();
    createFacts();
    p1.show();
    p1.update();
    for (let x = 0; x < obstacles.length; x++) {
      obstacles[x].show();
      obstacles[x].move();
    }
    powerupTimer();
  } else if (screen == 1) {
    instructionScreen();
  } else if (screen == 3) {
    button = true;
    hbutton = false;
    endScreen();
  } else if (screen == 4) {
    button = false;
    hbutton = true;
    winner();
  }
  retryButton();
  homeButton();
}

function keyPressed() {
  // DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW
  if (keyCode === UP_ARROW) {
    //player1Y -= speed;
    p1.dir(0, -3);
  } else if (keyCode === DOWN_ARROW) {
    // player1Y += speed;
    p1.dir(0, 3);
  } else if (keyCode === 87) {
    //w key
    // player2Y -= speed;
    p2.dir(0, -3);
    ellipse(30, 30, 15, 15);
  } else if (keyCode === 83) {
    //s key
    //player2Y += speed;
    p2.dir(0, 3);
  }
  //switch screens [spacebar]
  if (keyCode == 32) {
    if (screen == 0) {
      screen = 1;
    } else if (screen == 1) {
      screen = 2;
      resetGame();
    } else if (screen == 3) {
      screen = 0;
    }
  }
}

function startScreen() {
  screen = 0;
  background(bgImg);
  fill("black");
  textAlign(CENTER);
  textSize(80);
  textFont("Dancing Script");
  text("Virus Fighters", width / 2, height / 2 - 100);
  image(coronaImg, width / 2 - 130, height / 2 - 55);
  drawSprites();
  animation(startingScreenIcon, width / 2 + 70, height / 2 + 15);
  textSize(40);
  text("Spacebar to Start", width / 2, height / 2 + 160);
}

function instructionScreen() {
  background(bgImg);
  fill("black");
  textSize(18);
  textAlign(CENTER);
  textFont("Georgia");
  text(
    "During this game, you’ll be playing as a “virus fighter.” In order to avoid being infected with COVID-19, you must avoid the viruses coming at you. If you come into contact with one, you lose a 💖. Be careful, since you only have three, and once all three are gone, you will become sick and it’s game over! However, to help you along the way, there will be powerups -- masks and hand sanitizer -- that will protect you against any viruses for 10 and 5 seconds respectively. Use the arrow keys to direct your icon and keep it safe.\n\nThis game represents the importance of being safe, wearing a mask, and trying to avoid being infected with coronavirus. Throughout the game, you’ll be shown tips and facts to help you stay healthy and learn what’s going on in the world!😊",
    100,
    100,
    450,
    500
  );
  text("Spacebar to Continue", width / 2, height / 2 + 200);
}

function displayScores() {
  // Display score & lives
  textSize(20);
  fill("black");
  textStyle(BOLD);
  textFont("Pixieboy"); //i just replaced it with this font
  text("Lives: ", 30, 50);
  text(`Score: ${p1.score}`, 30, 80);
  if (timerValue <= 60) {
    text(`${timerValue} seconds`, 30, 140);
  }
  if (timerValue == 0) {
    screen = 4;
  }

  if (p1.lives <= 0) {
    screen = 3;
  }

  if (p1.hasPowerup) {
    text(`Powerup: ✨`, 30, 110);
  } else {
    text(`Powerup: `, 30, 110);
  }
  //text(`Powerup: ${powerupTime}`, 30, 140);
}
/*
function displayTime(){
  text(`Time: ${time}`, 40, 110);
  handleTime();
}*/

//function to decrease the timer
function timeIt() {
  if (timerValue > 0) {
    timerValue--;
  }
}

function powerupTimerIt() {
  if (powerupTime > 0) {
    powerupTime--;
  }
}


function powerupTimer() {
  if (p1.hasPowerup == true) {
    /*if (startedPowerupTimer == false) {
      secondsWithPowerup = powerupTime;
      startedPowerupTimer = true;
    }*/
    if (p1.hasMask && powerTimerSet == false) {
      powerupTime = 10; //debug with 3
      powerTimerSet = true;
    } else if (p1.hasSanitizer && powerTimerSet == false) {
      powerupTime = 5; //debut with 2
      powerTimerSet = true;
    }
    if (powerupTime == 0 && p1.hasMask) {
      p1.hasPowerup = false;
      p1.hasMask = false;
      powerTimerSet = false;
    }
    if (powerupTime == 0 && p1.hasSanitizer) {
      p1.hasPowerup = false;
      p1.hasSanitizer = false;
      powerTimerSet = false;
    }
  }
}

function goToHome() {
  screen = 0;
}

function resetGame() {
  button = false;
  hbutton = false;
  p1 = new Player((width * 1) / 4, height - grid);
  for (let x = 0; x < obstacles.length; x++) {
    //replace every obstacle with a new one
    obstacles.splice(x, 1, new Obstacles(width, random(50, height - 150), p1));
    screen = 2;
  }
  timerValue = 30;
}

function winner() {
  background(winnerScreen);
  textAlign(CENTER);
  fill("black");
  textFont("Dancing Script");
  textSize(80);
  text("You are a \n winner!", width / 2, height / 2 - 40);
  textSize(40);
  text(`Score: ${p1.score}`, width / 2, height / 2 + 150);
}

function retryButton() {
  //retry button? //problem it continues to persist in the game screen which i do not want
  //update solved the problem!! what was happening was that it would create a new button everytime on top of the old one
  //so like 60 buttons per second
  if (!retry) {
    retry = createButton("Retry ↻");
  }
  retry.position(width - 110, height - 30);
  retry.style("font-family", "Dancing Script");
  retry.style("background-color", "lightblue");
  retry.style("border-radius", "12px");
  retry.elt.style.fontSize = "2em";
  retry.mousePressed(resetGame);
  if (button) {
    retry.show();
  } else {
    retry.hide();
  }
}


function homeButton() {
  if (!home) {
    home = createButton("Home 🏡");
  }
  home.position(width - 110, height - 30);
  home.style("font-family", "Dancing Script");
  home.style("background-color", "lightblue");
  home.elt.style.fontSize = "2em";
  home.style("border-radius", "12px");
  home.mousePressed(goToHome);
  if (hbutton) {
    home.show();
  } else {
    home.hide();
  }
}

function endScreen() {
  background(360, 17, 50);
  drawSprites();
  animation(endingScreenIcon, width/2, height/2);
  textFont("Dancing Script");
  textSize(80);
  textAlign(CENTER);
  fill('black');
  text("Game\nOver", width / 2, height / 2 - 40);
}

//looping background --> code from p5 editor sample
function backgroundScroll() {
  image(bg2Img, x1, 0, width, height);
  image(bg2Img, x2, 0, width, height);

  x1 -= scrollSpeed;
  x2 -= scrollSpeed;

  if (x1 < -width) {
    x1 = width;
  }
  if (x2 < -width) {
    x2 = width;
  }
}

function createFacts() {
  facts = [
    "Make sure you stay home when you’re sick! 🏠",
    "Cough and sneeze into your elbow to protect others! 🤧",
    "Wash your hands as much as you can! 🧼👏",
    "Stay six feet away from others (about the same distance as a big bathtub 🛁).",
    'Don’t hug or touch others -- give lots of "air hugs"! 🤗',
    "Always remember to wear a mask when you’re with others. 😷",
    "COVID-19 is a new virus, with no cure yet. 🦠🔬",
    "Many scientists are researching medicines and vaccines right now. 🧪 💊",
    "Some people may have bad symptoms, while others might show none. 🤒 / 😃",
    "Try not to touch your eyes, nose, or mouth! 👁️👃👄"
  ];
  textSize(20);
  fill(0);
  textFont("Pixieboy");
  textAlign(CENTER);
  text(facts[factNum], (width * 3) / 6, 30, 300, 100);
}

function changeFacts() {
  factNum = (factNum + 1) % 10;
}
