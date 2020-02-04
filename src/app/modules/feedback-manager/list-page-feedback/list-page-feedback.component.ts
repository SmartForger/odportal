import { Component, OnInit, OnDestroy } from '@angular/core';
import { Feedback, FeedbackPageGroupAvg } from '../../../models/feedback.model';
import { FeedbackService } from '../../../services/feedback.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlGenerator } from '../../../util/url-generator';
import { AuthService } from '../../../services/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ApiResponse } from '../../../models/api-response.model';
import { NotificationService } from '../../../notifier/notification.service';
import { NotificationType } from '../../../notifier/notificiation.model';
import { AppPermissionsBroker } from '../../../util/app-permissions-broker';
import { Subscription } from 'rxjs';
import { BreadcrumbsService } from '../../display-elements/breadcrumbs.service';
import { Breadcrumb } from '../../display-elements/breadcrumb.model';
import { PlatformModalComponent } from '../../display-elements/platform-modal/platform-modal.component';
import { PlatformModalType } from 'src/app/models/platform-modal.model';
import { DirectQueryList } from 'src/app/base-classes/direct-query-list';
import { ApiSearchCriteria } from 'src/app/models/api-search-criteria.model';
import { ListItemIcon } from 'src/app/models/list-item-icon.model';

@Component({
  selector: 'app-list-page-feedback',
  templateUrl: './list-page-feedback.component.html',
  styleUrls: ['./list-page-feedback.component.scss'],
})
export class ListPageFeedbackComponent extends DirectQueryList<Feedback> implements OnInit, OnDestroy {
  pageGroup: string;
  groupAvg: FeedbackPageGroupAvg;
  canDelete: boolean;
  private broker: AppPermissionsBroker;
  private sessionUpdateSub: Subscription;
  searchCriteria: ApiSearchCriteria;
  moreMenuItems: ListItemIcon[] = [];

  constructor(
    private feedbackSvc: FeedbackService,
    private route: ActivatedRoute,
    private authSvc: AuthService,
    private dialog: MatDialog,
    private notifySvc: NotificationService,
    private router: Router,
    private crumbsSvc: BreadcrumbsService
  ) {
    super(new Array<string>('rating', 'comment', 'user', 'date', 'actions'));

    this.pageGroup = this.route.snapshot.paramMap.get('group');
    this.broker = new AppPermissionsBroker('feedback-manager');
    this.canDelete = false;
    this.searchCriteria = new ApiSearchCriteria({}, 0, 'rating', 'desc');
    this.query = function(first: number, max: number) {
      return this.feedbackSvc.listPageFeedback(this.pageGroup, this.searchCriteria);
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

  get pageTitle(): string {
    return this.groupAvg ? `${this.groupAvg.pageGroup} Submissions` : '';
  }

  getScreenshotUrl(feedback: Feedback): string {
    return UrlGenerator.generateFeedbackScreenshotUrl(
      this.authSvc.globalConfig.feedbackServiceConnection,
      feedback.screenshot
    );
  }

  deleteItem(item: Feedback): void {
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
            label: 'URL',
            defaultValue: item.url,
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
        this.feedbackSvc.delete(item.docId).subscribe(
          (response: ApiResponse) => {
            this.notifySvc.notify({
              message: 'The Feedback submission was deleted successfully',
              type: NotificationType.Success,
            });
            const index: number = this.items.findIndex((f: Feedback) => f.docId === item.docId);
            this.items.splice(index, 1);
            if (this.items.length) {
              this.fetchAll();
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
        subtitle: 'Are you sure you want to delete all feedback submissions for this page?',
        submitButtonTitle: 'Delete',
        submitButtonClass: 'bg-red',
        formFields: [
          {
            type: 'static',
            label: 'Page group',
            defaultValue: this.pageGroup,
          },
        ],
      },
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.feedbackSvc.deleteByPageGroup(this.pageGroup).subscribe(
          (response: ApiResponse) => {
            this.notifySvc.notify({
              message: 'All feedback submissions for this page were deleted successfully',
              type: NotificationType.Success,
            });
            this.router.navigateByUrl('/portal/feedback-manager');
          },
          (err: any) => {
            this.notifySvc.notify({
              message: 'There was a problem while deleting feedback for this page',
              type: NotificationType.Error,
            });
          }
        );
      }
    });
  }

  goToPage(): void {
    if (this.groupAvg) {
      this.router.navigateByUrl(this.groupAvg.pageGroup);
    }
  }

  private fetchGroupAverage(): void {
    this.feedbackSvc.fetchGroupAverage(this.pageGroup).subscribe(
      (avg: FeedbackPageGroupAvg) => {
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

  private setPermissions(): void {
    this.canDelete = this.broker.hasPermission('Delete');
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
        title: this.pageGroup,
        active: true,
        link: null,
      }
    );
    this.crumbsSvc.update(crumbs);
  }

  protected filterItems(): void {
    if (this.sortColumn === '') {
      this.sortColumn = 'rating';
    }
    this.filteredItems.sort((a: Feedback, b: Feedback) => {
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
        icon: 'apps',
        label: 'Visit Page',
        value: 'visit',
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
      case 'visit':
        this.goToPage();
        break;

      case 'delete':
        this.deleteAll();
        break;

      default:
        break;
    }
  }
}
