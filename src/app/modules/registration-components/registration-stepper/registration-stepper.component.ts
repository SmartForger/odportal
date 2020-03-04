import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef, ViewChildren, QueryList } from '@angular/core';
import { UserRegistrationService } from 'src/app/services/user-registration.service';
import { UserRegistration, RegistrationStatus, UserRegistrationStep } from 'src/app/models/user-registration.model';
import { AuthService } from 'src/app/services/auth.service';
import { StepStatus } from '../../../models/user-registration.model';
import { FormStatus, RegistrationSection, Form } from '../../../models/form.model';
import { MatStepper, MatDialog, MatDialogRef, PageEvent, MatPaginator } from '@angular/material';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ApproverContactsComponent } from '../approver-contacts/approver-contacts.component';
import { PlatformFormField } from 'src/app/models/platform-form-field.model';
import { PlatformModalComponent } from '../../display-elements/platform-modal/platform-modal.component';
import { PlatformModalType } from 'src/app/models/platform-modal.model';
import { RegistrationManagerService } from 'src/app/services/registration-manager.service';
import { Validators } from '@angular/forms';
import { ManualSubmissionModalComponent } from '../manual-submission-modal/manual-submission-modal.component';
import { UrlGenerator } from '../../../util/url-generator';
import { PDFDocumentProxy, PdfViewerComponent } from 'ng2-pdf-viewer';

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

    @ViewChildren(ApproverContactsComponent) approverContacts: QueryList<ApproverContactsComponent>;
    @ViewChild('stepper') stepper: MatStepper;

    pdf: PDFDocumentProxy;
    pdfPage: number;
    pdfUrl: string;

    get selectedFormIndex(): number{return this._selectedFormIndex;}
    private _selectedFormIndex: number;

    get selectedStepIndex(): number{return this._selectedStepIndex;}
    private _selectedStepIndex: number;

    @ViewChild('paginator') paginator: MatPaginator;
    @ViewChild('pdfViewer') pdfViewer: PdfViewerComponent;

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

    displayRighthandCards(step: UserRegistrationStep, formIndex: number): boolean{
        if(step.forms[formIndex]){
            let formStepper = step.forms.length > 1;
            let manualSubmission = step.forms[formIndex].allowPhysicalUpload;
            let approvers = false;
            let files = step.forms[formIndex].files && step.forms[formIndex].files.length > 0;
            step.forms[formIndex].layout.sections.forEach((section: RegistrationSection) => {
                if(section.approval && section.approval.applicantDefined){
                    approvers = true;
                }
            });
            return formStepper || manualSubmission || approvers || files;
        }
        else{
            return false;
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

    goToOverview() {
        this.router.navigate(['../'], {queryParams: {step: NaN, form: NaN}, relativeTo: this.route});
    }

    onDigitalReset(): void{
        let modalRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {data: {
            type: PlatformModalType.SECONDARY,
            title: "Reset to Digital Workflow",
            subtitle: "",
            submitButtonTitle: "Confirm",
            submitButtonClass: "bg-yellow",
            formFields: [{
                defaultValue: 'Returning this form to the digital workflow will remove the physical form from the system. Any data from a previous digital attempt will not be returned. All necessary approvers will need to sign off on the form digitally, even if they signed the currently uploaded physical form. Are you sure you wish to continue with this reset to the digital workflow?',
                fullWidth: true,
                type: 'static'
            }]
        }});

        modalRef.afterClosed().subscribe((data) => {
            if(data){
                this.userRegSvc.digitalReset(
                    this.authSvc.getUserId(),
                    this.userRegistration.docId, 
                    this.userRegistration.steps[this.selectedStepIndex].forms[this.selectedFormIndex].docId
                ).subscribe((regDoc: UserRegistration) => {
                    this.userRegistration = regDoc;
                    this.pdfInit();
                });
            }
        });
    }

    onFormDownload(): void{
        let error;
        let filename;
        if(this.userRegistration.steps[this.selectedStepIndex].forms[this.selectedFormIndex].physicalForm){
            filename = this.userRegistration.steps[this.selectedStepIndex].forms[this.selectedFormIndex].physicalForm.filename;
        }
        else if(this.userRegistration.steps[this.selectedStepIndex].forms[this.selectedFormIndex].pdf){
            filename = this.userRegistration.steps[this.selectedStepIndex].forms[this.selectedFormIndex].pdf;
        }
        else{
            error = true;
        }

        if(filename){
            let url = UrlGenerator.generateRegistrationFileUrl(this.authSvc.globalConfig.registrationServiceConnection, filename);
            fetch(url).then((resp: Response) => resp.blob()).then((blob: Blob) => {
                let objUrl = window.URL.createObjectURL(blob);
                let anchor = document.createElement('a');
                anchor.download = `${this.userRegistration.bindingRegistry['fullName']} - ${this.userRegistration.steps[this.selectedStepIndex].forms[this.selectedFormIndex].title}`;
                anchor.href = objUrl;
                anchor.style.display = 'none';
                document.body.appendChild(anchor);
                anchor.click();
                window.URL.revokeObjectURL(objUrl);
            }).catch(() => {error = true;});
        }

        if(error){
            this.downloadError();
        }
    }

    onLoadComplete(pdf: PDFDocumentProxy): void{
        console.log('load complete');
        console.log(pdf);
        this.pdf = pdf;
    }

    onManualSubmission(type: 'download' | 'upload'): void{
        let form = this.userRegistration.steps[this.selectedStepIndex].forms[this.selectedFormIndex];
        let subRef: MatDialogRef<ManualSubmissionModalComponent> = this.dialog.open(ManualSubmissionModalComponent, {
            data: {
                data: form,
                type: type
            },
            panelClass: 'manual-submission-dialog-container'
        });

        subRef.afterClosed().subscribe((result: any) => {
            if(type === 'download' && result){
                let filename, url;
                if(form.printableForm){
                    filename = form.printableForm.fileName;
                    url = UrlGenerator.generateRegistrationPrintableFormUrl(this.authSvc.globalConfig.registrationServiceConnection, filename);
                }
                else{
                    filename = form.title;
                    url = UrlGenerator.generateRegistrationPrintableFormUrl(this.authSvc.globalConfig.registrationServiceConnection, form.docId);
                }
                fetch(url).then((resp: Response) => resp.blob()).then((blob: Blob) => {
                    let objUrl = window.URL.createObjectURL(blob);
                    let anchor = document.createElement('a');
                    anchor.download = filename;
                    anchor.href = objUrl;
                    anchor.style.display = 'none';
                    document.body.appendChild(anchor);
                    anchor.click();
                    window.URL.revokeObjectURL(objUrl);
                }).catch((err) => {console.log(err);});
            }
            else if(type === 'upload' && result){
                let file = result as File;
                this.userRegSvc.uploadPhysicalReplacement(
                    this.userRegistration.userProfile.id, 
                    this.userRegistration.docId, 
                    this.userRegistration.steps[this.selectedStepIndex].forms[this.selectedFormIndex].docId,
                    file
                ).subscribe((regDoc: UserRegistration) => {
                    this.userRegistration = regDoc;
                    this.pdfInit();
                });
            }
        });
    }

    onPageFirst(): void{this.pdfPage = 0;}
    onPageLast(): void{this.pdfPage = this.pdf.numPages - 1;}
    onPageNext(): void{this.pdfPage++;}
    onPagePrev(): void{this.pdfPage--;}

    onNextPage(): void{
        this.pdfPage++;
    }

    onPrevPage(): void{
        this.pdfPage--;
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
                    let form = this.userRegistration.steps[this.selectedStepIndex].forms[this.selectedFormIndex];
                    let missingApprovals = new Array<RegistrationSection>();
                    form.layout.sections.forEach((section: RegistrationSection) => {
                        if(section.approval && section.approval.status === 'missing'){
                            missingApprovals.push(section);
                        }
                    });

                    if(missingApprovals.length === 0){
                        this.postSubmissionRouting(false);
                    }
                    else{
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

                        approvalModal.afterClosed().subscribe((data) => {
                            if(data){
                                console.log('missingApprovals: ...');
                                console.log(missingApprovals);
                                console.log('modalData: ...');
                                console.log(data);
                                missingApprovals.forEach((section: RegistrationSection) => {
                                    if(data[section.approval.title]){
                                        section.approval.email = data[section.approval.title];
                                    }
                                });
                                console.log('approver contacts');
                                console.log(this.approverContacts);
                                let appContactComp: ApproverContactsComponent = this.approverContacts.toArray()[this.selectedStepIndex];
                                appContactComp.refreshFormValues();
                                appContactComp.onSubmit();
                                appContactComp.updatedContacts.subscribe((regDoc: UserRegistration) => {
                                    this.userRegistration = regDoc;
                                    this.postSubmissionRouting(false);
                                });
                            }
                            else{
                                this.postSubmissionRouting(true);
                            }
                        });
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
        let form = this.userRegistration.steps[this.selectedStepIndex].forms[this.selectedFormIndex];
        let missingApprovals = new Array<RegistrationSection>();
        form.layout.sections.forEach((section: RegistrationSection) => {
            if(section.approval && section.approval.status === 'missing'){
                missingApprovals.push(section);
            }
        });
        this.postSubmissionRouting(missingApprovals.length > 0);
    }
  
    async setSelecteStepAndForm(stepIndex: number, formIndex: number){
        this._selectedStepIndex = stepIndex;
        this._selectedFormIndex = formIndex;

        this.pdfInit();

        if(this.stepper.selectedIndex !== this.selectedStepIndex){
            this.stepper.selectedIndex = this.selectedStepIndex;
            this.cdr.detectChanges();
        }
    }

    private downloadError(): void{
        let modalRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {data: {
            type: PlatformModalType.SECONDARY,
            title: "Error Downloading Form",
            submitButtonTitle: "Confirm",
            formFields: [
                {
                    type: 'static',
                    label: 'App title',
                    defaultValue: 'There was an unexpected issue downloading this form. If the problem persists, please contact an administrator for assistance.'
                }
            ]
        }});
    }

    private pdfInit(): void{
        if(this.userRegistration.steps[this.selectedStepIndex].forms[this.selectedFormIndex].physicalForm){
            this.pdf = null;
            this.pdfPage = 0;
            this.pdfUrl = UrlGenerator.generateRegistrationFileUrl(
                this.authSvc.globalConfig.registrationServiceConnection,
                this.userRegistration.steps[this.selectedStepIndex].forms[this.selectedFormIndex].physicalForm.filename
            );
        }
        else{
            this.pdfUrl = null;
        }
    }

    private postSubmissionRouting(missingApprovals: boolean): void{
        if(!missingApprovals){
            if (this.userRegistration.status === RegistrationStatus.Submitted || this.userRegistration.status === RegistrationStatus.Complete) {
                if (this.userRegistration.approvalStatus) {
                    this.router.navigate(['../'], {queryParams: {step: NaN, form: NaN, showApprovedDialog: 1}, relativeTo: this.route});
                    // this.router.navigateByUrl('/portal/my-registration?showApprovedDialog=1');
                }
                else {
                    this.router.navigate(['../'], {queryParams: {step: NaN, form: NaN, showSubmittedDialog: 1}, relativeTo: this.route});
                    // this.router.navigateByUrl('/portal/my-registration?showSubmittedDialog=1');
                }
            }
            else if (this.selectedFormIndex + 1 < this.userRegistration.steps[this.stepper.selectedIndex].forms.length) {
                this.setSelecteStepAndForm(this.selectedStepIndex, this.selectedFormIndex + 1);
            }
            else if (this.stepper.selectedIndex + 1 < this.userRegistration.steps.length) {
                this.setSelecteStepAndForm(this.selectedStepIndex + 1, 0);
            }
            else {
                this.router.navigate(['../'], {queryParams: {step: NaN, form: NaN}, relativeTo: this.route});
                this.router.navigateByUrl('/portal/my-registration');
            }
        }
    }
}
