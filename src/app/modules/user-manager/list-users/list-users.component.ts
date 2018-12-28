import { Component, OnInit, ViewChild } from '@angular/core';
import {ListActiveUsersComponent} from '../list-active-users/list-active-users.component';
import {UserProfile} from '../../../models/user-profile.model';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {

  @ViewChild(ListActiveUsersComponent) private activeUserList: ListActiveUsersComponent;

  constructor() { }

  ngOnInit() {
  }

  refreshActiveUsers(user: UserProfile): void {
    this.activeUserList.listUsers();
  }

}
