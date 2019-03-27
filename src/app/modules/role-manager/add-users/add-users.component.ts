import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {UserProfile} from '../../../models/user-profile.model';
import {Role} from '../../../models/role.model';
import {UsersService} from '../../../services/users.service';
import {NotificationType} from '../../../notifier/notificiation.model';
import {NotificationService} from '../../../notifier/notification.service';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss']
})
export class AddUsersComponent implements OnInit {

  search: string;
  users: Array<UserProfile>;

  @Input() activeRole: Role;

  @Output() userAdded: EventEmitter<UserProfile>;
  @Output() close: EventEmitter<null>;

  constructor(private usersSvc: UsersService, private notifySvc: NotificationService) {
    this.search = ""; 
    this.users = new Array<UserProfile>();
    this.userAdded = new EventEmitter<UserProfile>();
    this.close = new EventEmitter();
  }

  ngOnInit() {
  }

  searchUpdated(search: string): void {
    this.search = search;
  }

  refreshAvailableUsers(currentUsers: Array<UserProfile>): void {
    this.usersSvc.listUsers({}).subscribe(
      (users: Array<UserProfile>) => {
        this.users = users.filter((user: UserProfile) => {
          const u: UserProfile = currentUsers.find((item: UserProfile) => item.id === user.id);
          if (u) {
            return false;
          }
          return true;
        });
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  addUser(user: UserProfile): void {
    this.usersSvc.addComposites(user.id, [this.activeRole]).subscribe(
      (response: any) => {
        const index: number = this.users.findIndex((u: UserProfile) => user.id === u.id);
        this.users.splice(index, 1);
        this.notifySvc.notify({
          type: NotificationType.Success,
          message: this.activeRole.name + " was added to " + user.username + " successfully"
        });
        this.userAdded.emit(user);
      },
      (err: any) => {
        this.notifySvc.notify({
          type: NotificationType.Error,
          message: "There was a problem while adding " + this.activeRole.name + " to " + user.username
        });
      }
    );
  }

}
