import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfileWithRegistration } from 'src/app/models/user-profile-with-registration.model';
import { RegistrationManagerService } from 'src/app/services/registration-manager.service';
import { forkJoin } from 'rxjs';
import { UserRegistrationSummary } from 'src/app/models/user-registration-summary.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent{
  pendingSummaries: Array<UserRegistrationSummary>;
  approvedSummaries: Array<UserRegistrationSummary>;

  constructor(
    private router: Router,
    private regManagerSvc: RegistrationManagerService
  ) { 
    this.pendingSummaries = new Array<UserRegistrationSummary>();
    this.approvedSummaries = new Array<UserRegistrationSummary>();

    forkJoin(
      this.regManagerSvc.listPendingSummaries(),
      this.regManagerSvc.listApprovedSummaries()
    ).subscribe((results) => {
      this.pendingSummaries = results[0];
      this.approvedSummaries = results[1];
    });
  }

  userSelected(summary: UserRegistrationSummary){
    this.router.navigateByUrl(`/portal/registration/users/${summary.docId}`)
  }

}
