import { Component, OnInit, OnDestroy } from '@angular/core';
import { RolesService } from '../../../services/roles.service';
import { Role } from '../../../models/role.model';
import { Router } from '@angular/router';
import {Filters} from '../../../util/filters';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';
import {Breadcrumb} from '../../display-elements/breadcrumb.model';
import {BreadcrumbsService} from '../../display-elements/breadcrumbs.service';
import {AuthService} from '../../../services/auth.service';
import {AppPermissionsBroker} from '../../../util/app-permissions-broker';
import { SSPList } from '../../../base-classes/ssp-list';
import { ApiSearchCriteria } from '../../../models/api-search-criteria.model';
import { Subscription  } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AddRoleComponent } from '../add-role/add-role.component';
import { NavigationStateService } from 'src/app/services/navigation-state.service';

@Component({
  selector: 'app-list-roles',
  templateUrl: './list-roles.component.html',
  styleUrls: ['./list-roles.component.scss']
})
export class ListRolesComponent extends SSPList<Role> implements OnInit, OnDestroy {

  filteredItems: Array<Role>;
  displayItems: Array<Role>;
  showAdd: boolean;
  broker: AppPermissionsBroker;
  canCreate: boolean;
  page: number;
  pageSize: number;
  private userSessionUpdatedSub: Subscription;

  private readonly NAV_STATE_PAGE = 'rm/list-roles/page';
  private readonly NAV_STATE_PAGESIZE = 'rm/list-roles/pageSize';

  constructor(
    private rolesSvc: RolesService,
    private router: Router,
    private notificationSvc: NotificationService,
    private crumbsSvc: BreadcrumbsService,
    private authSvc: AuthService,
    private navStateSvc: NavigationStateService,
    private dialog: MatDialog) {
      super(
        new Array<string>(
          "name", "description", "actions"
        ),
        new ApiSearchCriteria(
          {name: ""}, 0, "name", "asc"
        )
      );
      this.showAdd = false;
      this.broker = new AppPermissionsBroker("role-manager");
      this.canCreate = true;
      this.filteredItems = new Array<Role>();
      this.displayItems = new Array<Role>();
      this.page = this.navStateSvc.getState(this.NAV_STATE_PAGE) || 0;
      this.pageSize = this.navStateSvc.getState(this.NAV_STATE_PAGESIZE) || 10;
  }

  ngOnInit() {
    this.setPermissions();
    this.fetchItems();
    this.generateCrumbs();
    this.subscribeToSessionUpdate();
  }

  ngOnDestroy() {
    this.userSessionUpdatedSub.unsubscribe();
  }

  private setPermissions(): void {
    this.canCreate = this.broker.hasPermission("Create");
  }

  private subscribeToSessionUpdate(): void {
    this.userSessionUpdatedSub = this.authSvc.observeUserSessionUpdates().subscribe(
      (userId: string) => {
        if (userId === this.authSvc.getUserId()) {
          this.setPermissions();
        }
      }
    );
  }

  addButtonClicked(): void{
    let modalRef = this.dialog.open(AddRoleComponent, {

    });

    modalRef.componentInstance.formSubmitted.subscribe(role => {
      this.createRole(role);
      modalRef.close();
    });
  }

  createRole(role: Role): void {
    this.rolesSvc.create(role).subscribe(
      (response: any) => {
        this.showAdd = false;
        this.notificationSvc.notify({
          type: NotificationType.Success,
          message: role.name + " was created successfully"
        });
        this.router.navigateByUrl('/portal/role-manager/edit/' + role.name);
      },
      (err: any) => {
        this.showAdd = false;
        this.notificationSvc.notify({
          type: NotificationType.Error,
          message: "There was a problem while creating " + role.name
        });
      }
    );
  }

  fetchItems(): void {
    this.rolesSvc.list().subscribe(
      (data: Array<Role>) => {
        this.items = Filters.removeByKeyValue<string, Role>("id", [this.authSvc.globalConfig.pendingRoleId, this.authSvc.globalConfig.approvedRoleId], data);
        this.filteredItems = this.items;
        this.paginator.length = this.items.length;
        this.listItems();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  listItems(): void {
    this.filteredItems.sort((a: Role, b: Role) => {
      if (this.searchCriteria.sortOrder === 'asc') {
        return a[this.searchCriteria.sortColumn] < b[this.searchCriteria.sortColumn] ? -1 : 1;
      } else {
        return a[this.searchCriteria.sortColumn] > b[this.searchCriteria.sortColumn] ? -1 : 1;
      }
    });
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    this.displayItems = this.filteredItems.slice(startIndex, startIndex + this.paginator.pageSize);
  }

  filterRoles(keyword: string): void {
    const filterKeys = ['name'];
    this.filteredItems = Filters.filterByKeyword(filterKeys, keyword, this.items);
    this.paginator.pageIndex = 0;
    this.paginator.length = this.filteredItems.length;
    this.listItems();
  }

  savePage(ev: any): void {
    this.page = ev.pageIndex;
    this.pageSize = ev.pageSize;
    this.navStateSvc.setState(this.NAV_STATE_PAGE, ev.pageIndex);
    this.navStateSvc.setState(this.NAV_STATE_PAGESIZE, ev.pageSize);
  }

  private generateCrumbs(): void {
    const crumbs: Array<Breadcrumb> = new Array<Breadcrumb>(
      {
        title: "Dashboard",
        active: false,
        link: '/portal'
      },
      {
        title: "Role Manager",
        active: true,
        link: null
      }
    );
    this.crumbsSvc.update(crumbs);
  }

}
