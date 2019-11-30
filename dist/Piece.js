import { Point2D } from "./Point2D.js";
export class Piece extends Point2D {
    constructor(x, y, xPos, yPos) {
        super(x, y);
        this.xPos = xPos;
        this.yPos = yPos;
    }
    getXPos() {
        return this.xPos;
    }
    getYPos() {
        return this.yPos;
    }
    setXPos(xPos) {
        this.xPos = xPos;
    }
    setYPos(yPos) {
        this.yPos = yPos;
    }
}
//# sourceMappingURL=Piece.js.map