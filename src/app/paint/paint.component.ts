import { el } from '@angular/platform-browser/testing/src/browser_util';

import { Component, ElementRef, Input, OnInit } from '@angular/core';
declare var createjs;
@Component({
  selector: 'app-paint',
  templateUrl: './paint.component.html',
  styleUrls: ['./paint.component.css']
})
export class PaintComponent implements OnInit {
  @Input() width: any = '100';
  @Input() height: any = '100';
  _image;
  canvas; stage; oldPt; oldMidPt; drawingCanvas;
  color = '#ffff00';
  stroke = 10;
  trigger = false;
  constructor(ele: ElementRef) {


  }
  @Input() get image(): string {
    return this._image;
  }
  set image(path: string) {
    this._image = path;
    this.loadImage();
  }
  ngOnInit() {
    this.canvas = document.getElementById('canvas');
    console.log(this.canvas);
    this.stage = new createjs.Stage(this.canvas);

    console.log(this.stage);
    
    this.loadImage();
  }
  loadImage() {

    if (this.image && this.stage) {
      this.stage.removeAllChildren();
      const image = new Image();
      image.src = this.image;
      image.onload = () => {
        const bitmap = new createjs.Bitmap(image);
        const text = new createjs.Text('pradeep');
        if (image.width > 500) {
          bitmap.scaleX = bitmap.scaleY = 500 / image.width;
        }
        this.stage.addChild(bitmap, text);
        this.drawingCanvas = new createjs.Shape();
        this.stage.addChild(this.drawingCanvas);
        this.stage.update();
      };

      this.stage.addEventListener('stagemousedown', this.handleMouseDown.bind(this));
      this.stage.addEventListener('stagemouseup', this.handleMouseUp.bind(this));
    }
  }
  handleMouseDown(event) {
    if (!event.primary) { return; }
    this.oldPt = new createjs.Point(this.stage.mouseX, this.stage.mouseY);
    this.oldMidPt = this.oldPt.clone();
    this.trigger = true;
    this.stage.addEventListener('stagemousemove', this.handleMouseMove.bind(this));
    this.stage.update();
  }
  handleMouseMove(event) {
    if (!event.primary) { return; }
    console.log(this.trigger)
    if (this.trigger) {
      const midPt = new createjs.Point(this.oldPt.x + this.stage.mouseX >> 1, this.oldPt.y + this.stage.mouseY >> 1);
      this.drawingCanvas.graphics.setStrokeStyle(this.stroke, 'round', 'round')
        .beginStroke(this.color).moveTo(midPt.x, midPt.y).curveTo(this.oldPt.x, this.oldPt.y, this.oldMidPt.x, this.oldMidPt.y);
      this.oldPt.x = this.stage.mouseX;
      this.oldPt.y = this.stage.mouseY;
      this.oldMidPt.x = midPt.x;
      this.oldMidPt.y = midPt.y;
      this.stage.update();
    }
  }
  handleMouseUp(event) {
    if (!event.primary) { return; }
    this.stage.removeEventListener('stagemousemove', this.handleMouseMove);
    this.trigger = false;
    this.stage.update();
  }

}
