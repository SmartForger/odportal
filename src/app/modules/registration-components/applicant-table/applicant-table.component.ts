import { Component, Output, EventEmitter, ViewChild, Input, OnInit } from '@angular/core';
import { UserProfileWithRegistration } from 'src/app/models/user-profile-with-registration.model';
import { MatTable } from '@angular/material';
import { UserRegistrationSummary } from 'src/app/models/user-registration-summary.model';

@Component({
  selector: 'app-applicant-table',
  templateUrl: './applicant-table.component.html',
  styleUrls: ['./applicant-table.component.scss']
})
export class ApplicantTableComponent implements OnInit{
  init: boolean;
  columnsToDisplay: Array<string>;
  @Input('summaries')
  get summaries(): Array<UserRegistrationSummary>{return this._summaries}
  set summaries(summaries: Array<UserRegistrationSummary>){
    this._summaries = summaries; 
    if(this.init){
      this.table.renderRows()
    }
  }
  private _summaries: Array<UserRegistrationSummary>;
  @Input() 
  get users(): Array<UserProfileWithRegistration>{return this._users;}
  set users(users: Array<UserProfileWithRegistration>){
      this._users = users;
      if(this.init){
          this.table.renderRows();
      }
      console.log(this._users);
  }
  private _users: Array<UserProfileWithRegistration>;
  @Output() userSelected: EventEmitter<UserProfileWithRegistration>;
  @ViewChild(MatTable) table: MatTable<UserProfileWithRegistration>;
  userColumnsToDisplay: Array<string>;

  constructor() {  
    this.init = false;
    this.columnsToDisplay = [
      'online',
      'username',
      'fullname',
      'email',
      'process',
      'status',
      'action'
    ];
    this.summaries = new Array<UserRegistrationSummary>();
    this.users = new Array<UserProfileWithRegistration>();
    this.userColumnsToDisplay = [
        'online',
        'username',
        'fullname',
        'email',
        'action'
    ];
    this.userSelected = new EventEmitter<UserProfileWithRegistration>();
  }

  ngOnInit(){
    this.init = true;
  }

  parseStatus(status: string): string{
      switch(status){
          case 'incomplete': return 'Incomplete';
          case 'inprogress': return 'In Progress';
          case 'complete': return 'Complete';
      }
  }
}