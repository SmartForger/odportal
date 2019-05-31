import { Component, OnInit, Input } from '@angular/core';
import { UserDetails } from '../../registration-manager/mock-data';
import { RolesService } from '../../../services/roles.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements OnInit {
  displayedColumns = [
    'username',
    'fullname',
    'email',
    'created',
    'role',
    'status',
    'action'
  ];
  @Input() users: UserDetails[] = [];
  injectable: RolesService;
  activeRoleName: string;

  constructor(private rolesSvc: RolesService, private authSvc: AuthService) {
    this.injectable = rolesSvc;
  }

  ngOnInit() {
    this.activeRoleName = this.authSvc.globalConfig.approvedRoleName;
  }

  searchUpdated(ev) {
    console.log(ev);
  }
}
