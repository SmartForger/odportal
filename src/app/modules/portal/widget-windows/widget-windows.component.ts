import { Component, OnInit, Input } from '@angular/core';
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

  models: Array<{app: App, widget: Widget, docked: boolean, maximized: boolean}>;
  rendererFormat: WidgetRendererFormat;
  maximizedFormat: WidgetRendererFormat;

  constructor(private widgetWindowsSvc: WidgetWindowsService) { 
    this.models = [];
    this.rendererFormat = {
      cardClass: 'gridster-card-view-mode',
      greenBtnClass: 'greenExpandBtn', yellowBtnClass: 'yellowMinimizeBtn', redBtnClass: 'redCloseBtn',
      greenBtnDisabled: false, yellowBtnDisabled: false, redBtndisabeld: false
    }
    this.maximizedFormat = {
      cardClass: 'gridster-card-view-mode',
      greenBtnClass: 'disabledBtn', yellowBtnClass: 'yellowMinimizeBtn', redBtnClass: 'redCloseBtn',
      greenBtnDisabled: true, yellowBtnDisabled: false, redBtndisabeld: false
    }
    this.widgetWindowsSvc.addWindowSub.subscribe(
      (modelPair) => this.addWindow(modelPair)
    );
  }

  ngOnInit() {
    
  }

  addWindow(modelPair: {app: App, widget: Widget}){
    this.models.push({
      app: modelPair.app,
      widget: modelPair.widget,
      docked: false,
      maximized: false
    });
  }

  removeWindow(index: number){
    this.models.splice(index, 1);
  }

  toggleDocked(index: number){
    this.models[index].docked = !this.models[index].docked;
  }

  maximize(index: number){
    this.models[index].maximized = true;
  }

  popoutMaximizedWidget(){
    
  }

  maximizedStateChanged(state: string, index: number){
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
}
