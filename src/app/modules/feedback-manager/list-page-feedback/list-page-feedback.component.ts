import { Component, OnInit } from '@angular/core';
import {Feedback, FeedbackPageGroupAvg} from '../../../models/feedback.model';
import {FeedbackService} from '../../../services/feedback.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UrlGenerator} from '../../../util/url-generator';
import {AuthService} from '../../../services/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import {ApiResponse} from '../../../models/api-response.model';
import {ConfirmModalComponent} from '../../display-elements/confirm-modal/confirm-modal.component';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';

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
    private authSvc: AuthService,
    private dialog: MatDialog,
    private notifySvc: NotificationService,
    private router: Router) { 
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

  deleteItem(item: Feedback): void {
    let modalRef: MatDialogRef<ConfirmModalComponent> = this.dialog.open(ConfirmModalComponent, {});
    modalRef.componentInstance.title = "Delete Feedback Submission";
    modalRef.componentInstance.message = "Are you sure you want to delete this feedback submission?";
    modalRef.componentInstance.icons =  [{icon: 'feedback', classList: ''}];
    modalRef.componentInstance.buttons = [{title: 'Delete', classList: 'bg-red'}];

    modalRef.componentInstance.btnClick.subscribe((btnTitle: string) => {
      if (btnTitle === "Delete") {
        this.feedbackSvc.delete(item.docId).subscribe(
          (response: ApiResponse) => {
            this.notifySvc.notify({
              message: "The Feedback submission was deleted successfully",
              type: NotificationType.Success
            });
            const index: number = this.feedback.findIndex((f: Feedback) => f.docId === item.docId);
            this.feedback.splice(index, 1);
            if (this.feedback.length) {
              this.fetchGroupAverage();
            }
            else {
              this.router.navigateByUrl('/portal/feedback-manager');
            }
          },
          (err: any) => {
            this.notifySvc.notify({
              message: "There was a problem while deleting the Feedback submission",
              type: NotificationType.Error
            });
          }
        );
      }
      modalRef.close();
    });
  }

  deleteAll(): void {
    let modalRef: MatDialogRef<ConfirmModalComponent> = this.dialog.open(ConfirmModalComponent, {});
    modalRef.componentInstance.title = "Delete All Feedback for This Page";
    modalRef.componentInstance.message = "Are you sure you want to delete all feedback submissions for this page?";
    modalRef.componentInstance.icons =  [{icon: 'feedback', classList: ''}];
    modalRef.componentInstance.buttons = [{title: 'Delete', classList: 'bg-red'}];

    modalRef.componentInstance.btnClick.subscribe((btnTitle: string) => {
      if (btnTitle === "Delete") {
        this.feedbackSvc.deleteByPageGroup(this.pageGroup).subscribe(
          (response: ApiResponse) => {
            this.notifySvc.notify({
              message: "All feedback submissions for this page were deleted successfully",
              type: NotificationType.Success
            });
            this.router.navigateByUrl('/portal/feedback-manager');
          },
          (err: any) => {
            this.notifySvc.notify({
              message: "There was a problem while deleting feedback for this page",
              type: NotificationType.Error
            });
          }
        );
      }
      modalRef.close();
    });
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
