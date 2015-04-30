/**
  * These are global variables that control game play.
*/
var livesAllowed = 3;

/**
  * This object contains details about the images in the game. It allows images
  * with varying attributes to be swapped out for one another.
*/
var appCharacters = {
	'boy': {
		sprite: 'images/char-boy.png',
		centerX: 51,
		centerY: 101,
		offsetLeft: 16,
		offsetRight: 86,
		offsetTop: 62,
		offsetBottom: 136
	},
	'cat-girl': {
		sprite: 'images/char-cat-girl.png',
		centerX: 51,
		centerY: 100,
		offsetLeft: 15,
		offsetRight: 86,
		offsetTop: 60,
		offsetBottom: 136
	},
	'horn-girl': {
		sprite: 'images/char-horn-girl.png',
		centerX: 51,
		centerY: 100,
		offsetLeft: 6,
		offsetRight: 86,
		offsetTop: 60,
		offsetBottom: 136
	},
	'pink-girl': {
		sprite: 'images/char-pink-girl.png',
		centerX: 51,
		centerY: 101,
		offsetLeft: 12,
		offsetRight: 90,
		offsetTop: 61,
		offsetBottom: 138
	},
	'princess-girl': {
		sprite: 'images/char-princess-girl.png',
		centerX: 51,
		centerY: 96,
		offsetLeft: 12,
		offsetRight: 90,
		offsetTop: 51,
		offsetBottom: 142
	},
	'bug': {
		sprite: 'images/enemy-bug.png',
		centerX: 50,
		centerY: 109,
		offsetLeft: 0,
		offsetRight: 100,
		offsetTop: 76,
		offsetBottom: 142
	}
};

/**
  * This object manages the start screen and builds the appropriate
  * players and enemies once the game is ready to go.
*/
var StartScreen = function() {
	this._chars = [];
	this._characterCurrent = 0;
	this._spacingInRadians = 0;
	this._queueRadians = 0;
	this._radianIncrement = 0;
	this._selectedCharacter = '';
};

/**
  * This accessor method returns the selected character.
  * @return {string} - The selected character's name.
*/
StartScreen.prototype.getSelectedCharacter = function() {
	return this._selectedCharacter;
};

/**
  * This accessor method resets the selected player.
*/
StartScreen.prototype.resetAll = function() {
	this._selectedCharacter = '';
};

/**
  * This method updates the start screen settings in preparation for rendering.
  * @param {decimal} dt - A time delta value based on the user's computer processing
  *   speed which will allow a consistent rate of movement for all computers.
*/
StartScreen.prototype.update = function(dt) {
	var i;

	// The first time we execute this code, set some object instance variables.
	if (this._chars.length === 0) {
		this.buildCharacterArray();
	}

	// This section monitors for rotation radians in the queue and
	// sets any necessary rotation to incrementally reduce it.
	if (this._queueRadians > this._spacingInRadians * dt * 2) {
		this._radianIncrement = this._spacingInRadians * dt * 2;
		this._queueRadians -= this._spacingInRadians * dt * 2;
	} else if (this._queueRadians > 0) {
		this._radianIncrement = this._queueRadians;
		this._queueRadians = 0;
	} else if (this._queueRadians < (this._spacingInRadians * dt * -2)) {
		this._radianIncrement = this._spacingInRadians * dt * -2;
		this._queueRadians += this._spacingInRadians * dt * 2;
	} else if (this._queueRadians < 0) {
		this._radianIncrement = this._queueRadians;
		this._queueRadians = 0;
	} else {
		this._radianIncrement = 0;
	}
};

/**
  * This function renders elements for the start screen, applying any
  * rotation queued up by the user.
*/
StartScreen.prototype.render = function() {
	var
		i
		, char;

	// Set up the start screen.
	ctx.clearRect(0, 0, 505, 606);
	ctx.drawImage(Resources.get('images/Selector.png'), 200, 50);
	ctx.font = "16pt Impact"
	ctx.textAlign = 'center';
	ctx.fillStyle = 'black';
	ctx.fillText('Select player using left/right keys.', 245, 75);

	// Draw the characters to the screen appling any necessary rotation.
	for (i = 0; i < this._chars.length; i++) {
		this._chars[i].radians += this._radianIncrement;
	    char = this._chars[i];
		ctx.drawImage(
			Resources.get(char.sprite),
			250 + (150 * Math.cos(char.radians)) - char.centerX,
			300 + (150 * Math.sin(char.radians)) - char.centerY
		);
	}

	// If the rotation has stopped, tell the user how to start the game.
	if (this._radianIncrement === 0) {
		ctx.fillText('Press enter to start.', 255, 290);
	}
};

