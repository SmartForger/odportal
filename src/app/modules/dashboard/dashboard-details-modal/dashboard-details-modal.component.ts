import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-dashboard-details-modal',
  templateUrl: './dashboard-details-modal.component.html',
  styleUrls: ['./dashboard-details-modal.component.scss']
})
export class DashboardDetailsModalComponent implements OnInit {
  dashDetailsForm: FormGroup;
  dashTitle: string;
  dashDescription: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
    if(data.title){this.dashTitle = data.title}
    else{this.dashTitle = ''}

    if(data.description){this.dashDescription = data.description}
    else{this.dashDescription = ''}
  }

  ngOnInit() {
    this.dashDetailsForm = this.fb.group({
      title: this.dashTitle,
      description: this.dashDescription
    });
  }

}
