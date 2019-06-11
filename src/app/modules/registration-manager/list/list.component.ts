import { Component, OnInit } from '@angular/core';
import { UserDetails, users } from '../mock-data';
import { UserProfile } from 'src/app/models/user-profile.model';
import { RolesService } from 'src/app/services/roles.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  users: Array<UserProfile>;

  constructor(private authSvc: AuthService, private rolesSvc: RolesService) { }

  ngOnInit() {
    this.rolesSvc.listUsers(this.authSvc.globalConfig.pendingRoleName).subscribe((users: Array<UserProfile>) => {
      this.users = users;
    });
  }
}
