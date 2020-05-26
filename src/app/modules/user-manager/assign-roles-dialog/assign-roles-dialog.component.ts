import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../../services/auth.service";
import { RolesService } from "../../../services/roles.service";
import { Role } from "../../../models/role.model";
import { Filters } from "../../../util/filters";
import { MatDialogRef } from "@angular/material";
import { PlatformModalType } from "src/app/models/platform-modal.model";
import { TableSelectionService } from "src/app/services/table-selection.service";
import { UserProfileKeycloak } from "src/app/models/user-profile.model";
import { UsersService } from "src/app/services/users.service";

@Component({
  selector: "app-assign-roles-dialog",
  templateUrl: "./assign-roles-dialog.component.html",
  styleUrls: ["./assign-roles-dialog.component.scss"],
})
export class AssignRolesDialogComponent implements OnInit {
  roles: Array<Role>;
  rolesSelected: boolean;
  hover: boolean;
  currentHoveredRole: string;
  search: string;
  searchFocused: boolean = false;
  selectedUsers: UserProfileKeycloak[] = [];
  rolesAssigned: Role[] = [];

  constructor(
    private authSvc: AuthService,
    private rolesSvc: RolesService,
    private dlgRef: MatDialogRef<AssignRolesDialogComponent>,
    private selectionService: TableSelectionService,
    private usersService: UsersService
  ) {
    this.roles = [];
    this.rolesSelected = false;

    this.dlgRef.addPanelClass("platform-modal");
    this.dlgRef.addPanelClass(PlatformModalType.PRIMARY);
    this.search = "";
  }

  ngOnInit() {
    this.listAllRoles();
    this.selectedUsers = this.selectionService.getSelectedItems();
  }

  updateSearch(searchTerm: string): void {
    this.search = searchTerm.toLowerCase();
  }

  updateSelectedStatus(role: Role) {
    role.active = !role.active;
    const selectedRoles = this.roles.filter((role) => role.active);
    this.rolesSelected = selectedRoles.length > 0;
  }

  get assignedRoles(): Role[] {
    return this.roles.filter((role) => role.active);
  }

  get unassignedRoles(): Role[] {
    return this.roles.filter((role) => !role.active);
  }

  assign() {
    const selectedRoles = this.roles.filter((role) => role.active);
    this.dlgRef.close(selectedRoles);
  }

  getCurrentHoveredRole(roleId: string): void {
    this.currentHoveredRole = roleId;
  }

  private listAllRoles(): void {
    this.rolesSvc.list().subscribe(
      (roles: Array<Role>) => {
        this.roles = Filters.removeByKeyValue<string, Role>(
          "id",
          [
            this.authSvc.globalConfig.approvedRoleId,
            this.authSvc.globalConfig.pendingRoleId,
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
