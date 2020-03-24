import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreadcrumbsService } from '../../display-elements/breadcrumbs.service';
import { Breadcrumb } from '../../display-elements/breadcrumb.model';
import { Router, RouterEvent } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  private routerSub: Subscription;

  constructor(private crumbsSvc: BreadcrumbsService, private router: Router) { 
    this.generateCrumbs();
  }

  ngOnInit() {
    this.generateCrumbs();
    this.routerSub = this.router.events.subscribe((event: RouterEvent) => {
      if(event.url === '/portal/verification'){
        this.generateCrumbs();
      }
    });
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }

  private generateCrumbs(): void {
    const crumbs: Array<Breadcrumb> = new Array<Breadcrumb>(
      {
        title: "Dashboard",
        active: false,
        link: "/portal"
      },
      {
        title: "Verification Manager",
        active: true,
        link: "/portal/verification"
      }
    );
    this.crumbsSvc.update(crumbs);
  }
}
