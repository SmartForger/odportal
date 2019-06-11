import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormStatus, Form } from 'src/app/models/form.model';
import { VerificationService } from 'src/app/services/verification.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserProfile } from 'src/app/models/user-profile.model';


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
    private authSvc: AuthService, 
    private verSvc: VerificationService) { 
      this.forms = new Array<Form>();
      this.formIndex = 0;
    }

  ngOnInit() {
    this.regId = this.route.snapshot.paramMap.get('id');
    const email = this.authSvc.userState.userProfile.email;
    this.verSvc.getForms(email, this.regId).subscribe((formResult: Array<Form>) => this.forms = formResult);
  }

  setForm(index: number): void{
    this.formIndex = index;
  }

  getBgColor(status: FormStatus): string{
    switch(status){
      case FormStatus.Complete: return 'bg-green'
      case FormStatus.Submitted: return 'bg-yellow'
      case FormStatus.Incomplete: return 'bg-gray'
    }
  }

  getIcon(status: FormStatus): string{
    switch(status){
      case FormStatus.Complete: return 'check'
      case FormStatus.Submitted: return 'edit'
      case FormStatus.Incomplete: return 'assignment'
    }
  }

  onSubmit(form: Form): void{
    
  }

}