import { Component, OnInit, Input } from '@angular/core';
import {RolesService} from '../../../services/roles.service';
import {Role} from '../../../models/role.model';
import {Filters} from '../../../util/filters';
import {AjaxProgressService} from '../../../ajax-progress/ajax-progress.service';
import {Cloner} from '../../../util/cloner';

@Component({
  selector: 'app-realm-role-picker',
  templateUrl: './realm-role-picker.component.html',
  styleUrls: ['./realm-role-picker.component.scss']
})
export class RealmRolePickerComponent implements OnInit {

  roles: Array<Role>;

  @Input() activeRoleId: string;

  constructor(
    private rolesSvc: RolesService,
    private ajaxSvc: AjaxProgressService) { 
      this.roles = new Array<Role>();
    }

  ngOnInit() {
    this.listRoles();
  }

  private listRoles(): void {
    this.rolesSvc.list().subscribe(
      (roles: Array<Role>) => {
        this.roles = roles;
      },
      (err: any) => {
        console.log(err);
      }
    );  
  }

}
