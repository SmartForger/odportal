import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormStatus, ApprovalStatus, Approval, Form, RegistrationSection } from 'src/app/models/form.model';

@Component({
  selector: 'app-form-card',
  templateUrl: './form-card.component.html',
  styleUrls: ['./form-card.component.scss']
})
export class FormCardComponent implements OnInit {

  @Input() 
  get forms(): Array<Form>{
    return this._forms;
  }
  set forms(forms: Array<Form>){
    this._forms = forms;
    this.generateHasApprovals();
  }
  private _forms: Array<Form>;
  @Input() formIndex: number;
  @Output() formSelected: EventEmitter<number>;
  hasApprovals: Array<boolean>;

  constructor() { 
    this.forms = new Array<Form>();
    this.formSelected = new EventEmitter<number>();
    this.hasApprovals = new Array<boolean>();
  }

  ngOnInit() {
  }

  getBgColor(status: FormStatus | ApprovalStatus): string{
    switch(status){
      case ApprovalStatus.Complete:
      case FormStatus.Complete: return 'bg-green'
      case FormStatus.Submitted: return 'bg-yellow'
      case ApprovalStatus.Incomplete:
      case FormStatus.Incomplete: 
      default: return 'bg-gray'
    }
  }

  getIcon(status: FormStatus): string{
    switch(status){
      case FormStatus.Complete: return 'check'
      case FormStatus.Submitted: return 'edit'
      case FormStatus.Incomplete: return 'assignment'
    }
  }

  getStatusAsString(status: ApprovalStatus): string{
    switch(status){
      case ApprovalStatus.Complete: return 'Complete'
      case ApprovalStatus.Incomplete: 
      default: return 'Incomplete'
    }
  }

  private generateHasApprovals(): void{
    this.forms.forEach((form: Form) => {
      console.log();
      console.log(`*********** FORM ${form.title} ***************`)
      let hasApprovals = false;
      let sectionIndex = 0;
      while(!hasApprovals && sectionIndex < form.layout.sections.length){
        console.log(form.layout.sections[sectionIndex]);
        if(form.layout.sections[sectionIndex].approval){
          console.log(`section has approval`);
          hasApprovals = true;
        }
        sectionIndex++;
      }
      if(!hasApprovals){console.log(`section DOES NOT have approval`);}
      this.hasApprovals.push(hasApprovals);
    })

    
  }
}
