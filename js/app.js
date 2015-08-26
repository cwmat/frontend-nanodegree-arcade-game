/*
app.js
frontend-nanodegree-arcade-game
(Frogger)
Written by Chaz Mateer and Udacity

This program attempts to recreate the arcade game Frogger.  The object of the game is to get your character across the street and to the river on the other side without running into the bugs.  Upon reaching the river the game will reset and you can try again.  Hit a bug and the game will also be reset though this event will count points against you while making it to the river gains points.  
*/

"use strict";
// Constants
var X_MOD = 101,
    Y_MOD = 83,
    END_OF_COLUMNS = 5 * X_MOD,
    BEFORE_COLUMNS = -1 * X_MOD,
    BEYOND_BOTTOM_ROW = 5 * Y_MOD,
    TOP_ROW = -Y_MOD,
    TOP_ROW_Y_COORD = Y_MOD / 2,
    MAX_SPEED = 500,
    MIN_SPEED = 100;

// Enemies our player must avoid
// Parameter: x, x coordinate of the enemy
// Parameter: y, y coordinate of the enemy
// Parameter: speed, the speed at which the enemy will move
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images

    this.sprite = 'images/enemy-bug.png';
    this.x = x * X_MOD;
    this.y = 82.5 * y - 23.333;
    this.speed = speed;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt;

    if (this.x >= END_OF_COLUMNS) {
        setRandomSpeed(this);
        this.x = BEFORE_COLUMNS;
    }

    // TODO add collision detection
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // Represents the main player character for the game
    this.sprite = 'images/char-boy.png';
    // Set x and y with a call to resetPlayer()
    this.resetPosition();
    this.score = 0;
    this.failure = 0;
}

// Update the player's position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.update = function(dt) {
    this.checkCollision(allEnemies);
}

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Handler method for keyup events (affects only arrow keys)
// Allows the PC to move.  
Player.prototype.handleInput = function(input) {
    var tempMove;
    switch (input) {
        case 'left':
            tempMove = this.x - X_MOD
            if (tempMove > BEFORE_COLUMNS) {
                this.x = tempMove;
            }
            break;
        case 'up':
            tempMove = this.y - Y_MOD
            if (tempMove > TOP_ROW) {
                this.y = tempMove;
            }
            if (this.y <= TOP_ROW_Y_COORD) {
                this.score++;
                printScore(this);
                this.resetPosition();
            }
            break;
        case 'right':
            tempMove = this.x + X_MOD
            if (tempMove < END_OF_COLUMNS) {
                this.x = tempMove;
            }
            break;
        case 'down':
            tempMove = this.y + Y_MOD;
            if (tempMove < BEYOND_BOTTOM_ROW) {
                this.y = tempMove;
            }
            break;
    }
}

// Resets the PC to the starting location
// Used on init, when the PC hits an enemy, and when the PC
// makes it to the river.
Player.prototype.resetPosition = function() {
    this.x = 2 * X_MOD;
    this.y = 82.5 * 5 - 23.333;
}

// Collision detection algorithm
// Determines if the PC has run into an enemy or has made it
// to the river.
Player.prototype.checkCollision = function(enemyArray) {
    var playerX,
        playerY,
        tempEnemyX,
        tempEnemyY,
        bugSizeX,
        bugSizeY,
        easY_MOD = 40,
        self = this;

    playerX = this.x;
    playerY = this.y;

    enemyArray.forEach(function(enemy) {
        tempEnemyX = enemy.x -20;
        bugSizeX = tempEnemyX + X_MOD;
        tempEnemyY = enemy.y;
        bugSizeY = tempEnemyY - Y_MOD;

        if (playerX >= tempEnemyX && playerX <= bugSizeX && playerY <= tempEnemyY && playerY >= bugSizeY) {
            self.failure++;
            printFailure(self);
            self.resetPosition();
        }
    });
}

// Randomize enemy inputs and push to enemy array.
var getRandomSpeed = function() {
    return Math.floor(Math.random() * (MAX_SPEED - MIN_SPEED + 1)) + MIN_SPEED
}

// Used to create a random speed for enemies after 
// they pass the final column.
var setRandomSpeed = function(enemy) {
    enemy.speed = getRandomSpeed();
}

// Randomizes enemy placement and speed.
var randomizeEnemy = function(allEnemies) {
    for (var row = 1; row <= 3; row ++) {
        for (var bug = 1; bug <= 1; bug++) {
            var randomSpeed = getRandomSpeed();
            allEnemies.push(new Enemy(-1, row, randomSpeed));
        }
    }
}

// Print score to index.html
var printScore = function(player) {
    var formattedScore = "<p>You have made it to the river: " + player.score + " times!</p>";
    $('#score').find('p').replaceWith(formattedScore);
}

// Print failures to index.html
var printFailure = function(player) {
    var formattedFails = "<p>You have been hit: " + player.failure + " times :[</p>";
    $('#failure').find('p').replaceWith(formattedFails);
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
// var allEnemies = [new Enemy(2, 3, 500), new Enemy(1, 1, 100), new Enemy(3, 2, 300)];
var allEnemies = [];
randomizeEnemy(allEnemies);
var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Prevent arrow key scrolling
document.addEventListener("keydown", function (e) {
  if([37,38,39,40].indexOf(e.keyCode) > -1){
    e.preventDefault();
  }
}, false);
