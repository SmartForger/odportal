import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfileWithRegistration } from 'src/app/models/user-profile-with-registration.model';
import { RegistrationManagerService } from 'src/app/services/registration-manager.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit{
  users: Array<UserProfileWithRegistration>;

  constructor(
    private router: Router,
    private regManagerSvc: RegistrationManagerService
  ) { 
    this.users = new Array<UserProfileWithRegistration>();
  }

  ngOnInit(){
    this.regManagerSvc.listUsers().subscribe((users: Array<UserProfileWithRegistration>) => {
      this.users = users;
    });
  }

  userSelected(user: UserProfileWithRegistration){
    this.router.navigateByUrl(`/portal/registration/users/${user.userProfile.id}`)
  }

}
