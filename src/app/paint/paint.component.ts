
import { Task } from './shape/task';

import { Ellipsis } from './shape/ellipsis';
import { Circle } from './shape/circle';
import { Rect } from './shape/rect';
import { Square } from './shape/square';
import { CanvasText } from './shape/text';
import { Line } from './shape/line';
import { GlobalService } from '../global.service';
import { FreeStyle } from './shape/freestyle';
import { Component, ElementRef, EventEmitter, Input, OnInit } from '@angular/core';
declare var createjs;
declare var $;
declare var localStorage;
@Component({
  selector: 'app-paint',
  templateUrl: './paint.component.html',
  styleUrls: ['./paint.component.css']
})
export class PaintComponent implements OnInit {
  canvas; stage; currentShapeBtn = 'freestyle';
  currentShape;
  stroke = 10;
  fillColor = '#000fff';
  selectedShape; taskList = [];
  contentContainer;
  mouseUp = false;
  textInputValue = '';
  @Input() saveJSON: EventEmitter<any> = new EventEmitter<any>();
  constructor(private globalServ: GlobalService) {

  }
  ngOnInit() {
    this.canvas = document.getElementById('canvas');
    const parentNode = this.canvas.parentNode;
    this.stage = new createjs.Stage(this.canvas);
    this.contentContainer = new createjs.Container();
    this.stage.addChild(this.contentContainer);
    this.stage.addEventListener('stagemousedown', this.stageMouseDown.bind(this));
    this.stage.addEventListener('stagemouseup', this.stageMouseUp.bind(this));
    const parentStyle = window.getComputedStyle(parentNode);
    this.canvas.height = window.innerHeight * 0.8;
    this.canvas.width = parseInt(parentStyle.width, 10);
    $('#strokeColor').colorpicker({
      color: this.globalServ.stokeColor,
      customClass: 'colorPickerCustom',
      align: 'left',
    }).on('changeColor', (e) => {
      this.globalServ.stokeColor = e.value;
    });
    $('#fillColor').colorpicker({
      color: this.fillColor,
      align: 'left',
    }).on('changeColor', (e) => {
      this.fillColor = e.value;
    });
    $('#updateFillColor').colorpicker({
      color: this.globalServ.updateFillColor,
      align: 'left',
    }).on('changeColor', (e) => {
      this.globalServ.updateFillColor = e.value;
    });
    $('#updateStrokeColor').colorpicker({
      color: this.globalServ.updateStrokeColor,
      align: 'left',
    }).on('changeColor', (e) => {
      this.globalServ.updateStrokeColor = e.value;
    });
    $('#deleteBtn').hide();
    $('#textProperties').hide();
    $('#properties').hide();
    $('#task').show();
    $('[data-toggle="tooltip"]').tooltip();
  }
  downloadImage() {
    if (this.canvas.msToBlob) {
      const blob = this.canvas.msToBlob();
      window.navigator.msSaveBlob(blob, 'canvas.jpeg');
    } else {
      const a = document.createElement('a');
      a.href = this.canvas.toDataURL();
      a.download = 'this.canvas.jpeg';
      document.body.appendChild(a);
      a.click();
    }
  }
  showStrokeColor() {
    $('#strokeColor').colorpicker('show');
  }
  updateSelectedObj() {

    if (this.globalServ.selectedShape) {
      this.selectedShape = this.globalServ.selectedShape;
      this.selectedShape.x = this.globalServ.updateX;
      this.selectedShape.y = this.globalServ.updateY;
      this.selectedShape.alpha = this.globalServ.updateAlpha;
      this.selectedShape.instance.updateColor(this.globalServ.updateStroke,
        this.globalServ.updateStrokeColor,
        this.globalServ.updateFillColor);

      if (!this.selectedShape.graphics) {
        this.selectedShape.font = this.globalServ.updateFontStyle + ' ' +
          this.globalServ.updateFontWeight + ' '
          + this.globalServ.updateFontSize + ' Arial';
        this.selectedShape.text = this.globalServ.updateText;
        this.selectedShape.color = this.globalServ.updateFillColor;
        console.log(this.globalServ.updateFillColor);
        $('#textProperties').show();
      }
      this.stage.update();
    }
  }

