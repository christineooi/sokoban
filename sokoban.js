const map = [
    "  WWWWW ",
    "WWW   W ",
    "WOSB  W ",
    "WWW BOW ",
    "WOWWB W ",
    "W W O WW",
    "WB XBBOW",
    "W   O  W",
    "WWWWWWWW"
  ];

const mapArray = [];

for (let i = 0; i < map.length; i++) {
    mapArray.push([]);
    mapArray[i].push(...map[i].split(""));
}    

// console.log("mapArray: \n" + JSON.stringify(mapArray));

maxCols = mapArray[0].length;
maxRows = mapArray.length;

cellSize = 40;

var startTop=cellSize*2;
var startLeft=cellSize*2;

var playYPos;
var playXPos;

var boxOnStorageCount = 0;
var numOfBoxes = 0;

var gameOver = false;

function setMessage(msg){
    var msgEl = document.getElementById("message"); 
    msgEl.innerHTML = msg;
}

// If the number of boxes on storage equals the number of boxes, then set 
// gameOver flag to true
function isGameOver(){
    if (boxOnStorageCount === numOfBoxes){
        gameOver = true;
    }
    return gameOver;
}

// Takes current position array, the value to set it to, the new position array and the value to set that to
function updateMapArray(oldpos, ovalue, newpos, nvalue){
    mapArray[oldpos.y][oldpos.x] = ovalue;
    mapArray[newpos.y][newpos.x] = nvalue;
}

function updatePlayerPos(newpos){
    playXPos = newpos.x;
    playYPos = newpos.y;
}

function getNextPosition (arr, direction, num) {
    var nextPos;
    if (direction === "right") {
        nextPos = {
            x: (arr.x)+num,
            y: arr.y
        }
    } else if (direction === "up") {
        nextPos = {
            x: arr.x,
            y: (arr.y)-num
        }
    } else if (direction === "down"){
        nextPos = {
            x: arr.x,
            y: (arr.y)+num
        }
    } else if (direction === "left") {
        nextPos = {
            x: (arr.x)-num,
            y: arr.y
        }
    }
    return nextPos;
}

function getDirection (key) {
  var direction;  
  if (key === "ArrowRight"){
    direction = "right";
  } else if (key === "ArrowUp") {
    direction = "up";
  } else if (key === "ArrowDown") {
    direction = "down";
  } else if (key === "ArrowLeft") {
    direction = "left";
  }
  return direction;
}

function movePlayer(direction){
    var playerEl = document.getElementById("player");
    if (direction  === "right"){
        startLeft = startLeft + cellSize;
        playerEl.style.left = startLeft + "px";
    } else if (direction === "up"){
        startTop = startTop - cellSize;
        playerEl.style.top = startTop + "px";
    } else if (direction === "down"){
        startTop = startTop + cellSize;
        playerEl.style.top = startTop + "px";
    } else if (direction === "left"){
        startLeft = startLeft - cellSize;
        playerEl.style.left = startLeft + "px";
    }
}

