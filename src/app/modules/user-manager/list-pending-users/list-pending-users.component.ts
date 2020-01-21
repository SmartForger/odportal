import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import {RolesService} from '../../../services/roles.service';
import {UserProfile} from '../../../models/user-profile.model';
import {UsersService} from '../../../services/users.service';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';
import {AuthService} from '../../../services/auth.service';
import {Filters} from '../../../util/filters';
import {MatDialog, MatDialogRef, PageEvent} from '@angular/material';
import { RealmRolePickerComponent } from '../realm-role-picker/realm-role-picker.component';
import { ViewAttributesComponent } from '../view-attributes/view-attributes.component';
import { PlatformModalComponent } from '../../display-elements/platform-modal/platform-modal.component';
import { PlatformModalType } from 'src/app/models/platform-modal.model';
import { DirectQueryList } from 'src/app/base-classes/direct-query-list';
import { KeyValue } from 'src/app/models/key-value.model';

@Component({
  selector: 'app-list-pending-users',
  templateUrl: './list-pending-users.component.html',
  styleUrls: ['./list-pending-users.component.scss']
})
export class ListPendingUsersComponent extends DirectQueryList<UserProfile> implements OnInit {

    search: string;
    activeUser: UserProfile;
    menuOptions: Array<KeyValue>;
  
    private _canUpdate: boolean;
    @Input('canUpdate')
    get canUpdate(): boolean {
      return this._canUpdate;
    }
    set canUpdate(canUpdate: boolean) {
      this._canUpdate = canUpdate;
    }
  
    @Output() userApproved: EventEmitter<UserProfile>;
    @Output() addUser: EventEmitter<void>;
  
    constructor(
      private authSvc: AuthService,
      private dialog: MatDialog,
      private notificationSvc: NotificationService,
      private rolesSvc: RolesService, 
      private usersSvc: UsersService
    ) {
      super(new Array<string>("username", "fullname", "email", "actions"));
      this.addUser = new EventEmitter<void>();
      this.canUpdate = true;
      this.menuOptions = new Array<KeyValue>();
      this.query = function(first: number, max: number){return this.rolesSvc.listUsers(this.authSvc.globalConfig.pendingRoleName, first, max);}.bind(this);
      this.search = "";
      this.userApproved = new EventEmitter<UserProfile>();
    }

    ngOnInit() {
      this.rolesSvc.generateKeyValues().subscribe(
        (kv: Array<KeyValue>) => {
          this.menuOptions = kv;
          this.menuOptions.push({
            display: 'Pending',
            value: 'Pending'
          });
        }
      );
    }

    selectRole(role: string): void {
      this.query = function(first: number, max: number) {
        return this.rolesSvc.listUsers(role, first, max);
      }.bind(this);
      this.refresh();
    }
  
    approve(user: UserProfile): void {
      this.activeUser = user;
      let modalRef: MatDialogRef<RealmRolePickerComponent> = this.dialog.open(RealmRolePickerComponent);
      modalRef.componentInstance.user = this.activeUser;
      modalRef.componentInstance.userUpdated.subscribe(user => {
        modalRef.close();
        this.approvalComplete(user)
      });
    }
  
    approvalComplete(user: UserProfile): void {
      this.removeUser(user);
      this.userApproved.emit(user);
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
  
    filterUsers(keyword: string): void {
      if(this.allItemsFetched){
        const filterKeys = ['username', 'fullname', 'email'];
        this.filteredItems = Filters.filterByKeyword(filterKeys, keyword, this.items);
        this.page = 0;
        this.listDisplayItems();
      }
    }
  
    onAddUserClick(): void {
      this.addUser.emit();
    }
  
    searchUpdated(search: string): void {
      this.search = search;
    }
    
    viewAttributes(user: UserProfile): void {
      this.activeUser = user;
      let modalRef: MatDialogRef<ViewAttributesComponent> = this.dialog.open(ViewAttributesComponent);
      modalRef.afterOpened().subscribe(open => modalRef.componentInstance.user = this.activeUser);
      modalRef.componentInstance.close.subscribe(close => modalRef.close());
    }

    protected filterItems(): void{
      if(this.allItemsFetched){
        if(this.sortColumn === ''){this.sortColumn = 'username';}
        this.filteredItems.sort((a: UserProfile, b: UserProfile) => {
          const sortOrder = this.sort.direction === 'desc' ? -1 : 1;
          if (this.sortColumn === 'fullname') {
            const nameA = ((a.firstName || ' ') + (a.lastName || ' ')).toLowerCase();
            const nameB = ((b.firstName || ' ') + (b.lastName || ' ')).toLowerCase();
            return nameA < nameB ? -1 * sortOrder : sortOrder;
          } else {
            return a[this.sortColumn] < b[this.sortColumn] ? -1 * sortOrder : sortOrder;
          }
        });
      }
    }
  
    private removeUser(user: UserProfile): void {
      let index: number = this.items.findIndex((u: UserProfile) => u.id === user.id);
      this.items.splice(index, 1);
      index = this.filteredItems.findIndex((u: UserProfile) => u.id === user.id);
      this.filteredItems.splice(index, 1);
    }
}
