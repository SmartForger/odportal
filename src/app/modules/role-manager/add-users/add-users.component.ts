import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import {UserProfile} from '../../../models/user-profile.model';
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
  users: Array<UserProfile>;

  @Input() activeRole: Role;
  @Input() currentUsers: Array<UserProfile>;

  @Output() userAdded: EventEmitter<UserProfile>;
  @Output() close: EventEmitter<null>;

  // @ViewChild(MatTable) table: MatTable<UserProfile>;

  constructor(
    private usersSvc: UsersService,
    private notifySvc: NotificationService,
    private dlgRef: MatDialogRef<AddUsersComponent>
  ) {
    this.close = new EventEmitter();
    this.currentUsers = new Array<UserProfile>();
    this.morePages = true;
    this.page = 0;
    this.pageSize = 50;
    this.search = ""; 
    this.users = new Array<UserProfile>();
    this.userAdded = new EventEmitter<UserProfile>();

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
      (users: Array<UserProfile>) => {
        console.log('test');
        if(users.length === this.pageSize){this.morePages = true;}
        else{this.morePages = false;}
        this.users = users.filter((user: UserProfile) => {
          const u: UserProfile = this.currentUsers.find((item: UserProfile) => item.id === user.id);
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
