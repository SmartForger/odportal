import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../../services/auth.service";
import { RolesService } from "../../../services/roles.service";
import { Role } from "../../../models/role.model";
import { Filters } from "../../../util/filters";
import { MatDialogRef } from '@angular/material';
import { PlatformModalType } from 'src/app/models/platform-modal.model';

@Component({
  selector: "app-assign-roles-dialog",
  templateUrl: "./assign-roles-dialog.component.html",
  styleUrls: ["./assign-roles-dialog.component.scss"]
})
export class AssignRolesDialogComponent implements OnInit {
  roles: Array<Role>;
  rolesSelected: boolean;

  constructor(
    private authSvc: AuthService,
    private rolesSvc: RolesService,
    private dlgRef: MatDialogRef<AssignRolesDialogComponent>
  ) {
    this.roles = [];
    this.rolesSelected = false;

    this.dlgRef.addPanelClass("platform-modal");
    this.dlgRef.addPanelClass(PlatformModalType.PRIMARY);
  }

  ngOnInit() {
    this.listAllRoles();
  }

  updateSelectedStatus() {
    const selectedRoles = this.roles.filter(role => role.active);
    this.rolesSelected = selectedRoles.length > 0;
  }

  assign() {
    const selectedRoles = this.roles.filter(role => role.active);
    this.dlgRef.close(selectedRoles);
  }

  private listAllRoles(): void {
    this.rolesSvc.list().subscribe(
      (roles: Array<Role>) => {
        this.roles = Filters.removeByKeyValue<string, Role>(
          "id",
          [
            this.authSvc.globalConfig.approvedRoleId,
            this.authSvc.globalConfig.pendingRoleId
          ],
          roles
        );
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
}