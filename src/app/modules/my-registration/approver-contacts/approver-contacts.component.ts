import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Approval, RegistrationSection, Form, ApproverContact, FormStatus } from 'src/app/models/form.model';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-approver-contacts',
  templateUrl: './approver-contacts.component.html',
  styleUrls: ['./approver-contacts.component.scss']
})
export class ApproverContactsComponent implements OnInit {

  @Input('data') 
  get data(): Form{
    return this._data;
  }
  set data(data: Form){
    this._data = data;
    this.approvalsWithTitles = new Array<{section: string, approval: Approval}>();
    this.data.layout.sections.forEach((section: RegistrationSection) => {
      if(section.approval && section.approval.applicantDefined){
        this.buildApplicantDefinedApproval(section);
      }
    });
  }
  private _data: Form;

  errors: boolean;
  form: FormGroup;
  approvalsWithTitles: Array<{section: string, approval: Approval}>;

  constructor(private cdr: ChangeDetectorRef) { 
    this.errors = false;
    this.form = new FormGroup({ });
    this.approvalsWithTitles = new Array<{section: string, approval: Approval}>();
  }

  ngOnInit() {
  }

  getApproverContacts(): Array<ApproverContact>{
    let contact = new Array<ApproverContact>();
    this.approvalsWithTitles.forEach((awt: {section: string, approval: Approval}) => {
      contact.push({section: awt.section, email: this.form.controls[this.generateControlName(awt.section)].value});
    });
    return contact;
  }

  validate(): boolean{
    this.errors = false;
    this.approvalsWithTitles.forEach((awt: {section: string, approval: Approval}) => {
      let name = this.generateControlName(awt.section);
      if(!this.form.controls[name].valid){
        this.errors = true;
        this.form.controls[name].markAsTouched();
      }
    });

    if(this.errors){
      this.cdr.detectChanges();
    }

    return !this.errors;
  }

  private buildApplicantDefinedApproval(section: RegistrationSection){
    this.approvalsWithTitles.push({section: section.title, approval: section.approval});
    let validators = new Array<ValidatorFn>();
    validators.push(Validators.required);
    if(section.approval.regex){
        // validators.push(Validators.pattern(RegExp(decodeURIComponent(section.approval.regex), 'i')));
        validators.push(Validators.pattern(decodeURIComponent(section.approval.regex)));
    }
    this.form.addControl(
      this.generateControlName(section.title),
      new FormControl(
        {
          value: (section.approval.email ? section.approval.email : ''),
          disabled: this.data.status !== FormStatus.Incomplete
        },
        validators
      )
    );
  }

  private generateControlName(sectionTitle: string): string{
    return sectionTitle.replace(/\s/g, '').toLowerCase();
  }

}
