import Board from './15-board.js';

window.location.href = 'index.html';
const TILE_SIZE = 64;  // Assuming each tile is 64x64 pixels
const BOARD_SIZE = 4;
const TILE_SPACING = 2;  // space of 5 pixels between tiles

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.startTime = null; // Track when the game starts
        this.timerEvent = null; // Phaser timer event
    }

    create() {
        // Set background color
        this.cameras.main.setBackgroundColor('#000');
    
        // Calculate tile and board size based on screen width
        const screenWidth = this.sys.game.config.width;
        const margin = 0.10 * screenWidth;
        const boardWidth = screenWidth - 2 * margin - 3 * TILE_SPACING;  // for a 4x4 board, there are 3 gaps between tiles
        const TILE_SIZE = boardWidth / BOARD_SIZE;
    
        // Create a new Board instance
        this.boardInstance = new Board();
        this.boardInstance.init_board();
    
        // Update class properties
        this.TILE_SIZE = TILE_SIZE;
        this.margin = margin;
    
        // Create tiles on the scene based on the board configuration
        this.renderBoard();
    }

    renderBoard() {
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                let tileValue = this.boardInstance.board[i * BOARD_SIZE + j].value;
    
                // Decide the color based on the tile value
                let fillColor = tileValue === -1 ? 0xC0C0C0 : 0x000000;
    
                // Offset by the margin when drawing
                let xPosition = this.margin + j * (this.TILE_SIZE + TILE_SPACING);
                let yPosition = this.margin + i * (this.TILE_SIZE + TILE_SPACING);
    
                // Create a rounded rectangle using Graphics API
                let graphics = this.add.graphics({ lineStyle: { width: 5, color: 0xFFFFFF }, fillStyle: { color: fillColor } });
                graphics.strokeRoundedRect(xPosition, yPosition, this.TILE_SIZE, this.TILE_SIZE, 10);
                graphics.fillRoundedRect(xPosition, yPosition, this.TILE_SIZE, this.TILE_SIZE, 10);
    
                // Set interactivity
                graphics.setInteractive(new Phaser.Geom.Rectangle(xPosition, yPosition, this.TILE_SIZE, this.TILE_SIZE), Phaser.Geom.Rectangle.Contains);
    
                // If tile is not empty, add a text object to it
                if (tileValue !== -1) {
                    let text = this.add.text(xPosition + this.TILE_SIZE / 2, yPosition + this.TILE_SIZE / 2, tileValue, { 
                        font: "24px Verdana",
                        fill: "#FFF" // white color
                    }).setOrigin(0.5, 0.5);
                }
    
                graphics.on('pointerdown', () => {
                    // If it's the first move, start the timer
                    if (!this.startTime) {
                        this.startTimer();
                    }
                    
                    this.boardInstance.switch_tile(tileValue);
                    this.refreshBoard();
                    
                    if (this.boardInstance.is_solved()) {
                        this.stopTimer();
                        alert(`Puzzle Solved in ${Math.round(this.timerEvent.elapsed / 1000)} seconds`);
                        this.resetGame();
                    }
                });
            }
        }
    }       

    startTimer() {
        this.startTime = Date.now();
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: () => {}, // Do nothing, just for tracking
            loop: true
        });
    }

    stopTimer() {
        if (this.timerEvent) {
            this.timerEvent.destroy();
            this.timerEvent = null;
            this.startTime = null;
        }
    }

    resetGame() {
        this.children.removeAll();
        this.boardInstance.init_board();
        this.renderBoard();
    }

    refreshBoard() {
        // Clear old tiles and render new state
        this.children.removeAll();
        this.renderBoard();
    }
}

const config = {
    type: Phaser.AUTO,
    width: TILE_SIZE * BOARD_SIZE,
    height: TILE_SIZE * BOARD_SIZE,
    parent: 'phaser-game',
    scene: [MainScene]
};

const game = new Phaser.Game(config);
