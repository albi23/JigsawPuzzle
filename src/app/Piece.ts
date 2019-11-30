import {Point2D} from "./Point2D.js";

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
