import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { App } from 'src/app/models/app.model';
import { WidgetRendererFormat } from 'src/app/models/widget-renderer-format.model';
import { WidgetWindowsService } from 'src/app/services/widget-windows.service';
import {AppsService} from '../../../services/apps.service';
import { AppWithWidget } from 'src/app/models/app-with-widget.model';
import {StateMutator} from '../../../util/state-mutator';

@Component({
  selector: 'app-widget-windows',
  templateUrl: './widget-windows.component.html',
  styleUrls: ['./widget-windows.component.scss']
})
export class WidgetWindowsComponent implements OnInit {

  models: Array<{aww: AppWithWidget, docked: boolean, maximized: boolean, resize: Subject<void>}>;
  rendererFormatFloating: WidgetRendererFormat;
  rendererFormatDocked: WidgetRendererFormat;
  rendererFormatMaximized: WidgetRendererFormat;

  constructor(
    private widgetWindowsSvc: WidgetWindowsService,
    private appsSvc: AppsService) { 
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
    this.widgetWindowsSvc.observeAddWindow().subscribe(
      (modelPair) => this.addWindow(modelPair)
    );
    this.widgetWindowsSvc.observeAppWindowRemoval().subscribe(
      (appId: string) => this.removeWindowsByAppId(appId)
    );
    this.appsSvc.observeLocalAppCache().subscribe(
      (apps: Array<App>) => {
        this.removeAppsByLocalCacheRefresh(apps);
      }
    );
  }

  addWindow(modelPair: AppWithWidget){
    this.models.push({
      aww: modelPair,
      docked: false,
      maximized: false,
      resize: new Subject<void>()
    });
  }

  removeWindow(index: number){
    this.models.splice(index, 1);
  }

  removeWindowsByAppId(appId: string): void {
    this.models = this.models.filter((model) => model.aww.app.docId !== appId);
  }

  removeAppsByLocalCacheRefresh(apps: Array<App>): void {
    this.models = this.models.filter((model) => {
      const app: App = apps.find((a: App) => a.docId === model.aww.app.docId);
      if (app) {
        return true;
      }
      return false;
    });
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

  stateChanged(state: any, index: number){
    this.models[index].aww.widget.state = StateMutator.parseState(state);
    //this.models[index].aww.widget.state = JSON.parse(state);
  }

  minimize(index: number){
    this.models[index].maximized = false;
  }

  /*
  getFloatingClass(index: number){
    if(this.models[index].docked){
      return "floating-widget-window floating-widget-docked"
    }
    else{
      return "floating-widget-window"
    }
  }
  */

  resize(index: number): void{
    this.models[index].resize.next();
  }
  
}
