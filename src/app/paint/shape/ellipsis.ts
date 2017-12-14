import { GlobalService } from '../../global.service';
declare var createjs;
export class Ellipsis {
    stage;
    ellipsis;
    startingPoint;
    drawingCanvas;
    offset;
    currentShapeBtn;
    constructor(stage, container, private globalService: GlobalService) {
        this.stage = stage;

        this.ellipsis = new createjs.Graphics();
        this.ellipsis.setStrokeStyle(this.globalService.stroke);
        this.ellipsis.beginStroke(this.globalService.stokeColor);
        this.ellipsis.beginFill(this.globalService.fillColor);
        this.ellipsis.drawEllipse(0, 0, 10, 10);
        this.startingPoint = new createjs.Point(stage.mouseX, stage.mouseY);
        this.drawingCanvas = new createjs.Shape(this.ellipsis);
        container.addChild(this.drawingCanvas);
        this.drawingCanvas.x = stage.mouseX;
        this.drawingCanvas.y = stage.mouseY;
        this.drawingCanvas.type = 'ellipsis';
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
            const diffX = (this.stage.mouseX - this.startingPoint.x);
            const diffY = (this.stage.mouseY - this.startingPoint.y);

            this.ellipsis.clear();
            if (this.globalService.stroke !== 0) {
                this.ellipsis
                    .setStrokeStyle(this.globalService.stroke)
                    .beginStroke(this.globalService.stokeColor)
                    .beginFill(this.globalService.fillColor).drawEllipse(0, 0, diffX, diffY);
            } else {

                this.ellipsis.beginFill(this.globalService.fillColor).drawEllipse(0, 0, diffX, diffY);
            }
            this.stage.update();
        }
    }
    updateColor(updateStroke, updateStrokeColor, updateFillColor) {
        const rect = this.drawingCanvas.graphics._instructions[1];
        this.ellipsis.clear();
        if (updateStroke !== 0) {
            this.ellipsis.setStrokeStyle(updateStroke)
                .beginStroke(updateStrokeColor)
                .beginFill(updateFillColor).drawEllipse(0, 0, rect.w, rect.h);
        } else {

            this.ellipsis.beginFill(updateFillColor).drawEllipse(0, 0, rect.w, rect.h);
        }
        this.stage.update();
    }
    redraw(data: any) {
        if (data.stroke !== 0) {
            this.ellipsis.clear().setStrokeStyle(data.stroke)
                .beginStroke(data.strokeColor)
                .beginFill(data.fillColor).drawEllipse(0, 0, data.width, data.height);
        } else {

            this.ellipsis.clear().beginFill(data.fillColor).drawEllipse(0, 0, data.width, data.height);
        }
        this.drawingCanvas.x = data.x;
        this.drawingCanvas.y = data.y;
        this.drawingCanvas.alpha = data.alpha;
        console.log('inside', data)
        this.stage.update();
    }
}
