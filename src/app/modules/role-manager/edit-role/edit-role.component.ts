import { Component, OnInit, ViewChild } from '@angular/core';
import {Role} from '../../../models/role.model';
import {RolesService} from '../../../services/roles.service';
import {ActivatedRoute} from '@angular/router';
import {RoleFormComponent} from '../role-form/role-form.component';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss']
})
export class EditRoleComponent implements OnInit {

  role: Role;

  @ViewChild(RoleFormComponent) roleForm: RoleFormComponent;

  constructor(private rolesSvc: RolesService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.fetchRole();
  }

  fetchRole(): void {
    const roleName: string = this.route.snapshot.params['id'];
    this.rolesSvc.fetchByName(roleName).subscribe(
      (role: Role) => {
        this.role = role;
        this.roleForm.setForm(role);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

}
