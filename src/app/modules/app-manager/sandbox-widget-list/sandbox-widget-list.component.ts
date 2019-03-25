import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {App} from '../../../models/app.model';
import {Widget} from '../../../models/widget.model';
import {WidgetWindowsService} from '../../../services/widget-windows.service';
import {UrlGenerator} from '../../../util/url-generator';
import {DefaultAppIcon} from '../../../util/constants';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-sandbox-widget-list',
  templateUrl: './sandbox-widget-list.component.html',
  styleUrls: ['./sandbox-widget-list.component.scss']
})
export class SandboxWidgetListComponent implements OnInit, OnDestroy {

  @Input() app: App;

  constructor(private wwSvc: WidgetWindowsService, private authSvc: AuthService) { 
    
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.app) {
      this.wwSvc.removeAppWindowsSub.next(this.app.docId);
    }
  }

  widgetClicked(widget: Widget): void {
    this.wwSvc.addWindowSub.next({app: this.app, widget: widget});
  }

  getWidgetIcon(widget: Widget, app: App): string {
    let url: string;
    if (widget.icon) {
      url = UrlGenerator.generateAppResourceUrl(this.authSvc.globalConfig.appsServiceConnection, app, widget.icon);
    }
    else if (app.appIcon) {
      url = UrlGenerator.generateAppResourceUrl(this.authSvc.globalConfig.appsServiceConnection, app, app.appIcon);
    }
    else {
      url = DefaultAppIcon;
    }
    return url;
  }

}
