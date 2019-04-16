import { Component, OnInit } from '@angular/core';
import {FeedbackService} from '../../../services/feedback.service';
import {FeedbackPageGroupAvg} from '../../../models/feedback.model';
import {BreadcrumbsService} from '../../display-elements/breadcrumbs.service';
import {Breadcrumb} from '../../display-elements/breadcrumb.model';

@Component({
  selector: 'app-list-page-averages',
  templateUrl: './list-page-averages.component.html',
  styleUrls: ['./list-page-averages.component.scss']
})
export class ListPageAveragesComponent implements OnInit {

  pageGroups: Array<FeedbackPageGroupAvg>;

  constructor(
    private feedbackSvc: FeedbackService,
    private crumbsSvc: BreadcrumbsService) { 
      this.pageGroups = new Array<FeedbackPageGroupAvg>();
  }

  ngOnInit() {
    this.listPageAverages();
    this.generateCrumbs();
  }

  private listPageAverages(): void {
    this.feedbackSvc.listGroupAverages().subscribe(
      (groups: Array<FeedbackPageGroupAvg>) => {
        this.pageGroups = groups;
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
        title: "Feedback Manager",
        active: true,
        link: null
      }
    );
    this.crumbsSvc.update(crumbs);
  }

}
