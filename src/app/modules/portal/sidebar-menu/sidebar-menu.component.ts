import { Component, OnInit} from '@angular/core';
import {AppsService} from '../../../services/apps.service';
import {App} from '../../../models/app.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit {

  apps: Observable<Array<App>>;

  constructor(private appsSvc: AppsService) { 
    
  }

  ngOnInit() {
    this.apps = this.appsSvc.appStoreSub.asObservable();
  }
}
