import { Component, OnInit, ViewChild } from '@angular/core';
import {ListActiveUsersComponent} from '../list-active-users/list-active-users.component';
import {UserProfile} from '../../../models/user-profile.model';
import {Breadcrumb} from '../../display-elements/breadcrumb.model';
import {BreadcrumbsService} from '../../display-elements/breadcrumbs.service';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {

  @ViewChild(ListActiveUsersComponent) private activeUserList: ListActiveUsersComponent;

  constructor(private crumbsSvc: BreadcrumbsService) { }

  ngOnInit() {
    this.generateCrumbs();
  }

  refreshActiveUsers(user: UserProfile): void {
    this.activeUserList.listUsers();
  }

  private generateCrumbs(): void {
    const crumbs: Array<Breadcrumb> = new Array<Breadcrumb>(
      {
        title: "Dashboard",
        active: false,
        link: '/portal'
      },
      {
        title: "User Manager",
        active: true,
        link: '/portal/user-manager'
      }
    );
    this.crumbsSvc.update(crumbs);
  }

}
