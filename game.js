const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacmanFrames = document.getElementById("animation");
const ghostFrames = document.getElementById("ghosts");

let createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
};

const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;
let lives = 3;
let ghostCount = 1;
let level = 1;
let xExitCube = 0;
let yExitCube = 0;  
let xNow = 0;
let yNow = 0;
let wallColor = "#008080" ;
let doorColor = "yellow";
let windowColor = "blue";

function CountFood(mapNow){
    let foodCount = 0;
    for (let i = 0; i < mapNow.length; i++) {
        for (let j = 0; j < mapNow[0].length; j++) {
       if(mapNow[i][j] == 2) {
           foodCount++;
         }
        }
    }
    return foodCount;
    }


    
function RandomExit(mapForGame){
    let allFood = CountFood(mapForGame);
    let randPos=parseInt(Math.random() * allFood);
    let counter = 0;
    for (let i = 0; i < mapForGame.length; i++) {
        for (let j = 0; j < mapForGame[0].length; j++) {
       if(mapForGame[i][j] == 2) {
            if(counter==randPos){
                mapForGame[i][j] =4;
            }
            counter++;
       }
    }
}
}

function FindNumOfExit(mapNow){ 
let counter = 0;
for (let i = 0; i < mapNow.length; i++) {
    for (let j = 0; j < mapNow[0].length; j++) {
       if(mapNow[i][j] == 4) {
         return counter
       }
       counter++;
    }
}
    return [xExitCube,yExitCube];
}

function generateUniqueRandomNumbers(count, min, max, mapForGameNow) {

    const uniqueNumbers = [];
    
    while (uniqueNumbers.length < count) {
        const randomNumber = parseInt(Math.random() * (max - min));
        
        if (!uniqueNumbers.includes(randomNumber) && (FindNumOfExit(mapForGameNow)!==randomNumber )) {
            uniqueNumbers.push(randomNumber);
        }
    }

    return uniqueNumbers;
}

function RandomKey(mapForGame){
    let allFood = CountFood(mapForGame);
    let randomKeys = generateUniqueRandomNumbers(5,0,allFood,mapForGame);
    let counter = 0;
    for (let i = 0; i < mapForGame.length; i++) {
        for (let j = 0; j < mapForGame[0].length; j++) {
       if(mapForGame[i][j] == 2) {
            if(randomKeys.includes(counter)){
                mapForGame[i][j] = 5;
            }
            counter++;
       }
    }
}
}

let ghostImageLocations = [
    { x: 0, y: 0 },
    { x: 176, y: 0 },
    { x: 0, y: 121 },
    { x: 176, y: 121 },
];

// Game variables
let fps = 25;
let pacman;
let oneBlockSize = 20;
let score = 0;
let miniMapBlock = 7;
let ghosts = [];
let miniMapOffset = 430;
let vision = 770;
let smallVision = 65;
let countOfKeys = 0;
let isOpened = false;
let wallSpaceWidth = oneBlockSize / 1.6;
let wallOffset = (oneBlockSize - wallSpaceWidth) / 2;
let wallInnerColor = "black";

// we now create the map of the walls,
// if 1 wall, if 0 not wall
// 21 columns // 23 rows

let map = maps1[parseInt(Math.random() * 3)];
RandomExit(map);
RandomKey(map);
let originalMap1= map.map(innerArray => innerArray.slice());
let map2 = maps2[parseInt(Math.random() * 3)];
RandomExit(map2);
RandomKey(map2);
let originalMap2= map2.map(innerArray => innerArray.slice());
let map3 = maps3[parseInt(Math.random() * 3)];
RandomExit(map3);
RandomKey(map3);
let originalMap3= map3.map(innerArray => innerArray.slice());

let mainMap = map;
let mainOriginalMap = originalMap1;
//let map = maps1[2];
let randomTargetsForGhosts = [
    { x: 1 * oneBlockSize, y: 1 * oneBlockSize },
    { x: 1 * oneBlockSize, y: (map.length - 2) * oneBlockSize },
    { x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize },
    {
        x: (map[0].length - 2) * oneBlockSize,
        y: (map.length - 2) * oneBlockSize,
    },
];


