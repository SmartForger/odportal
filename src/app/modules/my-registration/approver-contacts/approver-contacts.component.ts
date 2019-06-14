import { Component, OnInit, Input } from '@angular/core';
import { Approval, RegistrationSection, Form, ApproverContact, FormStatus } from 'src/app/models/form.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-approver-contacts',
  templateUrl: './approver-contacts.component.html',
  styleUrls: ['./approver-contacts.component.scss']
})
export class ApproverContactsComponent implements OnInit {

  @Input() data: Form;

  form: FormGroup;
  approvalsWithTitles: Array<{section: string, approval: Approval}>;

  constructor() { 
    this.form = new FormGroup({ });
    this.approvalsWithTitles = new Array<{section: string, approval: Approval}>();
  }

  ngOnInit() {
    this.data.layout.sections.forEach((section: RegistrationSection) => {
      if(section.approval && section.approval.applicantDefined){
        this.buildApplicantDefinedApproval(section);
      }
    });
  }

  getApproverContacts(): Array<ApproverContact>{
    let contact = new Array<ApproverContact>();
    this.approvalsWithTitles.forEach((awt: {section: string, approval: Approval}) => {
      contact.push({section: awt.section, email: this.form.controls[this.generateControlName(awt.section)].value});
    });
    return contact;
  }

  private buildApplicantDefinedApproval(section: RegistrationSection){
    this.approvalsWithTitles.push({section: section.title, approval: section.approval});
    this.form.addControl(
      this.generateControlName(section.title),
      new FormControl(
        {
          value: (section.approval.email ? section.approval.email : ''),
          disabled: this.data.status !== FormStatus.Incomplete
        },
        Validators.required
      )
    );
  }

  private generateControlName(sectionTitle: string): string{
    return sectionTitle.replace(/\s/g, '').toLowerCase();
  }

}
