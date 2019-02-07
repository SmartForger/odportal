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

  private listUserApps(): void {
    this.appsSvc.listUserApps(this.activeUserId).subscribe(
      (apps: Array<App>) => {
        this.apps = apps.map((app: App) => {
          return {app: app};
        });
        this.getAppClientPermissions();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private getAppClientPermissions(): void {
    let clientIds: Set<string> = new Set<string>();
    this.apps.forEach((awp: AppWithPermissions, index: number) => {
      clientIds.add(awp.app.clientId);
    });
    clientIds.forEach((clientId: string) => {
      this.listClientRoles(clientId);
    });
  }

  private listClientRoles(clientId: string): void {
    this.clientsSvc.listRoles(clientId).subscribe(
      (roles: Array<Role>) => {
        const appsToSet: Array<AppWithPermissions> = this.apps.filter((aws: AppWithPermissions) => aws.app.clientId === clientId);
        appsToSet.forEach((awp: AppWithPermissions) => {
          awp.permissions = roles;
        });
        this.listUserComposites(clientId, appsToSet);
      },
      (err: any) => {
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
    });
  }

}