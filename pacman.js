class Pacman {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = 4;
        this.nextDirection = 4;
        this.frameCount = 7;
        this.currentFrame = 1;
        setInterval(() => {
            this.changeAnimation();
        }, 100);
    }

    moveProcess() {
        this.changeDirectionIfPossible();
        this.moveForwards();
        if (this.checkCollisions()) {
            this.moveBackwards();
            return;
        }
    }

    eat() {
        for (let i = 0; i < mainMap.length; i++) {
            for (let j = 0; j < mainMap[0].length; j++) {
                if (
                    mainMap[i][j] == 2 &&
                    this.getMapX() == j &&
                    this.getMapY() == i
                ) {
                    mainMap[i][j] = 3;
                    score++;
                }
                if (
                    mainMap[i][j] == 5 &&
                    this.getMapX() == j &&
                    this.getMapY() == i
                ) {
                    mainMap[i][j] = 3;
                    countOfKeys++;
                }
            }
        }
    }

    moveBackwards() {
        switch (this.direction) {
            case DIRECTION_RIGHT: // Right
                this.x -= this.speed;
                break;
            case DIRECTION_UP: // Up
                this.y += this.speed;
                break;
            case DIRECTION_LEFT: // Left
                this.x += this.speed;
                break;
            case DIRECTION_BOTTOM: // Bottom
                this.y -= this.speed;
                break;
        }
    }

    moveForwards() {
        switch (this.direction) {
            case DIRECTION_RIGHT: // Right
                this.x += this.speed;
                break;
            case DIRECTION_UP: // Up
                this.y -= this.speed;
                break;
            case DIRECTION_LEFT: // Left
                this.x -= this.speed;
                break;
            case DIRECTION_BOTTOM: // Bottom
                this.y += this.speed;
                break;
        }
    }

    checkCollisions() {
        let isCollided = false;
        if ((
            mainMap[parseInt(this.y / oneBlockSize)][
                parseInt(this.x / oneBlockSize)
            ] == 1 ||
            mainMap[parseInt(this.y / oneBlockSize + 0.9999)][
                parseInt(this.x / oneBlockSize)
            ] == 1 ||
            mainMap[parseInt(this.y / oneBlockSize)][
                parseInt(this.x / oneBlockSize + 0.9999)
            ] == 1 ||
            mainMap[parseInt(this.y / oneBlockSize + 0.9999)][
                parseInt(this.x / oneBlockSize + 0.9999)
            ] == 1
        ) || (mainMap[parseInt(this.y / oneBlockSize)][
            parseInt(this.x / oneBlockSize)
        ] == 6 ||
        mainMap[parseInt(this.y / oneBlockSize + 0.9999)][
            parseInt(this.x / oneBlockSize)
        ] == 6 ||
        mainMap[parseInt(this.y / oneBlockSize)][
            parseInt(this.x / oneBlockSize + 0.9999)
        ] == 6 ||
        mainMap[parseInt(this.y / oneBlockSize + 0.9999)][
            parseInt(this.x / oneBlockSize + 0.9999)
        ] == 6
    )) {
            isCollided = true;
        }
        return isCollided;
    }

    checkGhostCollision(ghosts) {
        for (let i = 0; i < ghosts.length; i++) {
            let ghost = ghosts[i];
            if (
                ghost.getMapX() == this.getMapX() &&
                ghost.getMapY() == this.getMapY()
            ) {
                return true;
            }
        }
        return false;
    }

    changeDirectionIfPossible() {
        if (this.direction == this.nextDirection) return;
        let tempDirection = this.direction;
        this.direction = this.nextDirection;
        this.moveForwards();
        if (this.checkCollisions()) {
            this.moveBackwards();
            this.direction = tempDirection;
        } else {
            this.moveBackwards();
        }
    }

    getMapX() {
        let mapX = parseInt(this.x / oneBlockSize);
        return mapX;
    }

    getMapY() {
        let mapY = parseInt(this.y / oneBlockSize);

        return mapY;
    }

    getMapXRightSide() {
        let mapX = parseInt((this.x * 0.99 + oneBlockSize) / oneBlockSize);
        return mapX;
    }

    getMapYRightSide() {
        let mapY = parseInt((this.y * 0.99 + oneBlockSize) / oneBlockSize);
        return mapY;
    }

    changeAnimation() {
        this.currentFrame =
            this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
    }

    draw() {
        canvasContext.save();
        canvasContext.translate(
            this.x + oneBlockSize / 2,
            this.y + oneBlockSize / 2
        );
        canvasContext.rotate((this.direction * 90 * Math.PI) / 180);
        canvasContext.translate(
            -this.x - oneBlockSize / 2,
            -this.y - oneBlockSize / 2
        );
        canvasContext.drawImage(
            pacmanFrames,
            (this.currentFrame - 1) * oneBlockSize,
            0,
            oneBlockSize,
            oneBlockSize,
            this.x,
            this.y,
            this.width,
            this.height
        );
        canvasContext.restore();
        canvasContext.restore()
        canvasContext.lineWidth = vision;
        canvasContext.beginPath();
        canvasContext.strokeStyle = "#000000";
       canvasContext.arc(
         this.x + oneBlockSize / 2,
           this.y + oneBlockSize / 2,
           455,
           0,
           2 * Math.PI
       );
       canvasContext.stroke();
       canvasContext.restore()
        canvasContext.lineWidth = 3;
        canvasContext.beginPath();
        canvasContext.strokeStyle = "#000000";
       canvasContext.arc(
         this.x + oneBlockSize / 2,
           this.y + oneBlockSize / 2,
          smallVision,
           0,
           2 * Math.PI
       );
       canvasContext.stroke();
    }
    drawPacmamOnMiniMap(scaleFactor, miniMapOffsetX) {
        canvasContext.save();
        
        // Рассчитываем координаты на мини-карте, учитывая масштаб и смещение
        let miniMapX = this.x * scaleFactor + miniMapOffsetX;
        let miniMapY = this.y * scaleFactor;

        canvasContext.translate(
            miniMapX + oneBlockSize / 2,
            miniMapY + oneBlockSize / 2
        );
        
        canvasContext.translate(
            -miniMapX - oneBlockSize / 2,
            -miniMapY - oneBlockSize / 2
        );

        // Рисуем Pacman на мини-карте
        canvasContext.beginPath();
        canvasContext.arc(miniMapX+3.5, miniMapY+3.5, this.width * scaleFactor / 2, 0, Math.PI * 2);
        canvasContext.fillStyle = "yellow";
        canvasContext.fill();

        canvasContext.restore();
    }
}
