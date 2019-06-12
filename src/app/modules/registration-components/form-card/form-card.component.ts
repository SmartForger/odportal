import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Form } from '@angular/forms';
import { FormStatus } from 'src/app/models/form.model';

@Component({
  selector: 'app-form-card',
  templateUrl: './form-card.component.html',
  styleUrls: ['./form-card.component.scss']
})
export class FormCardComponent implements OnInit {

  @Input() forms: Array<Form>;
  @Input() formIndex: number;
  @Output() formSelected: EventEmitter<number>;

  constructor() { 
    this.forms = new Array<Form>();
    this.formSelected = new EventEmitter<number>();
  }

  ngOnInit() {
  }

  getBgColor(status: FormStatus): string{
    switch(status){
      case FormStatus.Complete: return 'bg-green'
      case FormStatus.Submitted: return 'bg-yellow'
      case FormStatus.Incomplete: return 'bg-gray'
    }
  }

  getIcon(status: FormStatus): string{
    switch(status){
      case FormStatus.Complete: return 'check'
      case FormStatus.Submitted: return 'edit'
      case FormStatus.Incomplete: return 'assignment'
    }
  }
}
