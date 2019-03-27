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

  @Output() saveChanges: EventEmitter<boolean>
  
  get objectWithPermissions(): any{
    return this._objectWithPermissions;
  }
  set objectWithPermissions(objectWithPermissions: any){
    if(objectWithPermissions.permissions){
      this._objectWithPermissions = objectWithPermissions;
    }
  }
  private _objectWithPermissions: any;

  constructor() {
    this.saveChanges = new EventEmitter();
  }
}
