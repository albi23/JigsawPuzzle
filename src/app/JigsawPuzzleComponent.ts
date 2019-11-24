/*
../../node_modules/tslib/tslib.es6.js
*/

window.onload = window.onbeforeunload = () => {
    loadAll();
};


function loadAll() {
    const urlParams = new URLSearchParams(window.location.search);
    const idImg: string = <string>urlParams.get('id');
    const type: string = <string>urlParams.get('type');
    const imgName: string = 'image'.concat(idImg).concat('.').concat(type);
    new JigsawPuzzleComponent(imgName)
}

enum srcConst {
    srcImg = "../assets/",
    PUZZLE_HOVER_TINT = "#009900"
}

export class JigsawPuzzleComponent {

    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private pieces: Piece[] = [];
    mouse: Point2D = new Point2D(0, 0);
    currentPiece: Piece | null = new Piece(0, 0, 0, 0);
    currentDropPiece: Piece | null = null;
    PUZZLE_COL: number = 4;
    PUZZLE_ROW: number = 4;
    pieceWidth: number = 0;
    pieceHeight: number = 0;
    img: HTMLImageElement = new Image();
    yScale: number = 0;
    xScale: number = 0;

    constructor(private imageName: string) {
        this.canvas = JigsawPuzzleComponent.setDefaultCanvas();
        this.context = <CanvasRenderingContext2D>this.canvas.getContext("2d");
        this.getLoadedImg();
    }

    private getLoadedImg() {
        this.loadImg().then(() => {
            const start = <HTMLAnchorElement>document.getElementById('start');
            start.addEventListener("click", () => (this.startGame(start)));
            (<HTMLInputElement>(document.getElementById('btn')))
                .addEventListener('click',()=>{this.changeColAndRow();});
        }).catch(() => {
            console.log('not done');
        })
    }

