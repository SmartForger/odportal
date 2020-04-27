import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import { DirectQueryList } from 'src/app/base-classes/direct-query-list';
import { NavigationStateService } from 'src/app/services/navigation-state.service';
import { RolesService } from '../../../services/roles.service';
import { UserProfileKeycloak } from '../../../models/user-profile.model';
import { UsersService } from '../../../services/users.service';
import { Role } from '../../../models/role.model';
import { NotificationType } from '../../../notifier/notificiation.model';
import { NotificationService } from '../../../notifier/notification.service';
import { AddUsersComponent } from '../add-users/add-users.component';
import { AuthService } from '../../../services/auth.service';
import { MatDialog, MatDialogRef, MatTable } from '@angular/material';
import { PlatformModalComponent } from '../../display-elements/platform-modal/platform-modal.component';
import { PlatformModalType } from 'src/app/models/platform-modal.model';
import { Filters } from 'src/app/util/filters';

const UM_NAV_STATE_PAGE = 'um/list-users/page';
const UM_NAV_STATE_PAGESIZE = 'um/list-users/pageSize';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.scss'],
})
export class ViewUsersComponent extends DirectQueryList<UserProfileKeycloak>
  implements OnInit {
  @ViewChild(MatTable) table: MatTable<UserProfileKeycloak>;

  search: string;
  activeUser: UserProfileKeycloak;
  users: Array<UserProfileKeycloak> = [];

  @Input() activeRole: Role;

  private _canUpdate: boolean;
  @Input('canUpdate')
  get canUpdate(): boolean {
    return this._canUpdate;
  }
  set canUpdate(canUpdate: boolean) {
    this._canUpdate = canUpdate;
  }

  constructor(
    private rolesSvc: RolesService,
    private usersSvc: UsersService,
    private notifySvc: NotificationService,
    private authSvc: AuthService,
    private dialog: MatDialog,
    protected navStateSvc: NavigationStateService
  ) {
    super(new Array<string>('username', 'fullname', 'email', 'actions'));
    this.query = (first: number, max: number) =>
      this.rolesSvc.listUsers(this.activeRole.name, first, max);
    this.search = '';
    this.canUpdate = true;
    this.page = this.navStateSvc.getState(UM_NAV_STATE_PAGE) || 0;
    this.pageSize = this.navStateSvc.getState(UM_NAV_STATE_PAGESIZE) || 10;
  }

  removeUser(user: UserProfileKeycloak): void {
    this.activeUser = user;

    const dialogRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(
      PlatformModalComponent,
      {
        data: {
          type: PlatformModalType.SECONDARY,
          title: 'Remove User from Role',
          subtitle: 'Are you sure you want to remove this user?',
          submitButtonTitle: 'Remove',
          submitButtonClass: 'bg-red',
          formFields: [
            {
              type: 'static',
              label: 'Username',
              defaultValue: this.activeUser.username,
            },
            {
              type: 'static',
              label: 'Full Name',
              defaultValue: `${this.activeUser.firstName} ${this.activeUser.lastName}`,
            },
          ],
        },
      }
    );

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.usersSvc
          .deleteComposites(this.activeUser.id, [this.activeRole])
          .subscribe(
            (response: any) => {
              this.items = this.items.filter(
                (item) => this.activeUser.id !== item.id
              );
              this.notifySvc.notify({
                type: NotificationType.Success,
                message:
                  this.activeRole.name +
                  ' was removed from ' +
                  this.activeUser.username +
                  ' successfully',
              });
              this.filterUsers(this.search);
              this.pushUserUpdate(this.activeUser);
            },
            (err: any) => {
              this.notifySvc.notify({
                type: NotificationType.Error,
                message:
                  'There was a problem while removing ' +
                  this.activeRole.name +
                  ' from ' +
                  this.activeUser.username,
              });
            }
          );
      }
    });
  }

  onAddUserClick(): void {
    const modalRef: MatDialogRef<AddUsersComponent> = this.dialog.open(
      AddUsersComponent,
      {
        data: {
          users: this.items,
          role: this.activeRole,
          callback: this.userAdded,
        },
      }
    );

    modalRef.componentInstance.activeRole = this.activeRole;
    modalRef.componentInstance.currentUsers = this.items;
    modalRef.componentInstance.userAdded.subscribe((user) =>
      this.userAdded(user)
    );
    modalRef.componentInstance.close.subscribe((close) => modalRef.close());
  }

  userAdded(user: UserProfileKeycloak): void {
    this.items.push(user);
    this.filterUsers(this.search);
    this.pushUserUpdate(user);
  }

  private pushUserUpdate(user: UserProfileKeycloak): void {
    if (user.id === this.authSvc.getUserId()) {
      this.authSvc.updateUserSession(true);
    }
  }

  protected filterItems(): void {
    if (this.sortColumn === '') {
      this.sortColumn = 'username';
    }
    this.filteredItems.sort(
      (a: UserProfileKeycloak, b: UserProfileKeycloak) => {
        const sortOrder = this.sort.direction === 'desc' ? -1 : 1;
        if (this.sortColumn === 'fullname') {
          const nameA = (
            (a.firstName || ' ') + (a.lastName || ' ')
          ).toLowerCase();
          const nameB = (
            (b.firstName || ' ') + (b.lastName || ' ')
          ).toLowerCase();
          return nameA < nameB ? -1 * sortOrder : sortOrder;
        } else {
          return a[this.sortColumn] < b[this.sortColumn]
            ? -1 * sortOrder
            : sortOrder;
        }
      }
    );
  }

  filterUsers(keyword: string): void {
    this.search = keyword;
    const filterKeys = ['username', 'fullname', 'email'];
    this.filteredItems = Filters.filterByKeyword(
      filterKeys,
      keyword,
      this.items
    );
    this.page = 0;
    this.filterItems();
    this.listDisplayItems();
  }

  savePage(ev: any) {
    this.navStateSvc.setState(UM_NAV_STATE_PAGE, ev.pageIndex);
    this.navStateSvc.setState(UM_NAV_STATE_PAGESIZE, ev.pageSize);
  }
}
