import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AppsService} from '../../../services/apps.service';
import {App} from '../../../models/app.model';
import {Breadcrumb} from '../../display-elements/breadcrumb.model';
import {BreadcrumbsService} from '../../display-elements/breadcrumbs.service';

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.scss']
})

export class SandboxComponent implements OnInit {

  app: App;
  showTools: boolean;

  constructor(
    private route: ActivatedRoute, 
    private appsSvc: AppsService,
    private crumbsSvc: BreadcrumbsService) { 
      this.showTools = true;
    }

  ngOnInit() {
    this.fetchApp();
  }

  private fetchApp(): void {
    this.appsSvc.fetch(this.route.snapshot.params['id']).subscribe(
      (app: App) => {
        this.app = app;
        this.generateCrumbs();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private generateCrumbs(): void {
    const crumbs: Array<Breadcrumb> = new Array<Breadcrumb>(
      {
        title: "Dashboard",
        active: false,
        link: '/portal'
      },
      {
        title: "MicroApp Manager",
        active: false,
        link: '/portal/app-manager'
      },
      {
        title: this.app.appTitle + " Details",
        active: false,
        link: `/portal/app-manager/edit/${this.app.docId}`
      },
      {
        title: `${this.app.appTitle} Testing`,
        active: true,
        link: null
      }
    );
    this.crumbsSvc.update(crumbs);
  }

}
