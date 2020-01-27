import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import {RolesService} from '../../../services/roles.service';
import {Filters} from '../../../util/filters';
import {UserProfile} from '../../../models/user-profile.model';
import {StringWithDropdown} from '../../list-filters/string-with-dropdown.model';
import {ApiSearchCriteria} from '../../../models/api-search-criteria.model';
import {SSPList} from '../../../base-classes/ssp-list';
import {AuthService} from '../../../services/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ViewAttributesComponent } from '../view-attributes/view-attributes.component';
import { DirectQueryList } from 'src/app/base-classes/direct-query-list';
import { KeyValue } from 'src/app/models/key-value.model';

@Component({
  selector: 'app-list-active-users',
  templateUrl: './list-active-users.component.html',
  styleUrls: ['./list-active-users.component.scss']
})
export class ListActiveUsersComponent extends DirectQueryList<UserProfile> implements OnInit {

  activeUser: UserProfile;
  search: string;
  showAttributes: boolean;
  menuOptions: Array<KeyValue>;
  selectedRole: string;

  @Output() addUser: EventEmitter<void>;

  constructor(private rolesSvc: RolesService, private authSvc: AuthService, private dialog: MatDialog) {
    super(new Array<string>("username", "fullname", "email", "actions"));
    this.addUser = new EventEmitter<void>();
    this.displayItems = new Array<UserProfile>();
    this.filteredItems = new Array<UserProfile>();
    this.items = new Array<UserProfile>();
    this.menuOptions = new Array<KeyValue>();
    this.query = function(first: number, max: number){return this.rolesSvc.listUsers(this.authSvc.globalConfig.approvedRoleName, first, max);}.bind(this);
    this.search = "";
    this.showAttributes = false;
    this.selectedRole = 'Approved';
  }

  ngOnInit() {
    this.rolesSvc.generateKeyValues().subscribe(
      (kv: Array<KeyValue>) => {
        this.menuOptions = kv;
      }
    );
  }

  selectRole(role: string): void {
    this.selectedRole = role;
    this.query = function(first: number, max: number) {
      return this.rolesSvc.listUsers(role, first, max);
    }.bind(this);
    this.refresh();
  }

  filterUsers(keyword: string): void {
    const filterKeys = ['username', 'fullname', 'email'];
    this.filteredItems = Filters.filterByKeyword(filterKeys, keyword, this.items);
    this.page = 0;
    this.listDisplayItems();
  }

  onAddUserClick(): void {
    this.addUser.emit();
  }
  
  viewAttributes(user: UserProfile): void {
    this.activeUser = user;
    let modalRef: MatDialogRef<ViewAttributesComponent> = this.dialog.open(ViewAttributesComponent);
    modalRef.componentInstance.user = user;
    modalRef.componentInstance.close.subscribe(() => modalRef.close());
  }

  protected filterItems(): void{
    if(this.sortColumn === ''){this.sortColumn = 'username';}
    this.filteredItems.sort((a: UserProfile, b: UserProfile) => {
        const sortOrder = this.sort.direction === 'desc' ? -1 : 1;
        if (this.sortColumn === 'fullname') {
          const nameA = ((a.firstName || ' ') + (a.lastName || ' ')).toLowerCase();
          const nameB = ((b.firstName || ' ') + (b.lastName || ' ')).toLowerCase();
          return nameA < nameB ? -1 * sortOrder : sortOrder;
        } else {
          return a[this.sortColumn] < b[this.sortColumn] ? -1 * sortOrder : sortOrder;
        }
    });
  }
}
