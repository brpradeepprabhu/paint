import { GlobalService } from '../../global.service';
declare var $;
declare var createjs;
export class CanvasText {
    stage;
    text;
    offset;
    currentShapeBtn;
    selectedShape;
    constructor(stage, text, container, private globalService: GlobalService) {
        this.stage = stage;
        this.text = new createjs.Text(text, 'normal bold 20px Arial', '#000000');
        this.text.x = this.stage.mouseX;
        this.text.y = this.stage.mouseY;
        container.addChild(this.text);
        this.text.instance = this;
        this.stage.update();
        this.text.addEventListener('mousedown', this.shapeMouseDown.bind(this));
        this.text.addEventListener('mouseup', this.shapeMouseUp);
        this.text.type = 'text';
        $('#textDialog').modal('show');
        $('#textInputValue').val('');
        this.globalService.currentShapeBtn.subscribe((currentShapeBtn) => {
            this.currentShapeBtn = currentShapeBtn;
        });
    }
    shapeMouseDown(e) {
        const hit = new createjs.Shape();
        hit.graphics.beginFill('rgba(0,0,0,0.5)').drawRect(0, 0, this.text.getMeasuredWidth(), this.text.getMeasuredHeight());
        this.text.hitArea = hit;
        this.offset = {
            x: this.text.x - e.stageX,
            y: this.text.y - e.stageY
        };
        this.text.addEventListener('pressmove', this.shapeMouseMove.bind(this));
        if (this.currentShapeBtn === 'select') {
            this.globalService.selectedShape = this.text;
            this.globalService.updateProperties();
        }
    }
    shapeMouseMove(e) {
        if (this.currentShapeBtn === 'select') {
            this.text.x = this.stage.mouseX + this.offset.x;
            this.text.y = this.stage.mouseY + this.offset.y;
            this.stage.update();
            this.globalService.updateProperties();
        }
    }
    shapeMouseUp(e) {
        this.text.removeEventListener('pressmove', this.shapeMouseMove);
    }
    mouseDown() {

    }
    mouseUp() {

    }
    mouseMove() {

    }
    updateColor(updateStroke, updateStrokeColor, updateFillColor) {
        this.text.color = updateFillColor;
        this.stage.update();
    }
    redraw(data) {
        console.log("text", data)
        this.text.x = data.x;
        this.text.y = data.y;
        this.text.alpha = data.alpha;
        this.text.font = data.font;
        this.text.color = data.color;
        this.text.text = data.text;
        this.stage.update();
    }
}