function FindExit(mapNow){
    xExitCube = 0;
    yExitCube = 0;   
for (let i = 0; i < mapNow.length; i++) {
    for (let j = 0; j < mapNow[0].length; j++) {
       if(mapNow[i][j] == 4) {
            xExitCube = j;
            yExitCube = i;
       }
    }
}
    return [xExitCube,yExitCube];
}

let createNewPacman = () => {
    pacman = new Pacman(
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize / 5
    );
}; 

let gameLoop = () => {
    draw();
    update();

};

let gameInterval = setInterval(gameLoop, 1000 / fps);



let restartPacmanAndGhosts = () => {
    createNewPacman();
    createGhosts();
};

let update = () => {
    if (countOfKeys>=5){
        isOpened = true;
    }
    xNow = pacman.getMapX();
    yNow = pacman.getMapY();
    let FindExitArr = FindExit(mainMap);
    pacman.moveProcess();
    pacman.eat(mainMap);
    updateGhosts();
    if (pacman.checkGhostCollision(ghosts)) {
        onGhostCollision(); 
    }
    if((countOfKeys>=5) && (xNow == FindExitArr[0]) && (yNow == FindExitArr[1]) ){

        switch (level) {
            case 1:
              level = 2;
              mainMap = map2;
              isOpened = false;
              mainOriginalMap = originalMap2;
              restartPacmanAndGhosts();
              wallColor = "#800000" ;
              vision *=1.04;
              smallVision=50;
              break;
            case 2:
                level = 3;
                mainMap = map3;
                isOpened = false;
                mainOriginalMap = originalMap3;
                restartPacmanAndGhosts();
                wallColor = "#808000" ;
                vision *=1.02;
                smallVision =40;
              break;
            case 3:
                drawWin(); 
                clearInterval(gameInterval);
              break;         
          }
            countOfKeys=0;
    }
};



let onGhostCollision = () => {
    lives--;
    restartPacmanAndGhosts();
    if (lives == 0) {
        gameOver();
    }
};
let gameOver = () =>{
    wallColor = "red";
    drawWalls();
    clearInterval(gameInterval);
    drawGameOver();
}
let drawGameOver = () =>{
    canvasContext.font = "30px Arcade Normal";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Game Over!", 75, 230);
}


let drawWin = () =>{
    canvasContext.font = "50px Arcade Normal";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Win!", 130, 240);
}
let drawFoods = () => {
    for (let i = 0; i < mainMap.length; i++) {
        for (let j = 0; j < mainMap[0].length; j++) {
            if (mainMap[i][j] == 2) {
                createRect(
                    j * oneBlockSize + oneBlockSize / 3,
                    i * oneBlockSize + oneBlockSize / 3,
                    oneBlockSize / 3,
                    oneBlockSize / 3,
                    "#FFFF00"
                );
                
            }
            if(mainMap[i][j]==5){
                createRect(
                    j * oneBlockSize + oneBlockSize / 3,
                    i * oneBlockSize + oneBlockSize / 3,
                    oneBlockSize / 3,
                    oneBlockSize / 3,
                    "#FFFF00"
                );
                createRect(
                    j * oneBlockSize + oneBlockSize / 2.5,
                    i * oneBlockSize + oneBlockSize / 2.5,
                    oneBlockSize / 5,
                    oneBlockSize / 5,
                    wallInnerColor
                );
                
                createRect(
                    j * oneBlockSize + oneBlockSize / 1.3,
                    i * oneBlockSize + oneBlockSize / 2.3,
                    oneBlockSize / 20,
                    oneBlockSize / 5,
                    "#FFFF00"
                );
                createRect(
                    j * oneBlockSize + oneBlockSize / 1.1,
                    i * oneBlockSize + oneBlockSize / 2.3,
                    oneBlockSize / 20,
                    oneBlockSize / 5,
                    "#FFFF00"
                );
                createRect(
                    j * oneBlockSize + oneBlockSize / 1.5,
                    i * oneBlockSize + oneBlockSize / 2.3,
                    oneBlockSize / 3,
                    oneBlockSize / 8,
                    "#FFFF00"
                );
            }
        }
    }
};
let drawFoodsOnMiniMap = () => {
    for (let i = 0; i < mainMap.length; i++) {
        for (let j = 0; j < mainMap[0].length; j++) {
            if (mainMap[i][j] == 2 || mainMap[i][j] == 5) {
                createRect(
                    j * miniMapBlock + miniMapBlock / 3 + miniMapOffset,
                    i * miniMapBlock + miniMapBlock / 3,
                    miniMapBlock / 3,
                    miniMapBlock / 3,
                    "#FFFF00"
                );
            }
        }
    }
};

