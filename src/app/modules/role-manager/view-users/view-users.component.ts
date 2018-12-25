import { Component, OnInit, Input } from '@angular/core';
import {RolesService} from '../../../services/roles.service';
import {UserProfile} from '../../../models/user-profile.model';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.scss']
})
export class ViewUsersComponent implements OnInit {

  users: Array<UserProfile>;

  @Input() activeRoleName: string;

  constructor(private rolesSvc: RolesService) { 
    this.users = new Array<UserProfile>();
  }

  ngOnInit() {
    this.listUsers();
  }

  private listUsers(): void {
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
