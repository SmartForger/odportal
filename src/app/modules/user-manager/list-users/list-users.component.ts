import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {ListActiveUsersComponent} from '../list-active-users/list-active-users.component';
import {UserProfileKeycloak} from '../../../models/user-profile.model';
import {Breadcrumb} from '../../display-elements/breadcrumb.model';
import {BreadcrumbsService} from '../../display-elements/breadcrumbs.service';
import {CreateUserFormComponent} from '../create-user-form/create-user-form.component';
import {UsersService} from '../../../services/users.service';
import {NotificationType} from '../../../notifier/notificiation.model';
import {NotificationService} from '../../../notifier/notification.service';
import {Router} from '@angular/router';
import {UserCreation} from '../../../models/user-creation.model';
import {CredentialsRepresentation} from '../../../models/credentials-representation.model';
import {RolesService} from '../../../services/roles.service';
import {Role} from '../../../models/role.model';
import {AuthService} from '../../../services/auth.service';
import {Subscription} from 'rxjs';
import {AppPermissionsBroker} from '../../../util/app-permissions-broker';
import {AppLaunchRequestService} from '../../../services/app-launch-request.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { NavigationStateService } from 'src/app/services/navigation-state.service';
import { UM_NAV_STATE_TAB, UM_NAV_STATE_PAGESIZE, UM_NAV_STATE_PAGE } from '../nav-state-keys';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit, OnDestroy {

  roles: Array<Role>;
  canCreate: boolean;
  canUpdate: boolean;
  selectedTabIndex: number;
  private broker: AppPermissionsBroker;
  private sessionUpdatedSub: Subscription;

  @ViewChild(ListActiveUsersComponent) private activeUserList: ListActiveUsersComponent;

  constructor(
    private crumbsSvc: BreadcrumbsService, 
    private usersSvc: UsersService,
    private notifySvc: NotificationService,
    private rolesSvc: RolesService,
    private router: Router,
    private authSvc: AuthService,
    private launchRequestSvc: AppLaunchRequestService,
    private navStateSvc: NavigationStateService,
    private dialog: MatDialog
  ) { 
    this.canCreate = true;
    this.canUpdate = true;
    this.broker = new AppPermissionsBroker("user-manager");
    this.selectedTabIndex = 0;
  }

  ngOnInit() {
    this.setPermissions();
    this.generateCrumbs();
    this.subscribeToSessionUpdate();
    this.selectedTabIndex = this.navStateSvc.getState(UM_NAV_STATE_TAB);
    this.setActiveTab();
  }

  ngOnDestroy() {
    this.sessionUpdatedSub.unsubscribe();
  }

  changeSelectedIndex(selected) {
    this.navStateSvc.setState(UM_NAV_STATE_PAGE, 0);
    this.navStateSvc.setState(UM_NAV_STATE_PAGESIZE, 10);
    this.navStateSvc.setState(UM_NAV_STATE_TAB, selected);
  }

  private setActiveTab(): void {
    let state: any = this.launchRequestSvc.appStates.get('user-manager');
    if (state && state.showApproved) {
      this.selectedTabIndex = 1;
    }
  }

  private setPermissions(): void {
    this.canCreate = this.broker.hasPermission("Create");
    this.canUpdate = this.broker.hasPermission("Update");
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

  refreshActiveUsers(user: UserProfileKeycloak): void {
    // this.activeUserList.listDisplayItems();
  }

  addButtonClicked(): void {
    let modalRef: MatDialogRef<CreateUserFormComponent> = this.dialog.open(CreateUserFormComponent, {

    });

    modalRef.afterOpened().subscribe(open => modalRef.componentInstance.clearForm());

    modalRef.componentInstance.formSubmitted.subscribe(userCreation => {
      this.createUser(userCreation);
      modalRef.close();
    });
    modalRef.componentInstance.close.subscribe((close) => modalRef.close());
  }

  createUser(userInfo: UserCreation): void {
    this.usersSvc.create(userInfo.user).subscribe(
      (response: any) => {
        this.fetchCreatedUser(userInfo.user.username, userInfo.creds);
      },
      (err: any) => {
       console.log(err);
       this.notifySvc.notify({
        type: NotificationType.Error,
        message: err.error.errorMessage || "There was a problem while creating the account"
       }); 
      }
    );
  }

  private fetchCreatedUser(username: string, creds: CredentialsRepresentation): void {
    this.usersSvc.listUsers({username: username}).subscribe(
      (users: Array<UserProfileKeycloak>) => {
        this.updatePassword(users[0].id, creds);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private updatePassword(userId: string, creds: CredentialsRepresentation): void {
    this.usersSvc.updatePassword(userId, creds).subscribe(
      (response: any) => {
        this.listRoles(userId);
      },
      (err: any) => {
        console.log(err);
        this.notifySvc.notify({
          type: NotificationType.Error,
          message: "The user was created, but the password could not be set"
        });
      }
    );
  }

  private listRoles(userId: string): void {
    if (this.roles) {
      this.removePendingRole(userId);
    }
    else {
      this.rolesSvc.list().subscribe(
        (roles: Array<Role>) => {
          this.roles = roles;
          this.removePendingRole(userId);
        },
        (err: any) => {
          console.log(err);
          this.sendRoleFailureNotification();
        }
      );
    }
  }

  private removePendingRole(userId: string): void {
    const rolesToRemove: Array<Role> = this.roles.filter((role: Role) => role.id === this.authSvc.globalConfig.pendingRoleId);
    this.usersSvc.deleteComposites(userId, rolesToRemove).subscribe(
      (response: any) => {
        this.addActiveRole(userId);
      },
      (err: any) => {
        console.log(err);
        this.sendRoleFailureNotification();
      }
    );
  }

  private addActiveRole(userId: string): void {
    const rolesToAdd: Array<Role> = this.roles.filter((role: Role) => role.id === this.authSvc.globalConfig.approvedRoleId);
    this.usersSvc.addComposites(userId, rolesToAdd).subscribe(
      (response: any) => {
        this.notifySvc.notify({
          type: NotificationType.Success,
          message: "The user was created successfully"
        });
        this.router.navigateByUrl('/portal/user-manager/edit/' + userId);
      },
      (err: any) => {
        console.log(err);
        this.sendRoleFailureNotification();
      }
    );
  }

  private sendRoleFailureNotification(): void {
    this.notifySvc.notify({
      type: NotificationType.Error,
      message: "The user was created, but there was a problem while flagging the user as approved"
    });
  }

  private generateCrumbs(): void {
    const crumbs: Array<Breadcrumb> = new Array<Breadcrumb>(
      {
        title: "Dashboard",
        active: false,
        link: '/portal'
      },
      {
        title: "User Manager",
        active: true,
        link: '/portal/user-manager'
      }
    );
    this.crumbsSvc.update(crumbs);
  }

}