let drawRemainingLives = () => {
    canvasContext.font = "12px Arcade Normal";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Lives: ", oneBlockSize *14, oneBlockSize * (mainMap.length + 1));

    for (let i = 0; i < lives; i++) {
        canvasContext.drawImage(
            pacmanFrames,
            2 * oneBlockSize,
            0,
            oneBlockSize,
            oneBlockSize,
            350 + i * oneBlockSize,
            oneBlockSize * mainMap.length + 2,
            oneBlockSize,
            oneBlockSize
        );
    }
};

let drawScore = () => {
    canvasContext.font = "12px Arcade Normal";
    canvasContext.fillStyle = "white";
    canvasContext.fillText(
        "Score:" + score ,
        0,
        oneBlockSize * (mainMap.length + 1)
    );
    canvasContext.fillText(
        "Keys: " + countOfKeys+" / 5" ,
        oneBlockSize * 6.2,
        oneBlockSize * (mainMap.length + 1)
    );
    canvasContext.fillText(
        "Level: " + level ,
        oneBlockSize * (mainMap.length),
        oneBlockSize * 9
    );
    canvasContext.font = "10px Arcade Normal";
    canvasContext.fillText(
        "To get out of the spaceship,",
        oneBlockSize * (mainMap.length-1.80),
        oneBlockSize * 11
    );
    canvasContext.fillText(
        "you need to go through 3 floors.",
        oneBlockSize * (mainMap.length-1.80),
        oneBlockSize * 12
    );
    canvasContext.fillText(
        "There are 5 keys hidden on each floor,",
        oneBlockSize * (mainMap.length-1.80),
        oneBlockSize * 13
    );
    canvasContext.fillText(
        "find them and run to the exit marked on the map.",
        oneBlockSize * (mainMap.length-1.80),
        oneBlockSize * 14
    );
    canvasContext.fillText(
        "Good luck!",
        oneBlockSize * (mainMap.length-1.80),
        oneBlockSize * 15
    );
    canvasContext.fillText(
        "P.S. An alien is chasing you",
        oneBlockSize * (mainMap.length-1.80),
        oneBlockSize * 17
    );
    canvasContext.fillText(
        "run away from him!",
        oneBlockSize * (mainMap.length-1.80),
        oneBlockSize * 18
    );
    canvasContext.fillText(
        "with each level you will have",
        oneBlockSize * (mainMap.length-1.80),
        oneBlockSize * 19
    );
    canvasContext.fillText(
        "less and less light...",
        oneBlockSize * (mainMap.length-1.80),
        oneBlockSize * 20
    );
};

let draw = () => {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    createRect(0, 0, canvas.width, canvas.height, "black");
    drawWalls();
    drawFoods();
    drawGhosts();
    pacman.draw();
    drawWallsOnMiniMap();
    drawFoodsOnMiniMap();
    pacman.drawPacmamOnMiniMap(7/20,miniMapOffset);
    drawScore();
    drawRemainingLives();
};
let drawWallsOnMiniMap = () =>{
        for (let i = 0; i < mainMap.length; i++) {
            for (let j = 0; j < mainMap[0].length; j++) {
                if (mainMap[i][j] == 1) {
                    createRect(
                        j * miniMapBlock + miniMapOffset,
                        i * miniMapBlock,
                        miniMapBlock,
                        miniMapBlock,
                        wallColor
                    );
                    
                }
                if (mainMap[i][j] == 6) {
                    createRect(
                        j * miniMapBlock + miniMapOffset,
                        i * miniMapBlock,
                        miniMapBlock,
                        miniMapBlock,
                        windowColor
                    );
                    
                }
                if (mainMap[i][j] == 4) {
                    createRect(
                        j * miniMapBlock + miniMapOffset,
                        i * miniMapBlock,
                        miniMapBlock,
                        miniMapBlock,
                        "yellow"
                    );
                    if (isOpened){
                        createRect(
                            j * miniMapBlock + miniMapOffset,
                            i * miniMapBlock,
                            miniMapBlock,
                            miniMapBlock,
                            "#66ff00"
                        );  
                    }
                }
                
            }
        }
    };

