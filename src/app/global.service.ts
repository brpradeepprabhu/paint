import { BehaviorSubject, Observable, Subject } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
declare var $;
@Injectable()
export class GlobalService {
  currentShapeBtnSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  currentShapeBtn: Observable<any> = this.currentShapeBtnSubject.asObservable();
  stokeColor = '#ffff00';
  fillColor = '#0000ff';
  stroke = 10;
  selectedShape;
  textInputValue;
  updateFontStyle;
  updateFontWeight;
  updateText;
  updateFontSize;
  updateX;
  updateY;
  updateAlpha;
  updateStrokeColor;
  updateStroke;
  updateFillColor;
  taskDesc;
  taskHeadValue;
  taskCounter = 0;
  mTextInputValue = 0;
  constructor() { }
  updateCurrentShapeBtn(currentShapeBtn: string) {
    this.currentShapeBtnSubject.next(currentShapeBtn);
  }

  updateProperties() {
    $('#deleteBtn').show();
    this.updateX = this.selectedShape.x;
    this.updateY = this.selectedShape.y;
    this.updateAlpha = this.selectedShape.alpha;
    if (this.selectedShape.graphics) {
      $('#textProperties').hide();
      this.updateStrokeColor =
        (this.selectedShape.graphics._stroke == null) ? '#000000' : this.selectedShape.graphics._stroke.style;
      this.updateFillColor =
        (this.selectedShape.graphics._fill == null) ? '#000000' : this.selectedShape.graphics._fill.style;
      this.updateStroke =
        (this.selectedShape.graphics._stroke == null) ? 0 : this.selectedShape.graphics._strokeStyle.width;
    } else {
      this.updateFillColor = this.selectedShape.color;
      const textFont: any = this.selectedShape.font.split(' ');
      this.updateFontStyle = textFont[0];
      this.updateFontWeight = textFont[1];
      this.updateText = this.selectedShape.text;
      this.updateFontSize = textFont[2].trim();
      $('#textProperties').show();
    }
    $('#properties').show();
    $('#task').hide();
  }
}
