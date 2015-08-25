// Global "magic numbers"
var xMod = 101,
    yMod = 85.5 ,
    endOfColumns = 5 * xMod,
    beforeColumns = -1 * xMod,
    beyondBottomRow = 5 * yMod,
    topRow = -yMod,
    topRowYCoord = -38.33299999999997,
    maxSpeed = 500,
    minSpeed = 100;

// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images

    this.sprite = 'images/enemy-bug.png';
    this.x = x * xMod;
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

    if (this.x >= endOfColumns) {
        setRandomSpeed(this);
        this.x = beforeColumns;
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
    this.sprite = 'images/char-boy.png';
    // Set x and y with a call to resetPlayer()
    this.resetPosition();
    this.score = 0;
    this.failure = 0;
}

Player.prototype.update = function(dt) {
    checkCollision(this, allEnemies);
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(input) {
    var tempMove;
    switch (input) {
        case 'left':
            tempMove = this.x - xMod
            if (tempMove > beforeColumns) {
                this.x = tempMove;
            }
            break;
        case 'up':
            tempMove = this.y - yMod
            if (tempMove > topRow) {
                this.y = tempMove;
            }
            if (this.y <= topRowYCoord) {
                this.score++;
                printScore(this);
                this.resetPosition();
            }
            break;
        case 'right':
            tempMove = this.x + xMod
            if (tempMove < endOfColumns) {
                this.x = tempMove;
            }
            break;
        case 'down':
            tempMove = this.y + yMod;
            if (tempMove < beyondBottomRow) {
                this.y = tempMove;
            }
            break;
    }
}

Player.prototype.resetPosition = function() {
    this.x = 2 * xMod;
    this.y = 82.5 * 5 - 23.333;
}

// Randomize enemy inputs and push to enemy array
var getRandomSpeed = function() {
    return Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed
}

var setRandomSpeed = function(enemy) {
    enemy.speed = getRandomSpeed();
}

var randomizeEnemy = function(allEnemies) {
    for (var row = 1; row <= 3; row ++) {
        for (var bug = 1; bug <= 1; bug++) {
            var randomSpeed = getRandomSpeed();
            allEnemies.push(new Enemy(-1, row, randomSpeed));
        }
    }
}

// Check Collision
var checkCollision = function(player, enemyArray) {
    var playerX,
        playerY,
        tempEnemyX,
        tempEnemyY,
        easyMod = 40;

    playerX = player.x;
    playerY = player.y;

    enemyArray.forEach(function(enemy) {
        tempEnemyX = enemy.x -20;
        bugSizeX = tempEnemyX + xMod;
        tempEnemyY = enemy.y;
        bugSizeY = tempEnemyY - yMod;

        if (playerX >= tempEnemyX && playerX <= bugSizeX && playerY <= tempEnemyY && playerY >= bugSizeY) {
            player.failure++;
            printFailure(player);
            player.resetPosition();
        }
    });
}

// Print score
var printScore = function(player) {
    var formattedScore = "<p>You have made it to the river: " + player.score + " times!</p>";
    $('#score').find('p').replaceWith(formattedScore);
}

// Print failures
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
