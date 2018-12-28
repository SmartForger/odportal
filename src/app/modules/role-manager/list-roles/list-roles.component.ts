import { Component, OnInit } from '@angular/core';
import { RolesService } from '../../../services/roles.service';
import { Role } from '../../../models/role.model';
import { Router } from '@angular/router';
import {Filters} from '../../../util/filters';
import { AjaxProgressService } from '../../../ajax-progress/ajax-progress.service';
import { stringify } from '@angular/core/src/util';

@Component({
  selector: 'app-list-roles',
  templateUrl: './list-roles.component.html',
  styleUrls: ['./list-roles.component.scss']
})
export class ListRolesComponent implements OnInit {

  roles: Array<Role>;
  showAdd: boolean;

  constructor(
    private rolesSvc: RolesService,
    private router: Router,
    private ajaxSvc: AjaxProgressService) {
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
    this.ajaxSvc.show();
    this.rolesSvc.create(role).subscribe(
      (response: any) => {
        this.showAdd = false;
        this.ajaxSvc.hide();
        this.router.navigateByUrl('/portal/role-manager/edit/' + role.name);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private fetchRoles(): void {
    this.ajaxSvc.show();
    this.rolesSvc.list().subscribe(
      (data: Array<Role>) => {
        this.roles = Filters.removeByKeyValue<string, Role>("id", ["pending", "approved"], data);
        this.ajaxSvc.hide();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

}
