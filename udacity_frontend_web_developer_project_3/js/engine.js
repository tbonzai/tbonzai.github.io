/**
  * Engine.js
  * This file provides the game loop functionality (update entities and render),
  * draws the initial game board on the screen, and then calls the update and
  * render methods on your player and enemy objects (defined in your app.js).
  *
  * A game engine works by drawing the entire game screen over and over, kind of
  * like a flipbook you may have created as a kid. When your player moves across
  * the screen, it may look like just that image/character is moving or being
  * drawn but that is not the case. What's really happening is the entire "scene"
  * is being drawn over and over, presenting the illusion of animation.
  *
  * This engine is available globally via the Engine variable and it also makes
  * the canvas' context (ctx) object globally available to make writing app.js
  * a little simpler to work with.
*/

var Engine = (function(global) {
    /**
      * Predefine the variables we'll be using within this scope,
      * create the canvas element, grab the 2D context for that canvas
      * set the canvas elements height/width and add it to the DOM.
    */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    /**
      * This function serves as the kickoff point for the game loop itself
      * and handles properly calling the update and render methods.
    */
    function main() {
        /*
         * Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
        */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /*
         * Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
        */
        update(dt);
        render(dt);

        /*
         * Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
        */
        lastTime = now;

        /*
         * Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
        */
        win.requestAnimationFrame(main);
    };

    /**
      * This function does some initial setup that should only occur once,
      * particularly setting the lastTime variable that is required for the
      * game loop.
    */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /**
      * This function is called by main (our game loop) and itself calls all
      * of the functions which may need to update entity's data. Based on how
      * you implement your collision detection (when two entities occupy the
      * same space, for instance when your character should die), you may find
      * the need to add an additional function call here. For now, we've left
      * it commented out - you may or may not want to implement this
      * functionality this way (you could just implement collision detection
      * on the entities themselves within your app.js file).
      * @param {decimal} dt - A time delta value based on the user's computer processing
      *   speed which will allow a consistent rate of movement for all computers.
    */
    function update(dt) {
        updateEntities(dt);
        eventCheck();
    }

    /**
      * This function monitors for game changing events such as player/enemy
      * colisions, player drownings, etc.
    */
    function eventCheck() {
        if (player.isDead() === true || player.isDying() === true) {
            return;
        }
        // Iterate over the enemies and check for an character overlap on the player.
        for (i = 0; i < allEnemies.length; i++) {
            if (player.getCharacterLeftEdge() < allEnemies[i].getCharacterRightEdge()
                && player.getCharacterRightEdge() > allEnemies[i].getCharacterLeftEdge()
                && player.getCharacterTopEdge() < allEnemies[i].getCharacterBottomEdge()
                && player.getCharacterBottomEdge() > allEnemies[i].getCharacterTopEdge()) {
                // We have a collision. Transfer the motion from the enemy to the player.
                player.setFlyoff(allEnemies[i].getSpeed());
                allEnemies[i].setStopped();
            }
        }
        player.checkDrowning(gems.getPickupColumn());
        gems.checkPickup(player.getCurrentColumn(), player.getCurrentRow());
    }

    /**
      * This is called by the update function  and loops through all of the
      * objects within your allEnemies array as defined in app.js and calls
      * their update() methods. It will then call the update function for your
      * player object. These update methods should focus purely on updating
      * the data/properties related to  the object. Do your drawing in your
      * render methods.
      * @param {decimal} dt - A time delta value based on the user's computer processing
      *   speed which will allow a consistent rate of movement for all computers.
    */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        startScreen.update(dt);
        player.update(dt);
        gems.update(player.getCurrentColumn(), player.getCurrentRow(), dt);
    }

    /**
      * This function initially draws the "game level", it will then call
      * the renderEntities function. Remember, this function is called every
      * game tick (or loop of the game engine) because that's how games work -
      * they are flipbooks creating the illusion of animation but in reality
      * they are just drawing the entire screen over and over.
      * @param {decimal} dt - A time delta value based on the user's computer processing
      *   speed which will allow a consistent rate of movement for all computers.
    */
    function render(dt) {
        var
            i = 0
            , char
            , selectedCharacter;

        // Determine if the conditions are right to reshow the start screen.
        if (showStartScreen === false && (livesRemaining === 0 || gems.allAcquired()) & player.getLastKey() === 'enter') {
            showStartScreen = true;
        }

        if (showStartScreen === true) {
            // Check to see if the user has made a player selection.
            selectedCharacter = startScreen.getSelectedCharacter();
            if (selectedCharacter != '') {
                // Set up the game.
                startScreen.resetAll();
                gems.resetAll();
                bubbles.createBubbles();
                player.setCharacter(selectedCharacter);
                // Build the enemies.
                allEnemies.splice(0, allEnemies.length);
                for (char in appCharacters) {
                    i++;
                    // The count of enemies will always equal the count of non-bug characters.
                    if (char != 'bug') {
                        if (selectedCharacter === 'bug') {
                            // If the user selected the bug as their player, make enemies of the non-bug characters.
                            allEnemies.push(new Enemy(char, 300 + (i * 100)));
                        } else {
                            allEnemies.push(new Enemy('bug', 300 + (i * 100)));
                        }
                    }
                }
                selectedCharacter = '';
                livesRemaining = livesAllowed;
                showStartScreen = false;
            } else {
                startScreen.render();
            }
        } else if (player.isDead() === true) {
            // The player has died. Set everything back to the starting positions.
            livesRemaining--;
            gems.resetToStart();
            player.resetToStart();
            // Reset all enemies.
            for (i = 0; i < allEnemies.length; i++) {
                allEnemies[i].stopped = false;
                allEnemies[i].getRandomStart();
            }
        } else {
            /* This array holds the relative URL to the image used
             * for that particular row of the game level.
             */
            var rowImages = [
                    'images/water-block.png',   // Top row is water
                    'images/stone-block.png',   // Row 1 of 3 of stone
                    'images/stone-block.png',   // Row 2 of 3 of stone
                    'images/stone-block.png',   // Row 3 of 3 of stone
                    'images/grass-block.png',   // Row 1 of 2 of grass
                    'images/grass-block.png'    // Row 2 of 2 of grass
                ],
                numRows = 6,
                numCols = 5,
                row, col;

            /*
             * Loop through the number of rows and columns we've defined above
             * and, using the rowImages array, draw the correct image for that
             * portion of the "grid"
            */
            for (row = 0; row < numRows; row++) {
                for (col = 0; col < numCols; col++) {
                    /*
                     * The drawImage function of the canvas' context element
                     * requires 3 parameters: the image to draw, the x coordinate
                     * to start drawing and the y coordinate to start drawing.
                     * We're using our Resources helpers to refer to our images
                     * so that we get the benefits of caching these images, since
                     * we're using them over and over.
                    */
                    ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
                }
            }
            renderEntities();
        }
    }

    /**
      * This function is called by the render function and is called on each game
      * tick. It's purpose is to then call the render functions you have defined
      * on your enemy and player entities within app.js
    */
    function renderEntities() {
        // Clear the area where the queen's crown sometimes extends beyond the height of the top row.
        ctx.clearRect(0, 0, 505, 50);
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        renderLives();
        gems.renderAcquired();
        gems.renderRock();
        if (livesRemaining > 0 && gems.allAcquired() === true) {
            // Display the character selection instructions on the screen.
            ctx.font = "normal normal 50px arial"
            ctx.textAlign = 'center';
            ctx.fillStyle = '#FF0000';
            ctx.fillText('Congratulations!', 248, 185);
            ctx.fillText('You Won!', 248, 268);
            ctx.font = "normal normal 45px arial"
            ctx.fillText('Press enter to continue', 248, 351);
        } else if (livesRemaining > 0) {
            if (player.hasMoved === false) {
                ctx.font = "normal normal 45px arial"
                ctx.textAlign = 'center';
                ctx.fillStyle = '#FF0000';
                ctx.fillText('Retrieve the gem', 248, 185);
                ctx.fillText('and bring it back.', 248, 268);
                ctx.fillText('Avoid the traffic', 248, 351);
                ctx.fillText('and the water.', 248, 434);
            }
            player.render();
            if (player.isDrowning()) {
                // Draw bubbles
                bubbles.render(player.getCurrentColumn(), player.getWaterDepth());
            }
        } else {
            // Display the character selection instructions on the screen.
            ctx.font = "normal normal 50px arial"
            ctx.textAlign = 'center';
            ctx.fillStyle = '#FF0000';
            ctx.fillText('Game Over', 248, 185);
            ctx.font = "normal normal 45px arial"
            ctx.fillText('Press enter to continue', 248, 351);
        }
        gems.renderTarget();
    }

    /**
      * This function draws the key images representing the number of lives.
    */
    function renderLives() {
    // Draw the keys representing player lives on the bottom to the screen.
      for (i = 0; i < livesRemaining; i++) {
        ctx.drawImage(
          Resources.get('images/Key.png'),
          455 - (i * 32),
          527,
          65,
          65
        );
      }
    }

    /**
      * This function does nothing but it could have been a good place to
      * handle game reset states - maybe a new game menu or a game over screen
      * those sorts of things. It's only called once by the init() method.
    */
    function reset() {
        // noop
    }

    /**
      * Go ahead and load all of the images we know we're going to need to
      * draw our game level. Then set init as the callback method, so that when
      * all of these images are properly loaded our game will start.
    */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/Selector.png',
        'images/Heart.png',
        'images/Star.png',
        'images/Key.png',
        'images/Rock.png',
        'images/Gem Blue.png',
        'images/Gem Green.png',
        'images/Gem Orange.png'
    ]);
    Resources.onReady(init);

    /**
      * Assign the canvas' context object to the global variable (the window
      * object when run in a browser) so that developer's can use it more easily
      * from within their app.js files.
    */
    global.ctx = ctx;

    /**
      * These are global variables that control game play.
    */
    global.livesRemaining = 0;
    global.showStarburst = true;
    global.showStartScreen = true;

})(this);
