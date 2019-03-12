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

  models: Array<{app: App, widget: Widget}>;
  format: WidgetRendererFormat;

  constructor(private widgetWindowsSvc: WidgetWindowsService) { 
    this.models = [];
    this.format = {
      cardClass: 'gridster-card-view-mode',
      greenBtnClass: 'disabledBtn', yellowBtnClass: 'disabledBtn', redBtnClass: 'redCloseBtn',
      greenBtnDisabled: true, yellowBtnDisabled: true, redBtndisabeld: false
    }
    this.widgetWindowsSvc.addWindowSub.subscribe(
      (modelPair) => this.addWindow(modelPair)
    );
  }

  ngOnInit() {
    
  }

  addWindow(modelPair: {app: App, widget: Widget}){
    
    this.models.push(modelPair);
  }

  removeWindow(index: number){
    this.models.splice(index, 1);
  }
}
