import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatDialog, MatTable } from '@angular/material';
import { UsersService } from '../../../services/users.service';
import { VendorsService } from '../../../services/vendors.service';
import { RolesService } from '../../../services/roles.service';
import { TableSelectionService } from '../../../services/table-selection.service';
import { NotificationService } from '../../../notifier/notification.service';
import { AuthService } from '../../../services/auth.service';
import { ListUsersBaseComponent } from '../list-users-base.component';
import { NavigationStateService } from 'src/app/services/navigation-state.service';
import { UserProfile } from 'src/app/models/user-profile.model';

@Component({
    selector: 'app-list-active-users',
    templateUrl: './list-active-users.component.html',
    styleUrls: ['./list-active-users.component.scss']
})
export class ListActiveUsersComponent extends ListUsersBaseComponent {

    @ViewChild(MatTable) table: MatTable<UserProfile>; 

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
        this.query = function (first: number, max: number) {
            return this.roleService.listUsers(this.authSvc.globalConfig.approvedRoleName, first, max);
        }.bind(this);
    }

    ngOnInit() {
        super.ngOnInit();
        this.table.renderRows();
    }
}
