import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import {RolesService} from '../../../services/roles.service';
import {UserProfile} from '../../../models/user-profile.model';
import {UsersService} from '../../../services/users.service';
import {ModalComponent} from '../../display-elements/modal/modal.component';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-list-pending-users',
  templateUrl: './list-pending-users.component.html',
  styleUrls: ['./list-pending-users.component.scss']
})
export class ListPendingUsersComponent implements OnInit {

  search: string;
  users: Array<UserProfile>;
  showApprove: boolean;
  showAttributes: boolean;
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

  @ViewChild(ModalComponent) private denyModal: ModalComponent;

  constructor(
    private rolesSvc: RolesService, 
    private usersSvc: UsersService,
    private notificationSvc: NotificationService,
    private authSvc: AuthService) { 
    this.search = "";
    this.users = new Array<UserProfile>();
    this.showApprove = false;
    this.showAttributes = false;
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
    console.log(user.attributes);
    this.showApprove = true;
  }

  approvalComplete(user: UserProfile): void {
    this.showApprove = false;
    this.removeUser(user);
    this.userApproved.emit(user);
  }

  viewAttributes(user: UserProfile): void {
    this.activeUser = user;
    this.showAttributes = true;
  }

  deny(user: UserProfile): void {
    this.activeUser = user;
    this.denyModal.show = true;
  }

  denyConfirmed(btnText: string): void {
    this.usersSvc.delete(this.activeUser.id).subscribe(
      (response: any) => {
        this.denyModal.show = false;
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
