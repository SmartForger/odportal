import { Component } from '@angular/core';
import { UserProfileWithRegistration } from 'src/app/models/user-profile-with-registration.model';
import { Router } from '@angular/router';
import { VerificationService } from 'src/app/services/verification.service';
import { UserRegistrationSummary } from 'src/app/models/user-registration-summary.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserProfile } from 'src/app/models/user-profile.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent{
  service: VerificationService;
  verifierEmail: string;

  constructor(private router: Router, private authSvc: AuthService, private verSvc: VerificationService) { 
      this.service = this.verSvc;
      this.verifierEmail = null;
      this.authSvc.getUserProfile().then((profile: UserProfile) => {
          this.verifierEmail = profile.email;
      });
  }

  ngOnInit(){
  }

  details(regId: string): void{
    this.router.navigateByUrl(`/portal/verification/users/${regId}`);
  }
}
