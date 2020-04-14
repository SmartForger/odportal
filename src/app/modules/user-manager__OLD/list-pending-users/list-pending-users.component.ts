import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { UsersService } from '../../../services/users.service';
import { VendorsService } from '../../../services/vendors.service';
import { RolesService } from '../../../services/roles.service';
import { TableSelectionService } from '../../../services/table-selection.service';
import { NotificationService } from '../../../notifier/notification.service';
import { AuthService } from '../../../services/auth.service';
import { ListUsersBaseComponent } from '../list-users-base.component';
import { UserProfileKeycloak } from '../../../models/user-profile.model';
import { Role } from '../../../models/role.model';
import { RealmRolePickerComponent } from '../realm-role-picker/realm-role-picker.component';
import { PlatformModalComponent } from '../../display-elements/platform-modal/platform-modal.component';
import { PlatformModalType } from 'src/app/models/platform-modal.model';
import { NotificationType } from '../../../notifier/notificiation.model';
import { catchError, toArray, map } from 'rxjs/operators';
import { concat, of, forkJoin } from 'rxjs';
import { NavigationStateService } from 'src/app/services/navigation-state.service';

@Component({
  selector: 'app-list-pending-users',
  templateUrl: './list-pending-users.component.html',
  styleUrls: ['./list-pending-users.component.scss']
})
export class ListPendingUsersComponent extends ListUsersBaseComponent {

  private _canUpdate: boolean;
  @Input('canUpdate')
  get canUpdate(): boolean {
    return this._canUpdate;
  }
  set canUpdate(canUpdate: boolean) {
    this._canUpdate = canUpdate;
  }

  @Output() userApproved: EventEmitter<UserProfileKeycloak>;

  private APPROVE_ROLE: Role;
  private PENDING_ROLE: Role;

  constructor(
    authSvc: AuthService, 
    notificationsSvc: NotificationService,
    userService: UsersService,
    vendorsSvc: VendorsService,
    roleService: RolesService, 
    dialog: MatDialog,
    selectionSvc: TableSelectionService,
    navStateSvc: NavigationStateService
  ) {
    super(authSvc, notificationsSvc, userService, vendorsSvc, roleService, dialog, selectionSvc, navStateSvc);
    this.query = function(first: number, max: number) {
      return this.roleService.listUsers(this.authSvc.globalConfig.pendingRoleName, first, max);
    }.bind(this);
    this.canUpdate = true;
    this.userApproved = new EventEmitter<UserProfileKeycloak>();
    this.selectedRole = 'Pending';
    this.APPROVE_ROLE = this.emptyRole();
    this.PENDING_ROLE = this.emptyRole();
  }

  ngOnInit() {
    super.ngOnInit();
    this.roleService.list().subscribe(
      (roles: Array<Role>) => {
        this.menuOptions = roles.map(role => ({
          display: role.name,
          value: role.name
        }));
        this.menuOptions.unshift({
          display: 'All results',
          value: 'All results'
        });
        this.APPROVE_ROLE = roles.find(role => role.id === this.authSvc.globalConfig.approvedRoleId) || this.emptyRole();
        this.PENDING_ROLE = roles.find(role => role.id === this.authSvc.globalConfig.pendingRoleId) || this.emptyRole();
      }
    );
    this.selectionSub = this.selectionSvc.selection.subscribe(selected => {
      this.selectedItems = selected;
      this.selectedCount = this.selectionSvc.getSelectedCount();
    });
    this.table.renderRows();
  }

  approve(user: UserProfileKeycloak): void {
    this.activeUser = user;
    let modalRef: MatDialogRef<RealmRolePickerComponent> = this.dialog.open(RealmRolePickerComponent);
    modalRef.componentInstance.user = this.activeUser;
    modalRef.componentInstance.userUpdated.subscribe(user => {
      modalRef.close();
      this.approvalComplete(user)
    });
  }

  approvalComplete(user: UserProfileKeycloak): void {
    this.removeUser(user);
    this.userApproved.emit(user);
  }

  deny(user: UserProfileKeycloak): void {
    this.activeUser = user;

    let dialogRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
      data: {
        type: PlatformModalType.SECONDARY,
        title: "Deny User Request",
        subtitle: "Are you sure you want to deny this request?",
        submitButtonTitle: "Deny",
        submitButtonClass: "bg-red",
        formFields: [
          {
            type: "static",
            label: "Username",
            defaultValue: this.activeUser.username
          },
          {
            type: "static",
            label: "Full Name",
            defaultValue: `${this.activeUser.firstName} ${this.activeUser.lastName}`
          }
        ]
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if(data){
        this.denyConfirmed();
      }
    });
  }

  denyConfirmed(): void {
    this.userService.delete(this.activeUser.id).subscribe(
      (response: any) => {
        this.removeUser(this.activeUser);
        this.notificationsSvc.notify({
          type: NotificationType.Success,
          message: this.activeUser.username + " was denied successfully"
        });
      },
      (err: any) => {
        this.notificationsSvc.notify({
          type: NotificationType.Error,
          message: "There was a problem while denying " + this.activeUser.username
        });
      }
    );
  }

  approveSelectedUsers(): void {
    console.log(this.APPROVE_ROLE, this.PENDING_ROLE)

    if (!this.APPROVE_ROLE.name || !this.PENDING_ROLE.name) {
      return;
    }

    let modalRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
      data: {
        type: PlatformModalType.SECONDARY,
        title: "Approve users",
        subtitle: "Are you sure you want to approve all selected users?",
        submitButtonTitle: "Approve",
        submitButtonClass: "bg-blue",
        formFields: [
          {
            type: "static",
            label: "Selected Count",
            defaultValue: this.selectedCount
          }
        ]
      }
    });

    modalRef.afterClosed().subscribe(data => {
      if(data){
        const observables = this.selectionSvc.getSelectedItems().map(
          (user: UserProfileKeycloak) => 
            forkJoin(
              this.userService.addComposites(user.id, [this.APPROVE_ROLE]),
              this.userService.deleteComposites(user.id, [this.PENDING_ROLE])
            )
            .pipe(
              map(response => response),
              catchError(err => of(new Error('error occured')))
            )
        );

        concat(...observables).pipe(toArray())
          .subscribe((result: any[]) => {
            let failed = 0;
            result.forEach((response: any) => {
              if (response instanceof Error) {
                failed ++;
              }
            });

            let message = `${this.pluralize(result.length - failed, true)} approved successfully`;
            if (failed > 0) {
              message += ` but ${this.pluralize(failed)} failed`;
            }

            this.notificationsSvc.notify({
              type: NotificationType.INFO,
              message
            });

            this.removeDeletedItems(result);
          });
      }
    });
  }

  private removeUser(user: UserProfileKeycloak): void {
    let index: number = this.items.findIndex((u: UserProfileKeycloak) => u.id === user.id);
    this.items.splice(index, 1);
    index = this.filteredItems.findIndex((u: UserProfileKeycloak) => u.id === user.id);
    this.filteredItems.splice(index, 1);
  }

  private emptyRole(): Role {
    return {
      clientRole: false,
      composite: false,
      containerId: '',
      description: '',
      id: '',
      name: ''
    };
  }
}
