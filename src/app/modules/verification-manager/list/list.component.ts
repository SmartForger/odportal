import { Component } from '@angular/core';
import { UserProfileWithRegistration } from 'src/app/models/user-profile-with-registration.model';
import { Router } from '@angular/router';
import { VerificationService } from 'src/app/services/verification.service';
import { UserRegistrationSummary } from 'src/app/models/user-registration-summary.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent{
  users: Array<UserRegistrationSummary>;

  constructor(private router: Router, private verSvc: VerificationService) { 
    this.users = new Array<UserRegistrationSummary>();
  }

  ngOnInit(){
    this.verSvc.getUsersToApprove().subscribe((users: Array<UserProfileWithRegistration>) => {
        console.log(users);
        let summaries = new Array<UserRegistrationSummary>();
        users.forEach((regWithProfile: UserProfileWithRegistration) => {
            summaries.push({
                bindings: [],
                docId: regWithProfile.docId,
                status: null,
                userProfile: regWithProfile.userProfile,
                registrationId: null,
                registrationTitle: null
            });
        });
        this.users = summaries;
        console.log(this.users);
    })
  }

  details(user: UserProfileWithRegistration): void{
    this.router.navigateByUrl(`/portal/verification/users/${user.docId}`);
  }
}
