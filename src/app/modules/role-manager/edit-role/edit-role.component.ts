import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {Role} from '../../../models/role.model';
import {RolesService} from '../../../services/roles.service';
import {ActivatedRoute} from '@angular/router';
import {RoleFormComponent} from '../role-form/role-form.component';
import {ConfirmModalComponent} from '../../display-elements/confirm-modal/confirm-modal.component';
import {Router} from '@angular/router';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';
import {Breadcrumb} from '../../display-elements/breadcrumb.model';
import {BreadcrumbsService} from '../../display-elements/breadcrumbs.service';
import {AppPermissionsBroker} from '../../../util/app-permissions-broker';
import {AuthService} from '../../../services/auth.service';
import {Subscription} from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss']
})
export class EditRoleComponent implements OnInit, OnDestroy {

  role: Role;
  broker: AppPermissionsBroker;
  canDelete: boolean;
  canUpdate: boolean;
  private sessionUpdatesSub: Subscription;

  @ViewChild(RoleFormComponent) roleForm: RoleFormComponent;

  constructor(
    private rolesSvc: RolesService, 
    private route: ActivatedRoute,
    private router: Router,
    private notificationSvc: NotificationService,
    private crumbsSvc: BreadcrumbsService,
    private authSvc: AuthService,
    private dialog: MatDialog) { 
      this.broker = new AppPermissionsBroker("role-manager");
    }

  ngOnInit() {
    this.fetchRole();
    this.setPermissions();
    this.subscribeToSessionUpdates();
  }

  ngOnDestroy() {
    this.sessionUpdatesSub.unsubscribe();
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

  deleteRole(): void{
    let modalRef: MatDialogRef<ConfirmModalComponent> = this.dialog.open(ConfirmModalComponent, {
      
    });

    modalRef.componentInstance.title = 'Delete Role';
    modalRef.componentInstance.message = 'Are you sure you want to delete this role?';
    modalRef.componentInstance.icons =  [{icon: 'people_outline', classList: ''}];
    modalRef.componentInstance.buttons = [{title: 'Delete', classList: 'bg-red'}];

    modalRef.componentInstance.btnClick.subscribe(btnClick => {
      if(btnClick === 'Delete'){
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
      modalRef.close();
    });
  }

  private setPermissions(): void {
    this.canDelete = this.broker.hasPermission("Delete");
    this.canUpdate = this.broker.hasPermission("Update");
  }

  private subscribeToSessionUpdates(): void {
    this.sessionUpdatesSub = this.authSvc.observeUserSessionUpdates().subscribe(
      (userId: string) => {
        if (userId === this.authSvc.getUserId()) {
          this.setPermissions();
        }
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
