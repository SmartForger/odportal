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
import { ApiResponse } from 'src/app/models/api-response.model';
import { PlatformModalComponent } from '../../display-elements/platform-modal/platform-modal.component';
import { PlatformModalType } from 'src/app/models/platform-modal.model';
import { DirectQueryList } from 'src/app/base-classes/direct-query-list';
import { ApiSearchCriteria } from 'src/app/models/api-search-criteria.model';
import { ListItemIcon } from 'src/app/models/list-item-icon.model';

@Component({
  selector: 'app-list-widget-feedback',
  templateUrl: './list-widget-feedback.component.html',
  styleUrls: ['./list-widget-feedback.component.scss'],
})
export class ListWidgetFeedbackComponent extends DirectQueryList<WidgetFeedback> implements OnInit, OnDestroy {
  widgetId: string;
  groupAvg: WidgetGroupAvgRating;
  canDelete: boolean;
  private broker: AppPermissionsBroker;
  private sessionUpdateSub: Subscription;
  searchCriteria: ApiSearchCriteria;
  moreMenuItems: ListItemIcon[] = [];

  constructor(
    private appsSvc: AppsService,
    private feedbackWidgetSvc: FeedbackWidgetService,
    private route: ActivatedRoute,
    private authSvc: AuthService,
    private dialog: MatDialog,
    private notifySvc: NotificationService,
    private router: Router,
    private crumbsSvc: BreadcrumbsService,
    private wwService: WidgetWindowsService
  ) {
    super(new Array<string>('rating', 'comment', 'user', 'date', 'actions'));

    this.widgetId = this.route.snapshot.paramMap.get('widgetId');
    this.broker = new AppPermissionsBroker('feedback-manager');
    this.canDelete = false;
    this.searchCriteria = new ApiSearchCriteria({}, 0, 'rating', 'desc');
    this.query = function(first: number, max: number) {
      return this.feedbackWidgetSvc.listWidgetFeedback(this.widgetId, this.searchCriteria);
    }.bind(this);
  }

  ngOnInit() {
    this.setPermissions();
    this.subscribeToSessionUpdate();
    this.fetchGroupAverage();
  }

  ngOnDestroy() {
    this.sessionUpdateSub.unsubscribe();
  }

  getScreenshotUrl(feedback: WidgetFeedback): string {
    return UrlGenerator.generateFeedbackScreenshotUrl(
      this.authSvc.globalConfig.feedbackServiceConnection,
      feedback.screenshot
    );
  }

  get pageTitle(): string {
    return this.groupAvg ? `${this.groupAvg.widgetTitle} Submissions` : '';
  }

