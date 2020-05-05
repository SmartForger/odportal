import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatDialog, MatTable } from '@angular/material';
import { UsersService } from '../../../services/users.service';
import { VendorsService } from '../../../services/vendors.service';
import { RolesService } from '../../../services/roles.service';
import { TableSelectionService } from '../../../services/table-selection.service';
import { NotificationService } from '../../../notifier/notification.service';
import { AuthService } from '../../../services/auth.service';
import { ListUsersBaseComponent } from '../list-users';
import { NavigationStateService } from 'src/app/services/navigation-state.service';
import { UserProfileKeycloak } from 'src/app/models/user-profile.model';

@Component({
	selector: 'app-list-all-users',
	templateUrl: './list-all-users.component.html',
	styleUrls: [ './list-all-users.component.scss' ]
})
export class ListAllUsersComponent extends ListUsersBaseComponent implements OnInit {
	@ViewChild(MatTable) table: MatTable<UserProfileKeycloak>;

	readonly AVATAR_STYLE = {
		fontSize: '14px',
		fontFamily: 'Roboto'
	};

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

	ngOnInit() {
		super.ngOnInit();
		this.table.renderRows();
	}
}
