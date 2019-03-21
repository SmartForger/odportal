import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { App } from 'src/app/models/app.model';
import { Widget } from 'src/app/models/widget.model';
import { WidgetRendererFormat } from 'src/app/models/widget-renderer-format.model';
import { WidgetWindowsService } from 'src/app/services/widget-windows.service';

@Component({
  selector: 'app-widget-windows',
  templateUrl: './widget-windows.component.html',
  styleUrls: ['./widget-windows.component.scss']
})
export class WidgetWindowsComponent implements OnInit {

  models: Array<{app: App, widget: Widget, docked: boolean, maximized: boolean, resize: Subject<any>}>;
  rendererFormatFloating: WidgetRendererFormat;
  rendererFormatDocked: WidgetRendererFormat;
  rendererFormatMaximized: WidgetRendererFormat;

  constructor(private widgetWindowsSvc: WidgetWindowsService) { 
    this.models = [];
    this.rendererFormatFloating = {
      cardClass: 'gridster-card-view-mode', widgetBodyClass: '',
      leftBtn: {class: "", icon: "crop_square", disabled: false},
      middleBtn: {class: "", icon: "remove", disabled: false},
      rightBtn: {class: "", icon: "clear", disabled: false}
    }
    this.rendererFormatDocked = {
      cardClass: 'gridster-card-view-mode', widgetBodyClass: '',
      leftBtn: {class: "", icon: "crop_square", disabled: false},
      middleBtn: {class: "", icon: "filter_none", disabled: false},
      rightBtn: {class: "", icon: "clear", disabled: false}
    }
    this.rendererFormatMaximized = {
      cardClass: 'gridster-card-view-mode', widgetBodyClass: '',
      leftBtn: {class: "", icon: "filter_none", disabled: false},
      middleBtn: {class: "", icon: "remove", disabled: false},
      rightBtn: {class: "", icon: "clear", disabled: false}
    }
  }

  ngOnInit() {
    this.widgetWindowsSvc.addWindowSub.subscribe(
      (modelPair) => this.addWindow(modelPair)
    );
    this.widgetWindowsSvc.removeAppWindowsSub.subscribe(
      (appId: string) => this.removeWindowsByAppId(appId)
    );
  }

  addWindow(modelPair: {app: App, widget: Widget}){
    this.models.push({
      app: modelPair.app,
      widget: modelPair.widget,
      docked: false,
      maximized: false,
      resize: new Subject()
    });
  }

  removeWindow(index: number){
    this.models.splice(index, 1);
  }

  removeWindowsByAppId(appId: string): void {
    this.models = this.models.filter((modelPair) => modelPair.app.docId !== appId);
  }

  toggleDocked(index: number){
    this.models[index].docked = !this.models[index].docked;
  }

  maximize(index: number){
    this.models[index].maximized = true;
  }

  popoutMaximizedWidget(index: number){
    this.models[index].docked = false;
    this.minimize(index);
  }

  dockMaximizedWidget(index: number){
    this.models[index].docked = true;
    this.minimize(index);
  }

  stateChanged(state: string, index: number){
    this.models[index].widget.state = JSON.parse(state);
  }

  minimize(index: number){
    this.models[index].maximized = false;
  }

  getFloatingClass(index: number){
    if(this.models[index].docked){
      return "floating-widget-window floating-widget-docked"
    }
    else{
      return "floating-widget-window"
    }
  }

  resize(index: number): void{
    this.models[index].resize.next();
  }
  
}
