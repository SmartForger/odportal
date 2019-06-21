import { Component, OnInit, ViewChild } from '@angular/core';
import { WidgetFeedback, AverageRating } from '../../../models/feedback-widget.model';
import { Widget } from 'src/app/models/widget.model';
import { AppPermissionsBroker } from 'src/app/util/app-permissions-broker';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { FeedbackWidgetService } from 'src/app/services/feedback-widget.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatDialogRef, MatSort, Sort, MatTable, MatTab } from '@angular/material';
import { NotificationService } from 'src/app/notifier/notification.service';
import { BreadcrumbsService } from '../../display-elements/breadcrumbs.service';
import { AppsService } from 'src/app/services/apps.service';
import { App } from 'src/app/models/app.model';
import { Breadcrumb } from '../../display-elements/breadcrumb.model';
import { UrlGenerator } from 'src/app/util/url-generator';
import { ConfirmModalComponent } from '../../display-elements/confirm-modal/confirm-modal.component';
import { NotificationType } from 'src/app/notifier/notificiation.model';
import { WidgetWindowsService } from 'src/app/services/widget-windows.service';

@Component({
  selector: 'app-list-widget-feedback',
  templateUrl: './list-widget-feedback.component.html',
  styleUrls: ['./list-widget-feedback.component.scss']
})
export class ListWidgetFeedbackComponent implements OnInit {

