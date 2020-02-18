import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef, ViewChildren, QueryList } from '@angular/core';
import { UserRegistrationService } from 'src/app/services/user-registration.service';
import { UserRegistration, RegistrationStatus } from 'src/app/models/user-registration.model';
import { AuthService } from 'src/app/services/auth.service';
import { StepStatus } from '../../../models/user-registration.model';
import { FormStatus, RegistrationSection } from '../../../models/form.model';
import { MatStepper, MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ApproverContactsComponent } from '../approver-contacts/approver-contacts.component';
import { PlatformFormField } from 'src/app/models/platform-form-field.model';
import { PlatformModalComponent } from '../../display-elements/platform-modal/platform-modal.component';
import { PlatformModalType } from 'src/app/models/platform-modal.model';
import { RegistrationManagerService } from 'src/app/services/registration-manager.service';
import { Validators } from '@angular/forms';
import { ManualSubmissionModalComponent } from '../manual-submission-modal/manual-submission-modal.component';
import { UrlGenerator } from '../../../util/url-generator';

@Component({
    selector: 'app-registration-stepper',
    templateUrl: './registration-stepper.component.html',
    styleUrls: ['./registration-stepper.component.scss']
})
export class RegistrationStepperComponent implements OnInit {
    @Input() activeStepIndex: number;
    @Input() initialFormIndex: number;
    @Input() initialStepIndex: number;
    @Input() userRegistration: UserRegistration;

    @Output() goToOverview: EventEmitter<void>;

    @ViewChildren(ApproverContactsComponent) approverContacts: QueryList<ApproverContactsComponent>;
    @ViewChild('stepper') stepper: MatStepper;

    pdfUrl: string;

    get selectedFormIndex(): number{return this._selectedFormIndex;}
    private _selectedFormIndex: number;

    get selectedStepIndex(): number{return this._selectedStepIndex;}
    private _selectedStepIndex: number;

    constructor(
        private authSvc: AuthService,
        private cdr: ChangeDetectorRef,
        private dialog: MatDialog,
        private regManagerSvc: RegistrationManagerService,
        private route: ActivatedRoute,
        private router: Router,  
        private userRegSvc: UserRegistrationService
    ) {
        this.initialFormIndex = 0;
        this.initialStepIndex = 0;
        this.goToOverview = new EventEmitter<void>();
    }

    ngOnInit() {
        if(this.userRegistration){
            this.setSelecteStepAndForm(this.initialStepIndex, this.initialFormIndex);
        }
    }

    ngAfterViewInit() {
        if(!this.userRegistration){
            this.userRegSvc.getUserRegistration(this.authSvc.getUserId()).subscribe((ur: UserRegistration) => {
                this.userRegistration = ur;
                this.cdr.detectChanges();
                this.route.queryParamMap.subscribe((params: ParamMap) => {
                    if (params.has('step')) {
                        let stepIndex = Number.parseInt(params.get('step'));
                        let formIndex = params.has('form') ? Number.parseInt(params.get('form')) : this.initialFormIndex;
                        this.setSelecteStepAndForm(stepIndex, formIndex);
                    }
                    else{
                        this.setSelecteStepAndForm(this.initialStepIndex, this.initialFormIndex);
                    }
                });
            });
        }
    }

    getBgColor(status: FormStatus | StepStatus): string {
        switch (status) {
            case StepStatus.Complete:
            case FormStatus.Complete: return 'bg-green'
            case StepStatus.Inprogress:
            case FormStatus.Submitted: return 'bg-yellow'
            case StepStatus.Complete:
            case FormStatus.Incomplete: return 'bg-gray'
        }
    }

    getIcon(status: FormStatus | StepStatus): string {
        switch (status) {
            case StepStatus.Complete:
            case StepStatus.Inprogress:
            case FormStatus.Complete: return 'check'
            case FormStatus.Submitted: return 'edit'
            case StepStatus.Incomplete:
            case FormStatus.Incomplete: return 'assignment'
        }
    }

