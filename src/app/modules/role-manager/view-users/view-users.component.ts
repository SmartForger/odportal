import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {RolesService} from '../../../services/roles.service';
import {UserProfile} from '../../../models/user-profile.model';
import {ConfirmModalComponent} from '../../display-elements/confirm-modal/confirm-modal.component';
import {UsersService} from '../../../services/users.service';
import {Role} from '../../../models/role.model';
import {NotificationType} from '../../../notifier/notificiation.model';
import {NotificationService} from '../../../notifier/notification.service';
import {AddUsersComponent} from '../add-users/add-users.component';
import {AuthService} from '../../../services/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.scss']
})
export class ViewUsersComponent implements OnInit {

  users: Array<UserProfile>;
  search: string;
  activeUser: UserProfile;
  showAdd: boolean;

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
    private dialog: MatDialog) { 
    this.users = new Array<UserProfile>();
    this.search = "";
    this.showAdd = false;
    this.canUpdate = true;
  }

  ngOnInit() {
    this.listUsers();
  }

  searchUpdated(search: string): void {
    this.search = search;
  }

  removeUser(user: UserProfile): void {
    this.activeUser = user;

    let modalRef: MatDialogRef<ConfirmModalComponent> = this.dialog.open(ConfirmModalComponent, {
      
    });

    modalRef.componentInstance.title = 'Remove User from Role';
    modalRef.componentInstance.message = 'Are you sure you want to remove ' + this.activeUser.username + ' from this role?';
    modalRef.componentInstance.icons =  [{icon: 'delete', classList: ''}];
    modalRef.componentInstance.buttons = [{title: 'Remove User from Role', classList: 'btn btn-danger'}];

    modalRef.componentInstance.btnClick.subscribe(btnClick => {
      if(btnClick === 'Remove User from Role'){
        this.usersSvc.deleteComposites(this.activeUser.id, [this.activeRole]).subscribe(
          (response: any) => {
            const index: number = this.users.findIndex((user: UserProfile) => user.id === this.activeUser.id);
            this.users.splice(index, 1);
            this.notifySvc.notify({
              type: NotificationType.Success,
              message: this.activeRole.name + " was removed from " + this.activeUser.username + " successfully"
            });
            this.pushUserUpdate(this.activeUser);
          },
          (err: any) => {
            this.notifySvc.notify({
              type: NotificationType.Error,
              message: "There was a problem while removing " + this.activeRole.name + " from " + this.activeUser.username
            });
          }
        );
      }
      modalRef.close();
    });
  }

  showAddUserList(): void {
    let modalRef: MatDialogRef<AddUsersComponent> = this.dialog.open(AddUsersComponent, {
      data: {
        users: this.users,
        role: this.activeRole,
        callback: this.userAdded
      }
    });

    modalRef.componentInstance.activeRole = this.activeRole;
    modalRef.componentInstance.refreshAvailableUsers(this.users);

    modalRef.componentInstance.userAdded.subscribe(user => this.userAdded(user));
    modalRef.componentInstance.close.subscribe(close => modalRef.close());
  }

  userAdded(user: UserProfile): void {
    this.users.push(user);
    this.pushUserUpdate(user);
  }

  private pushUserUpdate(user: UserProfile): void {
    if (user.id === this.authSvc.getUserId()) {
      this.authSvc.updateUserSession(true);
    }
  }

  private listUsers(): void {
    this.rolesSvc.listUsers(this.activeRole.name).subscribe(
      (users: Array<UserProfile>) => {
        this.users = users;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

}
