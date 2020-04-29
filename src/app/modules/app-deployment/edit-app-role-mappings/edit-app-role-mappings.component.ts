/**
 * @description Shows what app client roles are mapped to realm-level. Only shows realm-level roles that are assigned to the app.
 * @author Steven M. Redman
 */

import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { PermissionsModalComponent } from '../../display-elements/permissions-modal/permissions-modal.component';
import { Role } from '../../../models/role.model';
import { App } from '../../../models/app.model';
import { NotificationType } from '../../../notifier/notificiation.model';
import { RoleWithPermissions } from '../../../models/role-with-permissions.model';
import { ClientsService } from '../../../services/clients.service';
import { RolesService } from '../../../services/roles.service';
import { NotificationService } from '../../../notifier/notification.service';
import { AuthService } from '../../../services/auth.service';
import { Cloner } from '../../../util/cloner';
import { Filters } from '../../../util/filters';

@Component({
	selector: 'app-edit-app-role-mappings',
	templateUrl: './edit-app-role-mappings.component.html',
	styleUrls: [ './edit-app-role-mappings.component.scss' ]
})
export class EditAppRoleMappingsComponent implements OnInit {
	rwps: Array<RoleWithPermissions>;
	filteredItems: Array<RoleWithPermissions>;
	displayItems: Array<RoleWithPermissions>;
	activeRwp: RoleWithPermissions;
	clientRoles: Array<Role>;
	page: number;
	pageSize: number;
	allItemsFetched: boolean;
	filters: any;
	protected sortSub: Subscription;
	protected paginatorSub: Subscription;

