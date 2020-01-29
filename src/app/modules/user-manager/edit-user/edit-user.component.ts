import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserProfile} from '../../../models/user-profile.model';
import {UsersService} from '../../../services/users.service';
import {EditBasicInfoComponent} from '../edit-basic-info/edit-basic-info.component';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';
import {Breadcrumb} from '../../display-elements/breadcrumb.model';
import {BreadcrumbsService} from '../../display-elements/breadcrumbs.service';
import {AuthService} from '../../../services/auth.service';
import {AppPermissionsBroker} from '../../../util/app-permissions-broker';
import {Subscription} from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';
import { PlatformModalComponent } from '../../display-elements/platform-modal/platform-modal.component';
import { PlatformModalType } from 'src/app/models/platform-modal.model';
import { ListItemIcon } from 'src/app/models/list-item-icon.model';

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

  moreMenuOptions: ListItemIcon[] = [];

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

  get pageTitle() {
    return this.user ? `Edit ${this.user.username}` : '';
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
    let modalRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
      data: {
        type: PlatformModalType.SECONDARY,
        title: "Delete User",
        subtitle: "Are you sure you want to delete this user?",
        submitButtonTitle: "Delete",
        submitButtonClass: "bg-red",
        formFields: [
          {
            type: "static",
            label: "ID",
            defaultValue: this.user.id
          },
          {
            type: "static",
            label: "Username",
            defaultValue: this.user.username
          },
          {
            type: "static",
            label: "Full Name",
            defaultValue: `${this.user.firstName} ${this.user.lastName}`
          },
          {
            type: "static",
            label: "Email",
            defaultValue: this.user.email
          }
        ]
      }
    });

    modalRef.afterClosed().subscribe(data => {
      if(data){
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
    });
  }

  enableUser(){
    let modalRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
      data: {
        type: PlatformModalType.SECONDARY,
        title: "Enable User",
        subtitle: "Are you sure you want to enable this user and permit logins?",
        submitButtonTitle: "Enable",
        formFields: [
          {
            type: "static",
            label: "ID",
            defaultValue: this.user.id
          },
          {
            type: "static",
            label: "Username",
            defaultValue: this.user.username
          },
          {
            type: "static",
            label: "Full Name",
            defaultValue: `${this.user.firstName} ${this.user.lastName}`
          },
          {
            type: "static",
            label: "Email",
            defaultValue: this.user.email
          }
        ]
      }
    });

    modalRef.afterClosed().subscribe(data => {
      if(data){
        this.toggleEnabled(true);
      }
    });
  }

  disableUser(){
    let modalRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
      data: {
        type: PlatformModalType.SECONDARY,
        title: "Disable User",
        subtitle: "Are you sure you want to disable this user and revoke log-in privileges?",
        submitButtonTitle: "Disable",
        submitButtonClass: "bg-red",
        formFields: [
          {
            type: "static",
            label: "ID",
            defaultValue: this.user.id
          },
          {
            type: "static",
            label: "Username",
            defaultValue: this.user.username
          },
          {
            type: "static",
            label: "Full Name",
            defaultValue: `${this.user.firstName} ${this.user.lastName}`
          },
          {
            type: "static",
            label: "Email",
            defaultValue: this.user.email
          }
        ]
      }
    });

    modalRef.afterClosed().subscribe(data => {
      if(data){
        this.toggleEnabled(false);
      }
    });
  }

  handleMoreMenuClick(menu: string): void {
    switch(menu) {
      case "enable":
        this.enableUser();
        break;

      case "disable":
        this.disableUser();
        break;

      case "delete":
        this.deleteUser();
        break;

      default:
        break;
    }
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
        this.addMoreMenuOptions();
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

  private addMoreMenuOptions(): void {
    if (this.canUpdate && !this.user.enabled) {
      this.moreMenuOptions.push({
        icon: "person",
        label: "Enable User",
        value: "enable"
      });
    }
    if (this.canUpdate && this.user.enabled) {
      this.moreMenuOptions.push({
        icon: "person_outline",
        label: "Disable User",
        value: "disable"
      });
    }
    if (this.canDelete) {
      this.moreMenuOptions.push({
        icon: "delete",
        label: "Delete User",
        value: "delete"
      });
    }
  }

}