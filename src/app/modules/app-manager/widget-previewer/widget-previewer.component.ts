import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {Widget} from '../../../models/widget.model';
import {App} from '../../../models/app.model';

@Component({
  selector: 'app-widget-previewer',
  templateUrl: './widget-previewer.component.html',
  styleUrls: ['./widget-previewer.component.scss']
})
export class WidgetPreviewerComponent implements OnInit {

  activeWidget: Widget;

  @Input() app: App;

  constructor() { 
  }

  ngOnInit() {
  }

  loadWidget(widget: Widget): void {
    this.activeWidget = widget;
  }

}