document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    console.log('keydown event\n\n' + 'key: ' + keyName);
    var direction = getDirection(keyName);
    var currentPosition =  {
        x: playXPos,
        y: playYPos
    }

    var positionOneOver;
    var positionTwoOver;
    var playerValue = mapArray[currentPosition.y][currentPosition.x];

    // If game is not over
    if (!isGameOver()) {
        positionOneOver = getNextPosition(currentPosition,direction,1);
        positionTwoOver = getNextPosition(currentPosition,direction,2); 
        // If floor is next to player, player can move so update mapArray with new position values, 
        // update player current position and recreate the mapArray based on the new position values, 
        // and move the player
        if (mapArray[positionOneOver.y][positionOneOver.x] === " "){
            if (playerValue === "S") {
                updateMapArray(currentPosition," ",positionOneOver,"S");
            } else if (playerValue === "V"){
                updateMapArray(currentPosition,"O",positionOneOver,"S");
            }
            updatePlayerPos(positionOneOver);
            createMap();
            movePlayer(direction);
        }
        // If storage is next to player, player can move so update mapArray, update player current position,
        // recreate the interface based on mapArray and move the player
        // Note: Player over storage is represented by "V" in mapArray
        if (mapArray[positionOneOver.y][positionOneOver.x] === "O") {
            if (playerValue === "S") {         
                updateMapArray(currentPosition," ",positionOneOver,"V");
            } else if (playerValue === "V"){
                updateMapArray(currentPosition,"O",positionOneOver,"V");
            }
            updatePlayerPos(positionOneOver);
            createMap();
            movePlayer(direction);
        }
        // If next position is a box, and two positions over is either the floor or storage
        if (mapArray[positionOneOver.y][positionOneOver.x] === "B") {
            if (mapArray[positionTwoOver.y][positionTwoOver.x] === " ") {
                // Move box over
                updateMapArray(positionOneOver," ",positionTwoOver,"B");
                // Move player
                if (playerValue === "S"){             
                    updateMapArray(currentPosition," ",positionOneOver,"S");
                } else if (playerValue === "V"){
                    updateMapArray(currentPosition,"O",positionOneOver,"S");
                }     
                updatePlayerPos(positionOneOver);
                createMap();  
                movePlayer(direction);
            } else if (mapArray[positionTwoOver.y][positionTwoOver.x] === "O") {
                // Move box over
                updateMapArray(positionOneOver," ",positionTwoOver,"X");
                boxOnStorageCount++;
                // Move player
                if (playerValue === "S"){  
                    updateMapArray(currentPosition," ",positionOneOver,"S");
                } else if (playerValue === "V"){
                    updateMapArray(currentPosition,"O",positionOneOver,"S");
                }     
                updatePlayerPos(positionOneOver);
                createMap(); 
                movePlayer(direction);
            }
        }
        // If next position over is box-on-storage and two positions over is the floor or storage
        if (mapArray[positionOneOver.y][positionOneOver.x] === "X"){
            if (mapArray[positionTwoOver.y][positionTwoOver.x] === " ") {
                // Move box over
                updateMapArray(positionOneOver,"O",positionTwoOver,"B");
                boxOnStorageCount--;
                // Move player
                if (playerValue === "S"){             
                    updateMapArray(currentPosition," ",positionOneOver,"V");
                } else if (playerValue === "V"){
                    updateMapArray(currentPosition,"O",positionOneOver,"V");
                }     
                updatePlayerPos(positionOneOver);
                createMap();  
                movePlayer(direction);
            } else if (mapArray[positionTwoOver.y][positionTwoOver.x] === "O") {
                // Move box over
                updateMapArray(positionOneOver,"O",positionTwoOver,"X");
                boxOnStorageCount++;
                // Move player
                if (playerValue === "S"){  
                    updateMapArray(currentPosition," ",positionOneOver,"V");
                } else if (playerValue === "V"){
                    updateMapArray(currentPosition,"O",positionOneOver,"V");
                }     
                updatePlayerPos(positionOneOver);
                createMap(); 
                movePlayer(direction);
            }
        }
        if (isGameOver()){
            setMessage("You have finished the game!");
        }

    } // end !gameOver

});

// Set player starting position and initial counts
function setPlayerStartPos (){ 
    for (let i=0; i<maxRows; i++){
        for (let j=0; j<maxCols; j++){
            if (mapArray[i][j] === "S"){
                playYPos = i;
                playXPos = j;
            } else if (mapArray[i][j] === "X"){
                boxOnStorageCount++;
                numOfBoxes++;
            } else if (mapArray[i][j] === "B"){
                numOfBoxes++;
            }
            
        }
    }
}

function createPlayer(){
    divEl = document.createElement("div");
    divEl.className = "cell player";
    divEl.setAttribute("id", "player");
    divEl.style.top = startTop + "px";
    divEl.style.left = startLeft + "px";
    document.getElementById("container").appendChild(divEl);  
}

function createDiv(type) {
    divEl = document.createElement("div");
    divEl.className = "cell " + type;
    document.getElementById("container").appendChild(divEl);       
}

// Called onload of page and everytime the arrow buttons are pressed
function createMap() {
    // Remove any child elements as they will be re-created below 
    var parentEl = document.getElementById("container");
    while ( parentEl.firstChild ) {
        parentEl.removeChild( parentEl.firstChild );
    }
    createPlayer();
    for (let i = 0; i < maxRows; i++) {
        for (let j = 0; j < maxCols; j++) {
            if (mapArray[i][j] === "W") {
                createDiv("wall");
            }
            if (mapArray[i][j] === " ") {
                createDiv("floor");
            }
            if (mapArray[i][j] === "S" || mapArray[i][j] === "V") {
                createDiv("start");
            }
            if (mapArray[i][j] === "O") {
                createDiv("storage");
            }
            if (mapArray[i][j] === "B") {
                createDiv("box");
            }
            if (mapArray[i][j] === "X") {
                createDiv("boxonstorage");
            }
        
        }
    }

}

window.onload = function() {
    createMap();
    setPlayerStartPos();
};