import { GlobalService } from '../../global.service';
declare var createjs;
export class FreeStyle {
    stage;
    oldPtArray;
    oldMidPtArray;
    drawingCanvas;
    oldPt;
    oldMidPt; currentShapeBtn;
    constructor(stage, private container, private globalService: GlobalService) {
        this.stage = stage;
        this.oldPtArray = [];
        this.oldMidPtArray = [];
        this.drawingCanvas = new createjs.Shape();
        container.addChild(this.drawingCanvas);
        this.oldPt = new createjs.Point(this.stage.mouseX, this.stage.mouseY);
        this.oldMidPt = this.oldPt.clone();
        this.container.oldPtArray.push(this.oldPt);
        this.container.oldMidPtArray.push(this.oldMidPt);
        this.drawingCanvas.type = 'freestyle';
        this.stage.update();
        this.globalService.currentShapeBtn.subscribe((currentShapeBtn) => {
            this.currentShapeBtn = currentShapeBtn;
        });
    }
    mouseDown() {

    }
    mouseUp() {

    }
    mouseMove() {
        if (this.currentShapeBtn !== 'select') {
            const midPt = new createjs.Point(this.oldPt.x + this.stage.mouseX >> 1, this.oldPt.y + this.stage.mouseY >> 1);
            this.drawingCanvas.graphics.setStrokeStyle(this.globalService.stroke, 'round', 'round')
                .beginStroke(this.globalService.stokeColor).
                moveTo(midPt.x, midPt.y).curveTo(this.oldPt.x, this.oldPt.y, this.oldMidPt.x, this.oldMidPt.y);
            this.oldPt.x = this.stage.mouseX;
            this.oldPt.y = this.stage.mouseY;
            this.oldMidPt.x = midPt.x;
            this.oldMidPt.y = midPt.y;
            this.container.oldPtArray.push(this.oldPt);
            this.container.oldMidPtArray.push(this.oldMidPt);
            this.stage.update();
        }
    }
    redraw(data) {
        for (let i = 0; i < data.oldPt.length; i++) {
            const midPt = new createjs.Point(data.oldPt[i].x + this.stage.mouseX >> 1, data.oldPt[i].y + this.stage.mouseY >> 1);
            this.drawingCanvas.graphics.setStrokeStyle(this.globalService.stroke, 'round', 'round')
                .beginStroke(this.globalService.stokeColor).
                moveTo(midPt.x, midPt.y).curveTo(data.oldPt[i].x, data.oldPt[i].y, data.oldMidPt[i].x, data.oldMidPt[i].y);
            this.oldPt.x = data.oldPt[i].x;
            this.oldPt.y = data.oldPt[i].y;
            this.oldMidPt.x = data.oldMidPt[i].x;
            this.oldMidPt.y = data.oldMidPt[i].y;
            this.stage.update();
        }
    }
}
