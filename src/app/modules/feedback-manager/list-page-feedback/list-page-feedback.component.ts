import { Component, OnInit, OnDestroy } from '@angular/core';
import {Feedback, FeedbackPageGroupAvg} from '../../../models/feedback.model';
import {FeedbackService} from '../../../services/feedback.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UrlGenerator} from '../../../util/url-generator';
import {AuthService} from '../../../services/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import {ApiResponse} from '../../../models/api-response.model';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';
import {AppPermissionsBroker} from '../../../util/app-permissions-broker';
import {Subscription} from 'rxjs';
import {BreadcrumbsService} from '../../display-elements/breadcrumbs.service';
import {Breadcrumb} from '../../display-elements/breadcrumb.model';
import { PlatformModalComponent } from '../../display-elements/platform-modal/platform-modal.component';
import { PlatformModalType } from 'src/app/models/platform-modal.model';

@Component({
  selector: 'app-list-page-feedback',
  templateUrl: './list-page-feedback.component.html',
  styleUrls: ['./list-page-feedback.component.scss']
})
export class ListPageFeedbackComponent implements OnInit, OnDestroy {

  feedback: Array<Feedback>;
  pageGroup: string;
  pageGroupAvg: FeedbackPageGroupAvg;
  canDelete: boolean;
  private broker: AppPermissionsBroker;
  private sessionUpdateSub: Subscription;

  constructor(
    private feedbackSvc: FeedbackService,
    private route: ActivatedRoute,
    private authSvc: AuthService,
    private dialog: MatDialog,
    private notifySvc: NotificationService,
    private router: Router,
    private crumbsSvc: BreadcrumbsService) { 
      this.feedback = new Array<Feedback>();
      this.broker = new AppPermissionsBroker("feedback-manager");
      this.canDelete = false;
  }

  ngOnInit() {
    this.pageGroup = this.route.snapshot.paramMap.get("group");
    this.fetchGroupAverage();
    this.listFeedback();
    this.setPermissions();
    this.subscribeToSessionUpdate();
    this.generateCrumbs();
  }

  ngOnDestroy() {
    this.sessionUpdateSub.unsubscribe();
  }

  getScreenshotUrl(feedback: Feedback): string {
    return UrlGenerator.generateFeedbackScreenshotUrl(this.authSvc.globalConfig.feedbackServiceConnection, feedback.screenshot);
  }

  deleteItem(item: Feedback): void {

    let dialogRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
      data: {
        type: PlatformModalType.SECONDARY,
        title: "Delete Feedback Submission",
        subtitle: "Are you sure you want to delete this feedback submission?",
        submitButtonTitle: "Delete",
        submitButtonClass: "bg-red",
        formFields: [
          {
            type: "static",
            label: "URL",
            defaultValue: item.url
          },
          {
            type: "static",
            label: "Rating",
            defaultValue: item.rating
          },
          {
            type: "static",
            label: "User",
            defaultValue: item.user
          }
        ]
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
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
    });
  }

  deleteAll(): void {
    let dialogRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
      data: {
        type: PlatformModalType.SECONDARY,
        title: "Delete All Feedback for This Page",
        subtitle: "Are you sure you want to delete all feedback submissions for this page?",
        submitButtonTitle: "Delete",
        submitButtonClass: "bg-red",
        formFields: [
          {
            type: "static",
            label: "Page group",
            defaultValue: this.pageGroup
          }
        ]
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
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
    });
  }

  goToPage(): void{
    this.router.navigateByUrl(this.feedback[0].pageGroup);
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

  private subscribeToSessionUpdate(): void {
    this.sessionUpdateSub = this.authSvc.observeUserSessionUpdates().subscribe(
      (userId: string) => {
        if (userId === this.authSvc.getUserId()) {
          this.setPermissions();
        }
      }
    );
  }

  private setPermissions(): void {
    this.canDelete = this.broker.hasPermission("Delete");
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
        active: false,
        link: '/portal/feedback-manager'
      },
      {
        title: this.pageGroup,
        active: true,
        link: null
      }
    );
    this.crumbsSvc.update(crumbs);
  }

}