let drawWalls = () => {
    for (let i = 0; i < mainMap.length; i++) {
        for (let j = 0; j < mainMap[0].length; j++) {
            if (mainMap[i][j] == 1) {
                createRect(
                    j * oneBlockSize,
                    i * oneBlockSize,
                    oneBlockSize,
                    oneBlockSize,
                    wallColor
                );
                if (j > 0 && mainMap[i][j - 1] == 1) {
                    createRect(
                        j * oneBlockSize,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }

                if (j < mainMap[0].length - 1 && mainMap[i][j + 1] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }

                if (i < mainMap.length - 1 && mainMap[i + 1][j] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    );
                }

                if (i > 0 && mainMap[i - 1][j] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    );
                }
                
            }
            if (mainMap[i][j] == 4) {
                createRect(
                    j * oneBlockSize,
                    i * oneBlockSize,
                    oneBlockSize,
                    oneBlockSize/8,
                    doorColor
                );
                createRect(
                    j * oneBlockSize,
                    i * oneBlockSize+17.5,
                    oneBlockSize,
                    oneBlockSize/8,
                    doorColor
                );
                createRect(
                    j * oneBlockSize,
                    i * oneBlockSize,
                    oneBlockSize/8,
                    oneBlockSize,
                    doorColor
                );
                createRect(
                    j * oneBlockSize+17.5,
                    i * oneBlockSize,
                    oneBlockSize/8,
                    oneBlockSize,
                    doorColor
                );
                if (!isOpened){
                    createRect(
                        j * oneBlockSize+oneBlockSize/3.4,
                        i * oneBlockSize,
                        oneBlockSize/8,
                        oneBlockSize,
                        doorColor
                    );
                    createRect(
                        j * oneBlockSize+oneBlockSize/1.7,
                        i * oneBlockSize,
                        oneBlockSize/8,
                        oneBlockSize,
                        doorColor
                    );
                   
                    for (let m = 0; m < 4; m++) {
                    createRect(
                        j * oneBlockSize,
                        i * oneBlockSize+oneBlockSize*0.3*m,
                        oneBlockSize,
                        oneBlockSize/8,
                        doorColor
                    );
                }
                
                }
            }
            if (mainMap[i][j] == 6) {
                createRect(
                    j * oneBlockSize,
                    i * oneBlockSize,
                    oneBlockSize,
                    oneBlockSize,
                    windowColor
                );
                if (j > 0 && mainMap[i][j - 1] == 6) {
                    createRect(
                        j * oneBlockSize,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }

                if (j < mainMap[0].length - 1 && mainMap[i][j + 1] == 6) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }

                if (i < mainMap.length - 1 && mainMap[i + 1][j] == 6) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    );
                }

                if (i > 0 && mainMap[i - 1][j] == 6) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    );
                }
                
            }
            
        }
    }
};

let createGhosts = () => {
    ghosts = [];
    for (let i = 0; i < ghostCount; i++) {
        let newGhost = new Ghost(
            9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            oneBlockSize,
            oneBlockSize,
            pacman.speed / 2,
            ghostImageLocations[i % 4].x,
            ghostImageLocations[i % 4].y,
            124,
            116,
            6
        );
        ghosts.push(newGhost);
    }
};

createNewPacman();
createGhosts();
gameLoop();

window.addEventListener("keydown", (event) => {
    let k = event.keyCode;
    setTimeout(() => {
        if (k == 37 || k == 65) {
            // left arrow or a
            pacman.nextDirection = DIRECTION_LEFT;
        } else if (k == 38 || k == 87) {
            // up arrow or w
            pacman.nextDirection = DIRECTION_UP;
        } else if (k == 39 || k == 68) {
            // right arrow or d
            pacman.nextDirection = DIRECTION_RIGHT;
        } else if (k == 40 || k == 83) {
            // bottom arrow or s
            pacman.nextDirection = DIRECTION_BOTTOM;
        }
    }, 1);
});
