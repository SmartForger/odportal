import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatPaginator, MatTableDataSource } from '@angular/material';
import { UsersService } from '../../../services/users.service';
import { VendorsService } from '../../../services/vendors.service';
import { RolesService } from '../../../services/roles.service';
import { UserProfile } from '../../../models/user-profile.model';
import { ApiSearchCriteria } from '../../../models/api-search-criteria.model';
import { Vendor } from '../../../models/vendor.model';
import { ApiSearchResult } from '../../../models/api-search-result.model';
import { AuthService } from '../../../services/auth.service';
import { ViewAttributesComponent } from '../view-attributes/view-attributes.component';
import { DirectQueryList } from 'src/app/base-classes/direct-query-list';
import { Filters } from '../../../util/filters';
import { KeyValue } from 'src/app/models/key-value.model';

@Component({
  selector: 'app-list-all-users',
  templateUrl: './list-all-users.component.html',
  styleUrls: ['./list-all-users.component.scss']
})
export class ListAllUsersComponent extends DirectQueryList<UserProfile> implements OnInit {

  activeUser: UserProfile;
  search: string;
  showAttributes: boolean;
  menuOptions: Array<KeyValue>;
  selectedRole: string;

  @Output() addUser: EventEmitter<void>;

  constructor(
    private authSvc: AuthService, 
    private userService: UsersService,
    private vendorsSvc: VendorsService,
    private roleService: RolesService, 
    private dialog: MatDialog
  ) {
    super(new Array<string>("username", "fullname", "email", "actions"));
    this.addUser = new EventEmitter<void>();
    this.query = function(first: number, max: number){return this.userService.listUsers({first: first, max: max});}.bind(this);
    this.search = '';
    this.showAttributes = false;
    this.menuOptions = new Array<KeyValue>();
    this.selectedRole = '';
  }

  ngOnInit() {
    this.roleService.generateKeyValues().subscribe(
      (kv: Array<KeyValue>) => {
        this.menuOptions = kv;
      }
    );
  }

  selectRole(role: string): void {
    this.selectedRole = role;
    this.query = function(first: number, max: number) {
      return this.roleService.listUsers(role, first, max);
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
    modalRef.componentInstance.close.subscribe((close: any) => modalRef.close());
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

  protected listDisplayItems(): void{
    super.listDisplayItems();

    const userIds = this.displayItems.filter(u => !u.vendorId).map(u => u.id);
    if (userIds.length === 0) {
      return;
    }

    const searchCriteria = new ApiSearchCriteria(
      {
        userIds: JSON.stringify(userIds)
      },
      this.paginator.pageIndex,
      'name',
      'asc'
    );
    searchCriteria.pageSize = this.displayItems.length;
    this.vendorsSvc.listVendorsByUserIds(searchCriteria)
      .subscribe(
        (result: ApiSearchResult<Vendor>) => {
          this.displayItems.forEach((user: UserProfile) => {
            const vendor = result.data.find((vendor: Vendor) =>
              vendor.users.findIndex(u => u.id === user.id) >= 0
            );
            if (vendor) {
              user.vendorId = vendor.docId;
              user.vendorName = vendor.name;
            } else {
              user.vendorId = 'N/A';
              user.vendorName = '';
            }
          });
        },
        (err: any) => {
          console.log(err)
        }
      );
  };
}