/**
  * This builds the character array used by the start screen, setting
  * their initial positions.
*/
StartScreen.prototype.buildCharacterArray = function() {
	// Count the characters in the App Characters object.
	var
		characterCount = 0,
		i,
		radians;

	for (i in appCharacters) {
		characterCount++;
	}
	// Calculate the character spacing in radians.
	this._spacingInRadians = Math.PI * 2 / characterCount;
	// Set the initial character's radians to 270 degrees (straight up) from the 0 axis.
	radians = Math.PI * 1.5;
	// Iterate over the characters adding them to our array.
	for (i in appCharacters) {
		char = appCharacters[i];
		this._chars.push({
			name: i,
			sprite: char.sprite,
			radians: radians,
			centerX: char.centerX,
			centerY: char.centerY
		});
		radians += this._spacingInRadians;
	}
};

/**
  * This method handles user input on the start screen.
  * @param {string} key - The key pressed by the user.
*/
StartScreen.prototype.handleInput = function(key) {
	switch(key) {
		case 'enter':
			// Only allow the game to begin if the rotation has stopped.
			if (this._queueRadians === 0) {
				this._selectedCharacter = this._chars[this._characterCurrent].name;
			}
			break;
		case 'right':
			if (this._characterCurrent > 0) {
				this._characterCurrent--;
			} else {
				this._characterCurrent = this._chars.length - 1;
			}
			this._queueRadians += this._spacingInRadians;
			break;
		case 'left':
			if (this._characterCurrent < this._chars.length - 1) {
				this._characterCurrent++;
			} else {
				this._characterCurrent = 0;
			}
			this._queueRadians -= this._spacingInRadians;
			break;

	}
};

/**
  * This is a super class from which all game characters will inherit some methods and properties.
*/
var Character = function() {
	this._sprite = '';
	this._x = 0;
	this._y = 0;
	this._centerX = 0;
	this._centerY = 0;
	this._offsetTop = 0;
	this._offsetBottom = 0;
	this._offsetLeft = 0;
	this._offsetRight = 0;
	this._offScreenLeft = 0;
	this._offScreenRight = 0;
};

/**
  * This accessor method will return the canvas X coordinate for the left edge of a character's visible image.
  * @return {int} - The canvas X coordinate.
*/
Character.prototype.getCharacterLeftEdge = function() {
	return this._x + this._offsetLeft;
};

/**
  * This accessor method will return the canvas X coordinate for the right edge of a character's visible image.
  * @return {int} - The canvas X coordinate.
*/
Character.prototype.getCharacterRightEdge = function() {
	return this._x + this._offsetRight;
};

/**
  * This accessor method will return the canvas Y coordinate for the top edge of a character's visible image.
  * @return {int} - The canvas Y coordinate.
*/
Character.prototype.getCharacterTopEdge = function() {
	return this._y + this._offsetTop;
};

/**
  * This accessor method will return the canvas Y coordinate for the bottom edge of a character's visible image.
  * @return {int} - The canvas Y coordinate.
*/
Character.prototype.getCharacterBottomEdge = function() {
	return this._y + this._offsetBottom;
};

/**
  * This is the class for the enemy character(s) which our player must avoid.
  * @param {string} character - The name of the 'appCharacters' character who will become the enemy.
  * @param {int} speed - The speed at which the enemy character will move.
*/
var Enemy = function(character, speed) {
	Character.call(this);
	this._sprite = appCharacters[character].sprite;
	this._centerX = appCharacters[character].centerX;
	this._centerY = appCharacters[character].centerY;
	this._offsetTop = appCharacters[character].offsetTop;
	this._offsetBottom = appCharacters[character].offsetBottom;
	this._offsetLeft = appCharacters[character].offsetLeft;
	this._offsetRight = appCharacters[character].offsetRight;
	this._offScreenLeft = -100
	this._offScreenRight = 650;
	this._speed = speed;
	this._stopped = false;
	this.getRandomStart();
};

/**
  * Inherit prototypes from the super class.
*/
Enemy.prototype = Object.create(Character.prototype);

