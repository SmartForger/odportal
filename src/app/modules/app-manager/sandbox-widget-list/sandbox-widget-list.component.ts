import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {App} from '../../../models/app.model';
import {Widget} from '../../../models/widget.model';
import {WidgetWindowsService} from '../../../services/widget-windows.service';

@Component({
  selector: 'app-sandbox-widget-list',
  templateUrl: './sandbox-widget-list.component.html',
  styleUrls: ['./sandbox-widget-list.component.scss']
})
export class SandboxWidgetListComponent implements OnInit, OnDestroy {

  @Input() app: App;

  constructor(private wwSvc: WidgetWindowsService) { 
    
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.wwSvc.removeAppWindowsSub.next(this.app.docId);
  }

  widgetClicked(widget: Widget): void {
    this.wwSvc.addWindowSub.next({app: this.app, widget: widget});
  }

}
