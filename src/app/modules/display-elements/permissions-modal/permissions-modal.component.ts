import { Component, Output, EventEmitter } from '@angular/core';
import { Role } from '../../../models/role.model';

@Component({
  selector: 'app-permissions-modal',
  templateUrl: './permissions-modal.component.html',
  styleUrls: ['./permissions-modal.component.scss']
})
export class PermissionsModalComponent {

  objectTitle: string;
  clientName: string;
  emptyPermissionsString: string;

  @Output() saveChanges: EventEmitter<boolean>
  
  get objectWithPermissions(): any{
    return this._objectWithPermissions;
  }
  set objectWithPermissions(objectWithPermissions: any){
    console.log(objectWithPermissions);
    if(objectWithPermissions.permissions){
      this._objectWithPermissions = objectWithPermissions;
    }
  }
  private _objectWithPermissions: any;

  constructor() {
    this.saveChanges = new EventEmitter();
    this.objectWithPermissions = {
      permissions: []
    }
    this.emptyPermissionsString = 'No permissions found.';
  }
}
