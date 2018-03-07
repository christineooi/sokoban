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

    

console.log("map: \n" + JSON.stringify(map));


maxCols = map[0].length;
maxRows = map.length;

cellSize = 40;

var startTop=cellSize*2;
var startLeft=cellSize*2;

var playYPos;
var playXPos;

var boxCount = 0;
var boxOnStorageCount = 0;
var numOfBoxes = 0;

var gameOver = false;

function setMessage(msg){
    var msgEl = document.getElementById("message"); 
    msgEl.innerHTML = msg;
}

function isGameOver (){
    if (boxOnStorageCount === numOfBoxes){
        gameOver = true;
    }
    return gameOver;
}

function move(item, direction){
    var itemEl = document.getElementById(item);
    if (direction === "right") {
        startLeft = startLeft + cellSize;
        itemEl.style.left = startLeft + "px";
    } else if (direction === "up") {
        startTop = startTop - cellSize;
        itemEl.style.top = startTop + "px";
    } else if (direction === "down") {
        startTop = startTop + cellSize;
        itemEl.style.top = startTop + "px";
    } else if (direction === "left") {
        startLeft = startLeft - cellSize;
        itemEl.style.left = startLeft + "px";
    }
}

function updateMap(){

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

document.addEventListener('keydown', (event) => {
    // setMessage("");
    const keyName = event.key;
    console.log('keydown event\n\n' + 'key: ' + keyName);
    var direction = getDirection(keyName);
    var currentPosition =  {
        x: playXPos,
        y: playYPos
    }
console.log("currentPosition.y: " + currentPosition.y);
console.log("currentPosition.x: " + currentPosition.x);
    var positionOneOver;
    var positionTwoOver;
    // If game is not over
    if (!gameOver) {
        positionOneOver = getNextPosition(currentPosition,direction,1);
        positionTwoOver = getNextPosition(currentPosition,direction,2);
console.log("Player current position: " + map[currentPosition.y][currentPosition.x]);    
console.log("One position over from player: " + map[positionOneOver.y][positionOneOver.x]);  
console.log("Two positions over from player: " + map[positionTwoOver.y][positionTwoOver.x]);   

        if (map[positionOneOver.y][positionOneOver.x] === " " || map[positionOneOver.y][positionOneOver.x]  === "O"){
            console.log("Either floor or storage next to player");
        }

    } // end !gameOver

});

function setPlayerStartPos (){ 
    for (let i=0; i<maxRows; i++){
        for (let j=0; j<maxCols; j++){
            if (map[i][j] === "S"){
                playYPos = i;
                playXPos = j;
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

function createDiv(type,num) {
    divEl = document.createElement("div");
    divEl.className = "cell " + type;
    if (type === "box" || type === "boxonstorage") {
        divEl.setAttribute("id", type + num);
    }
    document.getElementById("container").appendChild(divEl);       
}

function createMaze() {
    var divEl;

//map[i].substr(j, 1) === " "
    for (let i = 0; i < maxRows; i++) {
        for (let j = 0; j < maxCols; j++) {
            if (map[i][j] === "W") {
                createDiv("wall");
            }
            if (map[i][j] === " ") {
                createDiv("floor");
            }
            if (map[i][j] === "S") {
                createDiv("start");
            }
            if (map[i][j] === "O") {
                createDiv("storage");
            }
            if (map[i][j] === "B") {
                boxCount++;
                numOfBoxes++;
                createDiv("box",boxCount);
            }
            if (map[i][j] === "X") {
                boxOnStorageCount++;
                numOfBoxes++;
                createDiv("boxonstorage",boxOnStorageCount);
            }
        
        }
    }

}

window.onload = function() {
    createMaze();
    createPlayer();
    setPlayerStartPos();
};