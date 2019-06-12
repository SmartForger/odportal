import { Component } from '@angular/core';
import { UserProfileWithRegistration } from 'src/app/models/user-profile-with-registration.model';
import { Router } from '@angular/router';
import { VerificationService } from 'src/app/services/verification.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent{
  users: Array<UserProfileWithRegistration>;

  constructor(private router: Router, private verSvc: VerificationService) { 
    this.users = new Array<UserProfileWithRegistration>();
  }

  ngOnInit(){
    this.verSvc.getUsersToApprove().subscribe((users: Array<UserProfileWithRegistration>) => {this.users = users})
  }

  details(user: UserProfileWithRegistration): void{
    this.router.navigateByUrl(`/portal/verification/users/${user.docId}`);
  }
}
