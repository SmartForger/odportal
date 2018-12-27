import { Component, OnInit } from '@angular/core';
import {RolesService} from '../../../services/roles.service';
import {UserProfile} from '../../../models/user-profile.model';
import {AjaxProgressService} from '../../../ajax-progress/ajax-progress.service';

@Component({
  selector: 'app-list-pending-users',
  templateUrl: './list-pending-users.component.html',
  styleUrls: ['./list-pending-users.component.scss']
})
export class ListPendingUsersComponent implements OnInit {

  search: string;
  users: Array<UserProfile>;

  constructor(private rolesSvc: RolesService, private ajaxSvc: AjaxProgressService) { 
    this.search = "";
    this.users = new Array<UserProfile>();
  }

  ngOnInit() {
    this.listUsers();
  }

  searchUpdated(search: string): void {
    this.search = search;
  }

  private listUsers(): void {
    this.rolesSvc.listUsers("Pending").subscribe(
      (users: Array<UserProfile>) => {
        this.users = users;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

}
