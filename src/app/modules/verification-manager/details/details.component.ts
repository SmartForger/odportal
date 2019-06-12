import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormStatus, Form } from 'src/app/models/form.model';
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
  
  onSubmit(form: Form): void{
    this.verSvc.submitForm(this.regId, form.docId, form).subscribe((form: Form) => {
      this.forms[this.formIndex] = form;
    });
  }
}