  showSelectFillColor() {
    $('#updateFillColor').colorpicker('show');
  }

  showSelectStrokeColor() {
    $('#updateStrokeColor').colorpicker('show');
  }
  showFillColor() {
    $('#fillColor').colorpicker('show');
  }

  deleteSelected() {
    if (this.globalServ.selectedShape) {
      this.contentContainer.removeChild(this.globalServ.selectedShape);
      if (this.globalServ.selectedShape.taskCounter) {
        for (let i = 0; i < this.taskList.length; i++) {
          if (this.taskList[i].id === this.globalServ.selectedShape.taskCounter) {
            this.taskList.splice(i, 1);
          }
        }
      }
      this.stage.update();
      this.globalServ.selectedShape = undefined;
      $('#deleteBtn').hide();
      $('#textProperties').hide();
    }
  }

  stageMouseDown(event) {
    this.mouseUp = false;
    $('#strokeColor').colorpicker('hide');
    $('#fillColor').colorpicker('hide');
    this.clearTaskFilter();
    this.stage.addEventListener('stagemousemove', this.stageMouseMove.bind(this));
    console.log(this.currentShapeBtn);
    if (this.currentShapeBtn === 'freestyle') {
      this.currentShape = new FreeStyle(this.stage, this.contentContainer, this.globalServ);

    } else if (this.currentShapeBtn === 'line') {
      this.currentShape = new Line(this.stage, this.contentContainer, this.globalServ);

    } else if (this.currentShapeBtn === 'text') {
      this.currentShape = new CanvasText(this.stage, '', this.contentContainer, this.globalServ);

    } else if (this.currentShapeBtn === 'square') {
      this.currentShape = new Square(this.stage, this.contentContainer, this.globalServ);

    } else if (this.currentShapeBtn === 'rect') {
      this.currentShape = new Rect(this.stage, this.contentContainer, this.globalServ);

    } else if (this.currentShapeBtn === 'circle') {
      this.currentShape = new Circle(this.stage, this.contentContainer, this.globalServ);

    } else if (this.currentShapeBtn === 'ellipsis') {
      this.currentShape = new Ellipsis(this.stage, this.contentContainer, this.globalServ);

    } else if (this.currentShapeBtn === 'task') {
      this.currentShape = new Task(this.stage, this.contentContainer, this.globalServ);

    }
    if (this.currentShapeBtn !== 'select') {
      this.globalServ.selectedShape = undefined;
      $('#deleteBtn').hide();
      $('#textProperties').hide();
      $('#properties').hide();
      $('#task').show();
    }
  }

  changeMeasurement() {
    this.currentShape.measurementText.text = this.globalServ.mTextInputValue;
    this.currentShape.lineContainer.measurementText = this.globalServ.mTextInputValue;
    $('#lineDialog').modal('hide');
    this.stage.update();
  }

  stageMouseMove(event) {
    if (!this.mouseUp) {
      if (this.currentShape) {
        this.currentShape.mouseMove();
      }
    }
  }

  displayText() {
    this.currentShape.text.text = this.globalServ.textInputValue;
    $('#textDialog').modal('hide');
    this.stage.update();
  }

  stageMouseUp(event) {
    this.mouseUp = true;
    this.stage.removeEventListener('stagemousemove', this.stageMouseMove.bind(this));
    if (this.currentShape) {
      this.currentShape.mouseUp();
    }
  }

  undo() {
    if (this.contentContainer.getNumChildren() > 0) {
      const child = this.contentContainer.getChildAt(this.contentContainer.getNumChildren() - 1);
      if (child.taskCounter) {
        for (let i = 0; i < this.taskList.length; i++) {
          if (this.taskList[i].id === child.taskCounter) {
            this.taskList.splice(i, 1);
          }
        }
      }
      this.contentContainer.removeChildAt(this.contentContainer.getNumChildren() - 1);
      this.stage.update();
    }
  }

  clearAll() {
    this.contentContainer.removeAllChildren();
    this.taskList = [];
    this.stage.update();
  }

