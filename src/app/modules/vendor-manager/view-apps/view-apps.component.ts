import { Component, OnInit, Input } from '@angular/core';
import {AppsService} from '../../../services/apps.service';
import {App} from '../../../models/app.model';

@Component({
  selector: 'app-view-apps',
  templateUrl: './view-apps.component.html',
  styleUrls: ['./view-apps.component.scss']
})
export class ViewAppsComponent implements OnInit {

  apps: Array<App>;

  @Input() vendorId: string;

  constructor(private appsSvc: AppsService) { 
    this.apps = new Array<App>();
  }

  ngOnInit() {
    this.listApps();
  }

  private listApps(): void {
    /*this.appsSvc.listVendorApps(this.vendorId).subscribe(
      (apps: Array<App>) => {
        this.apps = apps;
      },
      (err: any) => {
        console.log(err);
      }
    );*/
  }

}
