import { Component, OnInit } from '@angular/core';
import {Feedback, FeedbackPageGroupAvg} from '../../../models/feedback.model';
import {FeedbackService} from '../../../services/feedback.service';
import {ActivatedRoute} from '@angular/router';
import {UrlGenerator} from '../../../util/url-generator';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-list-page-feedback',
  templateUrl: './list-page-feedback.component.html',
  styleUrls: ['./list-page-feedback.component.scss']
})
export class ListPageFeedbackComponent implements OnInit {

  feedback: Array<Feedback>;
  pageGroup: string;
  pageGroupAvg: FeedbackPageGroupAvg;

  constructor(
    private feedbackSvc: FeedbackService,
    private route: ActivatedRoute,
    private authSvc: AuthService) { 
    this.feedback = new Array<Feedback>();
  }

  ngOnInit() {
    this.pageGroup = this.route.snapshot.paramMap.get("group");
    this.fetchGroupAverage();
    this.listFeedback();
  }

  getScreenshotUrl(feedback: Feedback): string {
    return UrlGenerator.generateFeedbackScreenshotUrl(this.authSvc.globalConfig.feedbackServiceConnection, feedback.screenshot);
  }

  private listFeedback(): void {
    this.feedbackSvc.listPageFeedback(this.pageGroup).subscribe(
      (feedback: Array<Feedback>) => {
        this.feedback = feedback;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private fetchGroupAverage(): void {
    this.feedbackSvc.fetchGroupAverage(this.pageGroup).subscribe(
      (avg: FeedbackPageGroupAvg) => {
        this.pageGroupAvg = avg;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

}
