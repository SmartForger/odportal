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

  dockedModels: Array<{app: App, widget: Widget}>;
  floatingModels: Array<{app: App, widget: Widget}>;
  rendererFormat: WidgetRendererFormat;

  constructor(private widgetWindowsSvc: WidgetWindowsService) { 
    this.dockedModels = [];
    this.floatingModels = [];
    this.rendererFormat = {
      cardClass: 'gridster-card-view-mode',
      greenBtnClass: 'greenExpandBtn', yellowBtnClass: 'yellowMinimizeBtn', redBtnClass: 'redCloseBtn',
      greenBtnDisabled: false, yellowBtnDisabled: false, redBtndisabeld: false
    }
    this.widgetWindowsSvc.addWindowSub.subscribe(
      (modelPair) => this.addWindow(modelPair)
    );
  }

  ngOnInit() {
    
  }

  addWindow(modelPair: {app: App, widget: Widget}){
    this.floatingModels.push(modelPair);
  }

  removeWindow(docked: boolean, index: number){
    if(docked){
      this.dockedModels.splice(index, 1);
    }
    else{
      this.floatingModels.splice(index, 1);
    }
  }

  toggleDocked(docked: boolean, index: number){
    if(docked){
      this.floatingModels.push(this.dockedModels[index]);
      this.dockedModels.splice(index, 1);
    }
    else{
      this.dockedModels.push(this.floatingModels[index]);
      this.floatingModels.splice(index, 1);
    }
  }
}
