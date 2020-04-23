import { OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatPaginator, MatTableDataSource } from '@angular/material';
import { UsersService } from '../../services/users.service';
import { VendorsService } from '../../services/vendors.service';
import { RolesService } from '../../services/roles.service';
import { TableSelectionService } from '../../services/table-selection.service';
import { UserProfile } from '../../models/user-profile.model';
import { ApiSearchCriteria } from '../../models/api-search-criteria.model';
import { Vendor } from '../../models/vendor.model';
import { ApiSearchResult } from '../../models/api-search-result.model';
import { AuthService } from '../../services/auth.service';
import { ViewAttributesComponent } from './view-attributes/view-attributes.component';
import { DirectQueryList } from 'src/app/base-classes/direct-query-list';
import { Filters } from '../../util/filters';
import { KeyValue } from 'src/app/models/key-value.model';
import { Subscription, concat, of } from 'rxjs';
import { catchError, toArray, map } from 'rxjs/operators';
import { PlatformModalComponent } from '../display-elements/platform-modal/platform-modal.component';
import { PlatformModalType } from 'src/app/models/platform-modal.model';
import { Role } from '../../models/role.model';
import { NotificationType } from '../../notifier/notificiation.model';
import { NotificationService } from '../../notifier/notification.service';
import { AssignRolesDialogComponent } from './assign-roles-dialog/assign-roles-dialog.component';
import { NavigationStateService } from 'src/app/services/navigation-state.service';
import { UM_NAV_STATE_PAGE, UM_NAV_STATE_PAGESIZE } from './nav-state-keys';

export class ListUsersBaseComponent extends DirectQueryList<UserProfile> implements OnInit {
	activeUser: UserProfile;
	search: string;
	menuOptions: Array<KeyValue>;
	selectedRole: string;
	selectedItems: Object;
	selectedCount: number;
	selectionSub: Subscription;

	@Output() addUser: EventEmitter<void>;

	constructor(
		protected authSvc: AuthService,
		protected notificationsSvc: NotificationService,
		protected userService: UsersService,
		protected vendorsSvc: VendorsService,
		protected roleService: RolesService,
		protected dialog: MatDialog,
		protected selectionSvc: TableSelectionService,
		protected navStateSvc: NavigationStateService
	) {
		super(new Array<string>('selection', 'username', 'fullname', 'email', 'actions'));
		this.addUser = new EventEmitter<void>();
		this.query = function(first: number, max: number) {
			return this.userService.listUsers({ first: first, max: max });
		}.bind(this);
		this.search = '';
		this.menuOptions = new Array<KeyValue>();
		this.selectedRole = '';
		this.selectedItems = {};
		this.selectionSvc.setCompareField('id');
		this.selectionSvc.resetSelection();
		this.page = this.navStateSvc.getState(UM_NAV_STATE_PAGE) || 0;
		this.pageSize = this.navStateSvc.getState(UM_NAV_STATE_PAGESIZE) || 10;
	}

	ngOnInit() {
		super.ngOnInit();
		this.roleService.generateKeyValues().subscribe((kv: Array<KeyValue>) => {
			this.menuOptions = kv;
			this.menuOptions.unshift({
				display: 'All results',
				value: 'All results'
			});
		});
		this.selectionSub = this.selectionSvc.selection.subscribe((selected) => {
			this.selectedItems = selected;
			this.selectedCount = this.selectionSvc.getSelectedCount();
		});
	}

	ngOnDestroy() {
		this.selectionSub.unsubscribe();
	}

	selectRole(role: string): void {
		if (role === 'All results') {
			this.selectedRole = '';
			this.query = function(first: number, max: number) {
				return this.userService.listUsers({ first: first, max: max });
			}.bind(this);
		} else {
			this.selectedRole = role;
			this.query = function(first: number, max: number) {
				return this.roleService.listUsers(role, first, max);
			}.bind(this);
		}
		this.refresh();
	}

	filterUsers(keyword: string): void {
		this.search = keyword;
		const filterKeys = [ 'username', 'fullname', 'email' ];
		this.filteredItems = Filters.filterByKeyword(filterKeys, keyword, this.items);
		this.page = 0;
		this.listDisplayItems();
	}

	onAddUserClick(): void {
		this.addUser.emit();
	}

	viewAttributes(user: UserProfile): void {
		this.activeUser = user;
		let modalRef: MatDialogRef<ViewAttributesComponent> = this.dialog.open(ViewAttributesComponent);
		modalRef.componentInstance.user = user;
		modalRef.componentInstance.close.subscribe((close: any) => modalRef.close());
	}

