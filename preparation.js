/* global loadImage, random, rect, collideRectRect, width, height, player, image, grid, constrain 
  text*/
let virusImg,
  maskImg,
  coronaImg,
  bgImg,
  personImg,
  sanitizerImg,
  heartImg,
  infectedPersonImg,
  maskPersonImg;

function preload() {
  //simply stock images as placeholders
  virusImg = loadImage(
    "https://cdn.glitch.com/332ecae8-9a4b-42fb-9693-fbda03cb35f6%2Fcoronavirus.png?v=1595619495938"
  );
  maskImg = loadImage(
    "https://cdn.glitch.com/332ecae8-9a4b-42fb-9693-fbda03cb35f6%2Ficons8_mask.png?v=1595792710102"
  );
  coronaImg = loadImage(
    "https://cdn.glitch.com/332ecae8-9a4b-42fb-9693-fbda03cb35f6%2Fsign12.png?v=1595623926804"
  );
  bgImg = loadImage(
    "https://cdn.glitch.com/16b9986d-5ec9-4ce3-bcdd-b89eec4342a6%2Fbackground1.png?v=1595949743253"
  );
  personImg = loadImage(
    "https://cdn.glitch.com/16b9986d-5ec9-4ce3-bcdd-b89eec4342a6%2FCharacter.png?v=1595949671163"
  );
  infectedPersonImg = loadImage(
    "https://cdn.glitch.com/16b9986d-5ec9-4ce3-bcdd-b89eec4342a6%2FInfected%20Person.png?v=1595949678971"
  );
  heartImg = loadImage(
    "https://cdn.glitch.com/47618f45-1182-4ee5-a17d-134302f879e5%2Fheartu.png?v=1595961443489"
  );
  sanitizerImg = loadImage(
    "https://cdn.glitch.com/47618f45-1182-4ee5-a17d-134302f879e5%2FhandSanitizer%20(1).png?v=1596050758926"
  );
  winnerScreen = loadImage(
    "https://cdn.glitch.com/947d782a-1399-4602-ad11-c2885d3929ec%2Fendingbg.png?v=1595983486646"
  );
  winnerScreen.resize(0, 0);

  bg2Img = loadImage(
    "https://cdn.glitch.com/01f31b4a-019f-46b1-af40-b5e90ec7c4f8%2Fbgimg.jpg?v=1596141404854"
  );
  lock1 = loadImage(
  "https://cdn.glitch.com/01f31b4a-019f-46b1-af40-b5e90ec7c4f8%2Flock1.png?v=1596139752103");
  
  lock2 = loadImage(
  "https://cdn.glitch.com/01f31b4a-019f-46b1-af40-b5e90ec7c4f8%2Flock2.png?v=1596139756006");
  
  lock3 = loadImage(
  "https://cdn.glitch.com/01f31b4a-019f-46b1-af40-b5e90ec7c4f8%2Flock3.png?v=1596139761092");
  
  lock4 = loadImage(
  "https://cdn.glitch.com/01f31b4a-019f-46b1-af40-b5e90ec7c4f8%2Flock4.png?v=1596139769235");
  
  maskPersonImg = loadImage(
    "https://cdn.glitch.com/47618f45-1182-4ee5-a17d-134302f879e5%2Fimageedit_11_2304300300.png?v=1596052817906"
  );
  //soundFormats('mp3');
  //song = loadSound("https://indiegamemusic.com/diskspace/mr_lou/Platform80kbps.mp3");
}

// Obstacle Class (insert powerups here I guess)

class Obstacles {
  constructor(x, y, player) {
    this.x = x;
    this.y = y;
    this.player = player;
    this.isVirus = false;
    this.isMask = false;
    this.isSanitizer = false;
    //(10% Sanitizer, 20% mask 70% virus)
    this.choose = random(); //number from 0.0-0.99 (inclusive)
    //number is converted from a value in the range of 0-9 to a value that ranges from 0.0-0.7
    if (this.choose < 0.7) {
      this.isVirus = true;
      this.setImage(0);
    } else if (this.choose < 0.9) {
      this.isMask = true;
      //this.player.hasMask = true;
      this.setImage(1);
    } else if (this.choose < 1) {
      this.isSanitizer = true;
      //this.player.hasSanitizer = true;
      this.setImage(2);
    } else {
      this.isVirus = true;
      this.setImage(0);
    }

    this.speed = random(3, 7); //going from right to left
    this.canHit = true;
  }

  setImage(x) {
    this.obstacleArr = [virusImg, maskImg, sanitizerImg];
    this.image = this.obstacleArr[x];
  }

  show() {
    image(this.image, this.x, this.y, 50, 50);
    this.checkPowerup();
    this.checkCollision();
  }
  checkPowerup() {
    let collided = collideRectRect(
      this.x,
      this.y,
      50,
      50,
      this.player.x,
      this.player.y,
      50,
      50
    );
    //console.log('mask');
    if (collided && this.isMask) {
      this.player.hasPowerup = true;
      this.player.isInfected = false;
      this.player.hasMask = true;
    } else if (collided && this.isSanitizer) {
      this.player.hasPowerup = true;
      this.player.isInfected = false;
      this.player.hasSanitizer = true;
    }
    /*
    if ((collided && this.isMask) || (collided && this.isSanitizer)) {
      this.player.hasPowerup = true;
      this.player.isInfected = false;
      //return true;
    }
    */
  }

  removePowerup() {
    this.player.hasPowerup = false;
  }

  checkCollision() {
    let isCollided = collideRectRect(
      this.x,
      this.y,
      50,
      50,
      this.player.x,
      this.player.y,
      50,
      50
    );

    if (!isCollided || !this.canHit) {
      return;
    }
    if (this.player.hasPowerup == false) {
      if (this.isVirus) {
        this.player.lives.pop();
      }

      if (isCollided && this.isVirus) {
        this.player.isInfected = true;
      } else {
        this.player.isInfected = false;
      }
    }
    
    if (this.isMask || this.isSanitizer) {
      this.player.score++;
    }

    this.canHit = false;
  }

  move() {
    if (!this.canHit) {
      this.x = width + grid;
      this.y = random(0, height - grid);
    }
    this.x -= this.speed;
    if (this.x < 0 - grid) {
      this.x = width + grid; //slide in from the right
      this.y = random(0, height - grid);
    }
    this.canHit = true;
  }
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.xSpeed = 0;
    this.ySpeed = 2;
    this.hasPowerup = false;
    this.hasMask = false;
    this.hasSanitizer = false;

    //lives and score
    this.lives = [heartImg, heartImg, heartImg]; //3 heart images
    this.score = 0;
  }

  dir(x, y) {
    this.xSpeed = x;
    this.ySpeed = y;
  }

  show() {
    if (this.isInfected) {
      image(infectedPersonImg, this.x, this.y, 150, 110);
    } else if (this.hasPowerup) {
      image(maskPersonImg, this.x, this.y, 150, 110);
    } else {
      image(personImg, this.x, this.y, 150, 110);
    }
    let size = 85;
    for (let x = 0; x < this.lives.length; x++) {
      image(heartImg, size, 35, 20, 20);
      size += 20;
    }
  }

  update() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    this.x = constrain(this.x, 0, width - 50);
    this.y = constrain(this.y, -20, height - 80);
  }
}
