import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
  showApprove: boolean;
  activeUser: UserProfile;

  @Output() userApproved: EventEmitter<UserProfile>;

  constructor(private rolesSvc: RolesService, private ajaxSvc: AjaxProgressService) { 
    this.search = "";
    this.users = new Array<UserProfile>();
    this.showApprove = false;
    this.userApproved = new EventEmitter<UserProfile>();
  }

  ngOnInit() {
    this.listUsers();
  }

  searchUpdated(search: string): void {
    this.search = search;
  }

  approve(user: UserProfile): void {
    this.activeUser = user;
    this.showApprove = true;
  }

  approvalComplete(user: UserProfile): void {
    this.showApprove = false;
    const index: number = this.users.findIndex((u: UserProfile) => u.id === user.id);
    this.users.splice(index, 1);
    this.userApproved.emit(user);
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