	deleteSelectedUsers(): void {
		let modalRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
			data: {
				type: PlatformModalType.SECONDARY,
				title: 'Delete users',
				subtitle: 'Are you sure you want to delete all selected users?',
				submitButtonTitle: 'Delete',
				submitButtonClass: 'bg-red',
				formFields: [
					{
						type: 'static',
						label: 'Selected Count',
						defaultValue: this.selectedCount
					}
				]
			}
		});

		modalRef.afterClosed().subscribe((data) => {
			if (data) {
				const observables = this.selectionSvc
					.getSelectedItems()
					.map((user: UserProfile) =>
						this.userService
							.delete(user.id)
							.pipe(map((response) => response), catchError((err) => of(new Error('error occured'))))
					);

				concat(...observables).pipe(toArray()).subscribe((result: any[]) => {
					let failed = 0;
					result.forEach((response: any) => {
						if (response instanceof Error) {
							failed++;
						}
					});

					let message = `${this.pluralize(result.length - failed, true)} deleted successfully`;
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

	assignRolesToSelectedUsers() {
		let modalRef: MatDialogRef<AssignRolesDialogComponent> = this.dialog.open(AssignRolesDialogComponent);

		modalRef.afterClosed().subscribe((data) => {
			if (data) {
				const roles = Filters.removeArrayObjectKeys<Role>([ 'active' ], data);

				const observables = this.selectionSvc
					.getSelectedItems()
					.map((user: UserProfile) =>
						this.userService
							.addComposites(user.id, roles)
							.pipe(map((response) => response), catchError((err) => of(new Error('error occured'))))
					);

				concat(...observables).pipe(toArray()).subscribe((result: any[]) => {
					let failed = 0;
					result.forEach((response: any) => {
						if (response instanceof Error) {
							failed++;
						}
					});

					let message = `Roles were added successfully to ${this.pluralize(result.length - failed)}`;
					if (failed > 0) {
						message += ` but ${this.pluralize(failed)} failed`;
					}

					this.notificationsSvc.notify({
						type: NotificationType.INFO,
						message
					});

					this.selectionSvc.resetSelection();
				});
			}
		});
	}

	suspendSelectedUsers() {
		let modalRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
			data: {
				type: PlatformModalType.SECONDARY,
				title: 'Suspend users',
				subtitle: 'Are you sure you want to disable selected users and revoke log-in privileges?',
				submitButtonTitle: 'Suspend',
				submitButtonClass: 'bg-red',
				formFields: [
					{
						type: 'static',
						label: 'Selected Count',
						defaultValue: this.selectedCount
					}
				]
			}
		});

		modalRef.afterClosed().subscribe((data) => {
			if (data) {
				const observables = this.selectionSvc.getSelectedItems().map((user: UserProfile) => {
					const newUser = {
						...user,
						enabled: false
					};
					delete newUser.vendorId;
					delete newUser.vendorName;
					return this.userService.updateProfile(newUser).pipe(
						map(() => {
							user.enabled = false;
						}),
						catchError((err) => of(new Error('error occured')))
					);
				});

				concat(...observables).pipe(toArray()).subscribe((result: any[]) => {
					let failed = 0;
					result.forEach((response: any) => {
						if (response instanceof Error) {
							failed++;
						}
					});

					let message = `${this.pluralize(result.length - failed, true)} disabled successfully`;
					if (failed > 0) {
						message += ` but ${this.pluralize(failed)} failed`;
					}

					this.notificationsSvc.notify({
						type: NotificationType.INFO,
						message
					});

					this.filterUsers(this.search);
					this.selectionSvc.resetSelection();
				});
			}
		});
	}

	approveSelectedUsers() {}

	savePage(ev: any) {
		this.navStateSvc.setState(UM_NAV_STATE_PAGE, ev.pageIndex);
		this.navStateSvc.setState(UM_NAV_STATE_PAGESIZE, ev.pageSize);
	}

	isAllSelected() {
		let result = true;
		this.displayItems.forEach((item) => {
			result = this.selectedItems[item.id] && result;
		});
		return result;
	}

	toggleAllSelection() {
		const selected = this.isAllSelected();
		this.selectionSvc.selectBatch(this.displayItems, !selected);
	}

	protected filterItems(): void {
		if (this.sortColumn === '') {
			this.sortColumn = 'username';
		}
		this.filteredItems.sort((a: UserProfile, b: UserProfile) => {
			const sortOrder = this.sort.direction === 'desc' ? -1 : 1;
			if (this.sortColumn === 'fullname') {
				const nameA = ((a.firstName || ' ') + (a.lastName || ' ')).toLowerCase();
				const nameB = ((b.firstName || ' ') + (b.lastName || ' ')).toLowerCase();
				return nameA < nameB ? -1 * sortOrder : sortOrder;
			} else {
				return a[this.sortColumn] < b[this.sortColumn] ? -1 * sortOrder : sortOrder;
			}
		});
	}

	protected listDisplayItems(): void {
		super.listDisplayItems();

		const userIds = this.displayItems.filter((u) => !u.vendorId).map((u) => u.id);
		if (userIds.length === 0) {
			return;
		}

		const searchCriteria = new ApiSearchCriteria(
			{
				userIds: JSON.stringify(userIds)
			},
			this.paginator.pageIndex,
			'name',
			'asc'
		);
		searchCriteria.pageSize = this.displayItems.length;
		this.vendorsSvc.listVendorsByUserIds(searchCriteria).subscribe(
			(result: ApiSearchResult<Vendor>) => {
				this.displayItems.forEach((user: UserProfile) => {
					const vendor = result.data.find(
						(vendor: Vendor) => vendor.users.findIndex((u) => u.id === user.id) >= 0
					);
					if (vendor) {
						user.vendorId = vendor.docId;
						user.vendorName = vendor.name;
					} else {
						user.vendorId = 'N/A';
						user.vendorName = '';
					}
				});
			},
			(err: any) => {
				console.log(err);
			}
		);
	}

	protected removeDeletedItems(result: any[]): void {
		const users: UserProfile[] = this.selectionSvc.getSelectedItems();
		const deletedUserIds = result
			.map((response, i) => (response instanceof Error ? -1 : i))
			.filter((index) => index >= 0)
			.map((index) => users[index].id);
		this.items = this.items.filter((item) => deletedUserIds.indexOf(item.id) < 0);
		this.filterUsers(this.search);
		this.selectionSvc.resetSelection();
	}

	protected pluralize(count, withSuffix = false) {
		return `${count} user${count > 1 ? 's' : ''} ${withSuffix ? (count > 1 ? 'were' : 'was') : ''}`;
	}
}
