import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { UsersService } from '../../../services/users.service';
import { VendorsService } from '../../../services/vendors.service';
import { RolesService } from '../../../services/roles.service';
import { TableSelectionService } from '../../../services/table-selection.service';
import { NotificationService } from '../../../notifier/notification.service';
import { AuthService } from '../../../services/auth.service';
import { ListUsersBaseComponent } from '../list-users-base.component';
import { NavigationStateService } from 'src/app/services/navigation-state.service';

@Component({
  selector: 'app-list-all-users',
  templateUrl: './list-all-users.component.html',
  styleUrls: ['./list-all-users.component.scss']
})
export class ListAllUsersComponent extends ListUsersBaseComponent {
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
  }
}
