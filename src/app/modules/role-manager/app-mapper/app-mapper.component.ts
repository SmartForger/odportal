import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { AppsService } from "../../../services/apps.service";
import { App } from "../../../models/app.model";
import { NotificationService } from "../../../notifier/notification.service";
import { NotificationType } from "../../../notifier/notificiation.model";
import { ClientsService } from "../../../services/clients.service";
import { Role } from "../../../models/role.model";
import { RolesService } from "../../../services/roles.service";
import { Cloner } from "../../../util/cloner";
import { Filters } from "../../../util/filters";
import { AppWithPermissions } from "../../../models/app-with-permissions.model";
import { AuthService } from "../../../services/auth.service";
import { MatDialog, MatDialogRef } from "@angular/material";
import { PermissionsModalComponent } from "../../display-elements/permissions-modal/permissions-modal.component";
import { PlatformModalComponent } from "../../display-elements/platform-modal/platform-modal.component";
import { PlatformModalType } from "src/app/models/platform-modal.model";

@Component({
  selector: "app-app-mapper",
  templateUrl: "./app-mapper.component.html",
  styleUrls: ["./app-mapper.component.scss"]
})
export class AppMapperComponent implements OnInit {
  apps: Array<AppWithPermissions>;
  showPermissionsModal: boolean;
  activeAwp: AppWithPermissions;
  activeAwpMods: Array<AppWithPermissions>;

  @Input() activeRole: Role;

  private _canUpdate: boolean;
  @Input("canUpdate")
  get canUpdate(): boolean {
    return this._canUpdate;
  }
  set canUpdate(canUpdate: boolean) {
    this._canUpdate = canUpdate;
  }

  constructor(
    private appsSvc: AppsService,
    private notifySvc: NotificationService,
    private clientsSvc: ClientsService,
    private rolesSvc: RolesService,
    private authSvc: AuthService,
    private dialog: MatDialog
  ) {
    this.apps = new Array<AppWithPermissions>();
    this.showPermissionsModal = false;
    this.canUpdate = true;
  }

