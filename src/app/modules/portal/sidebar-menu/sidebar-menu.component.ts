import { Component, OnInit} from '@angular/core';
import {AppsService} from '../../../services/apps.service';
import {App} from '../../../models/app.model';
import { Observable } from 'rxjs';
import {AuthService} from '../../../services/auth.service';
import {UrlGenerator} from '../../../util/url-generator';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit {

  apps: Observable<Array<App>>;

  constructor(private appsSvc: AppsService, private authSvc: AuthService) { 
    
  }

  ngOnInit() {
    this.apps = this.appsSvc.appStoreSub.asObservable();
  }

  generateResourceURL(app: App): string {
    return UrlGenerator.generateAppResourceUrl(this.authSvc.globalConfig.appsServiceConnection, app, app.appIcon);
  }
}
