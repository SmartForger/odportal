import { Component, OnInit, ViewChild } from '@angular/core';
import {ListActiveUsersComponent} from '../list-active-users/list-active-users.component';
import {UserProfile} from '../../../models/user-profile.model';
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

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {

  showAdd: boolean;
  roles: Array<Role>;

  @ViewChild(ListActiveUsersComponent) private activeUserList: ListActiveUsersComponent;
  @ViewChild(CreateUserFormComponent) private createUserForm: CreateUserFormComponent;

  constructor(
    private crumbsSvc: BreadcrumbsService, 
    private usersSvc: UsersService,
    private notifySvc: NotificationService,
    private rolesSvc: RolesService,
    private router: Router,
    private authSvc: AuthService) { 
    this.showAdd = false;
  }

  ngOnInit() {
    this.generateCrumbs();
  }

  refreshActiveUsers(user: UserProfile): void {
    this.activeUserList.listUsers();
  }

  addButtonClicked(): void {
    this.createUserForm.clearForm();
    this.showAdd = true;
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
      (users: Array<UserProfile>) => {
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
