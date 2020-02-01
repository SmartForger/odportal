import { Component, OnInit, Input, ViewChild, ViewChildren, ElementRef } from '@angular/core';
import { Registration } from 'src/app/models/registration.model';
import { FormGroup, AbstractControl, FormControl } from '@angular/forms';
import { Role } from 'src/app/models/role.model';
import { MatCheckbox, MatCheckboxChange, MatDialog, MatDialogRef } from '@angular/material';
import { RoleBlockComponent } from '../../display-elements/role-block/role-block.component';
import { RegistrationManagerService } from 'src/app/services/registration-manager.service';
import { Cloner } from '../../../util/cloner';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { RegistrationService } from 'src/app/services/registration.service';
import { RolesService } from 'src/app/services/roles.service';
import { PlatformModalComponent } from '../../display-elements/platform-modal/platform-modal.component';
import { PlatformModalType } from 'src/app/models/platform-modal.model';
import { BreadcrumbsService } from '../../display-elements/breadcrumbs.service';
import { Breadcrumb } from '../../display-elements/breadcrumb.model';

@Component({
  selector: 'app-edit-workflow',
  templateUrl: './edit-workflow.component.html',
  styleUrls: ['./edit-workflow.component.scss']
})
export class EditWorkflowComponent implements OnInit {
  @Input('workflow')
  get workflow(): Registration{return this._workflow;}
  set workflow(workflow: Registration){
    this._workflow = workflow;
    this.autopproveRoles = new Map<string, boolean>();
    workflow.roles.forEach((roleName: string) => {
      this.autopproveRoles.set(roleName, true);
    });
  }
  private _workflow: Registration;

  autopproveRoles: Map<string, boolean>;
  roles: Array<Role>;

  @ViewChild('autoapprove') autoapproveEl: MatCheckbox;
  @ViewChild('name') nameEl: ElementRef;
  @ViewChildren('app-role-block') roleBlockEls: RoleBlockComponent;

  constructor(
    private crumbsSvc: BreadcrumbsService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private regManagerSvc: RegistrationManagerService,
    private regProcSvc: RegistrationService,
    private roleSvc: RolesService
  ) {
    this.autopproveRoles = new Map<string, boolean>();
    this.roles = new Array<Role>();
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.regProcSvc.get(paramMap.get('id')).subscribe((regProc: Registration) => {
        this.workflow = regProc;
        this.generateCrumbs();
      });
    });
    this.roleSvc.list().subscribe((roles: Array<Role>) => {
      this.roles = roles;
    });
  }

  ensureAutoapprove(event: MatCheckboxChange): void{
    let autoapproveOnMsg = "Are you sure you want to autoapprove users? Registration managers will not have a chance to review an applicant's registration details before they are given the system permissions associated with this process.";
    let autoapproveOffMsg = "Are you sure you want to turn off autoapproval? A registration manager will need to manually approve each user into the system."
    let modalRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
      data: {
        type: PlatformModalType.SECONDARY,
        title: "Autoapprove Applicants",
        subtitle: event.checked ? autoapproveOnMsg : autoapproveOffMsg,
        submitButtonTitle: "Confirm",
        formFields: [
          {
            type: 'static',
            label: 'Autoapprove Users',
            defaultValue: event.checked ? "Yes" : "No"
          }
        ]
      }
    });

    modalRef.afterClosed().subscribe(data => {
      if(!data) {
        this.autoapproveEl.checked = !event.checked;
      }
    });
  }

  isActive(role: Role){
    return this.autopproveRoles.get(role.name);
  }

  save(): void{
    this.workflow.autoapprove = this.autoapproveEl.checked;
    this.workflow.roles = Array.from(this.autopproveRoles.keys()).filter((key: string) => {return this.autopproveRoles.get(key)});
    console.log(this.nameEl);
    this.workflow.title = this.nameEl.nativeElement.value;
    this.regManagerSvc.updateProcess(this.workflow).subscribe();
  }

  setRoleStatus(roleName: string, active: boolean){
    console.log(`setting ${roleName} as active: ${active}`)
    this.autopproveRoles.set(roleName, active);
  }

  private generateCrumbs(): void {
    const crumbs: Array<Breadcrumb> = new Array<Breadcrumb>(
      {
        title: "Dashboard",
        active: false,
        link: '/portal'
      },
      {
        title: "Registration Manager",
        active: false,
        link: "/portal/registration"
      },
      {
        title: this.workflow.title,
        active: true,
        link: `/portal/registration/workflows/${this.workflow.docId}`
      }
    );
    this.crumbsSvc.update(crumbs);
  }
}
