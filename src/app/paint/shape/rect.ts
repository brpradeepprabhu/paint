import { GlobalService } from '../../global.service';
declare var createjs;

export class Rect {
    stage;
    rect;
    startingPoint;
    drawingCanvas;
    offset;
    currentShapeBtn;
    constructor(stage, container, private globalService: GlobalService) {
        this.stage = stage;
        this.rect = new createjs.Graphics();
        this.rect.setStrokeStyle(this.globalService.stroke)
            .beginStroke(this.globalService.stokeColor)
            .beginFill(this.globalService.fillColor);
        this.rect.drawRect(0, 0, 10, 10);
        this.startingPoint = new createjs.Point(stage.mouseX, stage.mouseY);
        this.drawingCanvas = new createjs.Shape(this.rect);
        container.addChild(this.drawingCanvas);
        this.drawingCanvas.x = stage.mouseX;
        this.drawingCanvas.y = stage.mouseY;
        this.drawingCanvas.instance = this;
        this.drawingCanvas.type = 'rect';
        this.stage.update();
        this.drawingCanvas.addEventListener('mousedown', this.shapeMouseDown.bind(this));
        this.drawingCanvas.addEventListener('mouseup', this.shapeMouseUp);
        this.globalService.currentShapeBtn.subscribe((currentShapeBtn) => {
            this.currentShapeBtn = currentShapeBtn;
        });
    }
    shapeMouseDown(e) {
        this.offset = {
            x: this.drawingCanvas.x - e.stageX,
            y: this.drawingCanvas.y - e.stageY
        };
        this.drawingCanvas.addEventListener('pressmove', this.shapeMouseMove.bind(this));
        if (this.currentShapeBtn === 'select') {
            this.globalService.selectedShape = this.drawingCanvas;
            this.globalService.updateProperties();
        }
    }
    shapeMouseMove(e) {
        if (this.currentShapeBtn === 'select') {
            this.drawingCanvas.x = this.stage.mouseX + this.offset.x;
            this.drawingCanvas.y = this.stage.mouseY + this.offset.y;
            this.globalService.updateProperties();
            this.stage.update();
        }
    }
    shapeMouseUp(e) {
        this.drawingCanvas.removeEventListener('pressmove', this.shapeMouseMove);
    }
    mouseDown() {

    }
    mouseUp() {

    }
    mouseMove() {
        if (this.currentShapeBtn !== 'select') {
            const diffX = (this.stage.mouseX - this.startingPoint.x);
            const diffY = (this.stage.mouseY - this.startingPoint.y);
            this.rect.clear();
            if (this.globalService.stroke !== 0) {
                this.rect.setStrokeStyle(this.globalService.stroke)
                    .beginStroke(this.globalService.stokeColor)
                    .beginFill(this.globalService.fillColor)
                    .drawRect(0, 0, diffX, diffY);
            } else {

                this.rect.beginFill(this.globalService.fillColor).drawRect(0, 0, diffX, diffY);
            }

            this.stage.update();
        }
    }
    updateColor(updateStroke, updateStrokeColor, updateFillColor) {
        const rect = this.drawingCanvas.graphics._instructions[1];
        this.rect.clear();
        if (updateStroke !== 0) {
            this.rect.setStrokeStyle(updateStroke)
                .beginStroke(updateStrokeColor)
                .beginFill(updateFillColor).drawRect(0, 0, rect.w, rect.h);
        } else {

            this.rect.beginFill(updateFillColor).drawRect(0, 0, rect.w, rect.h);
        }
        this.stage.update();
    }
    redraw(data: any) {
        this.rect.clear();
        if (data.stroke !== 0) {
            this.rect.setStrokeStyle(data.stroke)
                .beginStroke(data.strokeColor)
                .beginFill(data.fillColor).drawRect(0, 0, data.width, data.height);
        } else {

            this.rect.beginFill(data.fillColor).drawRect(0, 0, data.width, data.height);
        }
        this.drawingCanvas.x = data.x;
        this.drawingCanvas.y = data.y;
        this.drawingCanvas.alpha = data.alpha;
        console.log('inside rect', data)
        this.stage.update();
    }
}
