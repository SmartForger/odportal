import { Component, OnInit, OnDestroy } from '@angular/core';
import { WidgetFeedback, WidgetGroupAvgRating } from '../../../models/feedback-widget.model';
import { Widget } from 'src/app/models/widget.model';
import { AppPermissionsBroker } from 'src/app/util/app-permissions-broker';
import { Subscription } from 'rxjs';
import { FeedbackWidgetService } from 'src/app/services/feedback-widget.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { NotificationService } from 'src/app/notifier/notification.service';
import { BreadcrumbsService } from '../../display-elements/breadcrumbs.service';
import { AppsService } from 'src/app/services/apps.service';
import { App } from 'src/app/models/app.model';
import { Breadcrumb } from '../../display-elements/breadcrumb.model';
import { UrlGenerator } from 'src/app/util/url-generator';
import { NotificationType } from 'src/app/notifier/notificiation.model';
import { WidgetWindowsService } from 'src/app/services/widget-windows.service';
import {ApiResponse} from 'src/app/models/api-response.model';
import { PlatformModalComponent } from '../../display-elements/platform-modal/platform-modal.component';
import { PlatformModalType } from 'src/app/models/platform-modal.model';

@Component({
  selector: 'app-list-widget-feedback',
  templateUrl: './list-widget-feedback.component.html',
  styleUrls: ['./list-widget-feedback.component.scss']
})
export class ListWidgetFeedbackComponent implements OnInit, OnDestroy {

  feedback: Array<WidgetFeedback>;
  widgetId: string;
  widgetGroupAvg: WidgetGroupAvgRating;
  canDelete: boolean;
  private broker: AppPermissionsBroker;
  private sessionUpdateSub: Subscription;

  constructor(
    private appsSvc: AppsService,
    private feedbackWidgetSvc: FeedbackWidgetService,
    private route: ActivatedRoute,
    private authSvc: AuthService,
    private dialog: MatDialog,
    private notifySvc: NotificationService,
    private router: Router,
    private crumbsSvc: BreadcrumbsService,
    private wwService: WidgetWindowsService) { 
      this.feedback = new Array<WidgetFeedback>();
      this.broker = new AppPermissionsBroker("feedback-manager");
      this.canDelete = false;
  }

  ngOnInit() {
    this.widgetId = this.route.snapshot.paramMap.get('widgetId');
    this.fetchGroupAverage();
    this.listFeedback();
    this.setPermissions();
    this.subscribeToSessionUpdate();
  }

  ngOnDestroy() {
    this.sessionUpdateSub.unsubscribe();
  }

  getScreenshotUrl(feedback: WidgetFeedback): string {
    return UrlGenerator.generateFeedbackScreenshotUrl(this.authSvc.globalConfig.feedbackServiceConnection, feedback.screenshot);
  }

  deleteItem(item: WidgetFeedback): void {
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
            label: "Widget title",
            defaultValue: item.widgetTitle
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
        this.feedbackWidgetSvc.delete(item.docId).subscribe(
          (response: ApiResponse) => {
            this.notifySvc.notify({
              message: "The Feedback submission was deleted successfully",
              type: NotificationType.Success
            });
            const index: number = this.feedback.findIndex((f: WidgetFeedback) => f.docId === item.docId);
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
        subtitle: "Are you sure you want to delete all feedback submissions for this widget?",
        submitButtonTitle: "Delete",
        submitButtonClass: "bg-red",
        formFields: [
          {
            type: "static",
            label: "Widget Title",
            defaultValue: this.widgetGroupAvg.widgetTitle
          },
          {
            type: "static",
            label: "Average Rating",
            defaultValue: this.widgetGroupAvg.rating
          },
          {
            type: "static",
            label: "Count",
            defaultValue: this.feedback.length
          }
        ]
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.feedbackWidgetSvc.deleteByWidgetId(this.widgetId).subscribe(
          (response: ApiResponse) => {
            this.notifySvc.notify({
              message: "All feedback submissions for this Widget were deleted successfully",
              type: NotificationType.Success
            });
            this.router.navigateByUrl('/portal/feedback-manager');
          },
          (err: any) => {
            this.notifySvc.notify({
              message: "There was a problem while deleting feedback for this Widget",
              type: NotificationType.Error
            });
          }
        );
      }
    });
  }

  launchWidget(): void {
    const apps: Array<App> = this.appsSvc.getLocalAppCache();
    let app: App = null;
    let widget: Widget = null;
    for (let appIndex: number = 0; appIndex < apps.length; ++appIndex) {
      for (let widgetIndex: number = 0; widgetIndex < apps[appIndex].widgets.length; ++widgetIndex) {
        if (apps[appIndex].widgets[widgetIndex].docId === this.widgetId) {
          app = apps[appIndex];
          widget = apps[appIndex].widgets[widgetIndex];
          break;
        }
      }
      if (app) {
        this.wwService.addWindow({app: app, widget: widget});
        break;
      }
    }
    if (!app) {
      this.notifySvc.notify({
        type: NotificationType.Warning,
        message: "You do not have permission to launch this widget"
      });
    }
  }

  private setPermissions(): void {
    this.canDelete = this.broker.hasPermission("Delete");
  }

  private fetchGroupAverage(): void {
    this.feedbackWidgetSvc.fetchGroupAverage(this.widgetId).subscribe(
      (avg: WidgetGroupAvgRating) => {
        this.widgetGroupAvg = avg;
        this.generateCrumbs();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private listFeedback(): void {
    this.feedbackWidgetSvc.listWidgetFeedback(this.widgetId).subscribe(
      (feedback: Array<WidgetFeedback>) => {
        this.feedback = feedback;
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
        title: this.widgetGroupAvg.widgetTitle,
        active: true,
        link: null
      }
    );
    this.crumbsSvc.update(crumbs);
  }

  

  parseDate(date: string): string{
    let year = date.substr(0, 4);
    let day = date.substr(8, 2);
    let monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let month = monthArr[parseInt(date.substr(5, 2))];
    return `${month} ${day}, ${year}`;
  }
}
