import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Form, RegistrationRow, RegistrationColumn, FormField, AutoFillType, Approval, RegistrationSection, FormStatus, ApprovalStatus, UploadedFile } from '../../../models/form.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserSignature } from 'src/app/models/user-signature.model';
import { RegistrationFilesService } from 'src/app/services/registration-files.service';
import { UrlGenerator } from 'src/app/util/url-generator';
import { HttpClient } from '@angular/common/http';
import { UserProfile } from 'src/app/models/user-profile.model';
import { MatDialog, MatDialogRef } from '@angular/material';
import { PlatformModalComponent } from '../../display-elements/platform-modal/platform-modal.component';
import { PlatformModalType } from 'src/app/models/platform-modal.model';
import { UserRegistrationService } from 'src/app/services/user-registration.service';
import { FileUtils } from 'src/app/util/file-utils';
import { RegistrationApprovalStatus } from 'src/app/models/user-registration.model';
import * as moment from 'moment';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {
  @Input() allowUnroutedApprovals: boolean;
  @Input() bindingRegistry: any;
  @Input() displayApprovals: boolean;
  @Input() displayProgressBlock: boolean;
  @Input() regId: string;
  @Input() regApprovalStatus: RegistrationApprovalStatus;
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
  @Output() sectionUnsubmitted: EventEmitter<RegistrationSection>;

  @ViewChild('filePicker') filePicker: ElementRef;
  @ViewChild('physicalReplacementInput') physicalReplacementEl: ElementRef;

  applicantSections: Array<RegistrationSection>;
  approverSections:  Array<RegistrationSection>;
  applicantDefinedApprovals: Array<Approval>;
  filesToUpload: Map<FormField, File>;
  forms: Map<string, FormGroup>;
  hasApprovalSections: boolean;
  init: boolean;
  submissionInProgress: boolean;

  constructor(
    private authSvc: AuthService,
    private cdr: ChangeDetectorRef, 
    private dialog: MatDialog,
    private fileSvc: RegistrationFilesService, 
    private http: HttpClient,
    private userRegSvc: UserRegistrationService
  ) {
    this.allowUnroutedApprovals = true;
    this.applicantDefinedApprovals = new Array<Approval>();
    this.applicantSections = new Array<RegistrationSection>();
    this.approverSections = new Array<RegistrationSection>();
    this.bindingRegistry = { };
    this.data = null;
    this.displayProgressBlock = true;
    this.forms = new Map<string, FormGroup>();
    this.hasApprovalSections = false;
    this.init = false;
    this.regId = '';
    this.sectionSubmitted = new EventEmitter<RegistrationSection>();
    this.sectionUnsubmitted = new EventEmitter<RegistrationSection>();
    this.submissionInProgress = false;
  }

  ngOnInit() { }

  displayPhysicalReplacementDialog(): void{
    this.physicalReplacementEl.nativeElement.click();
  }

  fileInputFieldValue(field: FormField): string{
    if(field.value){
      return `${FileUtils.isolateFilenameFromExtension(field.value)} (${FileUtils.getFiletypeFromMime(field.value)} ${FileUtils.getFilesizeString(field.value)})`;
    }
    else if(this.filesToUpload.has(field)){
      let file: File = this.filesToUpload.get(field);
      return `${FileUtils.isolateFilenameFromExtension(file)} (${FileUtils.getFiletypeFromMime(file)} ${FileUtils.getFilesizeString(file)})`;
    }
    else{
      return '';
    }
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

  getPhysicalReplacementLink(): string{
    // return UrlGenerator.generateRegistrationFileUrl(this.authSvc.globalConfig.registrationServiceConnection, this.data.allowPhysicalUpload);
    return '';
  }
  
  getUserId(): string{
    return this.authSvc.userState.userId;
  }

  isInvalidReadonly(field: FormField, sectionTitle: string): boolean{
    return field.hasOwnProperty('attributes') && 
           field.hasOwnProperty('binding') &&
           field.attributes.readonly && 
           field.attributes.enforceValidReadonly && 
           this.forms.get(sectionTitle).controls[field.binding].touched &&
           !this.forms.get(sectionTitle).controls[field.binding].valid;
  }

  isSectionApprover(approval: Approval): boolean{
    let hasAccess = false;
    if(this.authSvc.userState.userProfile.email && approval.email === this.authSvc.userState.userProfile.email){
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

  onFileClick(field: FormField){
      this.filePicker.nativeElement.onchange = (ev: any) => {
        if(ev.target.files[0] && ev.target.files[0].name !== ''){
          this.filesToUpload.set(field, ev.target.files[0]);
        }
        this.filePicker.nativeElement.onchange = null;
      };

      this.filePicker.nativeElement.click();
  }

  onSign(field: FormField, sig: UserSignature): void {
    field.value = sig.userId;
  }

  onSubmit(section: RegistrationSection) {
    this.submissionInProgress = true;
    let errors = false;
    section.rows.forEach((row: RegistrationRow) => {
      row.columns.forEach((col: RegistrationColumn) => {
        if(this.forms.get(section.title).controls[col.field.binding]){
          let control: AbstractControl = this.forms.get(section.title).controls[col.field.binding];
          if(col.field.attributes.readonly){
            if(col.field.attributes.enforceValidReadonly){
              control.enable();
              control.updateValueAndValidity();
              if(!control.valid){
                errors = true;
                control.markAsTouched();
              }
              control.disable();
            }
          }
          else if(!control.valid){
            errors = true;
            control.markAsTouched();
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
        }
      });
    });

    if(!errors){
       /*********************************************
        * HARDCODED TIE IN FOR CERTIFICATIONS
        *********************************************/
       if(this.data.docId === 'pcte-certification'){
        let temp: RegistrationSection = JSON.parse(JSON.stringify(section));
        let dateIssued = this.forms.get(temp.title).controls[temp.rows[0].columns[0].field.binding].value;
        let start = moment(dateIssued, 'YYYY/MM/DD');
        let lifespan = 1;
        let dateExpired = start.add(1, 'y').toString();
        if(this.authSvc.globalConfig.certificationsServiceConnection){
            this.authSvc.getUserProfile()
            .then((userProfile: UserProfile) => {
                this.http.post(
                    `${this.authSvc.globalConfig.certificationsServiceConnection}api/v1/my-certs/realm/${this.authSvc.globalConfig.realm}/${this.authSvc.getUserId()}/certification`,
                    {
                    certDoc: '',
                    certId: 'f15add3a-eef9-4cad-9260-859cfe17397e',
                    endDate: dateExpired,
                    issuedDate: dateIssued,
                    lifespan: lifespan,
                    providerId: "699dad14-ef15-44c0-9eb3-805f5a655323",
                    userId: this.authSvc.getUserId(),
                    userProfile: userProfile
                    },
                    {
                    headers: this.authSvc.getAuthorizationHeader()
                    }
                ).subscribe();
            });
        }
      }
      //END HARDCODE

      if(this.filesToUpload.size > 0){
        let i = 1;
        this.filesToUpload.forEach(async (file: File, field: FormField) => {
          let formData = new FormData();
          formData.append('uploadedFile', file);
          let uploadedFile: UploadedFile = await this.fileSvc.uploadFile(this.regId, this.data.docId, formData).toPromise();
          field.value = uploadedFile;
          if(i < this.filesToUpload.size){
            i++;
          }
          else{
            this.sectionSubmitted.emit(this.updateModel(section));
          }
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

  onUnsubmit(section: RegistrationSection) {
    let dialogRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
      data: {
        type: PlatformModalType.SECONDARY,
        title: "Revoke Form Section",
        subtitle: "Are you sure you want to revoke this section of the form? This will reset your approval process and might delay your registration.",
        submitButtonTitle: "Revoke",
        submitButtonClass: "bg-red",
        formFields: [
          {
            type: "static",
            label: "Form Title",
            defaultValue: this.data.title
          }
        ]
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if(data){
        this.submissionInProgress = true;
        this.sectionUnsubmitted.emit(section);
      }
    });
  }

  openFile(filename: string): string{
    return UrlGenerator.generateRegistrationFileUrl(this.authSvc.globalConfig.registrationServiceConnection, filename);
  }

  removeFileToUpload(field: FormField): void{
    if(this.filesToUpload.has(field)){
      this.filesToUpload.delete(field);
    }
  }

  uploadPhysicalReplacement(event: any): void{
    let fileList: FileList = event.target.files;
    let file: File = fileList.item(0);
    this.userRegSvc.uploadPhysicalReplacement(this.authSvc.userState.userId, this.regId, this.data.docId, file).subscribe((result) => {});
  }
  
  private buildAutofill(field: FormField): any{
    let initialState = null;

    if(field.autofill){
      if(field.autofill.type === AutoFillType.Static){
        initialState = field.autofill.value;
      }
      else if(field.autofill.type === AutoFillType.Date){
        initialState = field.value ? moment(field.value) : moment();
        if(field.attributes && field.attributes.format){
          initialState = initialState.format(field.attributes.format);
        }
      }
      else if(field.autofill.type === AutoFillType.Bind){
        initialState = this.bindingRegistry[field.binding];
      }
    }

    return initialState;
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

        if(field.attributes.regex){
          validators.push(Validators.pattern(decodeURIComponent(field.attributes.regex)));
        }
      }
    }

    return validators;
  }
  
  private buildFormControls(section: RegistrationSection, disabledCondition: Function){
    section.rows.forEach((row: RegistrationRow) => {
      row.columns.forEach((column: RegistrationColumn) => {
        if(column.field.type === 'signature' || column.field.type === 'description' || column.field.type === 'file'){
          
        }
        else{
          if(!column.field.attributes){column.field.attributes = { };}
          this.forms.get(section.title).addControl(
            column.field.binding,
            new FormControl(
              {
                value: (column.field.value ? column.field.value : this.buildAutofill(column.field)),
                disabled: disabledCondition() || column.field.attributes.readonly
              }, 
              this.buildValidators(column.field)
            )
          );
        }
      })
    });
  }

  private buildSections(){
    this.forms = new Map<string, FormGroup>();
    this.filesToUpload = new Map<FormField, File>();
    this.applicantSections = new Array<RegistrationSection>();
    this.approverSections = new Array<RegistrationSection>();
    this.data.layout.sections.forEach((section: RegistrationSection) => {
      if(!section.hidden){
        this.forms.set(section.title, new FormGroup({ }));
        if(section.approval){
          this.hasApprovalSections = true;
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
