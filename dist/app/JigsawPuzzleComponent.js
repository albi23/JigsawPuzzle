/*
../../node_modules/tslib/tslib.es6.js
*/
import { __extends, __read, __spread } from "../../node_modules/tslib/tslib.es6.js";
window.onload = window.onbeforeunload = function () {
    loadAll();
};
function loadAll() {
    var urlParams = new URLSearchParams(window.location.search);
    var idImg = urlParams.get('id');
    var type = urlParams.get('type');
    var imgName = 'image'.concat(idImg).concat('.').concat(type);
    new JigsawPuzzleComponent(imgName);
}
var srcConst;
(function (srcConst) {
    srcConst["srcImg"] = "../assets/";
    srcConst["PUZZLE_HOVER_TINT"] = "#009900";
    srcConst["PUZZLE_MAIN"] = "#ff0012";
})(srcConst || (srcConst = {}));
var JigsawPuzzleComponent = /** @class */ (function () {
    function JigsawPuzzleComponent(imageName) {
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
    JigsawPuzzleComponent.prototype.getLoadedImg = function () {
        var _this = this;
        this.loadImg().then(function () {
            var start = document.getElementById('start');
            start.addEventListener("click", function () { return (_this.startGame(start)); });
            (document.getElementById('btn'))
                .addEventListener('click', function () { _this.changeColAndRow(); });
        }).catch(function () {
            var alertElem = (document.getElementById('alert'));
            alertElem.style.display = 'block';
            alertElem.innerText = 'Some error occurred during load image';
        });
    };
    JigsawPuzzleComponent.prototype.loadImg = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var url = srcConst.srcImg.concat(_this.imageName);
            var newImgElem = document.createElement('img');
            var suitableCanvas = document.getElementById('can');
            newImgElem.setAttribute("src", url);
            newImgElem.setAttribute("alt", _this.imageName);
            _this.yScale = suitableCanvas.clientHeight / newImgElem.height;
            _this.xScale = suitableCanvas.clientWidth / newImgElem.width;
            _this.img = newImgElem;
            _this.setPuzzleProperties();
            _this.setCanvasProperties();
            _this.initPuzzle();
            newImgElem.onload = function () {
                resolve(url);
            };
            newImgElem.onerror = function () {
                reject(url);
            };
        });
    };
    JigsawPuzzleComponent.prototype.initPuzzle = function () {
        this.pieces = [];
        this.mouse = new Point2D(0, 0);
        this.currentPiece = null;
        this.currentDropPiece = null;
        this.drawScaledImage(0, 0, this.getPuzzleWidth(), this.getPuzzleHeight(), 0, 0, this.getPuzzleWidth(), this.getPuzzleHeight());
        this.buildPieces();
    };
    JigsawPuzzleComponent.prototype.drawScaledImage = function (sx, sy, sw, sh, dx, dy, dw, dh) {
        this.context.drawImage(this.img, sx / this.xScale, sy / this.yScale, sw / this.xScale, sh / this.yScale, dx, dy, dw, dh);
    };
    JigsawPuzzleComponent.prototype.buildPieces = function () {
        var x = 0;
        var y = 0;
        for (var i = 0; i < this.PUZZLE_COL * this.PUZZLE_ROW; i++) {
            this.pieces.push(new Piece(x, y, 0, 0));
            x += this.pieceWidth;
            if (x >= this.getPuzzleWidth()) {
                x = 0;
                y += this.pieceHeight;
            }
        }
    };
    JigsawPuzzleComponent.prototype.shufflePuzzle = function () {
        var _this = this;
        this.context.clearRect(0, 0, this.getPuzzleWidth(), this.getPuzzleHeight());
        var piece;
        var xPos = 0;
        var yPos = 0;
        for (var i = 0; i < this.pieces.length; i++) {
            piece = this.pieces[i];
            piece.setXPos(xPos);
            piece.setYPos(yPos);
            this.drawScaledImage(piece.getX(), piece.getY(), this.pieceWidth, this.pieceHeight, xPos, yPos, this.pieceWidth, this.pieceHeight);
            if (piece.getX() === 0 && piece.getY() === 0) {
                this.drawMainPiece(piece);
                this.mainPiece = piece;
            }
            this.context.strokeRect(xPos, yPos, this.pieceWidth, this.pieceHeight);
            xPos += this.pieceWidth;
            if (xPos >= this.getPuzzleWidth()) {
                xPos = 0;
                yPos += this.pieceHeight;
            }
        }
        document.onmousedown = function (e) {
            _this.onPuzzleClick(e);
        };
    };
    JigsawPuzzleComponent.setDefaultCanvas = function () {
        return document.getElementById("can");
    };
    JigsawPuzzleComponent.prototype.setPuzzleProperties = function () {
        this.pieceHeight = Math.floor(this.yScale * this.img.height / this.PUZZLE_ROW);
        this.pieceWidth = Math.floor(this.xScale * this.img.width / this.PUZZLE_COL);
    };
    JigsawPuzzleComponent.prototype.setCanvasProperties = function () {
        this.canvas.width = this.getPuzzleWidth();
        this.canvas.height = this.getPuzzleHeight();
        this.canvas.classList.add('rounded', 'img-fluid', 'bordered-img');
    };
    JigsawPuzzleComponent.prototype.startGame = function (startButton) {
        if (startButton)
            startButton.innerText = "Reset Game";
        this.pieces = __spread(this.shuffle(this.pieces));
        this.shufflePuzzle();
    };
    JigsawPuzzleComponent.prototype.changeColAndRow = function () {
        var colInput = (document.getElementById('col'));
        var rowInput = (document.getElementById('row'));
        var row = parseInt(colInput.value);
        var col = parseInt(rowInput.value);
        if (row <= 1 || col <= 1) {
            (document.getElementById('alert')).style.display = 'block';
            return;
        }
        this.PUZZLE_COL = col;
        this.PUZZLE_ROW = row;
        this.setPuzzleProperties();
        this.initPuzzle();
        this.startGame();
    };
    JigsawPuzzleComponent.prototype.shuffle = function (pieces) {
        for (var i = this.pieces.length - 1; i > 0; i--) {
            var nr = Utils.randomIntFromInterval(0, pieces.length - 1);
            Utils.swap(nr, i, pieces);
        }
        return pieces;
    };
    JigsawPuzzleComponent.prototype.getPuzzleHeight = function () {
        return this.pieceHeight * this.PUZZLE_ROW;
    };
    JigsawPuzzleComponent.prototype.getPuzzleWidth = function () {
        return this.pieceWidth * this.PUZZLE_COL;
    };
    JigsawPuzzleComponent.prototype.onPuzzleClick = function (mouseEvent) {
        var _this = this;
        var clientRects = this.canvas.getClientRects()[0];
        this.setMousePosition(mouseEvent, clientRects);
        this.currentPiece = this.checkPieceClicked();
        if (this.currentPiece != null) {
            this.context.clearRect(this.currentPiece.getXPos(), this.currentPiece.getYPos(), this.pieceWidth, this.pieceHeight);
            this.context.save();
            this.context.globalAlpha = .9;
            this.drawScaledImage(this.currentPiece.getX(), this.currentPiece.getY(), this.pieceWidth, this.pieceHeight, this.mouse.getX() - (this.pieceWidth / 2), this.mouse.getY() - (this.pieceHeight / 2), this.pieceWidth, this.pieceHeight);
            this.context.restore();
            document.onmousemove = function (e) {
                _this.updatePuzzle(e, clientRects);
            };
            document.onmouseup = function () {
                _this.pieceDropped();
            };
        }
    };
    JigsawPuzzleComponent.prototype.checkPieceClicked = function () {
        var piece;
        for (var i = 0; i < this.pieces.length; i++) {
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
    };
    JigsawPuzzleComponent.prototype.updatePuzzle = function (e, clientRects) {
        this.currentDropPiece = null;
        this.setMousePosition(e, clientRects);
        this.context.clearRect(0, 0, this.getPuzzleWidth(), this.getPuzzleHeight());
        var piece;
        for (var i = 0; i < this.pieces.length; i++) {
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
    };
    JigsawPuzzleComponent.prototype.setMousePosition = function (e, clientRects) {
        if (e.clientX || e.clientX == 0) {
            this.mouse.setX(e.clientX - clientRects.left);
            this.mouse.setY(e.clientY - clientRects.top);
        }
        else if (e.offsetX || e.offsetX == 0) {
            this.mouse.setX(e.offsetX - clientRects.top);
            this.mouse.setY(e.offsetY - clientRects.left);
        }
    };
    JigsawPuzzleComponent.prototype.pieceDropped = function () {
        document.onmousemove = null;
        document.onmouseup = null;
        if (this.currentDropPiece != null) {
            var temp = new Point2D(this.currentPiece.getXPos(), this.currentPiece.getYPos());
            this.currentPiece.setXPos(this.currentDropPiece.getXPos());
            this.currentPiece.setYPos(this.currentDropPiece.getYPos());
            this.currentDropPiece.setXPos(temp.getX());
            this.currentDropPiece.setYPos(temp.getY());
        }
        this.resetPuzzleAndCheckWin();
    };
    JigsawPuzzleComponent.prototype.drawMainPiece = function (piece) {
        this.context.globalAlpha = 1;
        this.context.fillStyle = srcConst.PUZZLE_MAIN;
        this.context.fillRect(piece.getXPos(), piece.getYPos(), this.pieceWidth, this.pieceHeight);
        this.context.restore();
    };
    JigsawPuzzleComponent.prototype.resetPuzzleAndCheckWin = function () {
        this.context.clearRect(0, 0, this.getPuzzleWidth(), this.getPuzzleHeight());
        var gameWin = true;
        var piece;
        for (var i = 0; i < this.pieces.length; i++) {
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
    };
    JigsawPuzzleComponent.prototype.gameOver = function () {
        document.onmousedown = null;
        document.onmousemove = null;
        document.onmouseup = null;
        loadAll();
    };
    return JigsawPuzzleComponent;
}());
export { JigsawPuzzleComponent };
var Point2D = /** @class */ (function () {
    function Point2D(x, y) {
        this.x = x;
        this.y = y;
    }
    Point2D.prototype.getX = function () {
        return this.x;
    };
    Point2D.prototype.getY = function () {
        return this.y;
    };
    Point2D.prototype.setX = function (x) {
        this.x = x;
    };
    Point2D.prototype.setY = function (y) {
        this.y = y;
    };
    return Point2D;
}());
export { Point2D };
var Piece = /** @class */ (function (_super) {
    __extends(Piece, _super);
    function Piece(x, y, xPos, yPos) {
        var _this = _super.call(this, x, y) || this;
        _this.xPos = xPos;
        _this.yPos = yPos;
        return _this;
    }
    Piece.prototype.getXPos = function () {
        return this.xPos;
    };
    Piece.prototype.getYPos = function () {
        return this.yPos;
    };
    Piece.prototype.setXPos = function (xPos) {
        this.xPos = xPos;
    };
    Piece.prototype.setYPos = function (yPos) {
        this.yPos = yPos;
    };
    return Piece;
}(Point2D));
export { Piece };
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.swap = function (from, to, array) {
        var temp = array[from];
        array[from] = array[to];
        array[to] = temp;
        return array;
    };
    Utils.randomIntFromInterval = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    return Utils;
}());
export { Utils };
//# sourceMappingURL=JigsawPuzzleComponent.js.map
