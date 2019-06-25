import { Component, Output, EventEmitter, ViewChild, Input, OnInit } from '@angular/core';
import { UserProfileWithRegistration } from 'src/app/models/user-profile-with-registration.model';
import { MatTable } from '@angular/material';

@Component({
  selector: 'app-applicant-table',
  templateUrl: './applicant-table.component.html',
  styleUrls: ['./applicant-table.component.scss']
})
export class ApplicantTableComponent implements OnInit{
  init: boolean;
  columnsToDisplay: Array<string>;
  @Input('users')
  get users(): Array<UserProfileWithRegistration>{return this._users}
  set users(users: Array<UserProfileWithRegistration>){
    this._users = users; 
    if(this.init){
      this.table.renderRows()
    }
  }
  private _users: Array<UserProfileWithRegistration>;
  @Output() userSelected: EventEmitter<UserProfileWithRegistration>;
  @ViewChild(MatTable) table: MatTable<UserProfileWithRegistration>;

  constructor() {  
    this.init = false;
    this.columnsToDisplay = [
      'online',
      'username',
      'fullname',
      'email',
      'action'
    ];
    this.users = new Array<UserProfileWithRegistration>();
    this.userSelected = new EventEmitter<UserProfileWithRegistration>();
  }

  ngOnInit(){
    this.init = true;
  }
}