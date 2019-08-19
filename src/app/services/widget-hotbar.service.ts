import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { App } from '../models/app.model';
import { Widget } from '../models/widget.model';
import { HotbarWidget } from '../models/hotbar-widget.model';
import { UrlGenerator } from '../util/url-generator';
import { DefaultAppIcon } from '../util/constants';
import { LocalStorageService } from './local-storage.service';
import { AuthService } from './auth.service';
import { AppsService } from './apps.service';

const WIDGET_HOTBAR_KEY = 'od360__hotbar-widgets';

@Injectable({
  providedIn: 'root'
})
export class WidgetHotbarService {
  private widgets: BehaviorSubject<Object>;

  constructor(
    private localStorage: LocalStorageService,
    private authSvc: AuthService,
    private appSvc: AppsService
  ) {
    const storedWidgets = this.localStorage.getItem(WIDGET_HOTBAR_KEY) || '{}';
    try {
      this.widgets = new BehaviorSubject(JSON.parse(storedWidgets));
    } catch (err) {
      console.log(err);
    }
  }

  getWidgetArray() {
    return combineLatest(
      this.widgets,
      this.appSvc.observeLocalAppCache(),
      (widgets, apps: App[]) => {
        const widgetsArray: HotbarWidget[] = [];

        for (let i = 1; i < 5; i++) {
          if (widgets[i]) {
            const hotbarWidget: HotbarWidget = {
              iconType: widgets[i].iconType,
              icon: widgets[i].icon
            };
            hotbarWidget.app = apps.find(app => app.docId === widgets[i].appId);
            if (hotbarWidget.app) {
              hotbarWidget.widget = hotbarWidget.app.widgets.find(
                widget => widget.docId === widgets[i].widgetId
              );
            } else {
              widgetsArray.push(null);
              continue;
            }
            widgetsArray.push(hotbarWidget);
          } else {
            widgetsArray.push(null);
          }
        }

        return widgetsArray;
      }
    );
  }

  saveWidget(position: number, app: App, widget: Widget) {
    const widgetsObject = this.removeWidget(app, widget);
    if (position > 0) {
      widgetsObject[position] = {
        appId: app.docId,
        widgetId: widget.docId
      };

      if (app.native) {
        if (widget.iconType === 'icon') {
          widgetsObject[position].iconType = 'icon';
          widgetsObject[position].icon = widget.icon;
        } else {
          widgetsObject[position].iconType = 'image';
          widgetsObject[position].icon = 'assets/images/' + widget.icon;
        }
      } else {
        widgetsObject[position].iconType = 'image';
        widgetsObject[position].icon = this.getWidgetIcon(widget, app);
      }
    }

    this.localStorage.setItem(WIDGET_HOTBAR_KEY, JSON.stringify(widgetsObject));
    this.widgets.next(widgetsObject);
  }

  removeWidget(app: App, widget: Widget) {
    const widgetsObject = this.widgets.value;
    const pos = this.getWidgetPos(app, widget);
    if (pos > 0) {
      widgetsObject[pos] = null;
    }
    return widgetsObject;
  }

  getWidgetPos(app: App, widget: Widget): number {
    const widgetsObject = this.widgets.value;
    for (let pos in widgetsObject) {
      const hotbarWidget: HotbarWidget = this.widgets.value[pos];
      if (
        hotbarWidget &&
        hotbarWidget.appId === app.docId &&
        hotbarWidget.widgetId === widget.docId
      ) {
        return parseInt(pos);
      }
    }
    return 0;
  }

  private getWidgetIcon(widget: Widget, app: App): string {
    let url: string;
    if (widget.icon) {
      url = UrlGenerator.generateAppResourceUrl(
        this.authSvc.globalConfig.appsServiceConnection,
        app,
        widget.icon
      );
    } else if (app.appIcon) {
      url = UrlGenerator.generateAppResourceUrl(
        this.authSvc.globalConfig.appsServiceConnection,
        app,
        app.appIcon
      );
    } else {
      url = DefaultAppIcon;
    }
    return url;
  }
}
