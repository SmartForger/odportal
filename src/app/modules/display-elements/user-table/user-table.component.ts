import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { DirectQueryList } from 'src/app/base-classes/direct-query-list';
import { UserProfileKeycloak } from 'src/app/models/user-profile.model';
import { KeyValue } from 'src/app/models/key-value.model';
import { Subscription, of, concat } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/notifier/notification.service';
import { UsersService } from 'src/app/services/users.service';
import { VendorsService } from 'src/app/services/vendors.service';
import { RolesService } from 'src/app/services/roles.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { TableSelectionService } from 'src/app/services/table-selection.service';
import { NavigationStateService } from 'src/app/services/navigation-state.service';
import { Filters } from 'src/app/util/filters';
import { ViewAttributesComponent } from '../../user-manager__OLD/view-attributes/view-attributes.component';
import { PlatformModalComponent } from '../platform-modal/platform-modal.component';
import { PlatformModalType } from 'src/app/models/platform-modal.model';
import { map, catchError, toArray } from 'rxjs/operators';
import { NotificationType } from 'src/app/notifier/notificiation.model';
import { AssignRolesDialogComponent } from '../../user-manager__OLD/assign-roles-dialog/assign-roles-dialog.component';
import { Role } from 'src/app/models/role.model';
import { ApiSearchCriteria } from 'src/app/models/api-search-criteria.model';
import { ApiSearchResult } from 'src/app/models/api-search-result.model';
import { Vendor } from 'src/app/models/vendor.model';

