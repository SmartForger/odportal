import { Component, OnInit } from '@angular/core';
import {FeedbackService} from '../../../services/feedback.service';
import {FeedbackPageGroupAvg} from '../../../models/feedback.model';

@Component({
  selector: 'app-list-page-averages',
  templateUrl: './list-page-averages.component.html',
  styleUrls: ['./list-page-averages.component.scss']
})
export class ListPageAveragesComponent implements OnInit {

  pageGroups: Array<FeedbackPageGroupAvg>;

  constructor(private feedbackSvc: FeedbackService) { 
    this.pageGroups = new Array<FeedbackPageGroupAvg>();
  }

  ngOnInit() {
    this.listPageAverages();
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

}
