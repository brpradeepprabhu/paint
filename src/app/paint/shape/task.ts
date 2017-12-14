import { GlobalService } from '../../global.service';
declare var createjs;
declare var $;
export class Task {
    stage;
    drawingCanvas;
    startingPoint;
    offset;
    currentShapeBtn;
    constructor(stage, container, private globalService: GlobalService, data?: any) {
        this.stage = stage;
        const image = new Image();
        image.src = 'assets/images/task.png';
        image.onload = () => {
            this.drawingCanvas = new createjs.Bitmap(image);
            this.startingPoint = new createjs.Point(stage.mouseX, stage.mouseY);
            container.addChild(this.drawingCanvas);
            this.drawingCanvas.x = stage.mouseX;
            this.drawingCanvas.y = stage.mouseY;
            this.drawingCanvas.instance = this;
            this.drawingCanvas.taskCounter = this.globalService.taskCounter;
            this.drawingCanvas.type = 'task';
            this.stage.update();
            this.drawingCanvas.addEventListener('mousedown', this.shapeMouseDown.bind(this));
            this.drawingCanvas.addEventListener('mouseup', this.shapeMouseUp);
            if (!data) {
                $('#taskDialog').show();
            } else {
                this.redraw(data);
            }
        };

        this.globalService.currentShapeBtn.subscribe((currentShapeBtn) => {
            this.currentShapeBtn = currentShapeBtn;
        });
    }
    applyFilter() {
        const filter = new createjs.ColorFilter(0, 0, 0, 1, 0, 0, 255, 0);
        this.drawingCanvas.filters = [filter];
        this.drawingCanvas.cache(0, 0, this.drawingCanvas.getBounds().width, this.drawingCanvas.getBounds().height);
        console.log(filter);
        this.stage.update();
    }
    clearFilter() {
        this.drawingCanvas.filters = [];
        this.drawingCanvas.cache(0, 0, this.drawingCanvas.getBounds().width, this.drawingCanvas.getBounds().height);
        this.stage.update();
    }
    shapeMouseDown(e) {
        this.offset = {
            x: this.drawingCanvas.x - e.stageX,
            y: this.drawingCanvas.y - e.stageY
        };
        this.drawingCanvas.addEventListener('pressmove', this.shapeMouseMove.bind(this));
        if (this.currentShapeBtn === 'select') {
            this.globalService.selectedShape = this.drawingCanvas;
            $('#deleteBtn').show();

        }
    }
    shapeMouseMove(e) {
        if (this.currentShapeBtn === 'select') {
            this.drawingCanvas.x = this.stage.mouseX + this.offset.x;
            this.drawingCanvas.y = this.stage.mouseY + this.offset.y;
            $('#task').show();
            this.stage.update();

        }
    }
    shapeMouseUp(e) {
        $('#task').show();
    }
    mouseDown() {

    }
    mouseUp() {
        if (this.currentShapeBtn !== 'select') {
            this.globalService.taskDesc = '';
            this.globalService.taskHeadValue = '';
            $('#taskDialog').show();
        }

    }
    mouseMove() {

    }
    updateColor(updateStroke, updateStrokeColor, updateFillColor) {

    }
    redraw(data) {
        console.log('task', data);
        this.drawingCanvas.x = data.x;
        this.drawingCanvas.y = data.y;
        this.drawingCanvas.alpha = data.alpha;
        this.drawingCanvas.taskCounter = data.taskCounter;
        $('#taskDialog').hide();
        this.stage.update();
        this.globalService.taskCounter = data.taskCounter + 1;
    }
}
