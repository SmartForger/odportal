import { Component, OnInit, ViewChild } from '@angular/core';
import {Role} from '../../../models/role.model';
import {RolesService} from '../../../services/roles.service';
import {ActivatedRoute} from '@angular/router';
import {RoleFormComponent} from '../role-form/role-form.component';
import {ModalComponent} from '../../display-elements/modal/modal.component';
import {Router} from '@angular/router';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';
import {Breadcrumb} from '../../display-elements/breadcrumb.model';
import {BreadcrumbsService} from '../../display-elements/breadcrumbs.service';

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
    private router: Router,
    private notificationSvc: NotificationService,
    private crumbsSvc: BreadcrumbsService) { }

  ngOnInit() {
    this.fetchRole();
  }

  fetchRole(): void {
    const roleName: string = this.route.snapshot.params['id'];
    this.rolesSvc.fetchByName(roleName).subscribe(
      (role: Role) => {
        this.role = role;
        this.roleForm.setForm(role);
        this.generateCrumbs();
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
        this.notificationSvc.notify({
          type: NotificationType.Success,
          message: this.role.name + " was updated successfully"
        });
        this.generateCrumbs();
      },
      (err: any) => {
        this.notificationSvc.notify({
          type: NotificationType.Error,
          message: "There was a problem while updating " + this.role.name
        });
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
        this.notificationSvc.notify({
          type: NotificationType.Success,
          message: this.role.name + " was deleted successfully"
        });
      },
      (err: any) => {
        this.notificationSvc.notify({
          type: NotificationType.Error,
          message: "There was a problem while deleting " + this.role.name
        });
      }
    );
  }

  private generateCrumbs(): void {
    const crumbs: Array<Breadcrumb> = new Array<Breadcrumb>(
      {
        title: "Dashboard",
        active: false,
        link: '/portal'
      },
      {
        title: "Role Manager",
        active: false,
        link: '/portal/role-manager'
      },
      {
        title: this.role.name,
        active: true,
        link: null
      }
    );
    this.crumbsSvc.update(crumbs);
  }

}
