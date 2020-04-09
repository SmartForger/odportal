import { Component, OnInit, Input } from '@angular/core';
import {AppsService} from '../../../services/apps.service';
import {App} from '../../../models/app.model';
import {Role} from '../../../models/role.model';
import {AppWithPermissions} from '../../../models/app-with-permissions.model';
import {ClientsService} from '../../../services/clients.service';
import {UsersService} from '../../../services/users.service';

@Component({
  selector: 'app-list-apps',
  templateUrl: './list-apps.component.html',
  styleUrls: ['./list-apps.component.scss']
})
export class ListAppsComponent implements OnInit {

  apps: Array<AppWithPermissions>;

  @Input() activeUserId: string;

  constructor(
    private appsSvc: AppsService,
    private clientsSvc: ClientsService,
    private usersSvc: UsersService) { 
    this.apps = new Array<AppWithPermissions>();
  }

  ngOnInit() {
    this.listUserApps()
  }

  toggleRowOpen(awp: AppWithPermissions) {
    if (!awp.expanded) {
      if (awp.permissions === undefined && !awp.loading) {
        awp.loading = true;
        this.listClientRoles(awp);
      }
      awp.expanded = true;
    } else {
      awp.expanded = false;
    }
  }

  private listUserApps(): void {
    this.appsSvc.listUserApps(this.activeUserId).subscribe(
      (apps: Array<App>) => {
        this.apps = apps.map((app: App) => {
          return {app: app};
        });
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private listClientRoles(awp: AppWithPermissions): void {
    this.clientsSvc.listRoles(awp.app.clientId).subscribe(
      (roles: Array<Role>) => {
        const appsToSet: Array<AppWithPermissions> = this.apps.filter(
          (awp1: AppWithPermissions) => awp1.app.clientId === awp.app.clientId
        );
        appsToSet.forEach((awp: AppWithPermissions) => {
          awp.permissions = roles;
        });
        this.listUserComposites(awp.app.clientId, appsToSet);
      },
      (err: any) => {
        awp.loading = false;
        console.log(err);
      }
    );
  }

  private listUserComposites(clientId: string, appsToSet: Array<AppWithPermissions>): void {
    this.usersSvc.listClientComposites(this.activeUserId, clientId).subscribe(
      (composites: Array<Role>) => {
        this.setActiveComposites(composites, appsToSet);
      },
      (err: any) => {
        appsToSet.forEach((awp: AppWithPermissions) => {
          awp.loading = false;
        });
        console.log(err);
      }
    );
  }

  private setActiveComposites(composites: Array<Role>, appsToSet: Array<AppWithPermissions>): void {
    appsToSet.forEach((awp: AppWithPermissions) => {
      awp.permissions.forEach((role: Role) => {
        const composite: Role = composites.find((c: Role) => c.id === role.id);
        if (composite) {
          role.active = true;
        }
      });
      awp.loading = false;
    });
  }

}