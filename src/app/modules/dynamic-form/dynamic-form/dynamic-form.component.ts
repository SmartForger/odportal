import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { Form, RegistrationRow, RegistrationColumn, FormField, AutoFillType, Approval, RegistrationSection } from '../../../models/form.model';
import { UserRegistrationService } from 'src/app/services/user-registration.service';
import { AuthService } from 'src/app/services/auth.service';
import * as uuid from 'uuid';
import { UserSignature } from 'src/app/models/user-signature.model';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {
  @Input() regId: string;
  @Input('data') 
  get data(): Form{
    return this._data;
  }
  set data(data: Form){
    this.userSections = new Array<RegistrationSection>();
    this.approverSections = new Array<RegistrationSection>();
    this.restrictedSections = new Set<string>();
    this.init = false;
    this._data = data;
    this.submissionInProgress = false;
    if(data){
      this.buildSections();
      this.userSections.forEach((section: RegistrationSection) => {this.addSectionFieldsToFormGroup(section)});
      this.approverSections.forEach((section: RegistrationSection) => {this.addSectionFieldsToFormGroup(section)});
      this.init = true;
    }
  }
  _data: Form;
  @Input() bindingRegistry: any;

  @Output() formSubmitted: EventEmitter<Form>;

  init: boolean;
  userSections: Array<RegistrationSection>;
  approverSections:  Array<RegistrationSection>;
  restrictedSections: Set<string>;
  form: FormGroup;
  approverEmails: FormGroup;
  isApprover: boolean;
  submissionInProgress: boolean;

  constructor(private authSvc: AuthService, private userRegSvc: UserRegistrationService) {
    this.init = false;
    this.regId = '';
    this.data = null;
    this.bindingRegistry = { };
    this.formSubmitted = new EventEmitter<Form>();
    this.userSections = new Array<RegistrationSection>();
    this.approverSections = new Array<RegistrationSection>();
    this.restrictedSections = new Set<string>();
    this.form = new FormGroup({ });
    this.approverEmails = new FormGroup({ });
    this.isApprover = false;
    this.submissionInProgress = false;
  }

  ngOnInit() {  }

  onSubmit() {
    this.submissionInProgress = true;
    this.formSubmitted.emit(this.updateModel());
  }

  onSign(field: FormField, sig: UserSignature): void {
    field.value = sig.userId;
    console.log(this.data);
  }

  private buildSections(){
    let approverSectionTitles: Set<string> = new Set();
    this.data.approvals.forEach((approval: Approval) => {
      let hasRole = false;
      let roleIndex = 0;
      while(!hasRole && roleIndex < approval.roles.length){
        if(this.authSvc.hasRealmRole(approval.roles[roleIndex])){
          hasRole = true;
        }
        else{
          roleIndex++;
        }
      }

      if(!hasRole){
        approval.sections.forEach((s: string) => {
          this.restrictedSections.add(s);
        });
      }
      else{
        approval.sections.forEach((s: string) => {
          approverSectionTitles.add(s);
        });
      }
    });

    this.data.layout.sections.forEach((section: RegistrationSection) => {
      if(!this.restrictedSections.has(section.title)){
        if(approverSectionTitles.has(section.title)){
          this.approverSections.push(section);
        }
        else{
          this.userSections.push(section);
        }
      }
    });

    this.isApprover = approverSectionTitles.size > 0;

    if(!this.isApprover){
      this.data.approvals.forEach((approval: Approval) => {
        if(approval.applicantDefined){
          this.form.addControl(approval.title, new FormControl('', Validators.required));
        }
      });
    }
  }

  private addSectionFieldsToFormGroup(section: RegistrationSection){
    section.rows.forEach((row: RegistrationRow) => {
      row.columns.forEach((column: RegistrationColumn) => {
        if(column.field.binding){
          let name = column.field.binding;
          let initialState = this.buildAutofill(column.field);
          let validators = this.buildValidators(column.field);
  
          this.form.addControl(name, new FormControl(initialState, validators));
        }
      })
    });
  }

  private buildValidators(field: FormField): ValidatorFn[] {
    let validators = [ ];

    if(field.attributes){
      if(field.attributes.required){
        validators.push(Validators.required);
      }

      if(field.type === 'text' || field.type === 'textarea'){
        if(field.attributes.maxlength){
          validators.push(Validators.maxLength(field.attributes.maxlength));
        }

        if(field.attributes.minlength){
          validators.push(Validators.minLength(field.attributes.minlength));
        }
      }
    }

    return validators;
  }

  private buildAutofill(field: FormField): any{
    let initialState = null;


    if(field.autofill){
      if(field.autofill.type === AutoFillType.Static){
        initialState = field.autofill.value;
      }
      else if(field.autofill.type === AutoFillType.Date){
        initialState = (new Date()).toDateString();
      }
      else if(field.autofill.type === AutoFillType.Bind){
        initialState = this.bindingRegistry[field.autofill.value];
      }
    }

    return initialState;
  }

  private updateModel(): Form{
    let temp: Form = JSON.parse(JSON.stringify(this.data));
    console.log('temp start');
    console.log(temp);
    temp.layout.sections.forEach((section: RegistrationSection) => {
      section.rows.forEach((row: RegistrationRow) => {
        row.columns.forEach((column: RegistrationColumn) => {
          if(this.form.controls[column.field.binding]){
            column.field.value = this.form.controls[column.field.binding].value;
          }
        });
      });
    });

    if(!this.isApprover){
      temp.approvals.forEach((approval: Approval) => {
        if(this.form.controls[approval.title]){
          approval.email = this.form.controls[approval.title].value;
        }
      });
    }
    
    console.log('temp end');
    console.log(temp);
    return temp;
  }
}
