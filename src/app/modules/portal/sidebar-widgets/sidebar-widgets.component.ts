import { Component, OnInit } from '@angular/core';
import { WidgetModalService } from 'src/app/services/widget-modal.service';
import { WidgetWindowsService } from 'src/app/services/widget-windows.service';
import { AppsService } from 'src/app/services/apps.service';
import { AppWithWidget } from 'src/app/models/app-with-widget.model';
import { App } from 'src/app/models/app.model';

@Component({
  selector: 'app-sidebar-widgets',
  templateUrl: './sidebar-widgets.component.html',
  styleUrls: ['./sidebar-widgets.component.scss']
})
export class SidebarWidgetsComponent implements OnInit {

  chat: AppWithWidget;

  constructor(private widgetModalSvc: WidgetModalService, private wwSvc: WidgetWindowsService, private appsSvc: AppsService) { }

  ngOnInit() {
    this.appsSvc.fetch('mm-chat').subscribe((mmChat: App) => {
      this.chat = {app: mmChat, widget: mmChat.widgets[0]};
    });
  }

  launchChat(){
    this.wwSvc.addWindow(this.chat);
  }

  showWidgetModal(){
    this.widgetModalSvc.show();
  }
}
