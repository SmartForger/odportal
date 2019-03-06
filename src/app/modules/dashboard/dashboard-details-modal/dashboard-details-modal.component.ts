import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-dashboard-details-modal',
  templateUrl: './dashboard-details-modal.component.html',
  styleUrls: ['./dashboard-details-modal.component.scss']
})
export class DashboardDetailsModalComponent implements OnInit {
  dashDetailsForm: FormGroup;
  @Input() dashTitle: string;
  @Input() dashDescription: string;
  @Output() details: EventEmitter<any>;

  private _show: boolean;
  get show(): boolean {
    return this._show;
  }
  set show(show: boolean) {
    this._show = show;
    this.dashDetailsForm.setValue({
      title: this.dashTitle,
      description: this.dashDescription
    })
  }

  constructor(private fb: FormBuilder) {
    this.details = new EventEmitter<any>();
  }

  ngOnInit() {
    this.dashDetailsForm = this.fb.group({
      title: this.dashTitle,
      description: this.dashDescription
    });
  }

  onSubmit(){
    this.details.emit(this.dashDetailsForm.value);
    this.show = false;
  }

}