  deleteItem(item: WidgetFeedback): void {
    let dialogRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
      data: {
        type: PlatformModalType.SECONDARY,
        title: 'Delete Feedback Submission',
        subtitle: 'Are you sure you want to delete this feedback submission?',
        submitButtonTitle: 'Delete',
        submitButtonClass: 'bg-red',
        formFields: [
          {
            type: 'static',
            label: 'Widget title',
            defaultValue: item.widgetTitle,
          },
          {
            type: 'static',
            label: 'Rating',
            defaultValue: item.rating,
          },
          {
            type: 'static',
            label: 'User',
            defaultValue: item.anonymous ? 'Anonymous' : item.user.firstName + ' ' + item.user.lastName,
          },
        ],
      },
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.feedbackWidgetSvc.delete(item.docId).subscribe(
          (response: ApiResponse) => {
            this.notifySvc.notify({
              message: 'The Feedback submission was deleted successfully',
              type: NotificationType.Success,
            });
            const index: number = this.items.findIndex((f: WidgetFeedback) => f.docId === item.docId);
            this.items.splice(index, 1);
            if (this.items.length) {
              this.fetchGroupAverage();
            } else {
              this.router.navigateByUrl('/portal/feedback-manager');
            }
          },
          (err: any) => {
            this.notifySvc.notify({
              message: 'There was a problem while deleting the Feedback submission',
              type: NotificationType.Error,
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
        title: 'Delete All Feedback for This Page',
        subtitle: 'Are you sure you want to delete all feedback submissions for this widget?',
        submitButtonTitle: 'Delete',
        submitButtonClass: 'bg-red',
        formFields: [
          {
            type: 'static',
            label: 'Widget Title',
            defaultValue: this.groupAvg.widgetTitle,
          },
          {
            type: 'static',
            label: 'Average Rating',
            defaultValue: this.groupAvg.rating,
          },
          {
            type: 'static',
            label: 'Count',
            defaultValue: this.filteredItems.length,
          },
        ],
      },
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.feedbackWidgetSvc.deleteByWidgetId(this.widgetId).subscribe(
          (response: ApiResponse) => {
            this.notifySvc.notify({
              message: 'All feedback submissions for this Widget were deleted successfully',
              type: NotificationType.Success,
            });
            this.router.navigateByUrl('/portal/feedback-manager');
          },
          (err: any) => {
            this.notifySvc.notify({
              message: 'There was a problem while deleting feedback for this Widget',
              type: NotificationType.Error,
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
        this.wwService.addWindow({ app: app, widget: widget });
        break;
      }
    }
    if (!app) {
      this.notifySvc.notify({
        type: NotificationType.Warning,
        message: 'You do not have permission to launch this widget',
      });
    }
  }

  private setPermissions(): void {
    this.canDelete = this.broker.hasPermission('Delete');
  }

  private fetchGroupAverage(): void {
    this.feedbackWidgetSvc.fetchGroupAverage(this.widgetId).subscribe(
      (avg: WidgetGroupAvgRating) => {
        this.groupAvg = avg;
        this.addMoreMenuItems();
        this.generateCrumbs();
        this.fetchAll();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private subscribeToSessionUpdate(): void {
    this.sessionUpdateSub = this.authSvc.observeUserSessionUpdates().subscribe((userId: string) => {
      if (userId === this.authSvc.getUserId()) {
        this.setPermissions();
      }
    });
  }

  private generateCrumbs(): void {
    const crumbs: Array<Breadcrumb> = new Array<Breadcrumb>(
      {
        title: 'Dashboard',
        active: false,
        link: '/portal',
      },
      {
        title: 'Feedback Manager',
        active: false,
        link: '/portal/feedback-manager',
      },
      {
        title: this.groupAvg.widgetTitle,
        active: true,
        link: null,
      }
    );
    this.crumbsSvc.update(crumbs);
  }

  parseDate(date: string): string {
    let year = date.substr(0, 4);
    let day = date.substr(8, 2);
    let monthArr = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    let month = monthArr[parseInt(date.substr(5, 2))];
    return `${month} ${day}, ${year}`;
  }

  protected filterItems(): void {
    if (this.sortColumn === '') {
      this.sortColumn = 'rating';
    }
    this.filteredItems.sort((a: WidgetFeedback, b: WidgetFeedback) => {
      const sortOrder = this.sort.direction === 'desc' ? -1 : 1;

      if (this.sortColumn === 'user') {
        const nameA = ((a.user.firstName || ' ') + (a.user.lastName || ' ')).toLowerCase();
        const nameB = ((b.user.firstName || ' ') + (b.user.lastName || ' ')).toLowerCase();
        return nameA < nameB ? -1 * sortOrder : sortOrder;
      } else {
        return a[this.sortColumn] < b[this.sortColumn] ? -1 * sortOrder : sortOrder;
      }
    });
  }

  private addMoreMenuItems(): void {
    this.moreMenuItems = [
      {
        icon: 'widgets',
        label: 'Launch Widget',
        value: 'widgets',
      },
    ];
    if (this.canDelete) {
      this.moreMenuItems.push({
        icon: 'delete_outline',
        label: 'Clear Feedback',
        value: 'delete',
      });
    }
  }

  handleMoreMenuClick(menu: string) {
    switch (menu) {
      case 'widgets':
        this.launchWidget();
        break;

      case 'delete':
        this.deleteAll();
        break;

      default:
        break;
    }
  }
}
