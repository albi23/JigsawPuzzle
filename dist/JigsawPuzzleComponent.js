import { Utils } from "./Utils.js";
import { Point2D } from "./Point2D.js";
import { Piece } from "./Piece.js";
window.onload = window.onbeforeunload = () => {
    loadAll();
};
function loadAll() {
    const urlParams = new URLSearchParams(window.location.search);
    const idImg = urlParams.get('id');
    const type = urlParams.get('type');
    const imgName = 'image'.concat(idImg).concat('.').concat(type);
    new JigsawPuzzleComponent(imgName);
}
var srcConst;
(function (srcConst) {
    srcConst["srcImg"] = "../assets/";
    srcConst["PUZZLE_HOVER_TINT"] = "#009900";
    srcConst["PUZZLE_MAIN"] = "#ff0012";
})(srcConst || (srcConst = {}));
export class JigsawPuzzleComponent {
    constructor(imageName) {
        this.imageName = imageName;
        this.pieces = [];
        this.mouse = new Point2D(0, 0);
        this.currentPiece = new Piece(0, 0, 0, 0);
        this.currentDropPiece = null;
        this.mainPiece = new Piece(0, 0, 0, 0);
        this.PUZZLE_COL = 4;
        this.PUZZLE_ROW = 4;
        this.pieceWidth = 0;
        this.pieceHeight = 0;
        this.img = new Image();
        this.yScale = 0;
        this.xScale = 0;
        this.canvas = JigsawPuzzleComponent.setDefaultCanvas();
        this.context = this.canvas.getContext("2d");
        this.getLoadedImg();
    }
    getLoadedImg() {
        this.loadImg().then(() => {
            const start = document.getElementById('start');
            start.addEventListener("click", () => (this.startGame(start)));
            (document.getElementById('btn'))
                .addEventListener('click', () => { this.changeColAndRow(); });
        }).catch(() => {
            const alertElem = (document.getElementById('alert'));
            alertElem.style.display = 'block';
            alertElem.innerText = 'Some error occurred during load image';
        });
    }
    loadImg() {
        return new Promise((resolve, reject) => {
            const url = srcConst.srcImg.concat(this.imageName);
            const newImgElem = document.createElement('img');
            const suitableCanvas = document.getElementById('can');
            newImgElem.setAttribute("src", url);
            newImgElem.setAttribute("alt", this.imageName);
            this.yScale = suitableCanvas.clientHeight / newImgElem.height;
            this.xScale = suitableCanvas.clientWidth / newImgElem.width;
            this.img = newImgElem;
            this.setPuzzleProperties();
            this.setCanvasProperties();
            this.initPuzzle();
            newImgElem.onload = () => {
                resolve(url);
            };
            newImgElem.onerror = () => {
                reject(url);
            };
        });
    }
    initPuzzle() {
        this.pieces = [];
        this.mouse = new Point2D(0, 0);
        this.currentPiece = null;
        this.currentDropPiece = null;
        this.drawScaledImage(0, 0, this.getPuzzleWidth(), this.getPuzzleHeight(), 0, 0, this.getPuzzleWidth(), this.getPuzzleHeight());
        this.buildPieces();
    }
    drawScaledImage(sx, sy, sw, sh, dx, dy, dw, dh) {
        this.context.drawImage(this.img, sx / this.xScale, sy / this.yScale, sw / this.xScale, sh / this.yScale, dx, dy, dw, dh);
    }
    buildPieces() {
        let x = 0;
        let y = 0;
        for (let i = 0; i < this.PUZZLE_COL * this.PUZZLE_ROW; i++) {
            this.pieces.push(new Piece(x, y, 0, 0));
            x += this.pieceWidth;
            if (x >= this.getPuzzleWidth()) {
                x = 0;
                y += this.pieceHeight;
            }
        }
    }
    shufflePuzzle() {
        this.context.clearRect(0, 0, this.getPuzzleWidth(), this.getPuzzleHeight());
        let piece;
        let xPos = 0;
        let yPos = 0;
        for (let i = 0; i < this.pieces.length; i++) {
            piece = this.pieces[i];
            piece.setXPos(xPos);
            piece.setYPos(yPos);
            this.drawScaledImage(piece.getX(), piece.getY(), this.pieceWidth, this.pieceHeight, xPos, yPos, this.pieceWidth, this.pieceHeight);
            this.context.strokeRect(xPos, yPos, this.pieceWidth, this.pieceHeight);
            xPos += this.pieceWidth;
            if (xPos >= this.getPuzzleWidth()) {
                xPos = 0;
                yPos += this.pieceHeight;
            }
        }
        this.findAndSetRedPiece();
        document.onmousedown = (e) => {
            this.onPuzzleClick(e);
        };
    }
    static setDefaultCanvas() {
        return document.getElementById("can");
    }
    setPuzzleProperties() {
        this.pieceHeight = Math.floor(this.yScale * this.img.height / this.PUZZLE_ROW);
        this.pieceWidth = Math.floor(this.xScale * this.img.width / this.PUZZLE_COL);
    }
    setCanvasProperties() {
        this.canvas.width = this.getPuzzleWidth();
        this.canvas.height = this.getPuzzleHeight();
        this.canvas.classList.add('rounded', 'img-fluid', 'bordered-img');
    }
    findAndSetRedPiece() {
        for (const piece of this.pieces) {
            if (piece.getXPos() === 0 && piece.getYPos() === 0) {
                this.drawMainPiece(piece);
                this.mainPiece = piece;
                break;
            }
        }
    }
    startGame(startButton) {
        if (startButton)
            startButton.innerText = "Reset Game";
        this.pieces = [...this.shuffle(this.pieces)];
        this.shufflePuzzle();
    }
    changeColAndRow() {
        const colInput = (document.getElementById('col'));
        const rowInput = (document.getElementById('row'));
        let row = parseInt(colInput.value);
        let col = parseInt(rowInput.value);
        if (row <= 1 || col <= 1 || row > 10 || col > 10) {
            (document.getElementById('alert')).style.display = 'block';
            this.clearInputsValue(colInput, rowInput);
            return;
        }
        this.PUZZLE_COL = col;
        this.PUZZLE_ROW = row;
        this.clearInputsValue(colInput, rowInput);
        this.setPuzzleProperties();
        this.initPuzzle();
        this.startGame();
    }
    clearInputsValue(colInput, rowInput) {
        colInput.value = "";
        rowInput.value = "";
    }
    shuffle(pieces) {
        for (let i = this.pieces.length - 1; i > 0; i--) {
            let nr = Utils.randomIntFromInterval(0, pieces.length - 1);
            Utils.swap(nr, i, pieces);
        }
        return pieces;
    }
    getPuzzleHeight() {
        return this.pieceHeight * this.PUZZLE_ROW;
    }
    getPuzzleWidth() {
        return this.pieceWidth * this.PUZZLE_COL;
    }
    onPuzzleClick(mouseEvent) {
        const clientRects = this.canvas.getClientRects()[0];
        this.setMousePosition(mouseEvent, clientRects);
        this.currentPiece = this.checkPieceClicked();
        if (this.currentPiece != null) {
            this.context.clearRect(this.currentPiece.getXPos(), this.currentPiece.getYPos(), this.pieceWidth, this.pieceHeight);
            this.context.save();
            this.context.globalAlpha = .9;
            this.drawScaledImage(this.currentPiece.getX(), this.currentPiece.getY(), this.pieceWidth, this.pieceHeight, this.mouse.getX() - (this.pieceWidth / 2), this.mouse.getY() - (this.pieceHeight / 2), this.pieceWidth, this.pieceHeight);
            this.context.restore();
            document.onmousemove = (e) => {
                this.updatePuzzle(e, clientRects);
            };
            document.onmouseup = () => {
                this.pieceDropped();
            };
        }
    }
    checkPieceClicked() {
        let piece;
        for (let i = 0; i < this.pieces.length; i++) {
            piece = this.pieces[i];
            if (this.mouse.getX() < piece.getXPos() ||
                this.mouse.getX() > (piece.getXPos() + this.pieceWidth) ||
                this.mouse.getY() < piece.getYPos() ||
                this.mouse.getY() > (piece.getYPos() + this.pieceHeight)) {
                //PIECE NOT HIT
            }
            else {
                if ((piece !== this.currentPiece) &&
                    ((piece.getXPos() == this.mainPiece.getXPos() && Math.abs(piece.getYPos() - this.mainPiece.getYPos()) === this.pieceHeight) ||
                        (piece.getYPos() == this.mainPiece.getYPos() && Math.abs(piece.getXPos() - this.mainPiece.getXPos()) === this.pieceWidth))) {
                    return piece;
                }
            }
        }
        return null;
    }
    updatePuzzle(e, clientRects) {
        this.currentDropPiece = null;
        this.setMousePosition(e, clientRects);
        this.context.clearRect(0, 0, this.getPuzzleWidth(), this.getPuzzleHeight());
        let piece;
        for (let i = 0; i < this.pieces.length; i++) {
            piece = this.pieces[i];
            if (piece == this.currentPiece) {
                continue;
            }
            this.drawScaledImage(piece.getX(), piece.getY(), this.pieceWidth, this.pieceHeight, piece.getXPos(), piece.getYPos(), this.pieceWidth, this.pieceHeight);
            this.context.strokeRect(piece.getXPos(), piece.getYPos(), this.pieceWidth, this.pieceHeight);
            if (this.currentDropPiece == null) {
                if (this.mouse.getX() < piece.getXPos() || this.mouse.getX() >
                    (piece.getXPos() + this.pieceWidth) || this.mouse.getY() < piece.getYPos()
                    || this.mouse.getY() > (piece.getYPos() + this.pieceHeight)) {
                    //NOT OVER
                }
                else {
                    if (piece === this.mainPiece) {
                        this.currentDropPiece = piece;
                        this.context.save();
                        this.context.globalAlpha = .4;
                        this.context.fillStyle = srcConst.PUZZLE_HOVER_TINT;
                        this.context.fillRect(this.currentDropPiece.getXPos(), this.currentDropPiece.getYPos(), this.pieceWidth, this.pieceHeight);
                        this.context.restore();
                    }
                    this.currentDropPiece = piece;
                }
            }
        }
        this.context.save();
        this.context.globalAlpha = .6;
        if (this.currentPiece) {
            this.drawScaledImage(this.currentPiece.getX(), (this.currentPiece).getY(), this.pieceWidth, this.pieceHeight, this.mouse.getX() - (this.pieceWidth / 2), this.mouse.getY() - (this.pieceHeight / 2), this.pieceWidth, this.pieceHeight);
        }
        this.context.restore();
        this.context.strokeRect(this.mouse.getX() - (this.pieceWidth / 2), this.mouse.getY() - (this.pieceHeight / 2), this.pieceWidth, this.pieceHeight);
    }
    setMousePosition(e, clientRects) {
        if (e.clientX || e.clientX == 0) {
            this.mouse.setX(e.clientX - clientRects.left);
            this.mouse.setY(e.clientY - clientRects.top);
        }
        else if (e.offsetX || e.offsetX == 0) {
            this.mouse.setX(e.offsetX - clientRects.top);
            this.mouse.setY(e.offsetY - clientRects.left);
        }
    }
    pieceDropped() {
        document.onmousemove = null;
        document.onmouseup = null;
        if (this.currentDropPiece != null) {
            let temp = new Point2D(this.currentPiece.getXPos(), this.currentPiece.getYPos());
            this.currentPiece.setXPos(this.currentDropPiece.getXPos());
            this.currentPiece.setYPos(this.currentDropPiece.getYPos());
            this.currentDropPiece.setXPos(temp.getX());
            this.currentDropPiece.setYPos(temp.getY());
        }
        this.resetPuzzleAndCheckWin();
    }
    drawMainPiece(piece) {
        this.context.globalAlpha = 1;
        this.context.fillStyle = srcConst.PUZZLE_MAIN;
        this.context.fillRect(piece.getXPos(), piece.getYPos(), this.pieceWidth, this.pieceHeight);
        this.context.restore();
    }
    resetPuzzleAndCheckWin() {
        this.context.clearRect(0, 0, this.getPuzzleWidth(), this.getPuzzleHeight());
        let gameWin = true;
        let piece;
        for (let i = 0; i < this.pieces.length; i++) {
            piece = this.pieces[i];
            this.drawScaledImage(piece.getX(), piece.getY(), this.pieceWidth, this.pieceHeight, piece.getXPos(), piece.getYPos(), this.pieceWidth, this.pieceHeight);
            this.context.strokeRect(piece.getXPos(), piece.getYPos(), this.pieceWidth, this.pieceHeight);
            if (piece === this.mainPiece) {
                this.drawMainPiece(piece);
            }
            if (piece.getXPos() != piece.getX() || piece.getYPos() != piece.getY()) {
                gameWin = false;
            }
        }
        if (gameWin) {
            console.log('You WIN!');
            setTimeout(this.gameOver, 500);
        }
    }
    gameOver() {
        document.onmousedown = null;
        document.onmousemove = null;
        document.onmouseup = null;
        loadAll();
    }
}
//# sourceMappingURL=JigsawPuzzleComponent.js.map