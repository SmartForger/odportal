import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormStatus, Form, RegistrationSection } from 'src/app/models/form.model';
import { VerificationService } from 'src/app/services/verification.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  
  regId: string;
  forms: Array<Form>;
  formIndex: number;

  constructor(
    private route: ActivatedRoute, 
    private verSvc: VerificationService) { 
      this.forms = new Array<Form>();
      this.formIndex = 0;
    }

  ngOnInit() {
    this.regId = this.route.snapshot.paramMap.get('id');
    this.verSvc.getForms(this.regId).subscribe((formResult: Array<Form>) => this.forms = formResult);
  }

  setForm(index: number): void{
    this.formIndex = index;
  }
  
  onSubmit(section: RegistrationSection): void{
    console.log('SUBMISSION');
    console.log(section);
    this.verSvc.submitSection(this.regId, this.forms[this.formIndex].docId, section).subscribe((form: Form) => {
      this.forms[this.formIndex] = form;
    });
  }
}