import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import {RolesService} from '../../../services/roles.service';
import {UserProfile} from '../../../models/user-profile.model';
import {UsersService} from '../../../services/users.service';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';
import {AuthService} from '../../../services/auth.service';
import {Filters} from '../../../util/filters';
import {ApiSearchCriteria} from '../../../models/api-search-criteria.model';
import {SSPList} from '../../../base-classes/ssp-list';
import {MatDialog, MatDialogRef} from '@angular/material';
import { RealmRolePickerComponent } from '../realm-role-picker/realm-role-picker.component';
import { ViewAttributesComponent } from '../view-attributes/view-attributes.component';
import { PlatformModalComponent } from '../../display-elements/platform-modal/platform-modal.component';
import { PlatformModalType } from 'src/app/models/platform-modal.model';

@Component({
  selector: 'app-list-pending-users',
  templateUrl: './list-pending-users.component.html',
  styleUrls: ['./list-pending-users.component.scss']
})
export class ListPendingUsersComponent extends SSPList<UserProfile> implements OnInit {

  search: string;
  items: Array<UserProfile>;
  filteredItems: Array<UserProfile>;
  activeUser: UserProfile;

  private _canUpdate: boolean;
  @Input('canUpdate')
  get canUpdate(): boolean {
    return this._canUpdate;
  }
  set canUpdate(canUpdate: boolean) {
    this._canUpdate = canUpdate;
  }

  @Output() userApproved: EventEmitter<UserProfile>;

  constructor(
    private rolesSvc: RolesService, 
    private usersSvc: UsersService,
    private notificationSvc: NotificationService,
    private authSvc: AuthService,
    private dialog: MatDialog) {
      super(
        new Array<string>(
          "username", "fullname", "email", "actions"
        ),
        new ApiSearchCriteria(
          {username: ""}, 0, "username", "asc"
        )
      );
      this.search = "";
      this.items = new Array<UserProfile>();
      this.filteredItems = new Array<UserProfile>();
      this.userApproved = new EventEmitter<UserProfile>();
      this.canUpdate = true;
  }

  ngOnInit() {
    this.listItems();
  }

  searchUpdated(search: string): void {
    this.search = search;
  }

  approve(user: UserProfile): void {
    this.activeUser = user;

    let modalRef: MatDialogRef<RealmRolePickerComponent> = this.dialog.open(RealmRolePickerComponent, {

    });

    modalRef.componentInstance.user = this.activeUser;
    modalRef.componentInstance.userUpdated.subscribe(user => {
      modalRef.close();
      this.approvalComplete(user)
    });
    
    console.log(user.attributes);
  }

  approvalComplete(user: UserProfile): void {
    this.removeUser(user);
    this.userApproved.emit(user);
  }

  viewAttributes(user: UserProfile): void {
    this.activeUser = user;

    let modalRef: MatDialogRef<ViewAttributesComponent> = this.dialog.open(ViewAttributesComponent, {

    });
    
    modalRef.afterOpened().subscribe(open => modalRef.componentInstance.user = this.activeUser);
    modalRef.componentInstance.close.subscribe(close => modalRef.close());
  }

  deny(user: UserProfile): void {
    this.activeUser = user;

    let dialogRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
      data: {
        type: PlatformModalType.SECONDARY,
        title: "Deny User Request",
        subtitle: "Are you sure you want to deny this request?",
        submitButtonTitle: "Deny",
        submitButtonClass: "bg-red",
        formFields: [
          {
            type: "static",
            label: "Username",
            defaultValue: this.activeUser.username
          },
          {
            type: "static",
            label: "Full Name",
            defaultValue: `${this.activeUser.firstName} ${this.activeUser.lastName}`
          }
        ]
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if(data){
        this.denyConfirmed();
      }
    });
  }

  denyConfirmed(): void {
    this.usersSvc.delete(this.activeUser.id).subscribe(
      (response: any) => {
        this.removeUser(this.activeUser);
        this.notificationSvc.notify({
          type: NotificationType.Success,
          message: this.activeUser.username + " was denied successfully"
        });
      },
      (err: any) => {
        this.notificationSvc.notify({
          type: NotificationType.Error,
          message: "There was a problem while denying " + this.activeUser.username
        });
      }
    );
  }

  private removeUser(user: UserProfile): void {
    let index: number = this.items.findIndex((u: UserProfile) => u.id === user.id);
    this.items.splice(index, 1);
    index = this.filteredItems.findIndex((u: UserProfile) => u.id === user.id);
    this.filteredItems.splice(index, 1);
  }

  listItems(): void {
    this.rolesSvc.listUsers(this.authSvc.globalConfig.pendingRoleName).subscribe(
      (users: Array<UserProfile>) => {
        this.items = users;
        this.filteredItems = users;
        this.paginator.length = users.length;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  filterUsers(keyword: string): void {
    const filterKeys = ['username', 'firstName', 'lastName', 'email'];
    this.paginator.pageIndex = 0;
    this.filteredItems = Filters.filterByKeyword(filterKeys, keyword, this.items);
  }

}
