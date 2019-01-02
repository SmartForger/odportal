import { Component, OnInit } from '@angular/core';
import {RolesService} from '../../../services/roles.service';
import {UserProfile} from '../../../models/user-profile.model';
import {StringWithDropdown} from '../../list-filters/string-with-dropdown.model';

@Component({
  selector: 'app-list-active-users',
  templateUrl: './list-active-users.component.html',
  styleUrls: ['./list-active-users.component.scss']
})
export class ListActiveUsersComponent implements OnInit {

  search: string;
  users: Array<UserProfile>;
  activeRoleName: string;
  injectable: RolesService;

  constructor(private rolesSvc: RolesService) { 
    this.search = "";
    this.users = new Array<UserProfile>();
    this.activeRoleName = "Approved";
    this.injectable = this.rolesSvc;
  }

  ngOnInit() {
    this.listUsers();
  }

  searchUpdated(sd: StringWithDropdown): void {
    this.rolesSvc.listUsers(sd.dropdownValue).subscribe(
      (users: Array<UserProfile>) => {
        this.search = sd.queryValue;
        this.users = users;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  listUsers(): void {
    this.rolesSvc.listUsers(this.activeRoleName).subscribe(
      (users: Array<UserProfile>) => {
        this.users = users;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

}
