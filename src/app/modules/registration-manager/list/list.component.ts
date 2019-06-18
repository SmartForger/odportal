import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfileWithRegistration } from 'src/app/models/user-profile-with-registration.model';
import { RegistrationManagerService } from 'src/app/services/registration-manager.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit{
  pendingUsers: Array<UserProfileWithRegistration>;
  approvedUsers: Array<UserProfileWithRegistration>;

  constructor(
    private router: Router,
    private regManagerSvc: RegistrationManagerService
  ) { 
    this.pendingUsers = new Array<UserProfileWithRegistration>();
    this.approvedUsers = new Array<UserProfileWithRegistration>();
  }

  ngOnInit(){
    forkJoin(
      this.regManagerSvc.listPendingUsers(),
      this.regManagerSvc.listApprovedUsers()
    ).subscribe((results) => {
      this.pendingUsers = results[0];
      this.approvedUsers = results[1];
    });
  }

  userSelected(upwr: UserProfileWithRegistration){
    this.router.navigateByUrl(`/portal/registration/users/${upwr.docId}`)
  }

}