/**
  * This method will update the enemy object's position.
  * @param {decimal} dt - A time delta value based on the user's computer processing
  *   speed which will allow a consistent rate of movement for all computers.
*/
Enemy.prototype.update = function(dt) {
	if (!this._stopped) {
		if (this._x < this._offScreenRight) {
			this._x += dt * this._speed;
		} else {
			this.getRandomStart();
		}
	}
};

/**
  * This method draws the enemy on the screen. Required method for game.
*/
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this._sprite), this._x, this._y);
};

/**
  * This method will set the enemy to a randomized starting position.
*/
Enemy.prototype.getRandomStart = function() {
	this._y = 172 + (Math.floor(Math.random() * 3) * 83) - this._centerY;
	this._x = this._offScreenLeft - (Math.floor(Math.random() * 100) + 1);
};

/**
  * This accessor method will return the speed of the enemy.
  * @return {int} - The speed of the enemy.
*/
Enemy.prototype.getSpeed = function() {
	return this._speed;
};

/**
  * This accessor method will set the stopped property for the enemy.
*/
Enemy.prototype.setStopped = function() {
	this._stopped = true;
};

/**
  * This is the class for the player that the user will navigate around
  * the screen.
*/
var Player = function() {
	Character.call(this);
	this._flyOffSpeed = 0;
	this._rotationAngle = 0;
	this._waterDepth = 0;
	this._minX = 0;
	this._maxX = 400;
	this._minY = 0;
	this._maxY = 390;
	this._hasMoved = false;
	this._lastKey = '';
};

/**
  * Inherit prototypes from the super class.
*/
Player.prototype = Object.create(Character.prototype);

/**
  * This method will set the character used for the player.
  * @param {string} character - The name of the 'appCharacters' character to use as the player.
*/
Player.prototype.setCharacter = function(character){
	this._sprite = appCharacters[character].sprite;
	this._startX = 200;
	this._startY = 505 - appCharacters[character].centerY;
	this._startColumn = 3;
	this._startRow = 6;
	this._currentColumn = 3;
	this._currentRow = 6;
	this._centerX = appCharacters[character].centerX;
	this._centerY = appCharacters[character].centerY;
	this._offsetLeft = appCharacters[character].offsetLeft;
	this._offsetRight = appCharacters[character].offsetRight;
	this._offsetTop = appCharacters[character].offsetTop;
	this._offsetBottom = appCharacters[character].offsetBottom;
	this._offScreenRight = 600;
	this._imageHeight = 171;
	this._imageWidth = 101;
	this.resetToStart();
};

/**
  * This accessor method returns the last key.
  * @return {string} - The last key pressed by the user.
*/
Player.prototype.getLastKey = function() {
	return this._lastKey;
};

/**
  * This accessor method returns the has moved value for the object.
  * @return {boolean} - A true/false indicating whether the player has ever been moved by the user.
*/
Player.prototype.hasMoved = function() {
	return this._hasMoved;
};

/**
  * This method is used to determine if the player is dead.
  * @return {boolean} - A true/false indicating whether the player is dead.
*/
Player.prototype.isDead = function() {
	return (this._flyOffSpeed > 0 && this._x >= this._offScreenRight) ||
		(this._waterDepth > 0 && (this._offsetBottom - this._waterDepth) <= this._offsetTop);
};

/**
  * This method is used to determine if the player is dying.
  * @return {boolean} - A true/false indicating whether the player is dying.
*/
Player.prototype.isDying = function () {
	return this._flyOffSpeed != 0 || this._waterDepth != 0;
};

/**
  * This accessor method is used to set the fly of speed when a player is struck by an enemy.
  * @speed {int} - The speed at which the player will fly off the screen.
*/
Player.prototype.setFlyoff = function(speed) {
	this._flyOffSpeed = speed;
};

/**
  * This method is used to determine if the player is flying off the screen.
  * @return {boolean} - A true/false indicating whether the player is flying off.
*/
Player.prototype.isFlyingOff = function () {
	return this._flyOffSpeed != 0;
};

/**
  * This method is used to determine if the player is dying.
  * @return {boolean} - A true/false indicating whether the player is dying.
*/
Player.prototype.isDrowning = function () {
	return this._waterDepth != 0;
};

