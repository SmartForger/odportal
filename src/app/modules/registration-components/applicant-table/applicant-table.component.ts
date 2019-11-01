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
  @Output() userSelected: EventEmitter<UserProfileWithRegistration>;
  @ViewChild(MatTable) table: MatTable<UserProfileWithRegistration>;

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