import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { VerificationService } from 'src/app/services/verification.service';
import { UserProfile } from 'src/app/models/user-profile.model';
import { UserProfileService } from 'src/app/services/user-profile.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent{
  service: VerificationService;
  verifierEmails: Array<string>;

  constructor(private profSvc: UserProfileService, private router: Router, private verSvc: VerificationService) { 
      this.service = this.verSvc;
      this.verifierEmails = null;
      this.profSvc.getProfile().subscribe((profile: UserProfile) => {
          console.log('profile');
          console.log(profile);
          this.verifierEmails = profile.alternateEmails;
          if(profile.email){
            this.verifierEmails.push(profile.email);
          }
      });
  }

  ngOnInit(){ }

  details(regId: string): void{
    this.router.navigateByUrl(`/portal/verification/users/${regId}`);
  }
}
