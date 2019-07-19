import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Role } from '../../../models/role.model';
import { Filters } from '../../../util/filters';
import { AuthService } from '../../../services/auth.service';
import { RolesService } from '../../../services/roles.service';

@Component({
  selector: 'app-role-mapping-modal',
  templateUrl: './role-mapping-modal.component.html',
  styleUrls: ['./role-mapping-modal.component.scss']
})
export class RoleMappingModalComponent implements OnInit {
  roles: Role[] = [];

  constructor(
    public dialogRef: MatDialogRef<RoleMappingModalComponent>,
    private authSvc: AuthService,
    private rolesSvc: RolesService
  ) {
    this.rolesSvc.list().subscribe(
      (roles: Array<Role>) => {
        this.roles = Filters.removeByKeyValue<string, Role>(
          'id',
          [
            this.authSvc.globalConfig.pendingRoleId,
            this.authSvc.globalConfig.approvedRoleId
          ],
          roles
        );
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  ngOnInit() {}

  addRoles() {
    this.dialogRef.close(
      this.roles.filter(role => role.active).map(role => role.id)
    );
  }
}
