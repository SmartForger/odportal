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
  @Input() displayApprovals: boolean;
  @Input() regId: string;
  @Input() bindingRegistry: any;
  @Input('data') 
  get data(): Form{
    return this._data;
  }
  set data(data: Form){
    this._data = data;
    this.initialize();
  }
  private _data: Form;

  @Output() formSubmitted: EventEmitter<Form>;

  init: boolean;
  applicantSections: Array<RegistrationSection>;
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
    this.applicantSections = new Array<RegistrationSection>();
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
  }

  getUserId(): string{
    return this.authSvc.userState.userId;
  }

  applicantDefinedApprovals(): Array<Approval>{
    return this.data.approvals.filter((a: Approval) => a.applicantDefined);
  }

  private initialize(): void{
    //Reset all necessary fields.
    this.applicantSections = new Array<RegistrationSection>();
    this.approverSections = new Array<RegistrationSection>();
    this.restrictedSections = new Set<string>();
    this.init = false;
    this.submissionInProgress = false;

    //Ensure data is not null.
    if(this.data){
      //Build out the arrays of form sections.
      this.buildSections();

      //Create FormControls for the applicants sections.
      this.applicantSections.forEach((section: RegistrationSection) => {
        this.addSectionFieldsToFormGroup(
          section, 
          () => {return (this.displayApprovals || this.data.status !== 'incomplete')} //Disable if the user is an approver, or if the form is submitted.
        )
      });

      //Create FormControls for the approver sections.
      this.approverSections.forEach((section: RegistrationSection) => {
        this.addSectionFieldsToFormGroup(
          section, 
          () => {return this.restrictedSections.has(section.title)} //Disable if the section was sorted into the restricted set during buildSections.
        )
      });

      //Create FormControls for the user input approvals.
      this.data.approvals.forEach((approval: Approval) => {
        this.form.addControl(
          approval.title, 
          new FormControl(
            {
              value: (approval.email ? approval.email : ''), 
              disabled: (this.displayApprovals || this.data.status !== 'incomplete')
            }, 
            Validators.required
          )
        )
      });

      //Good to go.
      this.init = true;
    }
  }

  private buildSections(){
    let restrictedSectionTitles = new Set<string>();
    if(!this.displayApprovals){
      this.data.approvals.forEach((approval: Approval) => {

        //Build a control for entering approver contact info.
        if(approval.applicantDefined){
          this.form.addControl(approval.title, new FormControl((approval.email ? approval.email : ''), Validators.required));
        }

        //Restrict the associated sections.
        approval.sections.forEach((sectionTitle: string) => {
          restrictedSectionTitles.add(sectionTitle);
        });
      });
  
      //Build an array of all non restricted sections.
      this.data.layout.sections.forEach((section: RegistrationSection) => {
        if(!restrictedSectionTitles.has(section.title)){
          this.applicantSections.push(section);
        }
      });
    }
    else{
      let approverSectionTitles = new Set<string>();

      this.data.approvals.forEach((approval: Approval) => {
        let hasAccess = false;
        if(approval.email = this.authSvc.userState.userProfile.email){
          hasAccess = true;
        }
        else{
          //Find out if the user has a role that lets them modify the section.
          let hasRole = false;
          let roleIndex = 0;
          if(approval.roles){
            while(!hasRole && roleIndex < approval.roles.length){
              if(this.authSvc.hasRealmRole(approval.roles[roleIndex])){
                hasRole = true;
              }
              else{
                roleIndex++;
              }
            }
          }
          hasAccess = hasRole;
        }

        //For all sections listed by the approval block...
        approval.sections.forEach((sectionTitle: string) => {
          //Add them to the approver sections array.
          approverSectionTitles.add(sectionTitle);
          //List them as restricted if the current user does not have one of the necessary roels.
          if(!hasAccess){
            this.restrictedSections.add(sectionTitle);
          }
        });
      });

      //Sort all sections into either the approver or user arrays.
      this.data.layout.sections.forEach((section: RegistrationSection) => {
        if(approverSectionTitles.has(section.title)){
          this.approverSections.push(section);
        }
        else{
          this.applicantSections.push(section);
        }
      });
    }
  }

  private addSectionFieldsToFormGroup(section: RegistrationSection, disabledCondition: Function){
    section.rows.forEach((row: RegistrationRow) => {
      row.columns.forEach((column: RegistrationColumn) => {
        if(column.field.type !== 'signature' && column.field.type !== 'description'){
          let name = column.field.binding;
          let initialState = this.buildAutofill(column.field);
          let validators = this.buildValidators(column.field);
  
          this.form.addControl(
            name,
            new FormControl(
              {
                value: (column.field.value ? column.field.value : initialState),
                disabled: disabledCondition()
              }, 
              validators
            )
          );
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
        initialState = (new Date()).toUTCString();
      }
      else if(field.autofill.type === AutoFillType.Bind){
        initialState = this.bindingRegistry[field.autofill.value];
      }
    }

    return initialState;
  }

  private updateModel(): Form{
    let temp: Form = JSON.parse(JSON.stringify(this.data));
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
    return temp;
  }
}
