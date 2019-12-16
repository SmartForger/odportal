import { Component, Output, EventEmitter } from '@angular/core';
import { Role } from '../../../models/role.model';
import { PlatformModalType } from 'src/app/models/platform-modal.model';
import { MatDialogRef } from '@angular/material';

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

  constructor(private dlgRef: MatDialogRef<PermissionsModalComponent>) {
    this.saveChanges = new EventEmitter();
    this.objectWithPermissions = {
      permissions: []
    }
    this.emptyPermissionsString = 'No permissions found.';
    this.dlgRef.addPanelClass("platform-modal");
    this.dlgRef.addPanelClass(PlatformModalType.PRIMARY);
  }
}
