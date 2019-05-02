import { Injectable } from '@angular/core';
import { WidgetModalComponent } from '../modules/portal/widget-modal/widget-modal.component';

@Injectable({
  providedIn: 'root'
})
export class WidgetModalService {

  get modal(): WidgetModalComponent{
    return this._modal;
  }
  set modal(modal: WidgetModalComponent){
    this._modal = modal;
  }
  private _modal: WidgetModalComponent;
  

  private _hidden: boolean;

  constructor() { }

  hide(): void{
    this.modal.hide();
  }

  show(): void{
    this.modal.show();
  }
}
