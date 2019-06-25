import { Component, OnInit } from '@angular/core';
import { UserRegistration } from 'src/app/models/user-registration.model';
import { UserRegistrationService } from 'src/app/services/user-registration.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  userRegistration: UserRegistration;

  constructor(
    private router: Router,
    private userRegSvc: UserRegistrationService, 
    private authSvc: AuthService
  ) { }

  ngOnInit() {
    this.userRegSvc.getUserRegistration(this.authSvc.userState.userId).subscribe((ur: UserRegistration) => {
      this.userRegistration = ur;
    });
  }

  goToStep(stepIndex: number){
    this.router.navigate(['/portal/my-registration/steps'], {queryParams: {'step': stepIndex}});
  }

  goToForm(stepAndForm: {step: number, form: number}): void{
    this.router.navigate(['/portal/my-registration/steps'], {queryParams: {'step': stepAndForm.step, 'form': stepAndForm.form}});
  }
}
