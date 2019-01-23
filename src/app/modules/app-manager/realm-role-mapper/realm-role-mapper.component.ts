import { Component, OnInit, Input } from '@angular/core';
import {App} from '../../../models/app.model';
import {Role} from '../../../models/role.model';
import {AppsService} from '../../../services/apps.service';
import {RolesService} from '../../../services/roles.service';
import {Filters} from '../../../util/filters';
import {NotificationType} from '../../../notifier/notificiation.model';
import {NotificationService} from '../../../notifier/notification.service';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-realm-role-mapper',
  templateUrl: './realm-role-mapper.component.html',
  styleUrls: ['./realm-role-mapper.component.scss']
})
export class RealmRoleMapperComponent implements OnInit {

  roles: Array<Role>;

  private _app: App;
  @Input('app')
  get app(): App {
    return this._app;
  }

  set app(app: App) {
    this._app = app;
    if (app) {
      if (!this.roles.length) {
        this.listRoles();
      }
      else {
        this.setActiveRoles();
      }
    }
  }

  private _canUpdate: boolean;
  @Input('canUpdate')
  get canUpdate(): boolean {
    return this._canUpdate;
  }
  set canUpdate(canUpdate: boolean) {
    this._canUpdate = canUpdate;
  }

  constructor(
    private appsSvc: AppsService, 
    private rolesSvc: RolesService,
    private notifySvc: NotificationService,
    private authSvc: AuthService) { 
    this.roles = new Array<Role>();
  }

  ngOnInit() {
  }

  update(): void {
    this.app.roles = this.roles.filter((role: Role) => role.active === true)
    .map((role: Role) => {
      return role.id;
    });
    this.appsSvc.update(this.app).subscribe(
      (app: App) => {
        this.notifySvc.notify({
          type: NotificationType.Success,
          message: "The realm roles for " + this.app.appTitle + " were updated successfully"
        });
        this.appsSvc.appUpdated(app);
      },
      (err: any) => {
        this.notifySvc.notify({
          type: NotificationType.Error,
          message: "There was a problem while updating realm roles for " + this.app.appTitle
        });
      }
    );
  }

  private listRoles(): void {
    this.rolesSvc.list().subscribe(
      (roles: Array<Role>) => {
        this.roles = Filters.removeByKeyValue<string, Role>("id", [this.authSvc.globalConfig.pendingRoleId, this.authSvc.globalConfig.approvedRoleId], roles);
        this.setActiveRoles();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private setActiveRoles(): void {
    this.roles.forEach((role: Role, index: number) => {
      const roleId: string = this.app.roles.find((roleId: string) => roleId === role.id);
      if (roleId) {
        role.active = true;
      }
    });
  }

}
