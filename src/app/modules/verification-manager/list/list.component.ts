import { Component, OnInit, ViewChild } from '@angular/core';
import { UserDetails, users } from '../../registration-manager/mock-data';
import { UsersService } from 'src/app/services/users.service';
import { RolesService } from 'src/app/services/roles.service';
import { UserProfile } from 'src/app/models/user-profile.model';
import { AuthService } from 'src/app/services/auth.service';
import { VerificationService } from 'src/app/services/verification.service';
import { UserProfileWithRegistration } from 'src/app/models/user-profile-with-registration.model';
import { MatTable } from '@angular/material';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  userList: Array<UserProfileWithRegistration>;
  columnsToDisplay: Array<string>;

  @ViewChild(MatTable) table: MatTable<UserProfileWithRegistration>;

  constructor(private authSvc: AuthService, private verSvc: VerificationService) {  
    this.columnsToDisplay = [
      'online',
      'username',
      'fullname',
      'email',
      'role',
      'created',
      'action'
    ];
  }

  ngOnInit() {
    const email = this.authSvc.userState.userProfile.email;
    this.verSvc.getUsersToApprove(email).subscribe((users: Array<UserProfileWithRegistration>) => {
      this.userList = users;
      this.table.renderRows();
    });
  }
}