  ngOnInit() {
    this.listApps();
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

  private listApps(): void {
    this.appsSvc.listApps().subscribe(
      (apps: Array<App>) => {
        this.apps = apps.map((app: App) => {
          return { app: app };
        });
        this.listRoleApps();
        // this.getAppClientPermissions();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private listRoleApps(): void {
    this.appsSvc.listRoleApps(this.activeRole.id).subscribe(
      (apps: Array<App>) => {
        this.setActiveApps(apps);
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
        this.listClientComposites(awp.app.clientId, appsToSet);
      },
      (err: any) => {
        awp.loading = false;
        console.log(err);
      }
    );
  }

  private listClientComposites(
    clientId: string,
    appsToSet: Array<AppWithPermissions>
  ): void {
    this.rolesSvc.listClientComposites(this.activeRole.id, clientId).subscribe(
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

  private setActiveComposites(
    composites: Array<Role>,
    appsToSet: Array<AppWithPermissions>
  ): void {
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

  private setActiveApps(roleApps: Array<App>): void {
    this.apps.forEach((awp: AppWithPermissions) => {
      const roleApp: App = roleApps.find((a: App) => a.docId === awp.app.docId);
      if (roleApp) {
        awp.app.active = true;
      }
    });
  }

  removeAppFromRole(awp: AppWithPermissions, ev: Event): void {
    ev.stopPropagation();

    this.activeAwp = awp;

    let dialogRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
      data: {
        type: PlatformModalType.SECONDARY,
        title: "Remove App from Role",
        subtitle: "Are you sure you want to remove this app",
        submitButtonTitle: "Remove",
        submitButtonClass: "bg-red",
        formFields: [
          {
            type: "static",
            label: "App Title",
            defaultValue: this.activeAwp.app.appTitle
          },
          {
            type: "static",
            label: "Role Name",
            defaultValue: this.activeRole.name
          }
        ]
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        const index: number = this.activeAwp.app.roles.indexOf(
          this.activeRole.id
        );
        this.activeAwp.app.roles.splice(index, 1);
        this.appsSvc.update(this.activeAwp.app).subscribe(
          (app: App) => {
            this.activeAwp.app.active = false;
            this.notifySvc.notify({
              type: NotificationType.Success,
              message:
                this.activeAwp.app.appTitle + " was removed from this role"
            });
            this.appsSvc.appUpdated(app);
            let roles: Array<Role> = new Array<Role>();
            this.activeAwp.permissions.forEach((p: Role) => {
              p.active = false;
              roles.push(p);
            });
            this.deleteComposites(roles);
            const rolesToDelete: Array<Role> = Filters.removeArrayObjectKeys<
              Role
            >(
              ["active"],
              Cloner.cloneObjectArray<Role>(
                this.activeAwp.permissions.filter((role: Role) => !role.active)
              )
            );
            this.deleteComposites(rolesToDelete);
          },
          (err: any) => {
            this.notifySvc.notify({
              type: NotificationType.Error,
              message:
                "There was a problem while removing " +
                this.activeAwp.app.appTitle +
                " from this role"
            });
          }
        );
      }
    });
  }

  addAppToRole(awp: AppWithPermissions, ev: Event): void {
    ev.stopPropagation();

    this.activeAwp = awp;

    let dialogRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
      data: {
        type: PlatformModalType.SECONDARY,
        title: "Add App to Role",
        subtitle: "Are you sure you want to add this app",
        submitButtonTitle: "Add",
        formFields: [
          {
            type: "static",
            label: "App Title",
            defaultValue: this.activeAwp.app.appTitle
          },
          {
            type: "static",
            label: "Role Name",
            defaultValue: this.activeRole.name
          }
        ]
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.activeAwp.app.roles.push(this.activeRole.id);
        this.appsSvc.update(this.activeAwp.app).subscribe(
          (app: App) => {
            this.activeAwp.app.active = true;
            this.notifySvc.notify({
              type: NotificationType.Success,
              message: this.activeAwp.app.appTitle + " was added to this role"
            });
            this.appsSvc.appUpdated(app);
            this.updatePermissions(this.activeAwp);
          },
          (err: any) => {
            this.notifySvc.notify({
              type: NotificationType.Error,
              message:
                "There was a problem while adding " +
                this.activeAwp.app.appTitle +
                " to this role"
            });
          }
        );
      }
    });
  }

  updatePermissions(awp: AppWithPermissions, ev?: Event): void {
    if (ev) {
      ev.stopPropagation();
    }

    this.activeAwp = Cloner.cloneObject<AppWithPermissions>(awp);

    let modelRef = this.dialog.open(PermissionsModalComponent, {
      data: {
        xwp: this.activeAwp,
        clientName: this.activeAwp.app.clientName
      }
    });

    modelRef.componentInstance.objectTitle = this.activeAwp.app.appTitle;
    modelRef.componentInstance.clientName = this.activeAwp.app.clientName;
    modelRef.componentInstance.objectWithPermissions = this.activeAwp;

    modelRef.componentInstance.saveChanges.subscribe(saveChanges => {
      if (saveChanges) {
        let rolesToAdd: Array<Role> = Filters.removeArrayObjectKeys<Role>(
          ["active"],
          Cloner.cloneObjectArray<Role>(
            this.activeAwp.permissions.filter((r: Role) => r.active)
          )
        );
        const rolesToDelete: Array<Role> = Filters.removeArrayObjectKeys<Role>(
          ["active"],
          Cloner.cloneObjectArray<Role>(
            this.activeAwp.permissions.filter((role: Role) => !role.active)
          )
        );
        this.addComposites(
          Cloner.cloneObjectArray<Role>(rolesToAdd),
          rolesToDelete
        );
        rolesToAdd.forEach((role: Role) => (role.active = true));
        let awps: Array<AppWithPermissions> = this.apps.filter(
          (awp: AppWithPermissions) =>
            awp.app.clientId === this.activeAwp.app.clientId
        );
        awps.forEach((awp: AppWithPermissions) => {
          awp.permissions = rolesToAdd.concat(rolesToDelete);
        });
      } else {
        this.activeAwp = Cloner.cloneObject<AppWithPermissions>(awp);
      }
      modelRef.close();
    });
  }

  private addComposites(roles: Array<Role>, inactiveRoles: Array<Role>): void {
    this.rolesSvc.addComposites(this.activeRole.id, roles).subscribe(
      (response: any) => {
        this.notifySvc.notify({
          type: NotificationType.Success,
          message: "Roles were added successfully to " + this.activeRole.name
        });
        this.deleteComposites(inactiveRoles);
      },
      (err: any) => {
        console.log(err);
        this.notifySvc.notify({
          type: NotificationType.Error,
          message:
            "There was a problem while adding roles to " + this.activeRole.name
        });
      }
    );
  }

  private deleteComposites(roles: Array<Role>): void {
    this.rolesSvc.deleteComposites(this.activeRole.id, roles).subscribe(
      (response: any) => {
        this.notifySvc.notify({
          type: NotificationType.Success,
          message:
            "Roles were removed successfully from " + this.activeRole.name
        });
        this.authSvc.updateUserSession(true);
      },
      (err: any) => {
        console.log(err);
        this.notifySvc.notify({
          type: NotificationType.Error,
          message:
            "There was a problem while removing roles from " +
            this.activeRole.name
        });
      }
    );
  }
}