@Component({
    selector: 'app-user-table',
    templateUrl: './user-table.component.html',
    styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent extends DirectQueryList<UserProfileKeycloak> implements OnInit {

    @Input() pageKey: string;
    @Input() pageSizeKey: string;

    activeUser: UserProfileKeycloak;
    menuOptions: Array<KeyValue>;
    search: string;
    selectedCount: number;
    selectedItems: Object;
    selectedRole: string;
    selectionSub: Subscription;

    @Output() addUser: EventEmitter<void>;
    @Output() userClick: EventEmitter<UserProfileKeycloak>;

    constructor(
        protected authSvc: AuthService,
        protected dialog: MatDialog,
        protected navStateSvc: NavigationStateService,
        protected notificationsSvc: NotificationService,
        protected roleService: RolesService,
        protected selectionSvc: TableSelectionService,
        protected userService: UsersService,
        protected vendorsSvc: VendorsService
    ) {
        super(new Array<string>("username", "fullname", "email", "actions"));
        this.addUser = new EventEmitter<void>();
        this.query = function (first: number, max: number) { return this.userService.listUsers({ first: first, max: max }); }.bind(this);
        this.search = '';
        this.menuOptions = new Array<KeyValue>();
        this.page = this.navStateSvc.getState(this.pageKey) || 0;
        this.pageSize = this.navStateSvc.getState(this.pageSize) || 10;
        this.selectedItems = {};
        this.selectedRole = '';
        this.selectionSvc.setCompareField('id');
        this.selectionSvc.resetSelection();
        this.userClick = new EventEmitter<UserProfileKeycloak>();
    }

    ngOnInit() {
        super.ngOnInit();
        this.roleService.generateKeyValues().subscribe(
            (kv: Array<KeyValue>) => {
                this.menuOptions = kv;
                this.menuOptions.unshift({
                    display: 'All results',
                    value: 'All results'
                });
            }
        );
        this.selectionSub = this.selectionSvc.selection.subscribe(selected => {
            this.selectedItems = selected;
            this.selectedCount = this.selectionSvc.getSelectedCount();
        });
    }

    ngOnDestroy() {
        this.selectionSub.unsubscribe();
    }

    approveSelectedUsers() { }

    assignRolesToSelectedUsers() {
        let modalRef: MatDialogRef<AssignRolesDialogComponent> = this.dialog.open(AssignRolesDialogComponent);

        modalRef.afterClosed().subscribe(data => {
            if (data) {
                const roles = Filters.removeArrayObjectKeys<Role>(["active"], data);

                const observables = this.selectionSvc.getSelectedItems().map(
                    (user: UserProfileKeycloak) => this.userService.addComposites(user.id, roles)
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

    deleteSelectedUsers(): void {
        let modalRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
            data: {
                type: PlatformModalType.SECONDARY,
                title: "Delete users",
                subtitle: "Are you sure you want to delete all selected users?",
                submitButtonTitle: "Delete",
                submitButtonClass: "bg-red",
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
            if (data) {
                const observables = this.selectionSvc.getSelectedItems().map(
                    (user: UserProfileKeycloak) => this.userService.delete(user.id)
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

    filterUsers(keyword: string): void {
        this.search = keyword;
        const filterKeys = ['username', 'fullname', 'email'];
        this.filteredItems = Filters.filterByKeyword(filterKeys, keyword, this.items);
        this.page = 0;
        this.listDisplayItems();
    }

    onAddUserClick(): void {
        this.addUser.emit();
    }

    onCardClick(user: UserProfileKeycloak, event: MouseEvent){
        this.onClick(user, event);
    }

    onClick(user: UserProfileKeycloak, event: MouseEvent){
        this.userClick.emit(user);
    }

    onIconClick(user: UserProfileKeycloak, event: MouseEvent){
        event.stopPropagation();
        this.selectionSvc.toggleItem(user);
    }

    savePage(ev: any) {
        if(this.pageKey){
            this.navStateSvc.setState(this.pageKey, ev.pageIndex);
        }
        if(this.pageSizeKey){
            this.navStateSvc.setState(this.pageSizeKey, ev.pageSize);
        }
    }

    selectRole(role: string): void {
        if (role === 'All results') {
            this.selectedRole = '';
            this.query = function (first: number, max: number) {
                return this.userService.listUsers({ first: first, max: max });
            }.bind(this);
        } else {
            this.selectedRole = role;
            this.query = function (first: number, max: number) {
                return this.roleService.listUsers(role, first, max);
            }.bind(this);
        }
        this.refresh();
    }

    suspendSelectedUsers() {
        let modalRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
            data: {
                type: PlatformModalType.SECONDARY,
                title: "Suspend users",
                subtitle: "Are you sure you want to disable selected users and revoke log-in privileges?",
                submitButtonTitle: "Suspend",
                submitButtonClass: "bg-red",
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
            if (data) {
                const observables = this.selectionSvc.getSelectedItems().map(
                    (user: UserProfileKeycloak) => {
                        const newUser = {
                            ...user,
                            enabled: false
                        };
                        delete newUser.vendorId;
                        delete newUser.vendorName;
                        return this.userService.updateProfile(newUser)
                            .pipe(
                                map(() => {
                                    user.enabled = false;
                                }),
                                catchError(err => of(new Error('error occured')))
                            )
                    }
                );

                concat(...observables).pipe(toArray())
                    .subscribe((result: any[]) => {
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

    viewAttributes(user: UserProfileKeycloak): void {
        this.activeUser = user;
        let modalRef: MatDialogRef<ViewAttributesComponent> = this.dialog.open(ViewAttributesComponent);
        modalRef.componentInstance.user = user;
        modalRef.componentInstance.close.subscribe((close: any) => modalRef.close());
    }

    protected filterItems(): void {
        if (this.sortColumn === '') { this.sortColumn = 'username'; }
        this.filteredItems.sort((a: UserProfileKeycloak, b: UserProfileKeycloak) => {
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

        const userIds = this.displayItems.filter(u => !u.vendorId).map(u => u.id);
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
        this.vendorsSvc.listVendorsByUserIds(searchCriteria)
            .subscribe(
                (result: ApiSearchResult<Vendor>) => {
                    this.displayItems.forEach((user: UserProfileKeycloak) => {
                        const vendor = result.data.find((vendor: Vendor) =>
                            vendor.users.findIndex(u => u.id === user.id) >= 0
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
                    console.log(err)
                }
            );
    };

    protected pluralize(count, withSuffix = false) {
        return `${count} user${count > 1 ? 's' : ''} ${withSuffix ? count > 1 ? 'were' : 'was' : ''}`;
    }

    protected removeDeletedItems(result: any[]): void {
        const users: UserProfileKeycloak[] = this.selectionSvc.getSelectedItems();
        const deletedUserIds = result.map((response, i) => response instanceof Error ? -1 : i)
            .filter(index => index >= 0)
            .map(index => users[index].id);
        this.items = this.items.filter(item => deletedUserIds.indexOf(item.id) < 0);
        this.filterUsers(this.search);
        this.selectionSvc.resetSelection();
    }
}
