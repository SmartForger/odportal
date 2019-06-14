import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { Form, RegistrationRow, RegistrationColumn, FormField, AutoFillType, Approval, RegistrationSection, FormStatus, ApprovalStatus, UploadedFile } from '../../../models/form.model';
import { UserRegistrationService } from 'src/app/services/user-registration.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserSignature } from 'src/app/models/user-signature.model';
import { RegistrationFilesService } from 'src/app/services/registration-files.service';

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
    this.init = false;
    this._data = data;
    if(this.data){
      this.buildSections();
    }
  }
  private _data: Form;

  @Output() sectionSubmitted: EventEmitter<RegistrationSection>;

  init: boolean;
  applicantSections: Array<RegistrationSection>;
  approverSections:  Array<RegistrationSection>;
  applicantDefinedApprovals: Array<Approval>;
  form: FormGroup;
  submissionInProgress: boolean;
  filesToUpload: Array<File>;

  constructor(private authSvc: AuthService, private fileSvc: RegistrationFilesService) {
    this.init = false;
    this.regId = '';
    this.data = null;
    this.bindingRegistry = { };
    this.sectionSubmitted = new EventEmitter<RegistrationSection>();
    this.applicantSections = new Array<RegistrationSection>();
    this.approverSections = new Array<RegistrationSection>();
    this.applicantDefinedApprovals = new Array<Approval>();
    this.form = new FormGroup({ });
    this.submissionInProgress = false;
  }

  ngOnInit() { }

  onSubmit(section: RegistrationSection) {
    if(this.filesToUpload.length > 0){
      let formData = new FormData();
      this.filesToUpload.forEach((file: File) => {
        formData.append('uploadedFiles[]', file);
      });
      this.fileSvc.uploadFiles(this.regId, this.data.docId, formData).subscribe((response: any) => {
        console.log(`File Response`);
        console.log(response);
      });
    }

    this.submissionInProgress = true;
    let errors = false;
    section.rows.forEach((row: RegistrationRow) => {
      row.columns.forEach((col: RegistrationColumn) => {
        if(this.form.controls[col.field.binding]){
          if(!this.form.controls[col.field.binding].valid){
            errors = true;
          }
        }
      });
    });
    this.sectionSubmitted.emit(this.updateModel(section));
  }

  onSign(field: FormField, sig: UserSignature): void {
    field.value = sig.userId;
  }

  getUserId(): string{
    return this.authSvc.userState.userId;
  }

  onFileChange(ev: any): void{
    console.log(ev);
    this.filesToUpload.push(ev.target.files[0]);
  }

  getApplicantClassList(section: RegistrationSection): string{
    return `section ${(this.displayApprovals || this.data.status !== FormStatus.Incomplete) ? 'section-dead' : 'section-live'}`;
  }

  getApproverClassList(section: RegistrationSection): string{
    return `section ${(this.isSectionApprover(section.approval) && section.approval.status === ApprovalStatus.Incomplete) ? 'section-live' : 'section-dead'}`
  }

  removeFileToUpload(index: number){
    this.filesToUpload.splice(index, 1);
  }

  private buildSections(){
    this.form = new FormGroup({ });
    this.filesToUpload = new Array<File>();
    this.applicantSections = new Array<RegistrationSection>();
    this.approverSections = new Array<RegistrationSection>();
    this.data.layout.sections.forEach((section: RegistrationSection) => {
      if(!section.hidden){
        if(section.approval){
          if(this.displayApprovals){
            this.approverSections.push(section);
            this.buildFormControls(section, () => {return section.approval.status === ApprovalStatus.Complete || !this.isSectionApprover(section.approval)})
          }
        }
        else{
          this.applicantSections.push(section);
          this.buildFormControls(section, () => {return this.displayApprovals || this.data.status !== FormStatus.Incomplete});
        }
      }
    });
    this.init = true;
  }

  private buildFormControls(section: RegistrationSection, disabledCondition: Function){
    section.rows.forEach((row: RegistrationRow) => {
      row.columns.forEach((column: RegistrationColumn) => {
        if(column.field.type === 'signature' || column.field.type === 'description' || column.field.type === 'file'){
          
        }
        else{
          this.form.addControl(
            column.field.binding,
            new FormControl(
              {
                value: (column.field.value ? column.field.value : this.buildAutofill(column.field)),
                disabled: disabledCondition()
              }, 
              this.buildValidators(column.field)
            )
          );
        }
      })
    });
  }

  private isSectionApprover(approval: Approval): boolean{
    let hasAccess = false;
    if(approval.email === this.authSvc.userState.userProfile.email){
      hasAccess = true;
    }
    else{
      //Find out if the user has a role that lets them modify the section.
      let roleIndex = 0;
      if(approval.roles){
        while(!hasAccess && roleIndex < approval.roles.length){
          if(this.authSvc.hasRealmRole(approval.roles[roleIndex])){
            hasAccess = true;
          }
          else{
            roleIndex++;
          }
        }
      }
    }
    return hasAccess;
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

  private updateModel(section: RegistrationSection): RegistrationSection{
    let temp: RegistrationSection = JSON.parse(JSON.stringify(section));
    temp.rows.forEach((row: RegistrationRow) => {
      row.columns.forEach((column: RegistrationColumn) => {
        if(this.form.controls[column.field.binding]){
          column.field.value = this.form.controls[column.field.binding].value;
        }
      });
    });
    return temp;
  }
}