  createShape(shape) {
    this.currentShapeBtn = shape;
    this.globalServ.updateCurrentShapeBtn(this.currentShapeBtn);
  }

  updateStroke() {
    this.globalServ.stroke = this.stroke;
  }

  saveTask() {
    this.taskList.push({
      id: this.globalServ.taskCounter,
      desc: this.globalServ.taskDesc,
      header: this.globalServ.taskHeadValue,
    });
    this.globalServ.taskCounter++;
    $('#taskDialog').hide();
  }
  openJSONData() {
    this.contentContainer.removeAllChildren();
    const prevJSON = JSON.parse(localStorage.savejson);
    this.taskList = prevJSON.task;
    console.log(prevJSON)
    for (let i = 0; i < prevJSON.shape.length; i++) {
      switch (prevJSON.shape[i].type) {
        case 'circle':
          this.currentShape = new Circle(this.stage, this.contentContainer, this.globalServ);
          this.currentShape.redraw(prevJSON.shape[i]);
          break;
        case 'rect':
          this.currentShape = new Rect(this.stage, this.contentContainer, this.globalServ);
          this.currentShape.redraw(prevJSON.shape[i]);
          break;
        case 'square':
          this.currentShape = new Square(this.stage, this.contentContainer, this.globalServ);
          this.currentShape.redraw(prevJSON.shape[i]);
          break;
        case 'ellipsis':
          this.currentShape = new Ellipsis(this.stage, this.contentContainer, this.globalServ);
          this.currentShape.redraw(prevJSON.shape[i]);
          break;
        case 'line':
          this.currentShape = new Line(this.stage, this.contentContainer, this.globalServ);
          this.currentShape.redraw(prevJSON.shape[i]);
          break;
        case 'text':
          this.currentShape = new CanvasText(this.stage, '', this.contentContainer, this.globalServ);
          this.currentShape.redraw(prevJSON.shape[i]);
          $('#textDialog').modal('hide');
          break;
        case 'task':
          this.currentShape = new Task(this.stage, this.contentContainer, this.globalServ, prevJSON.shape[i]);
          

          break;
      }
    }
    $('#deleteBtn').hide();
    $('#textProperties').hide();
    $('#properties').hide();
    $('#task').show();
  }
  saveJSONData() {
    const savejson = { 'shape': [], task: this.taskList };
    this.contentContainer.children.forEach((element: any) => {
      const shapeData: any = {
        x: element.x,
        y: element.y,
        alpha: element.alpha,
        type: element.type,
        taskCounter: element.taskCounter
      };
      if (element.graphics != null) {
        shapeData.strokeColor = element.graphics._stroke.style;
        shapeData.fillColor = (element.graphics._fill !== null) ? element.graphics._fill.style : '';
        shapeData.stroke = element.graphics._strokeStyle.width;
        if (element.type === 'line') {
          shapeData.oldMidPt = element.oldMidPt;
          shapeData.oldPt = element.oldPt;
          shapeData.measurementText = element.measurementText;
        }
        if (element.type === 'circle') {
          shapeData.radius = element.graphics._instructions[1].radius;
        } else {
          shapeData.width = element.graphics._instructions[1].w;
          shapeData.height = element.graphics._instructions[1].h;
        }
      } else {
        shapeData.font = element.font;
        shapeData.color = element.color;
        shapeData.text = element.text;
      }
      savejson.shape.push(shapeData);

    });
    console.log(savejson);
    localStorage.savejson = JSON.stringify(savejson);
  }

  clearTaskFilter() {
    this.contentContainer.children.forEach((element) => {
      if (element.taskCounter !== undefined) {
        element.instance.clearFilter();
      }
    });
  }

  applyTaskFilter(e) {
    this.contentContainer.children.forEach((element) => {

      if (element.taskCounter !== undefined) {
        console.log(e);
        console.log(element.taskCounter, e.target.id);
        if (element.taskCounter.toString() === e.target.id) {
          console.log(element.instance);
          element.instance.applyFilter();
          this.currentShapeBtn = 'select';
          this.globalServ.updateCurrentShapeBtn(this.currentShapeBtn);
        } else {
          element.instance.clearFilter();
        }
      }

    });
  }
}
