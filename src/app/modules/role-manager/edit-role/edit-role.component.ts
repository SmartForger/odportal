import { Component, OnInit, ViewChild } from '@angular/core';
import {Role} from '../../../models/role.model';
import {RolesService} from '../../../services/roles.service';
import {ActivatedRoute} from '@angular/router';
import {RoleFormComponent} from '../role-form/role-form.component';
import {ModalComponent} from '../../display-elements/modal/modal.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss']
})
export class EditRoleComponent implements OnInit {

  role: Role;

  @ViewChild(RoleFormComponent) roleForm: RoleFormComponent;
  @ViewChild(ModalComponent) confirmModal: ModalComponent;

  constructor(
    private rolesSvc: RolesService, 
    private route: ActivatedRoute,
    private router: Router) { }

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

  updateRole(role: Role): void {
    role.id = this.role.id;
    this.rolesSvc.update(role).subscribe(
      (response: any) => {
        this.role.name = role.name;
        this.role.description = role.description;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  removeButtonClicked(): void {
    this.confirmModal.show = true;
  }

  deleteConfirmed(title: string): void {
    this.confirmModal.show = false;
    this.rolesSvc.delete(this.role.id).subscribe(
      (response: any) => {
        this.router.navigateByUrl('/portal/role-manager');
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

}