    // goToOverview() {
    //     this.router.navigateByUrl('/portal/my-registration');
    // }
    onManualSubmission(type: 'download' | 'upload'): void{
        let subRef: MatDialogRef<ManualSubmissionModalComponent> = this.dialog.open(ManualSubmissionModalComponent, {
            data: {
                data: this.userRegistration.steps[this.selectedStepIndex].forms[this.selectedFormIndex],
                type: type
            },
            panelClass: 'manual-submission-dialog-container'
        });

        subRef.afterClosed().subscribe((file: File) => {
            if(file){
                this.userRegSvc.uploadPhysicalReplacement(
                    this.userRegistration.userProfile.id, 
                    this.userRegistration.docId, 
                    this.userRegistration.steps[this.selectedStepIndex].forms[this.selectedFormIndex].docId,
                    file
                ).subscribe((regDoc: UserRegistration) => {
                    this.userRegistration = regDoc;
                });
            }
        });
    }

    onSelectForm(index: number){
        this.setSelecteStepAndForm(this.selectedStepIndex, index);
    }

    onSelectStep(index: number){
        if(index !== this.selectedStepIndex){
            this.setSelecteStepAndForm(index, 0);
        }
    }

    async onSubmit(section: RegistrationSection): Promise<void> {
        if(section.approval){
            const formId = this.userRegistration.steps[this.selectedStepIndex].forms[this.selectedFormIndex].docId;
            this.regManagerSvc.submitSection(this.userRegistration.docId, formId, section).subscribe((ur: UserRegistration) => {
                this.userRegistration = ur;
            });
        }
        else{
            this.userRegSvc.submitSection(
                this.userRegistration.userProfile.id,
                this.userRegistration.docId,
                this.userRegistration.steps[this.stepper.selectedIndex].forms[this.selectedFormIndex].docId,
                section
            ).subscribe(
                async (ur: UserRegistration) => {
                    this.userRegistration = ur;
                    console.log(`stepIndex: ${this.selectedStepIndex}, formIndex: ${this.selectedFormIndex}`);
                    console.log('userReg: ...');
                    console.log(this.userRegistration);
                    let form = this.userRegistration.steps[this.selectedStepIndex].forms[this.selectedFormIndex];
                    let missingApprovals = new Array<RegistrationSection>();
                    form.layout.sections.forEach((section: RegistrationSection) => {
                        if(section.approval && section.approval.status === 'missing'){
                            missingApprovals.push(section);
                        }
                    });

                    if(missingApprovals.length > 0){
                        let fields: Array<PlatformFormField> = [
                            {
                                defaultValue: 'This form requires approval by one or more third party individuals. You will need to provide their contact information so that they can verify your application. You can enter their information below now, or click Cancel and return to this form later to provide their contact information.',
                                fullWidth: true,
                                type: 'static'
                            },
                            {
                                classList: 'bold-400 style-italic',
                                defaultValue: 'Your registration cannot be completed until you provide contact information for your approvers.',
                                fullWidth: true,
                                type: 'static'
                            }
                        ];

                        missingApprovals.forEach((section: RegistrationSection) => {
                            fields.push({
                                defaultValue: '',
                                fullWidth: true,
                                label: section.approval.title,
                                name: section.approval.title,
                                type: 'text-input',
                                validators: [Validators.required]
                            });
                        });

                        let approvalModal: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {data: {
                            type: PlatformModalType.SECONDARY,
                            title: "Missing Approver Contact Information",
                            subtitle: "",
                            submitButtonTitle: "Submit",
                            formFields: fields
                        }});

                        let modalData = await approvalModal.afterClosed().toPromise();
                        if(modalData){
                            console.log('missingApprovals: ...');
                            console.log(missingApprovals);
                            console.log('modalData: ...');
                            console.log(modalData);
                            missingApprovals.forEach((section: RegistrationSection) => {
                                if(modalData[section.approval.title]){
                                    section.approval.email = modalData[section.approval.title];
                                }
                            });
                            console.log('approver contacts');
                            console.log(this.approverContacts);
                            let appContactComp: ApproverContactsComponent = this.approverContacts.toArray()[this.selectedStepIndex];
                            appContactComp.refreshFormValues();
                            appContactComp.onSubmit();
                            await appContactComp.updatedContacts.toPromise();
                            missingApprovals = null;
                        }
                    }
                    
                    if(missingApprovals === null){
                        return;
                    }
                    else if (this.userRegistration.status === RegistrationStatus.Submitted || this.userRegistration.status === RegistrationStatus.Complete) {
                        if (this.userRegistration.approvalStatus) {
                            this.router.navigateByUrl('/portal/my-registration?showApprovedDialog=1');
                        }
                        else {
                            this.router.navigateByUrl('/portal/my-registration?showSubmittedDialog=1');
                        }
                    }
                    else if (this.selectedFormIndex + 1 < this.userRegistration.steps[this.stepper.selectedIndex].forms.length) {
                        console.log('incrementing form index');
                        this.setSelecteStepAndForm(this.selectedStepIndex, this.selectedFormIndex + 1);
                    }
                    else if (this.stepper.selectedIndex + 1 < this.userRegistration.steps.length) {
                        console.log('incrementing stepper index');
                        this.setSelecteStepAndForm(this.selectedStepIndex + 1, 0);
                    }
                    else {
                        this.router.navigateByUrl('/portal/my-registration');
                    }
                },
                (err: any) => {
                    let triggerResult = err.error;
                    if (typeof triggerResult === 'object' && Object.prototype.hasOwnProperty.call(triggerResult, 'type') && triggerResult.type === 'trigger-result') {
                        let fields: Array<PlatformFormField> = [];
                        if (Object.prototype.hasOwnProperty.call(triggerResult, 'data') && typeof triggerResult.data === 'object') {
                            Object.keys(triggerResult.data).forEach((prop: string) => {
                                fields.push({
                                    type: 'static',
                                    label: prop,
                                    defaultValue: triggerResult.data[prop]
                                });
                            });
                        }

                        let modalRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
                            data: {
                                type: PlatformModalType.PRIMARY,
                                title: "Form Submission Error",
                                subtitle: triggerResult.message,
                                submitButtonTitle: "Confirm",
                                submitButtonClass: "",
                                formFields: fields
                            }
                        });
                    }
                }
            );
        }
    }

    onUnsubmit(section: RegistrationSection) {
        this.userRegSvc.unsubmitSection(
            this.userRegistration.userProfile.id,
            this.userRegistration.docId,
            this.userRegistration.steps[this.stepper.selectedIndex].forms[this.selectedFormIndex].docId,
            section.title
        ).subscribe((ur: UserRegistration) => {
            this.userRegistration = ur;
        });
    }

    onUpdatedContacts(regDoc: UserRegistration): void{
        this.userRegistration = regDoc;
    }
  
    async setSelecteStepAndForm(stepIndex: number, formIndex: number){
        if(this.selectedStepIndex !== stepIndex || this.selectedFormIndex !== formIndex){
            if(this.userRegistration){
                console.log(this.userRegistration);
                if(this.userRegistration.steps[stepIndex].forms[formIndex].physicalForm){
                    // await this.userRegSvc.getPhysicalForm(this.userRegistration.steps[this.selectedStepIndex].forms[this.selectedFormIndex]).sub
                    this.pdfUrl = UrlGenerator.generateRegistrationFileUrl(
                        this.authSvc.globalConfig.registrationServiceConnection,
                        this.userRegistration.steps[stepIndex].forms[formIndex].physicalForm.filename
                    );
                    console.log('set pdf form');
                    // this.pdfForm.getAsBinary();
                }
                else{
                    this.pdfUrl = null;
                }
            }
        }

        this._selectedStepIndex = stepIndex;
        this._selectedFormIndex = formIndex;

        if(this.stepper.selectedIndex !== this.selectedStepIndex){
            this.stepper.selectedIndex = this.selectedStepIndex;
            this.cdr.detectChanges();
        }
    }
}