	@Input() app: App;
	@Input() displayedColumns: Array<string>;

	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator) paginator: MatPaginator;

	readonly menuOptions = [
		{
			display: 'Assigned',
			value: 'assigned'
		},
		{
			display: 'Unassigned',
			value: 'unassigned'
		}
	];

	constructor(
		private clientsSvc: ClientsService,
    private rolesSvc: RolesService,
    private authSvc: AuthService,
		private notifySvc: NotificationService,
		private dialog: MatDialog
	) {
		this.rwps = new Array<RoleWithPermissions>();
		this.page = 0;
		this.pageSize = 10;
		this.displayedColumns = [ 'role', 'client', 'status', 'actions' ];
		this.filters = {
			name: '',
			selected: []
		};
		this.filteredItems = new Array<RoleWithPermissions>();
		this.displayItems = new Array<RoleWithPermissions>();
		this.allItemsFetched = false;
	}

	ngOnInit() {
		this.listRealmRoles();
		this.subscribeToSort();
		this.subscribeToPaging();
	}

	toggleRowOpen(rwp: RoleWithPermissions) {
		if (!rwp.expanded) {
			if (rwp.permissions === undefined && !rwp.loading) {
				rwp.loading = true;
				this.listComposite(rwp);
			}
			rwp.expanded = true;
		} else {
			rwp.expanded = false;
		}
	}

	search(searchString: string) {
		this.filters.name = searchString;
		this.filterItems();
	}

	updateMenuFilter(menus: string[]) {
		this.filters.selected = menus;
		this.filterItems();
	}

	showPermissionEditor(rwp: RoleWithPermissions, ev?: Event): void {
		if (ev) {
			ev.stopPropagation();
		}

		if (rwp.permissions === undefined) {
			this.listComposite(rwp).subscribe(() => this.showPermissionEditorDialog(rwp));
		} else {
      this.showPermissionEditorDialog(rwp);
    }
	}

	get totalRoles() {
		let str = `${this.paginator.length} Total Roles`;
		return this.paginator.length > 1 ? str + 's' : str;
	}

	listRealmRoles(): void {
		this.rolesSvc.list().subscribe(
			(roles: Array<Role>) => {
				roles = this.setAssignedRoles(roles);
				this.listClientRoles();
				this.rwps = roles.map((role) => ({ role }));
				this.paginator.length = roles.length;
				this.allItemsFetched = true;
				this.filterItems();
			},
			(err: any) => {
				console.log(err);
			}
		);
	}

	updatePermissions(): void {
		let rolesToAdd: Array<Role> = Filters.removeArrayObjectKeys<Role>(
			[ 'active' ],
			Cloner.cloneObjectArray<Role>(this.activeRwp.permissions.filter((r: Role) => r.active))
		);
		const rolesToDelete: Array<Role> = Filters.removeArrayObjectKeys<Role>(
			[ 'active' ],
			Cloner.cloneObjectArray<Role>(this.activeRwp.permissions.filter((r: Role) => !r.active))
		);
		this.addComposites(Cloner.cloneObjectArray<Role>(rolesToAdd), rolesToDelete);
		rolesToAdd.forEach((role: Role) => (role.active = true));
		let rwp: RoleWithPermissions = this.rwps.find(
			(item: RoleWithPermissions) => item.role.id === this.activeRwp.role.id
		);
		rwp.permissions = rolesToAdd.concat(rolesToDelete);
	}

	private setAssignedRoles(roles: Array<Role>): Array<Role> {
		roles.forEach((role: Role) => {
			if (this.app.roles.includes(role.id)) {
				role.active = true;
			}
		});
		return roles;
	}

	private listClientRoles(): void {
		this.clientsSvc.listRoles(this.app.clientId).subscribe(
			(clientRoles: Array<Role>) => {
				this.clientRoles = clientRoles;
			},
			(err: any) => {
				console.log(err);
			}
		);
	}

	private listComposite(rwp: RoleWithPermissions): Observable<any> {
    return new Observable<any>(observer => {
      this.rolesSvc.listClientComposites(rwp.role.id, this.app.clientId).subscribe(
        (composites: Array<Role>) => {
          this.setPermissions(rwp, this.clientRoles, composites);
          observer.next();
          observer.complete();
        },
        (err: any) => {
          rwp.loading = false;
          console.log(err);
          observer.complete();
        }
      );
    });
	}

	private setPermissions(rwp: RoleWithPermissions, clientRoles: Array<Role>, composites: Array<Role>): void {
		let permissions: Array<Role> = new Array<Role>();
		clientRoles.forEach((role: Role) => {
			let clientRole: Role = Cloner.cloneObject<Role>(role);
			let comp: Role = composites.find((composite: Role) => composite.id === clientRole.id);
			if (comp) {
				clientRole.active = true;
			}
			permissions.push(clientRole);
		});
		rwp.permissions = permissions;
		rwp.loading = false;
	}

	private showPermissionEditorDialog(rwp: RoleWithPermissions) {
		this.activeRwp = Cloner.cloneObject<RoleWithPermissions>(rwp);
		let modalRef: MatDialogRef<PermissionsModalComponent> = this.dialog.open(PermissionsModalComponent);

		modalRef.afterOpened().subscribe(() => (modalRef.componentInstance.objectWithPermissions = this.activeRwp));

		modalRef.componentInstance.objectTitle = rwp.role.name;
		modalRef.componentInstance.clientName = this.app.clientName;

		modalRef.componentInstance.saveChanges.subscribe((saveChanges) => {
			if (saveChanges) {
				this.updatePermissions();
			}
			modalRef.close();
		});
	}

	private addComposites(roles: Array<Role>, inactiveRoles: Array<Role>): void {
		this.rolesSvc.addComposites(this.activeRwp.role.id, roles).subscribe(
			(response: any) => {
				this.notifySvc.notify({
					type: NotificationType.Success,
					message: 'Permissions were added successfully to ' + this.activeRwp.role.name
				});
				this.deleteComposites(inactiveRoles);
			},
			(err: any) => {
				console.log(err);
				this.notifySvc.notify({
					type: NotificationType.Error,
					message: 'There was a problem while adding permissions to ' + this.activeRwp.role.name
				});
			}
		);
	}

	private deleteComposites(roles: Array<Role>): void {
		this.rolesSvc.deleteComposites(this.activeRwp.role.id, roles).subscribe(
			(response: any) => {
				this.notifySvc.notify({
					type: NotificationType.Success,
					message: 'Permissions were successfully removed from ' + this.activeRwp.role.name
				});
				this.authSvc.updateUserSession(true);
			},
			(err: any) => {
				console.log(err);
				this.notifySvc.notify({
					type: NotificationType.Error,
					message: 'There was a problem while removing permissions from ' + this.activeRwp.role.name
				});
			}
		);
	}

	private filterItems() {
		const { name, selected } = this.filters;
		const nameFilter = (rwp: RoleWithPermissions) => !name || rwp.role.name.toLowerCase().indexOf(name) >= 0;
		const statusFilter = (rwp: RoleWithPermissions) => true; // !name || rwp.role.name.toLowerCase().indexOf(name) >= 0;
		this.filteredItems = this.rwps.filter((rwp) => nameFilter(rwp) && statusFilter(rwp));
		this.paginator.length = this.filteredItems.length;
		this.listDisplayItems();
	}

	private sortItems() {
		this.rwps.sort((a: RoleWithPermissions, b: RoleWithPermissions) => {
			let valA: string;
			let valB: string;
			if (this.sort.active === 'status') {
				valA = a.role.active ? 'assigned' : 'unassigned';
				valB = b.role.active ? 'assigned' : 'unassigned';
			} else if (this.sort.active === 'role') {
				valA = a.role.name || '';
				valB = b.role.name || '';
			}

			return this.sort.direction === 'asc' ? valA.localeCompare(valB) : -valA.localeCompare(valB);
		});
	}

	protected listDisplayItems(): void {
		const startIndex = this.page * this.pageSize;
		this.displayItems = this.filteredItems.slice(startIndex, startIndex + this.pageSize);
	}

	protected subscribeToPaging(): void {
		this.paginatorSub = this.paginator.page.subscribe(() => {
			this.pageSize = this.paginator.pageSize;
			this.page = this.paginator.pageIndex;
			this.listDisplayItems();
		});
	}

	protected subscribeToSort(): void {
		this.sortSub = this.sort.sortChange.subscribe(() => {
			this.paginator.pageIndex = 0;
			this.sortItems();
			this.listDisplayItems();
		});
	}
}