    private loadImg(): Promise<any> {
        return new Promise<any>((resolve, reject) => {

            const url = srcConst.srcImg.concat(this.imageName);
            const newImgElem: HTMLImageElement = document.createElement('img');
            const suitableCanvas = <HTMLDivElement>document.getElementById('can');
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

    private initPuzzle() {
        this.pieces = [];
        this.mouse = new Point2D(0, 0);
        this.currentPiece = null;
        this.currentDropPiece = null;
        this.drawScaledImage( 0, 0, this.getPuzzleWidth(), this.getPuzzleHeight(),
            0, 0, this.getPuzzleWidth(), this.getPuzzleHeight());
        this.buildPieces();
    }

    private drawScaledImage(sx:number, sy: number, sw: number, sh: number, dx:number, dy: number, dw: number, dh: number): void {
        this.context.drawImage(this.img, sx/this.xScale, sy/this.yScale, sw/this.xScale, sh/this.yScale, dx, dy, dw, dh);
    }
    private buildPieces() {
        let x: number = 0;
        let y: number = 0;
        for (let i = 0; i < this.PUZZLE_COL * this.PUZZLE_ROW; i++) {
            this.pieces.push(new Piece(x, y, 0, 0));
            x += this.pieceWidth;
            if (x >= this.getPuzzleWidth()) {
                x = 0;
                y += this.pieceHeight;
            }
        }
    }

    private shufflePuzzle() {
        this.context.clearRect(0, 0, this.getPuzzleWidth(), this.getPuzzleHeight());
        let piece;
        let xPos: number = 0;
        let yPos: number = 0;
        for (let i = 0; i < this.pieces.length; i++) {
            piece = this.pieces[i];
            piece.setXPos(xPos);
            piece.setYPos(yPos);
            this.drawScaledImage(piece.getX(), piece.getY(), this.pieceWidth, this.pieceHeight,
                xPos, yPos, this.pieceWidth, this.pieceHeight);
            this.context.strokeRect(xPos, yPos, this.pieceWidth, this.pieceHeight);
            xPos += this.pieceWidth;
            if (xPos >= this.getPuzzleWidth()) {
                xPos = 0;
                yPos += this.pieceHeight;
            }
        }
        document.onmousedown = (e: MouseEvent) => {
            this.onPuzzleClick(e);
        };
    }

    private static setDefaultCanvas(): HTMLCanvasElement {
        return <HTMLCanvasElement>document.getElementById("can");
    }

    private setPuzzleProperties(): void {
        this.pieceHeight = Math.floor(this.yScale * this.img.height / this.PUZZLE_ROW);
        this.pieceWidth = Math.floor(this.xScale * this.img.width / this.PUZZLE_COL);
    }

    private setCanvasProperties(): void {
        this.canvas.width = this.getPuzzleWidth();
        this.canvas.height = this.getPuzzleHeight();
        this.canvas.classList.add('rounded', 'img-fluid', 'bordered-img');
    }

    private startGame(startButton? : HTMLAnchorElement) {
        if (startButton) startButton.innerText = "Reset Game";
        this.pieces = [...this.shuffle(this.pieces)];
        this.shufflePuzzle();

    }

    private changeColAndRow(){
        const colInput = <HTMLInputElement>(document.getElementById('col'));
        const rowInput = <HTMLInputElement>(document.getElementById('row'));
        let row:number = parseInt(colInput.value);
        let col:number = parseInt(rowInput.value);
        if(row <= 1 || col <= 1 ){
            (<HTMLDivElement>(document.getElementById('alert'))).style.display ='block';
            return;
        }
        this.PUZZLE_COL = col;
        this.PUZZLE_ROW = row;
        this.setPuzzleProperties();
        this.initPuzzle();
        this.startGame();
    }

    private shuffle(pieces: Piece[]) {

        for (let i = this.pieces.length - 1; i > 0; i--) {
            let nr = Utils.randomIntFromInterval(0, pieces.length - 1);
            Utils.swap(nr, i, pieces);
        }
        return pieces;
    }

    private getPuzzleHeight(): number {
        return this.pieceHeight * this.PUZZLE_ROW
    }

    private getPuzzleWidth(): number {
        return this.pieceWidth * this.PUZZLE_COL;
    }

    private onPuzzleClick(mouseEvent: MouseEvent) {
        console.log('x: ', mouseEvent.clientX, '  y: ', mouseEvent.clientY);
        const clientRects : ClientRect = this.canvas.getClientRects()[0];
        this.setMousePostion(mouseEvent,clientRects);
        this.currentPiece = this.checkPieceClicked();
        if (this.currentPiece != null) {
            this.context.clearRect(this.currentPiece.getXPos(), this.currentPiece.getYPos(),
                this.pieceWidth, this.pieceHeight);
            this.context.save();
            this.context.globalAlpha = .9;
            this.drawScaledImage( this.currentPiece.getX(), this.currentPiece.getY(), this.pieceWidth, this.pieceHeight,
                this.mouse.getX() - (this.pieceWidth / 2), this.mouse.getY() - (this.pieceHeight / 2), this.pieceWidth, this.pieceHeight)
            this.context.restore();

            document.onmousemove = (e: MouseEvent) => {
                this.updatePuzzle(e,clientRects)
            };
            document.onmouseup = () => {
                this.pieceDropped();
            }
        }
    }

    private checkPieceClicked() {
        let piece: Piece;
        for (let i = 0; i < this.pieces.length; i++) {
            piece = this.pieces[i];
            if (this.mouse.getX() < piece.getXPos() ||
                this.mouse.getX() > (piece.getXPos() + this.pieceWidth) ||
                this.mouse.getY() < piece.getYPos() ||
                this.mouse.getY() > (piece.getYPos() + this.pieceHeight)) {
//PIECE NOT HIT
            } else {
                return piece;
            }
        }
        return null;
    }

    private updatePuzzle(e: MouseEvent, clientRects : ClientRect) {
        this.currentDropPiece = null;
        this.setMousePostion(e,clientRects);
        this.context.clearRect(0, 0, this.getPuzzleWidth(), this.getPuzzleHeight());
        let piece: Piece;
        for (let i = 0; i < this.pieces.length; i++) {
            piece = this.pieces[i];
            if (piece == this.currentPiece) {
                continue;
            }
            this.drawScaledImage(piece.getX(), piece.getY(), this.pieceWidth, this.pieceHeight, piece.getXPos(), piece.getYPos(),
                this.pieceWidth, this.pieceHeight);
            this.context.strokeRect(piece.getXPos(), piece.getYPos(), this.pieceWidth,
                this.pieceHeight);
            if (this.currentDropPiece == null) {
                if (this.mouse.getX() < piece.getXPos() || this.mouse.getX() >
                    (piece.getXPos() + this.pieceWidth) || this.mouse.getY() < piece.getYPos()
                    || this.mouse.getY() > (piece.getYPos() + this.pieceHeight)) {
//NOT OVER
                } else {
                    this.currentDropPiece = piece;
                    this.context.save();
                    this.context.globalAlpha = .4;
                    this.context.fillStyle = srcConst.PUZZLE_HOVER_TINT;
                    this.context.fillRect(this.currentDropPiece.getXPos(),
                        this.currentDropPiece.getYPos(), this.pieceWidth,
                        this.pieceHeight);
                    this.context.restore();
                }
            }
        }
        this.context.save();
        this.context.globalAlpha = .6;;
        if (this.currentPiece){
            this.drawScaledImage(this.currentPiece.getX(), (this.currentPiece).getY(), this.pieceWidth, this.pieceHeight,
                this.mouse.getX() - (this.pieceWidth / 2), this.mouse.getY() - (this.pieceHeight / 2), this.pieceWidth, this.pieceHeight)
        }
        this.context.restore();
        this.context.strokeRect(this.mouse.getX() - (this.pieceWidth / 2), this.mouse.getY() - (this.pieceHeight / 2), this.pieceWidth, this.pieceHeight);
    }

    private setMousePostion(e: MouseEvent, clientRects : ClientRect){
        if (e.clientX || e.clientX == 0) {
            this.mouse.setX(e.clientX - clientRects.left);
            this.mouse.setY(e.clientY - clientRects.top);
        } else if (e.offsetX || e.offsetX == 0) {
            this.mouse.setX(e.offsetX - clientRects.top);
            this.mouse.setY(e.offsetY - clientRects.left);
        }
    }


    private pieceDropped() {
        document.onmousemove = null;
        document.onmouseup = null;
        if (this.currentDropPiece != null) {
            let temp: Point2D = new Point2D((<Piece>this.currentPiece).getXPos(), (<Piece>this.currentPiece).getYPos());
            (<Piece>this.currentPiece).setXPos(this.currentDropPiece.getXPos());
            (<Piece>this.currentPiece).setYPos(this.currentDropPiece.getYPos());
            (<Piece>this.currentDropPiece).setXPos(temp.getX());
            (<Piece>this.currentDropPiece).setYPos(temp.getY());
        }
        this.resetPuzzleAndCheckWin();
    }

    private resetPuzzleAndCheckWin() {
        this.context.clearRect(0, 0, this.getPuzzleWidth(), this.getPuzzleHeight());
        let gameWin = true;

        let piece: Piece;
        for (let i = 0; i < this.pieces.length; i++) {
            piece = this.pieces[i];
            this.context.drawImage(this.img, piece.getX()/this.xScale, piece.getY()/this.yScale,
                this.pieceWidth/this.xScale, this.pieceHeight/this.yScale, piece.getXPos(),
                piece.getYPos(), this.pieceWidth, this.pieceHeight);
            this.context.strokeRect(piece.getXPos(), piece.getYPos(),
                this.pieceWidth, this.pieceHeight);
            if (piece.getXPos() != piece.getX() || piece.getYPos() != piece.getY()) {
                gameWin = false;
            }
        }
        if (gameWin) {
            console.log('Wygrałeś chujku');
            // setTimeout(gameOver,500);
        }
    }
}

export class Point2D {
    constructor(private x: number, private y: number) {
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public setX(x: number): void {
        this.x = x;
    }

    public setY(y: number): void {
        this.y = y;
    }
}

export class Piece extends Point2D {
    constructor(x: number, y: number, private xPos: number, private yPos: number) {
        super(x, y)
    }

    public getXPos(): number {
        return this.xPos;
    }

    public getYPos(): number {
        return this.yPos;
    }

    public setXPos(xPos: number): void {
        this.xPos = xPos;
    }

    public setYPos(yPos: number): void {
        this.yPos = yPos;
    }

}

export class Utils {

    public static swap<T>(from: number, to: number, array: T[]): T[] {
        let temp: T = array[from];
        array[from] = array[to];
        array[to] = temp;
        return array;
    }

    public static randomIntFromInterval(min: number, max: number) { // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