/**
  * This accessor method is used to determine the player's water depth.
  * @return {int} - The depth of the player in the water.
*/
Player.prototype.getWaterDepth = function() {
	return this._waterDepth;
};

/**
  * This accessor method is used to determine the player's current column.
  * @return {int} - The current column.
*/
Player.prototype.getCurrentColumn = function() {
	return this._currentColumn;
};

/**
  * This accessor method is used to determine the player's current row.
  * @return {int} - The current row.
*/
Player.prototype.getCurrentRow = function() {
	return this._currentRow;
};

/**
  * This method compares the player's current column to a safe column and
  * determines if the player is in the water. If the player is in the water,
  * the method sets the initial depth.
  * @param {int} safeColumn - The current safe column.
*/
Player.prototype.checkDrowning = function(safeColumn) {
	if (this._currentColumn != safeColumn && this._currentRow === 1) {
		// We are on the water.
		this._waterDepth = 1;
	}
};

/**
  * This method resets the player to the starting position. It does not
  * reset all player settings.
*/
Player.prototype.resetToStart = function() {
	this._x = this._startX;
	this._y = this._startY;
	this._currentColumn = this._startColumn;
	this._currentRow = this._startRow;
	this._waterDepth = 0;
	this._flyOffSpeed = 0;
	this._rotationAngle = 0;
	this._hasMoved = false;
};

/**
  * This method resets all player settings and is used when restarting the game.
*/
Player.prototype.resetAll = function() {
	this._hasMoved = false;
	this.resetToStart();
};

/**
  * This method updates the player position properties.
  * @param {decimal} dt - A time delta value based on the user's computer processing
  *   speed which will allow a consistent rate of movement for all computers.
*/
Player.prototype.update = function(dt) {
	if (this._flyOffSpeed > 0) {
		if (this._x < this._offScreenRight) {
			// Make the player fly off screen to the right.
			this._x += dt * this._flyOffSpeed;
			this._y -= dt * 50;
			this._rotationAngle += dt * 600;
		}
	} else if (this._waterDepth > 0) {
		if ((this._offsetBottom - this._waterDepth) > this._offsetTop) {
			this._waterDepth += 50 * dt;
		}
	}
};

/**
  * This method draws the player to the game board.
*/
Player.prototype.render = function() {
	if (this._rotationAngle != 0) {
		// Make the player rotate as they fly off the screen.
		ctx.translate(this._x + this._centerX, this._y + this._centerY);
		ctx.rotate(this._rotationAngle * Math.PI / 180);
		ctx.drawImage(
		    Resources.get(this._sprite),
		    -1 * this._centerX,
		    -1 * this._centerY,
		    this._imageWidth,
		    this._imageHeight
		);
		ctx.rotate(-1 * this._rotationAngle * Math.PI / 180);
		ctx.translate(-1 * (this._x + this._centerX), -1 * (this._y + this._centerY));
	} else if (this._waterDepth != 0) {
		// Make the player sink into the water.
		ctx.drawImage(
			Resources.get(this._sprite),
			0,
			0,
			this._imageWidth,
			this._offsetBottom - this._waterDepth, // shorten the player
			this._x,
			this._y + this._waterDepth, // move player down
			this._imageWidth,
			this._offsetBottom - this._waterDepth // shorten the player
		);
	} else {
		ctx.drawImage(
		    Resources.get(this._sprite),
		    this._x,
		    this._y,
		    this._imageWidth,
		    this._imageHeight
		);
	}
};

/**
  * This method handles user input during game play and queues up changes
  * to the player position.
*/
Player.prototype.handleInput = function(key) {
	if (this._flyOffSpeed === 0 && this._waterDepth === 0) {
		switch(key) {
			case 'up':
				if (this._y > this._minY) {
					this._y -= 83;
					this._currentRow--;
				}
				this._hasMoved = true;
				break;
			case 'down':
				if (this._y < this._maxY) {
					this._y += 83;
					this._currentRow++;
				}
				this._hasMoved = true;
				break;
			case 'left':
				if (this._x > this._minX) {
					this._x -= 101;
					this._currentColumn--;
				}
				this._hasMoved = true;
				break;
			case 'right':
				if (this._x < this._maxX) {
					this._x += 101;
					this._currentColumn++;
				}
				this._hasMoved = true;
				break;
		}
	}
	this._lastKey = key;
};

