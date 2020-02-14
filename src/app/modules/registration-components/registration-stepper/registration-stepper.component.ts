import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';
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

@Component({
    selector: 'app-registration-stepper',
    templateUrl: './registration-stepper.component.html',
    styleUrls: ['./registration-stepper.component.scss']
})
export class RegistrationStepperComponent implements OnInit {
    @Input() activeStepIndex: number;
    @Input() selectedFormIndex: number;
    @Input() selectedStepIndex: number;
    @Input() userRegistration: UserRegistration;

    @Output() goToOverview: EventEmitter<void>;

    @ViewChild(ApproverContactsComponent) approverContacts: ApproverContactsComponent;
    @ViewChild('stepper') stepper: MatStepper;

    constructor(
        private authSvc: AuthService,
        private cdr: ChangeDetectorRef,
        private dialog: MatDialog,
        private regManagerSvc: RegistrationManagerService,
        private route: ActivatedRoute,
        private router: Router,  
        private userRegSvc: UserRegistrationService
    ) {
        this.selectedFormIndex = 0;
        this.goToOverview = new EventEmitter<void>();
    }

    ngOnInit() {
        if(this.userRegistration){
            this.stepper.selectedIndex = this.selectedStepIndex;
        }
    }

    ngAfterViewInit() {
        if(!this.userRegistration){
            this.userRegSvc.getUserRegistration(this.authSvc.getUserId()).subscribe((ur: UserRegistration) => {
                this.userRegistration = ur;
                this.cdr.detectChanges();
                this.route.queryParamMap.subscribe((params: ParamMap) => {
                    if (params.has('step')) {
                        this.stepper.selectedIndex = Number.parseInt(params.get('step'));
                    }
                    else if(!this.selectedStepIndex){
                        this.selectedStepIndex = 0;
                        this.stepper.selectedIndex = this.selectedStepIndex;
                    }
                    if (params.has('form')) {
                        this.selectedFormIndex = Number.parseInt(params.get('form'));
                    }
                    else if(!this.selectedFormIndex){
                        this.selectedFormIndex = 0;
                    }
                    this.cdr.detectChanges();
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

    onSelectForm(index: number){
        this.selectedFormIndex = index;
    }

    onSelectStep(index: number){
        this.selectedFormIndex = 0;
        this.selectedStepIndex = index;
    }

    onSubmit(section: RegistrationSection) {
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
                (ur: UserRegistration) => {
                    this.userRegistration = ur;
                    if(!this.userRegistration.steps[this.selectedStepIndex].forms[this.selectedFormIndex].approvalContactsSubmitted){

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
                        this.selectedFormIndex++;
                    }
                    else if (this.stepper.selectedIndex + 1 < this.userRegistration.steps.length) {
                        this.stepper.selectedIndex = this.stepper.selectedIndex + 1;
                        this.selectedFormIndex = 0;
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
  
}
