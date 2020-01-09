import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatPaginator, MatTableDataSource } from '@angular/material';
import { UsersService } from '../../../services/users.service';
import { UserProfile } from '../../../models/user-profile.model';
import { AuthService } from '../../../services/auth.service';
import { ApiSearchCriteria } from '../../../models/api-search-criteria.model';
import { SSPList } from '../../../base-classes/ssp-list';
import { ViewAttributesComponent } from '../view-attributes/view-attributes.component';

@Component({
  selector: 'app-list-all-users',
  templateUrl: './list-all-users.component.html',
  styleUrls: ['./list-all-users.component.scss']
})
export class ListAllUsersComponent extends SSPList<UserProfile> implements OnInit {

  search: string;
  showAttributes: boolean;
  activeUser: UserProfile;
  displayItems: Array<UserProfile>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() addUser: EventEmitter<void>;

  constructor(private userService: UsersService, private authSvc: AuthService, private dialog: MatDialog) {
    super(
      new Array<string>(
        "username", "fullname", "email", "actions"
      ),
      new ApiSearchCriteria(
        {username: ""}, 0, "username", "asc"
      )
    );
    this.search = '';
    this.showAttributes = false;
    this.addUser = new EventEmitter<void>();
    this.displayItems = new Array<UserProfile>();
  }

  ngOnInit() {
    this.fetchItems();
  }

  viewAttributes(user: UserProfile): void {
    this.activeUser = user;
    
    let modalRef: MatDialogRef<ViewAttributesComponent> = this.dialog.open(ViewAttributesComponent, {

    });

    modalRef.componentInstance.user = user;

    modalRef.componentInstance.close.subscribe((close: any) => modalRef.close());
  }

  filterUsers(keyword: string): void {
    this.search = keyword;
    this.paginator.pageIndex = 0;
    this.fetchItems();
  }

  fetchItems(): void {
    this.userService.listUsers({search: this.search}).subscribe(
      (users: Array<UserProfile>) => {
        this.items = users;
        this.paginator.length = users.length;
        this.listItems();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  listItems(): void {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    this.displayItems = this.items.slice(startIndex, startIndex + this.paginator.pageSize);
  }

  onAddUserClick(): void {
    this.addUser.emit();
  }
}
