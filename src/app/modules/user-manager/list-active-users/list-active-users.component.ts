import { Component, OnInit } from '@angular/core';
import {RolesService} from '../../../services/roles.service';
import {UserProfile} from '../../../models/user-profile.model';
import {StringWithDropdown} from '../../list-filters/string-with-dropdown.model';
import {AuthService} from '../../../services/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ViewAttributesComponent } from '../view-attributes/view-attributes.component';

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
  showAttributes: boolean;
  activeUser: UserProfile;

  constructor(private rolesSvc: RolesService, private authSvc: AuthService, private dialog: MatDialog) { 
    this.search = "";
    this.users = new Array<UserProfile>();
    this.injectable = this.rolesSvc;
    this.showAttributes = false;
  }

  ngOnInit() {
    this.activeRoleName = this.authSvc.globalConfig.approvedRoleName;
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

  viewAttributes(user: UserProfile): void {
    this.activeUser = user;
    
    let modalRef: MatDialogRef<ViewAttributesComponent> = this.dialog.open(ViewAttributesComponent, {

    });

    modalRef.componentInstance.user = user;

    modalRef.componentInstance.close.subscribe(close => modalRef.close());
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
