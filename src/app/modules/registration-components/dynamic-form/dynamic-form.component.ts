import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { Form, RegistrationRow, RegistrationColumn, FormField, AutoFillType, Approval, RegistrationSection, FormStatus, ApprovalStatus, UploadedFile } from '../../../models/form.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserSignature } from 'src/app/models/user-signature.model';
import { RegistrationFilesService } from 'src/app/services/registration-files.service';
import { UrlGenerator } from 'src/app/util/url-generator';
import * as moment from 'moment';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {
  @Input() allowUnroutedApprovals: boolean;
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
  forms: Map<string, FormGroup>;
  submissionInProgress: boolean;
  filesToUpload: Array<File>;

  constructor(private authSvc: AuthService, private fileSvc: RegistrationFilesService, private cdr: ChangeDetectorRef) {
    this.init = false;
    this.regId = '';
    this.data = null;
    this.bindingRegistry = { };
    this.allowUnroutedApprovals = true;
    this.sectionSubmitted = new EventEmitter<RegistrationSection>();
    this.applicantSections = new Array<RegistrationSection>();
    this.approverSections = new Array<RegistrationSection>();
    this.applicantDefinedApprovals = new Array<Approval>();
    this.forms = new Map<string, FormGroup>();
    this.submissionInProgress = false;
  }

  ngOnInit() { }

  onSubmit(section: RegistrationSection) {
    this.submissionInProgress = true;
    let errors = false;
    section.rows.forEach((row: RegistrationRow) => {
      row.columns.forEach((col: RegistrationColumn) => {
        if(this.forms.get(section.title).controls[col.field.binding]){
          if(!this.forms.get(section.title).controls[col.field.binding].valid){
            errors = true;
            this.forms.get(section.title).controls[col.field.binding].markAsTouched();
          }
        }
        else if(col.field.type === 'signature'){
          if(!col.field.value){
            errors = true;
            col.field['invalid'] = true;
          }
          else if(col.field['invalid']){
            col.field['invalid'] = false;
          }
          console.log(col.field);
        }
      });
    });

    if(!errors){
      
      if(this.filesToUpload.length > 0){
        let formData = new FormData();
        this.filesToUpload.forEach((file: File) => {
          formData.append('uploadedFiles[]', file);
        });
        this.fileSvc.uploadFiles(this.regId, this.data.docId, formData).subscribe((form: Form) => {
          this.filesToUpload = new Array<File>();
          this.sectionSubmitted.emit(this.updateModel(section));
        });
      }
      else{
        this.sectionSubmitted.emit(this.updateModel(section));
      }
    }
    else{
      this.cdr.detectChanges();
    }
  }

  onSign(field: FormField, sig: UserSignature): void {
    field.value = sig.userId;
  }

  getUserId(): string{
    return this.authSvc.userState.userId;
  }

  getApplicantClassList(section: RegistrationSection): string{
    if(this.displayApprovals){
      if(this.data.status === FormStatus.Incomplete){
        return 'section-dead';
      }
      else{
        return 'section-submitted';
      }
    }
    else{
      if(this.data.status === FormStatus.Incomplete){
        return '';
      }
      else{
        return 'section-submitted';
      }
    }
  }

  getApproverClassList(section: RegistrationSection): string{
    if(section.approval.status === ApprovalStatus.Complete){
      return 'section-submitted';
    }
    else if(this.isSectionApprover(section.approval)){
      return 'section-live'
    }
    else{
      return 'section-dead';
    }
  }

  onFileChange(ev: any): void{
    if(ev.target.files[0] && ev.target.files[0].name !== ''){
      this.filesToUpload.push(ev.target.files[0]);
    }
  }

  removeFileToUpload(index: number): void{
    this.filesToUpload.splice(index, 1);
  }

  openFile(filename: string): string{
    return UrlGenerator.generateRegistrationFileUrl(this.authSvc.globalConfig.registrationServiceConnection, filename);
  }

  private buildSections(){
    this.forms = new Map<string, FormGroup>();
    this.filesToUpload = new Array<File>();
    this.applicantSections = new Array<RegistrationSection>();
    this.approverSections = new Array<RegistrationSection>();
    this.data.layout.sections.forEach((section: RegistrationSection) => {
      if(!section.hidden){
        this.forms.set(section.title, new FormGroup({ }));
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
          this.forms.get(section.title).addControl(
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
      /*
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
      */
     hasAccess = this.allowUnroutedApprovals;
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
        initialState = field.value ? moment(field.value) : moment();

        if(field.autofill.value){
          initialState = initialState.format(field.autofill.value)
        }
      }
      else if(field.autofill.type === AutoFillType.Bind){
        initialState = this.bindingRegistry[field.binding];
      }
    }

    return initialState;
  }

  private updateModel(section: RegistrationSection): RegistrationSection{
    let temp: RegistrationSection = JSON.parse(JSON.stringify(section));
    temp.rows.forEach((row: RegistrationRow) => {
      row.columns.forEach((column: RegistrationColumn) => {
        if(this.forms.get(section.title).controls[column.field.binding]){
          column.field.value = this.forms.get(section.title).controls[column.field.binding].value;
        }
      });
    });
    return temp;
  }
}