/**
  * This object contains bubbles which are shown when the player is drowning.
*/
var Bubbles = function() {
	this._bubble = [];
	this._bubbleCount = 20;
};

/**
  * This method generates randomly placed and sized bubbles.
*/
Bubbles.prototype.createBubbles = function() {
	var i;

	// Clear any existing bubbles.
	this._bubble.splice(0, this._bubbleCount);
	// Create new randomized bubbles.
	for (i = 0; i < this._bubbleCount; i++) {
		this._bubble.push({
			offsetX: Math.floor((Math.random() * 70) + 15),
			radius: Math.floor((Math.random() * 4) + 1),
			floatSpeed: Math.random() * 5 / 6
		})
	}
};

/**
  * This method draws the bubbles to the game board around a drowning player. The bubbles
  *   will rise in relative proportion to the sinking player.
  * @param {int} column - The column where the bubbles are to be drawn.
  * @param {int} waterDepth - The player's depth int he water.
*/
Bubbles.prototype.render = function(column, waterDepth) {
	var
		i,
		bubble;

	ctx.fillStyle = '#E6E6FF'; // light blue
	for (i = 0; i < this._bubbleCount; i++) {
		bubble = this._bubble[i];
		ctx.beginPath();
		ctx.arc(
		    bubble.offsetX + (column - 1) * 101,
		    125 - (waterDepth * bubble.floatSpeed),
		    bubble.radius,
		    0,
		    2 * Math.PI
		);
		ctx.fill();
	}
};

/**
  * This object contains gems which the player will attempt to acquire.
*/
var Gems = function() {
	this._gem = [{
		sprite: 'images/Gem Blue.png',
		x: 440,
		y: 70,
		startX: 440,
		startY: 70,
		acquiredX: 8,
		acquiredY: 540,
		pickupColumn: 5,
		pickupRow: 1,
		width: 25,
		height: 40,
		rockX: 404,
		rockY: 40
	},
	{
		sprite: 'images/Gem Green.png',
		x: 238,
		y: 70,
		startX: 238,
		startY: 70,
		acquiredX: 40,
		acquiredY: 540,
		pickupColumn: 3,
		pickupRow: 1,
		width: 25,
		height: 40,
		rockX: 202,
		rockY: 40
	},
	{
		sprite: 'images/Gem Orange.png',
		x: 36,
		y: 70,
		startX: 36,
		startY: 70,
		acquiredX: 72,
		acquiredY: 540,
		pickupColumn: 1,
		pickupRow: 1,
		width: 25,
		height: 40,
		rockX: 0,
		rockY: 40
	}];
	this._gemMoveX = 0;
	this._gemMoveY = 0;
	this._gemCurrent = 0;
	this._gemInHand = false;
};

/**
  * This method indicates whether all the gems have been acquired.
  * @return {boolean} - A true/false indicating whether all gems are acquired.
*/
Gems.prototype.allAcquired = function() {
	return this._gemCurrent >= this._gem.length;
};

/**
  * This accessor method will return the column where the current gem
  * may be picked up by a player character.
  * @return {int} - The column where the gem is situated for pickup.
*/
Gems.prototype.getPickupColumn = function() {
	if (this._gemCurrent < this._gem.length) {
		return this._gem[this._gemCurrent].pickupColumn;
	} else {
		return 0;
	}
};

/**
  * This method updates the gem position properties.
  * @param {int} col - The column where the player if located.
  * @param {int} row - The row where the player is located.
  * @param {decimal} dt - A time delta value based on the user's computer processing
  *   speed which will allow a consistent rate of movement for all computers.
*/
Gems.prototype.update = function(col, row, dt) {
	if (this._gemInHand === true && this._gemCurrent < this._gem.length && this._gemMoveX === 0 && this._gemMoveY === 0) {
		if (this._gem[this._gemCurrent].y > 400) {
			// The gem was in hand and has been moved to the home area. Move it to the acquired zone.
			this._gemInHand = false;
			this._gemMoveX = (this._gem[this._gemCurrent].x - this._gem[this._gemCurrent].acquiredX) * dt;
			this._gemMoveY = (this._gem[this._gemCurrent].y - this._gem[this._gemCurrent].acquiredY) * dt;
		} else {
			this._gem[this._gemCurrent].x = 36 + (col - 1) * 101;
			this._gem[this._gemCurrent].y = 90 + (row - 1) * 83;
		}
	}
};

