import { GlobalService } from '../../global.service';
declare var createjs;
export class Square {
    stage;
    square;
    startingPoint;
    drawingCanvas;
    offset;
    currentShapeBtn;
    constructor(stage, container, private globalService: GlobalService) {
        this.stage = stage;

        this.square = new createjs.Graphics();
        this.square.beginStroke(this.globalService.stokeColor).beginFill(this.globalService.fillColor);
        if (this.globalService.stroke !== 0) {
            this.square.setStrokeStyle(this.globalService.stroke);
        }
        this.square.drawRect(0, 0, 10, 10);
        this.startingPoint = new createjs.Point(stage.mouseX, stage.mouseY);
        this.drawingCanvas = new createjs.Shape(this.square);
        this.drawingCanvas.instance = this;
        container.addChild(this.drawingCanvas);
        this.drawingCanvas.x = stage.mouseX;
        this.drawingCanvas.y = stage.mouseY;
        this.drawingCanvas.type = 'square';
        this.drawingCanvas.addEventListener('mousedown', this.shapeMouseDown.bind(this));
        this.drawingCanvas.addEventListener('mouseup', this.shapeMouseUp);
        this.stage.update();
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
            const diff = (this.stage.mouseX - this.startingPoint.x);
            const diffY = (this.stage.mouseY - this.startingPoint.y);
            const differ = diffY > 0 ? diff : -diff;
            this.square.clear();
            if (this.globalService.stroke !== 0) {
                this.square.setStrokeStyle(this.globalService.stroke)
                    .beginStroke(this.globalService.stokeColor)
                    .beginFill(this.globalService.fillColor).drawRect(0, 0, diff, differ);
            } else {

                this.square.beginFill(this.globalService.fillColor).drawRect(0, 0, diff, differ);
            }
            this.stage.update();
        }
    }
    redraw(data: any) {
        this.square.clear();
        if (data.stroke !== 0) {
            this.square.setStrokeStyle(data.stroke)
                .beginStroke(data.strokeColor)
                .beginFill(data.fillColor).drawRect(0, 0, data.width, data.height);
        } else {

            this.square.beginFill(data.fillColor).drawRect(0, 0, data.width, data.height);
        }
        this.drawingCanvas.x = data.x;
        this.drawingCanvas.y = data.y;
        this.drawingCanvas.alpha = data.alpha;
        console.log('inside', data)
        this.stage.update();
    }
    updateColor(updateStroke, updateStrokeColor, updateFillColor) {
        const rect = this.drawingCanvas.graphics._instructions[1];
        this.square.clear();
        if (updateStroke !== 0) {
            this.square.clear().setStrokeStyle(updateStroke)
                .beginStroke(updateStrokeColor)
                .beginFill(updateFillColor).drawRect(0, 0, rect.w, rect.h);
        } else {

            this.square.clear().beginFill(updateFillColor).drawRect(0, 0, rect.w, rect.h);
        }
        this.stage.update();
    }
}
