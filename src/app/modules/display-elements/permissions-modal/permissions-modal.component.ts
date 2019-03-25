import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { RoleWithPermissions } from 'src/app/models/role-with-permissions.model';

@Component({
  selector: 'app-permissions-modal',
  templateUrl: './permissions-modal.component.html',
  styleUrls: ['./permissions-modal.component.scss']
})
export class PermissionsModalComponent implements OnInit {

  clientName: string;
  xwp: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { 
    if(data.clientName){this.clientName = data.clientName;}
    else{this.clientName = '';}

    if(data.xwp){this.xwp = data.xwp;}
    else{this.xwp = null;}
  }

  ngOnInit() {
  }

}
