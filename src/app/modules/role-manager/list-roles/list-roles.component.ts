import { Component, OnInit } from '@angular/core';
import { RolesService } from '../../../services/roles.service';
import { Role } from '../../../models/role.model';
import { Router } from '@angular/router';
import {Filters} from '../../../util/filters';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';

@Component({
  selector: 'app-list-roles',
  templateUrl: './list-roles.component.html',
  styleUrls: ['./list-roles.component.scss']
})
export class ListRolesComponent implements OnInit {

  roles: Array<Role>;
  showAdd: boolean;

  constructor(
    private rolesSvc: RolesService,
    private router: Router,
    private notificationSvc: NotificationService) {
    this.roles = new Array<Role>();
    this.showAdd = false;
  }

  ngOnInit() {
    this.fetchRoles();
  }

  addButtonClicked(): void {
    this.showAdd = true;
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

  private fetchRoles(): void {
    this.rolesSvc.list().subscribe(
      (data: Array<Role>) => {
        this.roles = Filters.removeByKeyValue<string, Role>("id", ["pending", "approved"], data);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

}
