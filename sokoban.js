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
  
for (let i = 0; i < map.length; i++){
    mapArray.push(map[i].split(""));
}

// console.log("mapArray: \n" + JSON.stringify(mapArray));

maxCols = mapArray[0].length;
maxRows = mapArray.length;

cellSize = 40;

var playYPos;
var playXPos;
var startTop;
var startLeft;

var boxOnStorageCount = 0;
var numOfBoxes = 0;

var gameOver = false;

function setWidth(){
    var containerEl = document.getElementById("container");
    containerEl.style.width = cellSize*maxCols + "px";
}

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

function updateTasks(nextPosArray, direction){
    updatePlayerPos(nextPosArray);
    createMap();
    movePlayer(direction);
}

function handlePlayerValueInMapArray(playerVal, currPosArr, nextPosArr, nextPosValue){
    if (playerVal === "S") {
        updateMapArray(currPosArr," ",nextPosArr,nextPosValue);
    } else if (playerVal === "V"){
        updateMapArray(currPosArr,"O",nextPosArr,nextPosValue);
    }
}

document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    // console.log('keydown event\n\n' + 'key: ' + keyName);
    var direction = getDirection(keyName);
    var currentPosition =  {
        x: playXPos,
        y: playYPos
    }

    var playerValue = mapArray[currentPosition.y][currentPosition.x];

    // If game is not over
    if (!isGameOver()) {
        var positionOneOver = getNextPosition(currentPosition,direction,1);
        var positionTwoOver = getNextPosition(currentPosition,direction,2); 
        var valueOfPositionOneOver = mapArray[positionOneOver.y][positionOneOver.x];
        var valueOfPositionTwoOver = mapArray[positionTwoOver.y][positionTwoOver.x];
        // If floor is next to player, player can move so update mapArray with new position values, 
        // update player current position and recreate the mapArray based on the new position values, 
        // and move the player
        if (valueOfPositionOneOver === " "){
            handlePlayerValueInMapArray(playerValue, currentPosition, positionOneOver, "S");
            updateTasks(positionOneOver, direction);
        }
        // If storage is next to player, player can move so update mapArray, update player current position,
        // recreate the interface based on mapArray and move the player
        // Note: Player over storage is represented by "V" in mapArray
        if (valueOfPositionOneOver === "O") {
            handlePlayerValueInMapArray(playerValue, currentPosition, positionOneOver, "V");
            updateTasks(positionOneOver, direction);
        }
        // If next position is a box, and two positions over is either the floor or storage
        if (valueOfPositionOneOver === "B") {
            if (valueOfPositionTwoOver === " ") {
                // Move box over
                updateMapArray(positionOneOver," ",positionTwoOver,"B");
                // Move player
                handlePlayerValueInMapArray(playerValue, currentPosition, positionOneOver, "S");   
                updateTasks(positionOneOver, direction);
            } else if (valueOfPositionTwoOver === "O") {
                // Move box over
                updateMapArray(positionOneOver," ",positionTwoOver,"X");
                boxOnStorageCount++;
                // Move player
                handlePlayerValueInMapArray(playerValue, currentPosition, positionOneOver, "S");     
                updateTasks(positionOneOver, direction);
            }
        }
        // If next position over is box-on-storage and two positions over is the floor or storage
        if (valueOfPositionOneOver === "X"){
            if (valueOfPositionTwoOver === " ") {
                // Move box over
                updateMapArray(positionOneOver,"O",positionTwoOver,"B");
                // Decrease box-on-storage count
                boxOnStorageCount--;
                // Move player
                handlePlayerValueInMapArray(playerValue, currentPosition, positionOneOver, "V");     
                updateTasks(positionOneOver, direction);
            } else if (valueOfPositionTwoOver === "O") {
                // Move box over
                updateMapArray(positionOneOver,"O",positionTwoOver,"X");
                // Move player
                handlePlayerValueInMapArray(playerValue, currentPosition, positionOneOver, "V");    
                updateTasks(positionOneOver, direction);
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
                startTop=cellSize*playYPos; 
                startLeft=cellSize*(playXPos);     
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
    setWidth();
    setPlayerStartPos();
    createMap();  
};