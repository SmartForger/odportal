import { Component, OnInit } from '@angular/core';
import {RolesService} from '../../../services/roles.service';
import {Role} from '../../../models/role.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-list-roles',
  templateUrl: './list-roles.component.html',
  styleUrls: ['./list-roles.component.scss']
})
export class ListRolesComponent implements OnInit {

  roles: Array<Role>;
  showAdd: boolean;

  constructor(private rolesSvc: RolesService, private router: Router) { 
    this.roles = new Array<Role>();
    this.showAdd = false;
  }

  ngOnInit() {
    this.fetchRoles();
  }

  addButtonClicked(): void {
    this.showAdd = true;
  }

  createRole(role: Role): void {
    this.rolesSvc.create(role).subscribe(
      (response: any) => {
        this.showAdd = false;
        this.router.navigateByUrl('/portal/role-manager/edit/' + role.name);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private fetchRoles(): void {
    this.rolesSvc.list().subscribe(
      (data: Array<Role>) => {
        this.roles = data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

}
