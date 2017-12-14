import { GlobalService } from '../../global.service';
declare var createjs;
export class Circle {
    stage;
    circle;
    startingPoint;
    drawingCanvas;
    offset;
    currentShapeBtn;
    constructor(stage, container, private globalService: GlobalService) {
        this.stage = stage;
        this.circle = new createjs.Graphics();
        this.circle.setStrokeStyle(this.globalService.stroke);
        this.circle.beginStroke(this.globalService.stokeColor);
        this.circle.beginFill(this.globalService.fillColor);
        this.circle.drawCircle(0, 0, 30);
        this.startingPoint = new createjs.Point(stage.mouseX, stage.mouseY);
        this.drawingCanvas = new createjs.Shape(this.circle);
        container.addChild(this.drawingCanvas);
        this.drawingCanvas.x = stage.mouseX;
        this.drawingCanvas.y = stage.mouseY;
        this.drawingCanvas.type = 'circle';
        this.drawingCanvas.instance = this;
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
            const diff = Math.abs(this.stage.mouseX - this.startingPoint.x);
            this.circle.clear().setStrokeStyle(this.globalService.stroke)
                .beginStroke(this.globalService.stokeColor).beginFill(this.globalService.fillColor).drawCircle(0, 0, diff);
            this.stage.update();
        }
    }
    updateColor(updateStroke, updateStrokeColor, updateFillColor) {
        const rect = this.drawingCanvas.graphics._instructions[1];
        console.log(rect);
        this.circle.clear();
        if (updateStroke !== 0) {
            this.circle.setStrokeStyle(this.globalService.updateStroke)
                .beginStroke(this.globalService.updateStrokeColor)
                .beginFill(this.globalService.updateFillColor).drawCircle(0, 0, rect.radius);
        } else {

            this.circle.beginFill(updateFillColor).drawCircle(0, 0, rect.radius);
        }
        this.stage.update();
    }
    redraw(data: any) {
        this.circle.clear();
        if (data.stroke !== 0) {
            this.circle.setStrokeStyle(data.stroke)
                .beginStroke(data.strokeColor)
                .beginFill(data.fillColor).drawCircle(0, 0, data.radius);
        } else {

            this.circle.beginFill(data.fillColor).drawCircle(0, 0, data.radius);
        }
        this.drawingCanvas.x = data.x;
        this.drawingCanvas.y = data.y;
        this.drawingCanvas.alpha = data.alpha;
        this.stage.update();
    }
}
