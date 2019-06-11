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
    'online',
    'username',
    'fullname',
    'email',
    'organization',
    'created',
    'action'
  ];
  @Input() users: UserDetails[] = [];
  injectable: RolesService;
  activeRoleName: string;

  // ngOnInit() {
  //   this.activeRoleName = this.authSvc.globalConfig.approvedRoleName;
  // }

  searchUpdated(ev) {
    console.log(ev);
  }
}
