// @ts-ignore
// import {Utils} from "../../dist/app/Utils.js";
//  ../../node_modules/tslib/tslib.es6.js

window.onload =  ()=> {loadAll();};
window.onbeforeunload = () => {loadAll();};

function loadAll() {
    const urlParams = new URLSearchParams(window.location.search);
    const idImg: string = <string>urlParams.get('id');
    const type: string = <string>urlParams.get('type');
    const imgName: string = 'image'.concat(idImg).concat('.').concat(type);
    new JigsawPuzzleComponent(imgName)
}

enum srcConst {
    srcImg = "../assets/"
}

export class JigsawPuzzleComponent {

    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private pieces: Piece[] = [];
    mouse: Point2D = new Point2D(0,0);
    currentPiece = null;
    currentDropPiece = null;
    PUZZLE_DIFFICULTY: number = 4;
    pieceWidth: number = 0;
    pieceHeight: number = 0;
    img: HTMLImageElement = new Image();

    constructor(private imageName: string) {
        this.canvas = JigsawPuzzleComponent.setDefaultCanvas();
        this.context = <CanvasRenderingContext2D>this.canvas.getContext("2d");
        this.getLoadedImg();
    }

    private getLoadedImg() {
        this.loadImg().then(() => {
            (<HTMLAnchorElement>document.getElementById('start'))
                .addEventListener("click", () => (this.startGame()));
        }).catch(() => {
            console.log('not done');
        })
    }

    private loadImg(): Promise<any> {
        return new Promise<any>((resolve, reject) => {

            const url = srcConst.srcImg.concat(this.imageName);
            const newImgElem: HTMLImageElement = document.createElement('img');
            newImgElem.setAttribute("src", url);
            newImgElem.setAttribute("alt", this.imageName);
            this.img = newImgElem;
            this.setPuzzleProperties(newImgElem);
            this.setCanvasProperties();
            this.initPuzzle(newImgElem);
            newImgElem.onload = () => {
                resolve(url);
            };
            newImgElem.onerror = () => {
                reject(url);
            };
        });
    }

    private initPuzzle(newImgElem: HTMLImageElement) {
        this.pieces = [];
        this.mouse = new Point2D(0, 0);
        this.currentPiece = null;
        this.currentDropPiece = null;
        this.context.drawImage(newImgElem, 0, 0, this.getPuzzleWidth(), this.getPuzzleHeight(),
            0, 0, this.getPuzzleWidth(), this.getPuzzleHeight());
        this.buildPieces();
    }

    private buildPieces(){
        let x: number = 0;
        let y: number = 0;
        for (let i = 0; i < this.PUZZLE_DIFFICULTY * this.PUZZLE_DIFFICULTY; i++) {
            this.pieces.push(new Piece(x, y,0,0));
            x += this.pieceWidth;
            if (x >= this.getPuzzleWidth()) {
                x = 0;
                y += this.pieceHeight;
            }
        }
        // document.onmousedown = ()=>{;}
        // this.shufflePuzzle();

    }

    private shufflePuzzle(){
        this.context.clearRect(0,0,this.getPuzzleWidth(),this.getPuzzleHeight());
        let piece;
        let xPos :number = 0;
        let yPos : number = 0;
        for(let i = 0;i < this.pieces.length;i++){
            piece = this.pieces[i];
            piece.setXPos(xPos);
            piece.setYPos(yPos);
            this.context.drawImage(this.img, piece.getX(), piece.getY(), this.pieceWidth, this.pieceHeight,
                xPos, yPos, this.pieceWidth, this.pieceHeight);
            this.context.strokeRect(xPos, yPos, this.pieceWidth,this.pieceHeight);
            xPos += this.pieceWidth;
            if(xPos >= this.getPuzzleWidth()){
                xPos = 0;
                yPos += this.pieceHeight;
            }
        }
        // document.onmousedown = onPuzzleClick;
    }
    private static setDefaultCanvas(): HTMLCanvasElement {
        return <HTMLCanvasElement>document.getElementById("can");
    }

