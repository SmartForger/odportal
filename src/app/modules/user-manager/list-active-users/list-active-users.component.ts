import { Component, OnInit } from '@angular/core';
import {RolesService} from '../../../services/roles.service';
import {Filters} from '../../../util/filters';
import {UserProfile} from '../../../models/user-profile.model';
import {StringWithDropdown} from '../../list-filters/string-with-dropdown.model';
import {ApiSearchCriteria} from '../../../models/api-search-criteria.model';
import {SSPList} from '../../../base-classes/ssp-list';
import {AuthService} from '../../../services/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ViewAttributesComponent } from '../view-attributes/view-attributes.component';

@Component({
  selector: 'app-list-active-users',
  templateUrl: './list-active-users.component.html',
  styleUrls: ['./list-active-users.component.scss']
})
export class ListActiveUsersComponent extends SSPList<UserProfile> implements OnInit {

  search: string;
  items: Array<UserProfile>;
  filteredItems: Array<UserProfile>;
  activeRoleName: string;
  injectable: RolesService;
  showAttributes: boolean;
  activeUser: UserProfile;

  constructor(private rolesSvc: RolesService, private authSvc: AuthService, private dialog: MatDialog) {
    super(
      new Array<string>(
        "username", "fullname", "email", "actions"
      ),
      new ApiSearchCriteria(
        {username: ""}, 0, "username", "asc"
      )
    );
    this.search = "";
    this.items = new Array<UserProfile>();
    this.filteredItems = new Array<UserProfile>();
    this.injectable = this.rolesSvc;
    this.showAttributes = false;
  }

  ngOnInit() {
    this.activeRoleName = this.authSvc.globalConfig.approvedRoleName;
    this.listItems();
  }

  searchUpdated(sd: StringWithDropdown): void {
    this.rolesSvc.listUsers(sd.dropdownValue).subscribe(
      (users: Array<UserProfile>) => {
        this.search = sd.queryValue;
        this.items = users;
        this.filteredItems = users;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  viewAttributes(user: UserProfile): void {
    this.activeUser = user;
    
    let modalRef: MatDialogRef<ViewAttributesComponent> = this.dialog.open(ViewAttributesComponent, {

    });

    modalRef.componentInstance.user = user;

    modalRef.componentInstance.close.subscribe(() => modalRef.close());
  }

  listItems(): void {
    this.rolesSvc.listUsers(this.activeRoleName).subscribe(
      (users: Array<UserProfile>) => {
        this.items = users;
        this.filteredItems = users;
        this.paginator.length = users.length;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  filterUsers(keyword: string): void {
    const filterKeys = ['username', 'firstName', 'lastName', 'email'];
    this.paginator.pageIndex = 0;
    this.filteredItems = Filters.filterByKeyword(filterKeys, keyword, this.items);
  }
}
