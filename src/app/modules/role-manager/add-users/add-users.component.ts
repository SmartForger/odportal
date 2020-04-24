import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import {UserProfileKeycloak} from '../../../models/user-profile.model';
import {Role} from '../../../models/role.model';
import {UsersService} from '../../../services/users.service';
import {NotificationType} from '../../../notifier/notificiation.model';
import {NotificationService} from '../../../notifier/notification.service';
import { PageEvent, MatSelectChange, MatTable, MatDialogRef } from '@angular/material';
import { Cloner } from '../../../util/cloner';
import { PlatformModalType } from 'src/app/models/platform-modal.model';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss']
})
export class AddUsersComponent implements OnInit {

  morePages: boolean;
  page: number;
  pageSize: number;
  search: string;
  users: Array<UserProfileKeycloak>;

  @Input() activeRole: Role;
  @Input() currentUsers: Array<UserProfileKeycloak>;

  @Output() userAdded: EventEmitter<UserProfileKeycloak>;
  @Output() close: EventEmitter<null>;

  // @ViewChild(MatTable) table: MatTable<UserProfile>;

  constructor(
    private usersSvc: UsersService,
    private notifySvc: NotificationService,
    private dlgRef: MatDialogRef<AddUsersComponent>
  ) {
    this.close = new EventEmitter();
    this.currentUsers = new Array<UserProfileKeycloak>();
    this.morePages = true;
    this.page = 0;
    this.pageSize = 50;
    this.search = ""; 
    this.users = new Array<UserProfileKeycloak>();
    this.userAdded = new EventEmitter<UserProfileKeycloak>();

    this.dlgRef.addPanelClass("platform-modal");
    this.dlgRef.addPanelClass(PlatformModalType.PRIMARY);
  }

  ngOnInit() {
    this.refreshAvailableUsers();
  }

  searchUpdated(search: string): void {
    this.search = search;
  }

  refreshAvailableUsers(): void {
    this.usersSvc.listUsers({first: this.page * this.pageSize, max: this.pageSize}).subscribe(
      (users: Array<UserProfileKeycloak>) => {
        console.log('test');
        if(users.length === this.pageSize){this.morePages = true;}
        else{this.morePages = false;}
        this.users = users.filter((user: UserProfileKeycloak) => {
          const u: UserProfileKeycloak = this.currentUsers.find((item: UserProfileKeycloak) => item.id === user.id);
          if (u) {
            return false;
          }
          return true;
        });
        // this.table.renderRows();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  addUser(user: UserProfileKeycloak): void {
    this.usersSvc.addComposites(user.id, [this.activeRole]).subscribe(
      (response: any) => {
        const index: number = this.users.findIndex((u: UserProfileKeycloak) => user.id === u.id);
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

  onPageSize(event: MatSelectChange): void{
    this.page = 0;
    this.pageSize = Number.parseInt(event.value);
    this.refreshAvailableUsers();
  }

  onPagePrev(): void{
    if(this.page > 0){
      this.page = this.page - 1;
      this.refreshAvailableUsers();
    }
  }

  onPageNext(): void{
    if(this.morePages){
      this.page = this.page + 1;
      this.refreshAvailableUsers();
    }
  }

}
