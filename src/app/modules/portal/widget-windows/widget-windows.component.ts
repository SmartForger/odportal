import { Component, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { App } from "src/app/models/app.model";
import { WidgetRendererFormat } from "src/app/models/widget-renderer-format.model";
import { WidgetWindowsService } from "src/app/services/widget-windows.service";
import { AppsService } from "../../../services/apps.service";
import { AppWithWidget } from "src/app/models/app-with-widget.model";
import { Cloner } from "../../../util/cloner";

interface WidgetModel {
  aww: AppWithWidget;
  docked: boolean;
  maximized: boolean;
  resize: Subject<void>;
  zoffset: number;
}

@Component({
  selector: "app-widget-windows",
  templateUrl: "./widget-windows.component.html",
  styleUrls: ["./widget-windows.component.scss"]
})
export class WidgetWindowsComponent implements OnInit {
  models: Array<WidgetModel>;
  rendererFormatFloating: WidgetRendererFormat;
  rendererFormatDocked: WidgetRendererFormat;
  rendererFormatMaximized: WidgetRendererFormat;

  constructor(
    private widgetWindowsSvc: WidgetWindowsService,
    private appsSvc: AppsService
  ) {
    this.models = [];
    this.rendererFormatFloating = {
      cardClass: "gridster-card-view-mode",
      widgetBodyClass: "",
      buttons: [
        {title: 'Minimize', class: "minimize", icon: "remove", disabled: false},
        {title: 'Float', class: "", icon: "filter_none", disabled: true},
        {title: 'Maximize', class: "", icon: "crop_square", disabled: false},
        {title: 'Close', class: "", icon: "clear", disabled: false}
      ]
    };
    this.rendererFormatDocked = {
      cardClass: "gridster-card-view-mode",
      widgetBodyClass: "",
      buttons: [
        {title: 'Minimize', class: "minimize", icon: "remove", disabled: true},
        {title: 'Float', class: "", icon: "filter_none", disabled: false},
        {title: 'Maximize', class: "", icon: "crop_square", disabled: false},
        {title: 'Close', class: "", icon: "clear", disabled: false}
      ]
    };
    this.rendererFormatMaximized = {
      cardClass: "gridster-card-view-mode",
      widgetBodyClass: "",
      buttons: [
        {title: 'Minimize', class: "minimize", icon: "remove", disabled: false},
        {title: 'Float', class: "", icon: "filter_none", disabled: false},
        {title: 'Maximize', class: "", icon: "crop_square", disabled: true},
        {title: 'Close', class: "", icon: "clear", disabled: false}
      ]
    };
  }

  ngOnInit() {
    this.widgetWindowsSvc
      .observeAddWindow()
      .subscribe(modelPair => this.addWindow(modelPair));
    this.widgetWindowsSvc
      .observeAppWindowRemoval()
      .subscribe((appId: string) => this.removeWindowsByAppId(appId));
    this.appsSvc.observeLocalAppCache().subscribe((apps: Array<App>) => {
      this.removeAppsByLocalCacheRefresh(apps);
    });
  }

  addWindow(modelPair: any) {
    this.models.push({
      aww: Cloner.cloneObject(modelPair),
      docked: modelPair.docked === true,
      maximized: modelPair.maximized === true,
      resize: new Subject<void>(),
      zoffset: this.models.length
    });
  }

  removeWindow(index: number) {
    this.models.splice(index, 1);
  }

  removeWindowsByAppId(appId: string): void {
    this.models = this.models.filter(model => model.aww.app.docId !== appId);
  }

  removeAppsByLocalCacheRefresh(apps: Array<App>): void {
    this.models = this.models.filter(model => {
      const app: App = apps.find((a: App) => a.docId === model.aww.app.docId);
      if (app) {
        return true;
      }
      return false;
    });
  }

  handleBtnClick(btn: string, index: number){
      console.log(`btn: ${btn}`);
      switch(btn){
          case 'Minimize':
              this.toggleDocked(index);
              break;
          case 'Float': 
            if(this.models[index].maximized){
              this.restoreMaximized(index);
            }
            else{
              this.toggleDocked(index);
            }
            break;
          case 'Maximize':
            this.maximize(index);
            break;
          case 'Close':
            this.removeWindow(index);
            break;
          case 'titleBarClick':
            if(this.models[index].docked){
                this.toggleDocked(index);
            }
            this.bringToFront(index);
            break;
      }
  }

  toggleDocked(index: number) {
    this.models[index].docked = !this.models[index].docked;
  }

  maximize(index: number) {
    this.models[index].maximized = true;
  }

  restoreMaximized(index: number) {
    this.models[index].maximized = false;
    this.models[index].docked = false;
  }

  stateChanged(state: any, index: number) {
    this.models[index].aww.widget.state = state;
    //this.models[index].aww.widget.state = JSON.parse(state);
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

  resize(index: number): void {
    this.models[index].resize.next();
  }

  bringToFront(index: number): void{
    let maxOffset = -1;
    let modelOffset = this.models[index].zoffset;
    this.models.forEach((model: WidgetModel) => {
      if(model.zoffset > modelOffset){
        if(model.zoffset > maxOffset){
          maxOffset = model.zoffset;
        }
        model.zoffset = model.zoffset - 1;
      }
    });
    this.models[index].zoffset = maxOffset;
  }
}
