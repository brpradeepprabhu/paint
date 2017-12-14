import { GlobalService } from '../../global.service';
declare var $;
declare var createjs;
export class Line {
    stage;
    currentShapeBtn;
    lineContainer;
    drawingCanvas;
    measurementText;
    oldPt;
    oldMidPt;
    offset;
    measurementCalc;
    constructor(stage, container, private globalService: GlobalService) {
        this.stage = stage;
        this.lineContainer = new createjs.Container();
        container.addChild(this.lineContainer);
        this.drawingCanvas = new createjs.Shape();
        this.lineContainer.addChild(this.drawingCanvas);
        this.measurementText = new createjs.Text('', '14px Arial');
        this.lineContainer.addChild(this.measurementText);
        this.lineContainer.instance = this;
        this.lineContainer.oldPt = new createjs.Point(this.stage.mouseX, this.stage.mouseY);
        this.measurementText.x = this.stage.mouseX;
        this.measurementText.y = this.stage.mouseY + this.globalService.stroke;
        this.lineContainer.oldMidPt = this.lineContainer.oldPt.clone();
        this.measurementCalc = 'px';
        this.calculateWidth(this.lineContainer.oldPt, this.lineContainer.oldMidPt);
        this.stage.update();
        this.lineContainer.type = 'line';
        this.lineContainer.addEventListener('mousedown', this.shapeMouseDown.bind(this));
        this.lineContainer.addEventListener('mouseup', this.shapeMouseUp);
        this.globalService.currentShapeBtn.subscribe((currentShapeBtn) => {
            this.currentShapeBtn = currentShapeBtn;
        });
    }
    calculateWidth(startingPoint, endPoint) {
        const xDist = endPoint.x - startingPoint.x;
        const yDist = endPoint.y - startingPoint.y;
        const centerPointX = ((endPoint.x - startingPoint.x) / 2);
        const centerPointY = ((endPoint.y - startingPoint.y) / 2);
        // this.measurementText.text = Math.floor(Math.sqrt(xDist * xDist + yDist * yDist)) +' '+ this.measurementCalc;
        this.measurementText.x = startingPoint.x + centerPointX;
        this.measurementText.y = startingPoint.y + centerPointY;
        const angle = Math.atan2(yDist, xDist) * (180 / Math.PI);
        this.measurementText.rotation = angle;

        this.stage.update();
    }
    shapeMouseDown(e) {
        this.offset = {
            x: this.lineContainer.x - e.stageX,
            y: this.lineContainer.y - e.stageY
        };
        this.lineContainer.addEventListener('pressmove', this.shapeMouseMove.bind(this));
        if (this.currentShapeBtn === 'select') {
            this.lineContainer.graphics = this.drawingCanvas.graphics;
            this.globalService.selectedShape = this.lineContainer;
            this.globalService.updateProperties();
        }
    }
    shapeMouseMove(e) {
        if (this.currentShapeBtn === 'select') {
            this.lineContainer.x = this.stage.mouseX + this.offset.x;
            this.lineContainer.y = this.stage.mouseY + this.offset.y;
            this.stage.update();
            this.globalService.updateProperties();
        }
    }
    shapeMouseUp(e) {
        this.lineContainer.removeEventListener('pressmove', this.shapeMouseMove);
    }
    mouseDown() {

    }
    mouseUp() {
        if (this.currentShapeBtn !== 'select') {
            this.globalService.mTextInputValue = 0;
            $('#lineDialog').modal('show');
        }
    }
    mouseMove() {
        if (this.currentShapeBtn !== 'select') {

            const midPt = new createjs.Point(this.stage.mouseX, this.stage.mouseY);
            this.drawingCanvas.graphics.clear().setStrokeStyle(this.globalService.stroke, 'round', 'round')
                .beginStroke(this.globalService.stokeColor).moveTo(midPt.x, midPt.y)
                .lineTo(this.lineContainer.oldPt.x, this.lineContainer.oldPt.y);
            this.lineContainer.oldMidPt = midPt;
            this.lineContainer.graphics = this.drawingCanvas.graphics;
            this.calculateWidth(this.lineContainer.oldPt, this.lineContainer.oldMidPt);

        }
    }
    updateColor(updateStroke, updateStrokeColor, updateFillColor) {
        const rect = this.drawingCanvas.graphics._instructions[1];
        this.drawingCanvas.graphics.clear().
            setStrokeStyle(updateStroke, 'round', 'round')
            .beginStroke(updateStrokeColor).moveTo(this.lineContainer.oldMidPt.x, this.lineContainer.oldMidPt.y)
            .lineTo(this.lineContainer.oldPt.x, this.lineContainer.oldPt.y);
        this.stage.update();
    }
    redraw(data) {
        console.log("line", data);
        this.drawingCanvas.graphics.clear().
            setStrokeStyle(data.stroke, 'round', 'round')
            .beginStroke(data.strokeColor).moveTo(data.oldMidPt.x, data.oldMidPt.y)
            .lineTo(data.oldPt.x, data.oldPt.y);
        this.measurementText.text = data.measurementText;
        this.calculateWidth(data.oldPt, data.oldMidPt)
        this.stage.update();
    }

}
