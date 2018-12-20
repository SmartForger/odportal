import { Component, OnInit } from '@angular/core';
import {RolesService} from '../../../services/roles.service';
import {Role} from '../../../models/role.model';

@Component({
  selector: 'app-list-roles',
  templateUrl: './list-roles.component.html',
  styleUrls: ['./list-roles.component.scss']
})
export class ListRolesComponent implements OnInit {

  roles: Array<Role>;

  constructor(private rolesSvc: RolesService) { 
    this.roles = new Array<Role>();
  }

  ngOnInit() {
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
