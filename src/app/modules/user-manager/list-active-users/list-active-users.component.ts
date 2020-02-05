import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { UsersService } from '../../../services/users.service';
import { VendorsService } from '../../../services/vendors.service';
import { RolesService } from '../../../services/roles.service';
import { TableSelectionService } from '../../../services/table-selection.service';
import { NotificationService } from '../../../notifier/notification.service';
import { AuthService } from '../../../services/auth.service';
import { ListUsersBaseComponent } from '../list-users-base.component';

@Component({
  selector: 'app-list-active-users',
  templateUrl: './list-active-users.component.html',
  styleUrls: ['./list-active-users.component.scss']
})
export class ListActiveUsersComponent extends ListUsersBaseComponent {
  constructor(
    authSvc: AuthService, 
    notificationsSvc: NotificationService,
    userService: UsersService,
    vendorsSvc: VendorsService,
    roleService: RolesService, 
    dialog: MatDialog,
    selectionSvc: TableSelectionService
  ) {
    super(authSvc, notificationsSvc, userService, vendorsSvc, roleService, dialog, selectionSvc);
    this.query = function(first: number, max: number) {
      return this.roleService.listUsers(this.authSvc.globalConfig.approvedRoleName, first, max);
    }.bind(this);
  }
}
