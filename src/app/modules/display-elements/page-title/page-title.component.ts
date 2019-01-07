import { Component, OnInit, Input } from '@angular/core';
import {Breadcrumb} from '../breadcrumb.model';
import {BreadcrumbsService} from '../breadcrumbs.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss']
})
export class PageTitleComponent implements OnInit {

  crumbs: Observable<Array<Breadcrumb>>;

  @Input() pageTitle: string;

  constructor(private crumbsSvc: BreadcrumbsService) { 
    this.pageTitle = "";
  }

  ngOnInit() {
    this.subscribeToCrumbUpdates();
  }

  private subscribeToCrumbUpdates(): void {
    this.crumbs = this.crumbsSvc.breadcrumbUpdatedSub.asObservable();
  }

}