  feedback: Array<WidgetFeedback>;
  app: App;
  widget: Widget;
  widgetAvg: AverageRating;
  canDelete: boolean;
  private broker: AppPermissionsBroker;
  private sessionUpdateSub: Subscription;
  private sortSub: Subscription;
  columnsToDisplay = ['rating', 'comment', 'user', 'date', 'options'];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<WidgetFeedback>;

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
    this.subscribeToSort();
    this.fetchModels(this.route.snapshot.paramMap.get("appId"), this.route.snapshot.paramMap.get("widgetId"))
    .subscribe(() => {
      this.fetchGroupAverage();
      this.listFeedback();
      this.setPermissions();
      this.subscribeToSessionUpdate();
      this.generateCrumbs();
    });
  }

  ngOnDestroy() {
    this.sessionUpdateSub.unsubscribe();
    this.sortSub.unsubscribe();
  }

  getScreenshotUrl(feedback: WidgetFeedback): string {
    return UrlGenerator.generateFeedbackScreenshotUrl(this.authSvc.globalConfig.feedbackServiceConnection, feedback.screenshot);
  }

  deleteItem(item: WidgetFeedback): void {
    let modalRef: MatDialogRef<ConfirmModalComponent> = this.dialog.open(ConfirmModalComponent, {});
    modalRef.componentInstance.title = "Delete Feedback Submission";
    modalRef.componentInstance.message = "Are you sure you want to delete this feedback submission?";
    modalRef.componentInstance.icons =  [{icon: 'feedback', classList: ''}];
    modalRef.componentInstance.buttons = [{title: 'Delete', classList: 'bg-red'}];

    modalRef.componentInstance.btnClick.subscribe((btnTitle: string) => {
      if (btnTitle === "Delete") {
        this.feedbackWidgetSvc.delete(item.docId).subscribe((success: boolean) => {
          let notification = (success ? 
            {
              message: "The Feedback submission was deleted successfully",
              type: NotificationType.Success
            } :
            {
              message: "There was a problem while deleting the Feedback submission",
              type: NotificationType.Error
            });
          this.notifySvc.notify(notification);

          const index: number = this.feedback.findIndex((f: WidgetFeedback) => f.docId === item.docId);
          this.feedback.splice(index, 1);
          if (this.feedback.length) {
            this.fetchGroupAverage();
          }
          else {
            this.router.navigateByUrl('/portal/feedback-manager');
          }
        });
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
        this.feedbackWidgetSvc.deleteWidgetFeedback(this.widget.docId).subscribe((success: boolean) => {
          let notification = (success ? 
          {
            message: "All feedback submissions for this page were deleted successfully",
            type: NotificationType.Success
          } :
          {
            message: "There was a problem while deleting feedback for this page",
            type: NotificationType.Error
          });
          this.notifySvc.notify(notification);
          this.router.navigateByUrl('/portal/feedback-manager');
        });
      }
      modalRef.close();
    });
  }

  launchWidget(): void{
    this.wwService.addWindow({app: this.app, widget: this.widget});
  }

  private fetchModels(appId: string, widgetId: string): Observable<void>{
    return new Observable((observer) => {
      this.appsSvc.fetch(appId).subscribe(
        (app: App) => {
          this.app = app;
          this.widget = app.widgets.find((w: Widget) => w.docId === widgetId);
          observer.next(null);
          observer.complete();
        },
        (err: any) => {
          observer.error(err);
          observer.complete();
        }
      );
    });
  }

  private setPermissions(): void {
    this.canDelete = this.broker.hasPermission("Delete");
  }

  private fetchGroupAverage(): void {
    this.feedbackWidgetSvc.fetchWidgetAverage(this.widget.docId).subscribe(
      (avg: AverageRating) => {
        this.widgetAvg = avg;
      },
      (err: any) => {
        console.error(err);
      }
    );
  }

  private listFeedback(): void {
    this.feedbackWidgetSvc.fetchWidgetFeedback(this.widget.docId).subscribe(
      (feedback: Array<WidgetFeedback>) => {
        this.feedback = feedback;
      },
      (err: any) => {
        console.error(err);
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
        title: this.widget.widgetTitle,
        active: true,
        link: null
      }
    );
    this.crumbsSvc.update(crumbs);
  }

  private subscribeToSort(): void{
    this.sortSub = this.sort.sortChange.subscribe((s: Sort) => {
      let direction: number = (s.direction === 'desc' ? -1 : 1);
      if(s.active === 'rating'){
        this.feedback.sort((a: WidgetFeedback, b: WidgetFeedback) => {
          return (a.rating < b.rating ? -1 : (a.rating > b.rating ? 1 : 0)) * direction;
        });
      }
      else if(s.active === 'user'){
        this.feedback.sort((a: WidgetFeedback, b: WidgetFeedback) => {
          return (a.user.firstName.toLowerCase() < b.user.firstName.toLowerCase() ? -1 : (a.user.firstName.toLowerCase() > b.user.firstName.toLowerCase() ? 1 : 0)) * direction;
        });
      }
      else if(s.active === 'date'){
        this.feedback.sort((a: WidgetFeedback, b: WidgetFeedback) => {
          let yearA = parseInt(a.dateCreated.substr(0, 4));
          let yearB = parseInt(b.dateCreated.substr(0, 4));
          if(yearA < yearB){
            return -1 * direction;
          }
          else if (yearA > yearB){
            return 1 * direction;
          }
          else{
            let monthA = parseInt(a.dateCreated.substr(5, 2));
            let monthB = parseInt(b.dateCreated.substr(5, 2));

            if(monthA < monthB){
              return -1 * direction;
            }
            else if(monthA > monthB){
              return 1 * direction;
            }
            else{
              let dayA = parseInt(a.dateCreated.substr(8, 2));
              let dayB = parseInt(b.dateCreated.substr(8, 2));
              return (dayA < dayB ? -1 : (dayA > dayB ? 1 : 0)) * direction;
            }
          }
        });
      }
      else if(s.active === 'options'){
        this.feedback.sort((a: WidgetFeedback, b: WidgetFeedback) => {
          return (a.screenshot && !b.screenshot ? -1 : (!a.screenshot && b.screenshot ? 1 : 0)) * direction;
        });
      }
      this.table.renderRows();
    });
  }

  private parseDate(date: string): string{
    let year = date.substr(0, 4);
    let day = date.substr(8, 2);
    let monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let month = monthArr[parseInt(date.substr(5, 2))];
    return `${month} ${day}, ${year}`;
  }
}