/**
  * This method checks to see if the player is in a position to pick up the gem.
  * @param {int} col - The column where the player if located.
  * @param {int} row - The row where the player is located.
*/
Gems.prototype.checkPickup = function(col, row) {
	if (this._gemInHand === false && this._gemCurrent < this._gem.length) {
		// The gem is not in hand. Check to see if the player is in a location to pick it up.
		if (col === this._gem[this._gemCurrent].pickupColumn
		    && row === this._gem[this._gemCurrent].pickupRow) {
			this._gemInHand = true;
			this._gem[this._gemCurrent].y = 90;
		}
	}
};

/**
  * This method resets all gem properties. It is generally used when starting a new game.
*/
Gems.prototype.resetAll = function() {
	var i;
	this._gemCurrent = 0;
	for (i = 0; i < this._gem.length; i++) {
		this._gem[i].x = this._gem[i].startX;
		this._gem[i].y = this._gem[i].startY;
	}
};

/**
  * This method resets the current gem properties. It is generally used when a player dies.
*/
Gems.prototype.resetToStart = function() {
	this._gem[this._gemCurrent].x = this._gem[this._gemCurrent].startX;
	this._gem[this._gemCurrent].y = this._gem[this._gemCurrent].startY;
	this._gemInHand = false;
};

/**
  * This method draws acquired gems to the lower left side of the game board.
*/
Gems.prototype.renderAcquired = function() {
	var
		i
		, img;

	for (i = 0; i < this._gemCurrent; i++) {
		img = this._gem[i];
		ctx.drawImage(
			Resources.get(img.sprite),
			img.acquiredX,
			img.acquiredY,
			img.width,
			img.height
		);
	}
};

/**
  * This method draws the current target gem to the appropriate location on the game board.
*/
Gems.prototype.renderTarget = function() {
	if (this._gemCurrent < this._gem.length) {
		if (this._gemMoveX != 0) {
			diff = this._gem[this._gemCurrent].x - this._gem[this._gemCurrent].acquiredX;
			if (Math.abs(diff) <= Math.abs(this._gemMoveX)) {
				this._gem[this._gemCurrent].x = this._gem[this._gemCurrent].acquiredX;
				this._gemMoveX = 0;
			} else {
				this._gem[this._gemCurrent].x -= this._gemMoveX;
			}
		}
		if (this._gemMoveY != 0) {
			diff = this._gem[this._gemCurrent].y - this._gem[this._gemCurrent].acquiredY;
			if (Math.abs(diff) <= Math.abs(this._gemMoveY)) {
				this._gem[this._gemCurrent].y = this._gem[this._gemCurrent].acquiredY;
				this._gemMoveY = 0;
			} else {
				this._gem[this._gemCurrent].y -= this._gemMoveY;
			}
		}
		ctx.drawImage(
		    Resources.get(this._gem[this._gemCurrent].sprite)
		    , this._gem[this._gemCurrent].x
		    , this._gem[this._gemCurrent].y
		    , this._gem[this._gemCurrent].width
		    , this._gem[this._gemCurrent].height
		);

		if (this._gem[this._gemCurrent].x === this._gem[this._gemCurrent].acquiredX
			&& this._gem[this._gemCurrent].x === this._gem[this._gemCurrent].acquiredX) {
			this._gemCurrent++;
		}
	}
};

/**
  * This method draws the rock upon which the current target gem is rested
  * while waiting for pickup.
*/
Gems.prototype.renderRock = function() {
	if (this._gemCurrent < this._gem.length) {
		ctx.drawImage(
			Resources.get('images/Rock.png'),
			this._gem[this._gemCurrent].rockX,
			this._gem[this._gemCurrent].rockY,
			100,
			100
		);
	}
};

/**
  * Instantiate all game objects.
*/
var allEnemies = [];
var player = new Player();
var startScreen = new StartScreen();
var gems = new Gems();
var bubbles = new Bubbles();

/**
  * This method listens for key presses and sends the keys to the
  * appropriate handler method.
*/
document.addEventListener('keyup', function(e) {
	var allowedKeys = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down',
		13: 'enter'
	};
	if (showStartScreen === true) {
		startScreen.handleInput(allowedKeys[e.keyCode]);
	} else {
		player.handleInput(allowedKeys[e.keyCode]);
	}
});
