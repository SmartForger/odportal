import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {RolesService} from '../../../services/roles.service';
import {UserProfile} from '../../../models/user-profile.model';
import {ModalComponent} from '../../display-elements/modal/modal.component';
import {UsersService} from '../../../services/users.service';
import {Role} from '../../../models/role.model';
import {NotificationType} from '../../../notifier/notificiation.model';
import {NotificationService} from '../../../notifier/notification.service';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.scss']
})
export class ViewUsersComponent implements OnInit {

  users: Array<UserProfile>;
  search: string;
  activeUser: UserProfile;

  //@Input() activeRoleName: string;
  @Input() activeRole: Role;

  @ViewChild('removeModal') private removeModal: ModalComponent;

  constructor(
    private rolesSvc: RolesService, 
    private usersSvc: UsersService,
    private notifySvc: NotificationService) { 
    this.users = new Array<UserProfile>();
    this.search = "";
  }

  ngOnInit() {
    this.listUsers();
  }

  searchUpdated(search: string): void {
    this.search = search;
  }

  removeUser(user: UserProfile): void {
    this.activeUser = user;
    this.removeModal.show = true;
  }

  removeConfirmed(btnTitle: string): void {
    this.removeModal.show = false;
    this.usersSvc.deleteComposites(this.activeUser.id, [this.activeRole]).subscribe(
      (response: any) => {
        const index: number = this.users.findIndex((user: UserProfile) => user.id === this.activeUser.id);
        this.users.splice(index, 1);
        this.notifySvc.notify({
          type: NotificationType.Success,
          message: this.activeRole.name + " was removed from " + this.activeUser.username + " successfully"
        });
        this.usersSvc.userUpdated(this.activeUser);
      },
      (err: any) => {
        this.notifySvc.notify({
          type: NotificationType.Error,
          message: "There was a problem while removing " + this.activeRole.name + " from " + this.activeUser.username
        });
      }
    );
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
