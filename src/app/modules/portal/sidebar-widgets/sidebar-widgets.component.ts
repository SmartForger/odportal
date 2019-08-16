import { Component, OnInit, OnDestroy } from '@angular/core';
import { WidgetModalService } from 'src/app/services/widget-modal.service';
import { WidgetWindowsService } from 'src/app/services/widget-windows.service';
import { AppsService } from 'src/app/services/apps.service';
import { AppWithWidget } from 'src/app/models/app-with-widget.model';
import { App } from 'src/app/models/app.model';
import { WidgetHotbarService } from 'src/app/services/widget-hotbar.service';
import { Subscription } from 'rxjs';
import { HotbarWidget } from 'src/app/models/hotbar-widget.model';

@Component({
  selector: 'app-sidebar-widgets',
  templateUrl: './sidebar-widgets.component.html',
  styleUrls: ['./sidebar-widgets.component.scss']
})
export class SidebarWidgetsComponent implements OnInit, OnDestroy {
  chat: AppWithWidget;
  widgetSub: Subscription;
  widgets: HotbarWidget[];

  constructor(
    private widgetModalSvc: WidgetModalService,
    private wwSvc: WidgetWindowsService,
    private appsSvc: AppsService,
    private widgetHotbarSvc: WidgetHotbarService
  ) {
    this.widgets = [null, null, null, null];
    this.widgetSub = this.widgetHotbarSvc
      .getWidgetArray()
      .subscribe(widgets => {
        this.widgets = widgets;
      });
  }

  ngOnInit() {
    this.appsSvc.fetch('mm-chat').subscribe((mmChat: App) => {
      this.chat = { app: mmChat, widget: mmChat.widgets[0] };
    });
  }

  ngOnDestroy() {
    this.widgetSub.unsubscribe();
  }

  launchChat() {
    this.wwSvc.addWindow(this.chat);
  }

  launchWidget(hWidget: HotbarWidget) {
    this.wwSvc.addWindow({ app: hWidget.app, widget: hWidget.widget });
  }

  showWidgetModal() {
    this.widgetModalSvc.show();
  }
}
