import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserProfile} from '../../../models/user-profile.model';
import {UsersService} from '../../../services/users.service';
import {EditBasicInfoComponent} from '../edit-basic-info/edit-basic-info.component';
import {ConfirmModalComponent} from '../../display-elements/confirm-modal/confirm-modal.component';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';
import {Breadcrumb} from '../../display-elements/breadcrumb.model';
import {BreadcrumbsService} from '../../display-elements/breadcrumbs.service';
import {AuthService} from '../../../services/auth.service';
import {AppPermissionsBroker} from '../../../util/app-permissions-broker';
import {Subscription} from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit, OnDestroy {

  user: UserProfile;
  canUpdate: boolean;
  canDelete: boolean;
  private broker: AppPermissionsBroker;
  private sessionUpdatedSub: Subscription;

  @ViewChild(EditBasicInfoComponent) private basicInfo: EditBasicInfoComponent;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private usersSvc: UsersService,
    private notificationsSvc: NotificationService,
    private crumbsSvc: BreadcrumbsService,
    private authSvc: AuthService,
    private dialog: MatDialog) { 
      this.canUpdate = true;
      this.canDelete = true;
      this.broker = new AppPermissionsBroker("user-manager");
    }

  ngOnInit() {
    this.setPermissions();
    this.fetchUser();
    this.subscribeToSessionUpdate();
  }

  ngOnDestroy() {
    this.sessionUpdatedSub.unsubscribe();
  }

  private setPermissions(): void {
    this.canUpdate = this.broker.hasPermission("Update");
    this.canDelete = this.broker.hasPermission("Delete");
  }

  private subscribeToSessionUpdate(): void {
    this.sessionUpdatedSub = this.authSvc.observeUserSessionUpdates().subscribe(
      (userId: string) => {
        if (userId === this.authSvc.getUserId()) {
          this.setPermissions();
        }
      }
    );
  }

  deleteUser(){
    let modalRef: MatDialogRef<ConfirmModalComponent> = this.dialog.open(ConfirmModalComponent);

    modalRef.componentInstance.title = 'Delete User';
    modalRef.componentInstance.message = 'Are you sure you want to delete this user?';
    modalRef.componentInstance.icons = [{icon: 'delete_forever', classList: ''}];
    modalRef.componentInstance.buttons = [{title: 'Delete', classList: 'bg-red'}];

    modalRef.componentInstance.btnClick.subscribe(btnClick => {
      if(btnClick === 'Delete'){
        this.usersSvc.delete(this.user.id).subscribe(
          (response: any) => {
            this.notificationsSvc.notify({
              type: NotificationType.Success,
              message: this.user.username + " was deleted successfuly"
            });
            this.router.navigateByUrl('/portal/user-manager');
          },
          (err: any) => {
            this.notificationsSvc.notify({
              type: NotificationType.Error,
              message: "There was a problem while attempting to delete " + this.user.username
            });
          }
        );
      }
      modalRef.close();
    });
  }

  enableUser(){
    let modalRef: MatDialogRef<ConfirmModalComponent> = this.dialog.open(ConfirmModalComponent, {

    });

    modalRef.componentInstance.title = 'Enable User';
    modalRef.componentInstance.message = 'Are you sure you want to enable this user and permit logins?';
    modalRef.componentInstance.icons = [{icon: 'how_to_reg', classList: ''}];
    modalRef.componentInstance.buttons = [{title: 'Enable', classList: 'bg-green'}];

    modalRef.componentInstance.btnClick.subscribe(btnClick => {
      if(btnClick === 'Enable'){
        this.toggleEnabled(true);
      }
      modalRef.close();
    });
  }

  disableUser(){
    let modalRef: MatDialogRef<ConfirmModalComponent> = this.dialog.open(ConfirmModalComponent, {

    });

    modalRef.componentInstance.title = 'Disable User';
    modalRef.componentInstance.message = 'Are you sure you want to disable this user and revoke log-in privileges?';
    modalRef.componentInstance.icons = [{icon: 'person_add_disabled', classList: ''}];
    modalRef.componentInstance.buttons = [{title: 'Disable', classList: 'bg-red'}];

    modalRef.componentInstance.btnClick.subscribe(btnClick => {
      if(btnClick === 'Confirm'){
        this.toggleEnabled(false);
      }
      modalRef.close();
    });
  }

  private toggleEnabled(enable: boolean): void {
    this.user.enabled = enable;
    this.usersSvc.updateProfile(this.user).subscribe(
      (response: any) => {
        let message: string = this.user.username + " was ";
        if (enable) {
          message += "enabled successfully"
        }
        else {
          message += "disabled successfully"
        }
        this.notificationsSvc.notify({
          type: NotificationType.Success,
          message: message
        });
      },
      (err: any) => {
        let message: string = "There was a problem while ";
        if (enable) {
          message += "enabling " + this.user.username
        }
        else {
          message += "disabling " + this.user.attributes
        }
        this.notificationsSvc.notify({
          type: NotificationType.Error,
          message: message
        });
      }
    );
  }

  private fetchUser(): void {
    this.usersSvc.fetchById(this.route.snapshot.params['id']).subscribe(
      (user: UserProfile) => {
        this.user = user;
        this.basicInfo.setForm(user);
        this.generateCrumbs();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private generateCrumbs(): void {
    const crumbs: Array<Breadcrumb> = new Array<Breadcrumb>(
      {
        title: "Dashboard",
        active: false,
        link: "/portal"
      },
      {
        title: "User Manager",
        active: false,
        link: "/portal/user-manager"
      },  
      {
        title: this.user.username,
        active: true,
        link: null
      }
    );
    this.crumbsSvc.update(crumbs);
  }

}