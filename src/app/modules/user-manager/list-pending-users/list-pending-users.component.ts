import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import {RolesService} from '../../../services/roles.service';
import {UserProfile} from '../../../models/user-profile.model';
import {UsersService} from '../../../services/users.service';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';
import {AuthService} from '../../../services/auth.service';
import {ConfirmModalComponent} from '../../display-elements/confirm-modal/confirm-modal.component';
import {MatDialog, MatDialogRef} from '@angular/material';
import { RealmRolePickerComponent } from '../realm-role-picker/realm-role-picker.component';
import { ViewAttributesComponent } from '../view-attributes/view-attributes.component';

@Component({
  selector: 'app-list-pending-users',
  templateUrl: './list-pending-users.component.html',
  styleUrls: ['./list-pending-users.component.scss']
})
export class ListPendingUsersComponent implements OnInit {

  search: string;
  users: Array<UserProfile>;
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
    this.search = "";
    this.users = new Array<UserProfile>();
    this.userApproved = new EventEmitter<UserProfile>();
    this.canUpdate = true;
  }

  ngOnInit() {
    this.listUsers();
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
    
    modalRef.componentInstance.user = this.activeUser;
    modalRef.componentInstance.close.subscribe(close => modalRef.close());
  }

  deny(user: UserProfile): void {
    this.activeUser = user;

    let modalRef: MatDialogRef<ConfirmModalComponent> = this.dialog.open(ConfirmModalComponent, {

    });

    modalRef.componentInstance.title = 'Deny User Request';
    modalRef.componentInstance.message = 'Are you sure you want to deny this request?';
    modalRef.componentInstance.icons = [{icon: 'clear', classList: ''}];
    modalRef.componentInstance.buttons = [{title: 'Confirm', classList: 'btn btn-danger'}];

    modalRef.componentInstance.btnClick.subscribe(btnClick => {
      if(btnClick === 'Confirm'){
        this.denyConfirmed();
      }
      modalRef.close();
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
    const index: number = this.users.findIndex((u: UserProfile) => u.id === user.id);
    this.users.splice(index, 1);
  }

  private listUsers(): void {
    this.rolesSvc.listUsers(this.authSvc.globalConfig.pendingRoleName).subscribe(
      (users: Array<UserProfile>) => {
        this.users = users;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

}