    private setPuzzleProperties(img: HTMLImageElement): void {
        this.pieceHeight = Math.floor(img.height / this.PUZZLE_DIFFICULTY);
        this.pieceWidth = Math.floor(img.width / this.PUZZLE_DIFFICULTY);
    }

    private setCanvasProperties(): void {
        this.canvas.width = this.getPuzzleWidth();
        this.canvas.height = this.getPuzzleHeight();
        this.canvas.classList.add('rounded', 'img-fluid', 'bordered-img');
    }

    private startGame(){
        this.pieces = [...this.shuffle(this.pieces)];
        this.shufflePuzzle();

    }
    private shuffle(pieces : Piece[]) {

        const utils = new Utils();
        for (let i = this.pieces.length - 1; i > 0; i--) {
            let nr = utils.randomIntFromInterval(0,this.pieces.length-1);
            utils.swap(nr,i, pieces);
        }
        return pieces;
    }
    private getPuzzleHeight(): number {
        return this.pieceHeight * this.PUZZLE_DIFFICULTY;
    }

    private getPuzzleWidth(): number {
        return this.pieceWidth * this.PUZZLE_DIFFICULTY;
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

    public  swap<T>(from : number, to: number, array: T[]):T[]{
        let temp: T = array[from];
        array[from] = array[to];
        array[to] = temp;
        return array;
    }

    public  randomIntFromInterval(min: number, max: number) { // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

// window.onload = function () {
//     const stack:HTMLElement[] = [];
//     const root : HTMLElement = <HTMLElement> document.getElementById('tes');
//     stack.push(root);
//     let created = createNewHTMLElement('div',["row"]);
//     stack.push(created);
//     /*let*/ created = createNewHTMLElement('div',["col"],"col-1");
//     stack.push(created);
//     /*let*/ created  = createNewHTMLElement('img',["rounded", "img-fluid", "flex-img-size", "bordered-img"],"img1","../assets/image1.jpeg");
//     stack.push(created);
//     // appendElementsToParent(created2,created3)
//     // appendElementsToParent(created,created2)
//     // appendElementsToParent(root,created)
//     while (stack.length > 1){
//         let child = <HTMLElement>stack.pop();
//         let parent = <HTMLElement>stack.pop();
//         stack.push(appendElementsToParent(parent,child))
//     }
// };
//
// function loadIMG(url: string, id: string): Promise<any> {
//
//     return new Promise<any>((resolve, reject) => {
//
//         const parent: HTMLDivElement = <HTMLDivElement>document.getElementById(id);
//         let newElement: HTMLImageElement = document.createElement('img');
//         newElement.setAttribute("src", url);
//         newElement.setAttribute("alt", url);
//         newElement.setAttribute("width", "30%");
//         newElement.setAttribute("height", "30%");
//         parent.appendChild(newElement);
//         newElement.onload = function () {
//             resolve(url);
//         };
//         newElement.onerror = function () {
//             reject(url);
//         };
//     });
// }
//
//
// function appendElementsToParent(parent: HTMLElement, child: HTMLElement):HTMLElement {
//     parent.appendChild(child);
//     return parent;
// }
//
// function createNewHTMLElement(newElementType: string, classNames?: string[], id?: string, url?:string): HTMLElement {
//     let newElement: HTMLElement = <HTMLElement>document.createElement(newElementType);
//     if (classNames) newElement = <HTMLElement>addClasses(newElement, classNames);
//     if (id) newElement = <HTMLElement>addId(newElement, id);
//     if (id) newElement = <HTMLElement>addSrc(newElement, url);
//     return newElement;
// }
//
// function addClasses(element: HTMLElement, classNames?: string[]): HTMLElement {
//     if (!element) return element;
//     if (classNames && classNames.length > 0) {
//         for (const newClass of classNames) {
//             element.classList.add(newClass)
//         }
//     }
//     return element;
// }
//
// function addId(element: HTMLElement,id: string): HTMLElement {
//     if (!element) return element;
//     element.setAttribute("id", id);
//     return element;
// }
//
// function addSrc(element: HTMLElement,url?: string): HTMLElement {
//     if (!element) return element;
//     if (typeof url === "string") {
//         element.setAttribute("src", url);
//     }
//     return element;
// }
