import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserProfile} from '../../../models/user-profile.model';
import {UsersService} from '../../../services/users.service';
import {EditBasicInfoComponent} from '../edit-basic-info/edit-basic-info.component';
import {ModalComponent} from '../../display-elements/modal/modal.component';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';
import {Breadcrumb} from '../../display-elements/breadcrumb.model';
import {BreadcrumbsService} from '../../display-elements/breadcrumbs.service';
import {AuthService} from '../../../services/auth.service';
import {AppPermissionsBroker} from '../../../util/app-permissions-broker';
import {Subscription} from 'rxjs';

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
  @ViewChild('deleteModal') private deleteModal: ModalComponent;
  @ViewChild('enableModal') private enableModal: ModalComponent;
  @ViewChild('disableModal') private disableModal: ModalComponent;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private usersSvc: UsersService,
    private notificationsSvc: NotificationService,
    private crumbsSvc: BreadcrumbsService,
    private authSvc: AuthService) { 
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

  enableButtonClicked(enable: boolean): void {
    this.showEnableOrDisableModal(enable);
  }

  removeButtonClicked(): void {
    this.deleteModal.show = true;
  }

  deleteConfirmed(btnText: string): void {
    this.disableModal.show = false;
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

  enableConfirmed(btnText: string, enable: boolean): void {
    this.hideEnableOrDisableModal(enable);
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

  private showEnableOrDisableModal(enable: boolean): void {
    if (enable) {
      this.enableModal.show = true;
    }
    else {
      this.disableModal.show = true;
    }
  }

  private hideEnableOrDisableModal(enable: boolean): void {
    if (enable) {
      this.enableModal.show = false;
    }
    else {
      this.disableModal.show = false;
    }
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